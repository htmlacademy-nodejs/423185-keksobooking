"use strict";

const express = require(`express`);
const IllegalArgumentError = require(`../errors/illegal-argument-error`);
const IlliegalDateError = require(`../errors/illegal-date-error`);
const InvalidParameterError = require(`../errors/illegal-date-error`);
const NotFoundError = require(`../errors/not-found-error`);
const ValidationError = require(`../errors/validation-error`);
const util = require(`../data/util`);
const multer = require(`multer`);
const toStream = require(`buffer-to-stream`);

const offersRouter = new express.Router();
const validate = require(`./validate`);
const OffersStore = require(`./store`);
const ImagesStore = require(`../images/store`);
const storage = multer.memoryStorage();
const upload = multer({storage});
const jsonParser = express.json();

const PAGE_DEFAULT_LIMIT = 20;
const PAGE_DEFAULT_SKIP = 0;

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

offersRouter.get(`/offers`, (req, res, next) => {
  let cursor;
  let offersCount;
  const limit = req.query.limit ? queryCheck(req.query.limit) : PAGE_DEFAULT_LIMIT;
  const skip = req.query.skip ? queryCheck(req.query.skip) : PAGE_DEFAULT_SKIP;

  return new Promise((success, _fail) => {
    OffersStore.getAllOffers()
      .then((curs) => {
        cursor = curs.skip(skip).limit(limit);
      })
      .then(() => {
        offersCount = cursor.count();
      })
      .then(() => {
        cursor.toArray();
      })
      .then((offers) => {
        success(res.send({
          data: offers,
          skip,
          limit,
          total: offersCount
        }));
      })
      .catch((err) => {
        next(err);
      });
  });
});

offersRouter.get(`/offers/:date`, (req, res, next) => {
  const offerDate = req.params.date;
  const convertedDate = util.timestampToDate(offerDate);

  if (!offerDate) {
    throw new IllegalArgumentError(`No date was typed`);
  }
  if (!parseInt(offerDate, 10) || !convertedDate) {
    throw new IlliegalDateError(`Invalid date error`);
  }
  const parsedDate = parseInt(offerDate, 10);
  return new Promise((success, _fail) => {
    OffersStore.getOffer(parsedDate)
      .then((answer) => {
        if (!answer) {
          throw new NotFoundError(`No offers were found at "${convertedDate}"`);
        }
        success(res.send(answer));
      })
      .catch((err) => {
        next(err);
      });
  });
});

offersRouter.post(`/offers`, jsonParser, upload.single(`photo`), (req, res, next) => {
  const body = req.body;
  const avatar = req.file;
  let insertedId;
  const validatedRequest = validate(body);

  OffersStore.saveOffer(validatedRequest)
    .then((result) => {
      insertedId = result.insertedId;
      if (avatar) {
        ImagesStore.save(insertedId, toStream(avatar.buffer));
      }
    })
    .then(() => {
      res.send(validate(body));
    })
    .catch((err) => {
      next(err);
    });
});

offersRouter.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(err.code).json(err.errors);
  } else {
    next(err);
  }
});


module.exports = offersRouter;
