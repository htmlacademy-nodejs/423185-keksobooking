"use strict";

const express = require(`express`);

const IllegalArgumentError = require(`../errors/illegal-argument-error`);
const IlliegalDateError = require(`../errors/illegal-date-error`);
const InvalidParameterError = require(`../errors/illegal-date-error`);
const NotFoundError = require(`../errors/not-found-error`);
const ValidationError = require(`../errors/validation-error`);
const MongoError = require(`mongodb`).MongoError;

const util = require(`../data/util`);
const multer = require(`multer`);

const offersRouter = new express.Router();
const GridStream = require(`./stream`);
const validate = require(`./validate`);
const OffersStore = require(`./store`);
const ImagesStore = require(`../images/store`);
const storage = multer.memoryStorage();
const upload = multer({storage});
const jsonParser = express.json();

const defaultNames = require(`../data/raw-data`).defaultNames;

const PAGE_DEFAULT_LIMIT = 20;
const PAGE_DEFAULT_SKIP = 0;

const asyncMiddleware = (fn) => (req, res, next) => fn(req, res, next).catch((err) => next(err));

const queryCheck = (query) => {
  if (!query) {
    return ``;
  }
  if ((!isFinite(query) && query !== parseInt(query, 10)) && query > 0) {
    throw new InvalidParameterError(`Invalid parameter error`);
  } else {
    return parseInt(query, 10);
  }
};

const modifyRequestToRes = (request) => {
  const matchArray = request.address.match(/\d+/g);
  const location = {x: matchArray[0], y: matchArray[1]};
  const name = defaultNames[util.generateRandomInteger(0, defaultNames.length - 1)];
  let resultingObject = Object.assign({}, request, {name}, location);

  return resultingObject;
};

offersRouter.get(`/offers`, asyncMiddleware(async (req, res, _next) => {
  const limit = req.query.limit ? queryCheck(req.query.limit) : PAGE_DEFAULT_LIMIT;
  const skip = req.query.skip ? queryCheck(req.query.skip) : PAGE_DEFAULT_SKIP;

  const cursor = await OffersStore.getAllOffers();
  const cursorWithParams = await cursor.skip(skip).limit(limit);
  const offersCount = await cursor.count();
  const offersArray = await cursorWithParams.toArray();

  res.send({
    data: offersArray,
    skip,
    limit,
    total: offersCount
  });
}));

offersRouter.get(`/offers/:date`, asyncMiddleware(async (req, res, _next) => {
  const offerDate = req.params.date;
  const convertedDate = util.timestampToDate(offerDate);

  if (!offerDate) {
    throw new IllegalArgumentError(`No date was typed`);
  }
  if (!parseInt(offerDate, 10) || !convertedDate) {
    throw new IlliegalDateError(`Invalid date error`);
  }
  const parsedDate = parseInt(offerDate, 10);
  const offer = await OffersStore.getOffer(parsedDate);

  if (!offer) {
    throw new NotFoundError(`No offers were found at "${convertedDate}"`);
  }
  res.send(offer);
}));

offersRouter.get(`/offers/:date/avatar`, asyncMiddleware(async (req, res, _next) => {
  const offerDate = req.params.date;
  const convertedDate = util.timestampToDate(offerDate);

  if (!offerDate) {
    throw new IllegalArgumentError(`No date was typed`);
  }

  if (!parseInt(offerDate, 10) || !convertedDate) {
    throw new IlliegalDateError(`Invalid date error`);
  }

  const parsedDate = parseInt(offerDate, 10);
  const result = await OffersStore.getOffer(parsedDate);

  if (!result) {
    throw new NotFoundError(`No offers were found at "${convertedDate}"`);
  }

  const stream = await ImagesStore.get(result._id);

  stream.on(`error`, (e) => console.error(e));
  stream.on(`end`, () => res.end());
  stream.pipe(res);
}));

offersRouter.post(`/offers`, jsonParser, upload.single(`photo`), asyncMiddleware(async (req, res, _next) => {
  const body = req.body;
  const avatar = req.file;
  const validatedRequest = validate(body);
  const requestToRes = modifyRequestToRes(validatedRequest);

  const result = await OffersStore.saveOffer(validatedRequest);
  const insertedId = result.insertedId;

  if (avatar) {
    await ImagesStore.save(insertedId, new GridStream(avatar.buffer));
  }

  const requestToDatabase = modifyRequestToDatabase(requestToRes);

  res.send(requestToRes);
}));

offersRouter.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(err.code).json(err.errors);
  } else if (err instanceof MongoError) {
    res.status(400).json(err.message);
  } else {
    next(err);
  }
});


module.exports = offersRouter;
