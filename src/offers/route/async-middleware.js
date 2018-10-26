"use strict";

const asyncMiddleware = (fn) => (req, res, next) => fn(req, res, next).catch((err) => next(err));

module.exports = asyncMiddleware;
