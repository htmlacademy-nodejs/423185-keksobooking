"use strict";

const express = require(`express`);
const offersStore = require(`../offers/store`);
const imagesStore = require(`../images/store`);
const previewsStore = require(`../previews/store`);
const offersRouter = require(`../offers/route`)(offersStore, imagesStore, previewsStore);
const app = express();

const {
  SERVER_HOST = `localhost`,
  SERVER_PORT = 3000
} = process.env;

const launchServer = (port) => {
  app.listen(port, () => console.log(`Server launched!\nConnect: http://${SERVER_HOST}:${port}`))
    .on(`error`, (err) => {
      if (err.code === `EADDRINUSE`) {
        console.error(`Порт занят`);
        process.exit(1);
      } else {
        console.error(`Произошла ошибка`, err);
        process.exit(1);
      }
    });
};

const checkPort = (givenPort) => {
  let serverPort;
  // If port given in console
  if (givenPort) {
    serverPort = givenPort;
  // If port given as arg
  } else {
    const args = process.argv.slice(2);
    serverPort = args[1] ? args[1].trim() : ``;
  }
  // Port check
  if (parseInt(serverPort, 10)) {
    return serverPort;
  } else {
    return SERVER_PORT;
  }
};

app.use(express.static(`./static`));
app.use(`/api`, offersRouter);

module.exports = {
  name: `server`,
  description: `запускает сервер`,
  async execute(...rest) {
    let givenPort;
    if (rest) {
      givenPort = rest[1];
    }
    const port = checkPort(givenPort);
    launchServer(port);
  },
  app
};
