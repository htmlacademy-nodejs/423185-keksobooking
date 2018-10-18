'use strict';

const {placeTypes} = require(`../data/raw-data`);
const ValidationError = require(`../errors/validation-error`);

const validate = (data) => {
  const errors = [];
  if (placeTypes.find((item) => item !== data.offer.type)) {
    errors.push(`Field name "type" must have correct value!`);
  }
  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
  return data;
};

module.exports = validate;
