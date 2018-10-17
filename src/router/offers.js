"use strict";

const express = require(`express`);
// eslint-disable-next-line new-cap
const offersRouter = require(`express`).Router();
const IllegalArgumentError = require(`../errors/illegal-argument-error`);
const IlliegalDateError = require(`../errors/illegal-date-error`);
const InvalidParameterError = require(`../errors/illegal-date-error`);
const NotFoundError = require(`../errors/not-found-error`);
const generate = require(`../generator/generate`);
const util = require(`../data/util`);
const multer = require(`multer`);

const storage = multer.memoryStorage();
const upload = multer({storage});
const jsonParser = express.json();

const offers = generate.getData(28);

const queryCheck = (query) => {
  if ((!isFinite(query) && query !== parseInt(query, 10)) || query < 0) {
    throw new InvalidParameterError(`Invalid parameter error`);
  } else {
    return parseInt(query, 10);
  }
};

offersRouter.get(`/offers`, (req, res) => {
  const limit = req.query.limit ? queryCheck(req.query.limit) : ``;
  const skip = req.query.skip ? queryCheck(req.query.skip) : ``;
  let modifiedOffers = [...offers];

  if (skip) {
    modifiedOffers = offers.slice(skip);
  }
  if (limit) {
    modifiedOffers.length = limit > modifiedOffers.length ? modifiedOffers.length : limit;
  }

  res.send(modifiedOffers);
});

offersRouter.get(`/offers/:date`, (req, res) => {
  const offerDate = req.params.date;

  const convertedDate = util.timestampToDate(offerDate);
  if (!offerDate) {
    throw new IllegalArgumentError(`No date was typed`);
  }
  if (!parseInt(offerDate, 10) || !convertedDate) {
    throw new IlliegalDateError(`Invalid date error`);
  }
  const parsedDate = parseInt(offerDate, 10);
  const date = offers.find((it) => it.date === parsedDate);
  if (!date) {
    throw new NotFoundError(`No offers were found at "${convertedDate}"`);
  }

  res.send(date);
});

offersRouter.post(`/offers`, jsonParser, upload.single(`photo`), (req, res) => {
  const body = req.body;
  const photo = req.file;
  if (photo) {
    body.photo = {name: photo.originalname};
  }
  res.send(body);
});


module.exports = offersRouter;