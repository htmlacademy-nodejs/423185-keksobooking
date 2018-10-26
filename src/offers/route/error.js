"use strict";

const ValidationError = require(`../../errors/validation-error`);
const MongoError = require(`mongodb`).MongoError;

module.exports = (offersRouter) => {
  const notFoundHandler = (req, res) => {
    if (req.method !== `POST` && req.method !== `GET`) {
      res.status(501).json(({error: 501, errorMessage: `Invalid method requested`}));
    } else {
      res.status(404).send(({error: 404, errorMessage: `Page was not found`}));
    }
  };

  const errorHandler = (err, req, res, _next) => {
    if (err instanceof ValidationError) {
      res.status(err.code).json(err.errors.map(({fieldName, errorMessage}) => ({error: `Validation Error`, fieldName, errorMessage})));
    } else if (err instanceof MongoError) {
      res.status(400).json(({error: err.code, errorMessage: err.message}));
    } else {
      res.status(err.code || 500).send({error: err.code, errorMessage: err.message});
    }
  };
  offersRouter.use(errorHandler);
  offersRouter.use(notFoundHandler);
};
