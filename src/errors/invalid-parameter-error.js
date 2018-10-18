'use strict';

module.exports = class InvalidParameterError extends Error {
  constructor(message) {
    super(message);
    this.code = 400;
  }
};
