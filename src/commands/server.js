"use strict";

const express = require(`express`);
const offersRouter = require(`../router/offers`);
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

const ERROR_HANDLER = (err, req, res, _next) => {
  console.log(err);
  if (err.code === 404) {
    res.status(404).send(`Page not found`);
  } else {
    console.error(err);
    res.status(err.code || 500).send(err.message);
  }
};

app.use(express.static(`./static`));

app.use(`/api`, offersRouter);

app.use(ERROR_HANDLER);

const launchServer = (port) => {
  app.listen(port, () => console.log(`Server launched!\nConnect: http://localhost:${port}`));
};

module.exports = {
  name: `server`,
  description: `запускает сервер`,
  execute() {
    const port = checkPort();
    launchServer(port);
  }
};
