"use strict";

const util = require(`../../data/util`);
const {defaultNames} = require(`../../data/raw-data`);

const InvalidParameterError = require(`../../errors/illegal-date-error`);
const IllegalArgumentError = require(`../../errors/illegal-argument-error`);
const IlliegalDateError = require(`../../errors/illegal-date-error`);

const getName = (name) => {
  if (name) {
    return name;
  } else {
    return defaultNames[util.generateRandomInteger(0, defaultNames.length - 1)];
  }
};

const queryCheck = (query) => {
  if (parseInt(query, 10) === 0) {
    return 0;
  }
  if ((!isFinite(query) || !parseInt(query, 10)) || query < 0) {
    throw new InvalidParameterError(`Invalid parameter error`);
  } else {
    return parseInt(query, 10);
  }
};

const checkDate = (offerDate) => {
  const convertedDate = util.timestampToDate(offerDate);

  if (!offerDate) {
    throw new IllegalArgumentError(`No date was typed`);
  }
  if (!parseInt(offerDate, 10) || !convertedDate) {
    throw new IlliegalDateError(`Invalid date error`);
  }
  const parsedDate = parseInt(offerDate, 10);

  return {convertedDate, parsedDate};
};

const modifyRequestToResponse = (request) => {
  const offer = Object.assign({}, request);
  if (!offer.features || !offer.features.length) {
    offer.features = [];
  }
  if (!offer.description) {
    offer.description = ``;
  }
  const matchArray = offer.address.match(/\d+/g);
  const location = {x: matchArray[0], y: matchArray[1]};

  const name = getName(offer.name);
  console.log(offer);

  const resultingObject = Object.assign({}, offer, {name}, {location});

  return resultingObject;
};


const modifyRequestToDatabase = (request, avatar, photos) => {
  const offer = Object.assign({}, request);

  const name = offer.name;
  delete offer.name;

  const location = offer.location;
  const pictures = photos ? offer.photos : [];
  offer.photos = pictures;

  const date = Date.now();
  const author = {name, avatar: avatar ? `api/offers/${date}/avatar` : ``};

  const resultingObject = Object.assign({}, {author}, {offer}, {location}, {date});

  return resultingObject;
};


module.exports = {queryCheck, checkDate, modifyRequestToResponse, modifyRequestToDatabase};
