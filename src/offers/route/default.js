"use strict";

const express = require(`express`);
const logger = require(`../../logger`);

const multer = require(`multer`);
const storage = multer.memoryStorage();
const upload = multer({storage});
const jsonParser = express.json();

const asyncMiddleware = require(`./async-middleware`);
const GridStream = require(`./stream`);
const handlers = require(`./handlers`);
const validate = require(`../validate`);

const PAGE_DEFAULT_LIMIT = 20;
const PAGE_DEFAULT_SKIP = 0;

module.exports = (offersRouter) => {
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
    logger.info(`GET all request was sent`);
  }));

  offersRouter.post(`/offers`, jsonParser, upload.single(`avatar`), asyncMiddleware(async (req, res, _next) => {
    const body = req.body;
    const avatar = req.file;

    const validatedRequest = validate(body);
    const dataToRsponse = handlers.modifyRequestToResponse(validatedRequest);
    const dataToDatabase = handlers.modifyRequestToDatabase(validatedRequest);

    await offersRouter.offersStore.saveOffer(dataToDatabase);
    const dateId = dataToDatabase.date;

    if (avatar) {
      await offersRouter.imagesStore.save(dateId, new GridStream(avatar.buffer));
    }

    res.send(dataToRsponse);
    logger.info(`POST request was sent`);
  }));
};
