'use strict';

module.exports = class IllegalDateError extends Error {
  constructor(message) {
    super(message);
    this.code = 404;
  }
};
