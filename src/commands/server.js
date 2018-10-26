"use strict";

const express = require(`express`);
const offersStore = require(`../router/store`);
const imagesStore = require(`../images/store`);
const offersRouter = require(`../router/offers`)(offersStore, imagesStore);
const app = express();

const {
  SERVER_HOST = `localhost`,
  SERVER_PORT = 3000
} = process.env;

const checkPort = () => {
  const args = process.argv.slice(2);
  const serverPort = args[1] ? args[1].trim() : ``;
  if (parseInt(serverPort, 10)) {
    return serverPort;
  } else {
    return SERVER_PORT;
  }
};

app.use(express.static(`./static`));

app.use(`/api`, offersRouter);

const launchServer = (port) => {
  app.listen(port, () => console.log(`Server launched!\nConnect: http://${SERVER_HOST}:${port}`));
};

module.exports = {
  name: `server`,
  description: `запускает сервер`,
  execute() {
    const port = checkPort();
    launchServer(port);
  },
  app
};
