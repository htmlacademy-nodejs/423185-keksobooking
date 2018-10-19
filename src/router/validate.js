'use strict';

const {placeTypes, features, imageMimes, defaultNames} = require(`../data/raw-data`);
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
  return title.length <= MAX_TITLE_LENGTH && title.length >= MIN_TITLE_LENGTH && typeof title === `string`;
};

const checkType = (type) => {
  return placeTypes.find((item) => item === type);
};

const checkPrice = (price) => {
  return price > MIN_PRICE && price <= MAX_PRICE && typeof price === `number`;
};

const checkAddress = (address) => {
  return address.length <= MAX_ADDRESS_LENGTH && address.length >= MIN_ADDRESS_LENGTH && typeof address === `string`;
};

const checkTime = (time) => {
  const matchArray = time.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/);
  return matchArray.length === 4;
};

const checkRooms = (rooms) => {
  return rooms >= MIN_ROOMS_NUMBER && rooms <= MAX_ROOMS_NUMBER;
};

const checkFeatures = (featuresInserted) => {
  if (!featuresInserted) {
    return true;
  } else {
    return featuresInserted.every((item) => features.includes(item));
  }
};

const checkImage = (avatar) => {
  if (!avatar) {
    return true;
  } else {
    return imageMimes.find((item) => item === avatar.type);
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
  if (!checkTitle(data.offer.title)) {
    errors.push(`The title should be a string with a length from 1 to 140 symbols`);
  }
  if (!checkType(data.offer.type)) {
    errors.push(`Field name "type" must have correct value!`);
  }
  if (!checkPrice(data.offer.price)) {
    errors.push(`The price should be from 0 to 100 000`);
  }
  if (!checkAddress(data.offer.address)) {
    errors.push(`The address should be a string with a length not more than 100 symbols`);
  }
  if (!checkTime(data.offer.checkin)) {
    errors.push(`Checkin time should be in HH:mm format`);
  }
  if (!checkTime(data.offer.checkout)) {
    errors.push(`Checkout time should be in HH:mm format`);
  }
  if (!checkRooms(data.offer.rooms)) {
    errors.push(`Rooms number should be countable with a length from 0 to 1000`);
  }
  if (!checkFeatures(data.offer.features)) {
    errors.push(`Invalid features`);
  }
  if (!checkImage(data.author.avatar)) {
    errors.push(`Invalid file format. Image should be image/jpg, image/jpeg or image/png`);
  }
  if (!checkImage(data.author.preview)) {
    errors.push(`Invalid file format. Image should be image/jpg, image/jpeg or image/png`);
  }
  if (!checkName(data.author.name)) {
    errors.push(`Invalid name`);
  }
  if (errors.length > 0) {
    throw new ValidationError(errors);
  }
  return data;
};

module.exports = validate;

