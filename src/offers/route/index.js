'use strict';

const express = require(`express`);

const corsRoute = require(`./cors`);
const defaultRoute = require(`./default`);
const errorRoute = require(`./error`);
const nameRoute = require(`./name`);

const offersRouter = new express.Router();

corsRoute(offersRouter);
defaultRoute(offersRouter);
nameRoute(offersRouter);
errorRoute(offersRouter);

module.exports = (offersStore, imagesStore) => {
  offersRouter.offersStore = offersStore;
  offersRouter.imagesStore = imagesStore;
  return offersRouter;
};
