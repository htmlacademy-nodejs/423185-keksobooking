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
  const matchArray = request.address.match(/\d+/g);
  const location = {x: matchArray[0], y: matchArray[1]};

  const name = getName(request.name);

  const resultingObject = Object.assign({}, {request}, {name}, {location});

  return resultingObject;
};


const modifyRequestToDatabase = (request) => {
  const offer = Object.assign({}, request);
  const name = offer.name;
  delete offer.name;

  const matchArray = request.address.match(/\d+/g);
  const location = {x: matchArray[0], y: matchArray[1]};
  const date = Date.now();
  const author = {name: getName(name), avatar: `api/offers/${date}/avatar`};

  const resultingObject = Object.assign({}, {offer}, {author}, {date}, {location});

  return resultingObject;
};


module.exports = {queryCheck, checkDate, modifyRequestToResponse, modifyRequestToDatabase};
