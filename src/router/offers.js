"use strict";

const express = require(`express`);

const NotFoundError = require(`../errors/not-found-error`);
const ValidationError = require(`../errors/validation-error`);
const MongoError = require(`mongodb`).MongoError;

const handlers = require(`./handlers`);
const multer = require(`multer`);

const offersRouter = new express.Router();
const GridStream = require(`./stream`);
const validate = require(`./validate`);
const storage = multer.memoryStorage();
const upload = multer({storage});
const jsonParser = express.json();

const PAGE_DEFAULT_LIMIT = 20;
const PAGE_DEFAULT_SKIP = 0;

const asyncMiddleware = (fn) => (req, res, next) => fn(req, res, next).catch((err) => next(err));

const notFoundHandler = (req, res) => {
  res.status(404).send(`Page was not found`);
};

const errorHandler = (err, req, res, _next) => {
  if (err instanceof ValidationError) {
    res.status(err.code).json(err.errors);
  } else if (err instanceof MongoError) {
    res.status(400).json(err.message);
  } else {
    console.log(err);
    res.status(err.code || 500).send(err.message);
  }
};

offersRouter.get(`/offers`, asyncMiddleware(async (req, res, _next) => {
  const limit = req.query.limit ? handlers.queryCheck(req.query.limit) : PAGE_DEFAULT_LIMIT;
  const skip = req.query.skip ? handlers.queryCheck(req.query.skip) : PAGE_DEFAULT_SKIP;

  const cursor = await offersRouter.offersStore.getAllOffers();
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
  const {convertedDate, parsedDate} = handlers.checkDate(offerDate);
  const offer = await offersRouter.offersStore.getOffer(parsedDate);

  if (!offer) {
    throw new NotFoundError(`No offers were found at "${convertedDate}"`);
  }
  res.send(offer);
}));

offersRouter.get(`/offers/:date/avatar`, asyncMiddleware(async (req, res, _next) => {
  const offerDate = req.params.date;
  const {convertedDate, parsedDate} = handlers.checkDate(offerDate);
  const result = await offersRouter.offersStore.getOffer(parsedDate);

  if (!result) {
    throw new NotFoundError(`No offers were found at "${convertedDate}"`);
  }

  const stream = await offersRouter.imagesStore.get(result._id);

  stream.on(`error`, (e) => console.error(e));
  stream.on(`end`, () => res.end());
  stream.pipe(res);
}));

offersRouter.post(`/offers`, jsonParser, upload.single(`photo`), asyncMiddleware(async (req, res, _next) => {
  const body = req.body;
  const avatar = req.file;

  const validatedRequest = validate(body);
  const dataToRsponse = handlers.modifyRequestToResponse(validatedRequest);
  const dataToDatabase = handlers.modifyRequestToDatabase(validatedRequest);

  await offersRouter.offersStore.saveOffer(dataToDatabase);
  const dateId = dataToDatabase.offer;

  if (avatar) {
    await offersRouter.imagesStore.save(dateId, new GridStream(avatar.buffer));
  }

  res.send(dataToRsponse);
}));


offersRouter.use(notFoundHandler);

offersRouter.use(errorHandler);


module.exports = (offersStore, imagesStore) => {
  offersRouter.offersStore = offersStore;
  offersRouter.imageStore = imagesStore;
  return offersRouter;
};
