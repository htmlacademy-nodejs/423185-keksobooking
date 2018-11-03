"use strict";

const logger = require(`../../logger`);

const asyncMiddleware = require(`./async-middleware`);
const handlers = require(`./handlers`);
const NotFoundError = require(`../../errors/not-found-error`);

module.exports = (offersRouter) => {
  offersRouter.get(`/offers/:date`, asyncMiddleware(async (req, res, _next) => {
    const offerDate = req.params.date;
    const {convertedDate, parsedDate} = handlers.checkDate(offerDate);
    const offer = await offersRouter.offersStore.getOffer(parsedDate);

    if (!offer) {
      throw new NotFoundError(`No offers were found at "${convertedDate}"`);
    }

    res.format({
      html: (() => {
        res.send(`<div>
             <p>offer: ${JSON.stringify(offer)}</p>
            </div>`);
      }),
      json: (() => {
        res.send(
            offer
        );
      })
    });
    logger.info(`GET request for offer at chosen date was sent`);
  }));

  offersRouter.get(`/offers/:date/avatar`, asyncMiddleware(async (req, res, _next) => {
    const offerDate = req.params.date;
    const {convertedDate, parsedDate} = handlers.checkDate(offerDate);
    const result = await offersRouter.offersStore.getOffer(parsedDate);

    if (!result) {
      throw new NotFoundError(`No offers were found at "${convertedDate}"`);
    }

    const avatar = await offersRouter.imagesStore.get(parsedDate);
    if (!avatar) {
      throw new NotFoundError(`No avatars were found at ${convertedDate}`);
    }

    res.header(`Content-Type`, `image/jpeg`);
    res.header(`Content-Length`, avatar.info.length);

    const stream = avatar.stream;
    stream.on(`error`, (err) => console.error(err));
    stream.on(`end`, () => {
      res.end();
      logger.info(`GET request for avatar at chosen date was sent`);
    });
    stream.pipe(res);
  }));
};

