'use strict';

const {placeTypes, features, defaultNames} = require(`../data/raw-data`);
const ValidationError = require(`../errors/validation-error`);

const MAX_TITLE_LENGTH = 140;
const MIN_TITLE_LENGTH = 1;

const MIN_PRICE = 0;
const MAX_PRICE = 100000;

const MAX_ADDRESS_LENGTH = 100;
const MIN_ADDRESS_LENGTH = 1;

const MAX_ROOMS_NUMBER = 1000;
const MIN_ROOMS_NUMBER = 0;

const checkTitle = (title) => {
  if (!title) {
    return false;
  }

  return title.length <= MAX_TITLE_LENGTH && title.length >= MIN_TITLE_LENGTH && typeof title === `string`;
};

const checkType = (type) => {
  if (!type) {
    return false;
  }

  return placeTypes.find((item) => item === type);
};

const checkPrice = (price) => {
  if (!price) {
    return false;
  }

  return price > MIN_PRICE && price <= MAX_PRICE && parseInt(price, 10);
};

const checkAddress = (address) => {
  if (!address) {
    return false;
  }
  if (address.length > MAX_ADDRESS_LENGTH || address.length < MIN_ADDRESS_LENGTH || typeof address !== `string`) {
    return false;
  }
  const matchArray = address.match(/\d+/g);
  if (!matchArray) {
    return false;
  }
  if (matchArray.length !== 2) {
    return false;
  }

  return true;
};

const checkTime = (time) => {
  const matchArray = time.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/g);
  if (matchArray) {
    return true;
  }

  return false;
};

const checkRooms = (rooms) => {
  if (!rooms) {
    return false;
  }

  return rooms >= MIN_ROOMS_NUMBER && rooms <= MAX_ROOMS_NUMBER;
};

const checkFeatures = (featuresInserted) => {
  if (!featuresInserted) {
    return true;
  } else if (typeof featuresInserted === `string`) {
    return features.includes(featuresInserted);
  } else {

    return featuresInserted.every((item) => features.includes(item));
  }
};

const checkName = (name) => {
  if (!name) {
    return true;
  } else {

    return defaultNames.find((item) => item === name);
  }
};

const validate = (data) => {
  const errors = [];
  if (!checkTitle(data.title)) {
    errors.push({fieldName: `title`, errorMessage: `The title should be a string with a length from 1 to 140 symbols`});
  }
  if (!checkType(data.type)) {
    errors.push({fieldName: `type`, errorMessage: `Field name "type" must have correct value!`});
  }
  if (!checkPrice(data.price)) {
    errors.push({fieldName: `price`, errorMessage: `The price should be from 0 to 100 000`});
  }
  if (!checkAddress(data.address)) {
    errors.push({fieldName: `address`, errorMessage: `The address should be a string with a length not more than 100 symbols`});
  }
  if (!checkTime(data.checkin)) {
    errors.push({fieldName: `checkin`, errorMessage: `Checkin time should be in HH:mm format`});
  }
  if (!checkTime(data.checkout)) {
    errors.push({fieldName: `checkin`, errorMessage: `Checkout time should be in HH:mm format`});
  }
  if (!checkRooms(data.rooms)) {
    errors.push({fieldName: `rooms`, errorMessage: `Rooms number should be countable with a length from 0 to 1000`});
  }
  if (!checkFeatures(data.features)) {
    errors.push({fieldName: `features`, errorMessage: `Invalid features`});
  }
  if (!checkName(data.name)) {
    errors.push({fieldName: `name`, errorMessage: `Invalid name`});
  }
  if (errors.length > 0) {
    throw new ValidationError(errors);
  }

  return data;
};

module.exports = validate;

