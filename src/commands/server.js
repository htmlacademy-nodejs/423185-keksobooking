"use strict";

const express = require(`express`);
const offersStore = require(`../router/store`);
const imagesStore = require(`../images/store`);
const offersRouter = require(`../router/offers`)(offersStore, imagesStore);
const app = express();

const DEFAULT_PORT = 3000;

const checkPort = () => {
  const args = process.argv.slice(2);
  const serverPort = args[1] ? args[1].trim() : ``;
  if (parseInt(serverPort, 10)) {
    return serverPort;
  } else {
    return DEFAULT_PORT;
  }
};

app.use(express.static(`./static`));

app.use(`/api`, offersRouter);

const launchServer = (port) => {
  app.listen(port, () => console.log(`Server launched!\nConnect: http://localhost:${port}`));
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
