"use strict";

const ValidationError = require(`../../errors/validation-error`);
const MongoError = require(`mongodb`).MongoError;
const handlers = require(`./handlers`);

module.exports = (offersRouter) => {
  const notFoundHandler = (req, res) => {
    if (req.method !== `POST` && req.method !== `GET`) {
      res.format({
        json: (() => {
          res.status(501).json(({error: 501, errorMessage: `Invalid method requested`}));
        }),
        html: (() => {
          res.status(501).send(handlers.generateSimpleErrorHtml(501, `Invalid method requested`));
        })
      });
    } else {
      res.format({
        json: (() => {
          res.status(404).json(({error: 404, errorMessage: `Page was not found`}));
        }),
        html: (() => {
          res.status(404).send(handlers.generateSimpleErrorHtml(404, `Page was not found`));
        })
      });
    }
  };

  const errorHandler = (err, req, res, _next) => {
    if (err instanceof ValidationError) {
      res.format({
        json: (() => {
          res.status(err.code).json(err.errors.map(({fieldName, errorMessage}) => ({error: `Validation Error`, fieldName, errorMessage})));
        }),
        html: (() => {
          res.status(err.code).send(handlers.generateCombineErrorHtml(`Validation Error`, err.errors));
        })
      });
    } else if (err instanceof MongoError) {
      res.format({
        json: (() => {
          res.status(400).json(({error: err.code, errorMessage: err.message}));
        }),
        html: (() => {
          res.status(404).send(handlers.generateSimpleErrorHtml(err.code, err.message));
        })
      });
    } else {
      res.format({
        json: (() => {
          res.status(err.code || 500).json({error: err.code, errorMessage: err.message});
        }),
        html: (() => {
          res.status(err.code || 500).send(handlers.generateSimpleErrorHtml(err.code, err.message));
        })
      });
    }
  };
  offersRouter.use(errorHandler);
  offersRouter.use(notFoundHandler);
};
