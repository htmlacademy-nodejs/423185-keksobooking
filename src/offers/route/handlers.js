"use strict";

const util = require(`../../data/util`);
const {defaultNames} = require(`../../data/raw-data`);

const InvalidParameterError = require(`../../errors/illegal-date-error`);
const IllegalArgumentError = require(`../../errors/illegal-argument-error`);
const IlliegalDateError = require(`../../errors/illegal-date-error`);

const checkFiles = (data) => {
  let avatar;
  let preview;

  const files = (`files` in data) ? data.files : ``;
  if (files) {
    avatar = (`avatar` in files) ? files.avatar[0] : ``;
    preview = (`preview` in files) ? files.preview[0] : ``;
  } else {
    avatar = preview = ``;
  }

  return {avatar, preview};
};

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

const checkPhotos = (offerPreviews, preview) => {
  if (offerPreviews) {
    return offerPreviews;
  }
  if (preview) {
    return preview.originalname;
  }
  return [];
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

  const resultingObject = Object.assign({}, offer, {name}, {location});

  return resultingObject;
};


const modifyRequestToDatabase = (request, avatar, preview) => {
  const offer = Object.assign({}, request);

  const name = offer.name;
  delete offer.name;

  offer.photos = checkPhotos(offer.photos, preview);

  const location = offer.location;

  const date = Date.now();
  const author = {name, avatar: avatar ? `api/offers/${date}/avatar` : ``};

  const resultingObject = Object.assign({}, {author}, {offer}, {location}, {date});

  return resultingObject;
};

const generateOfferHtml = (data) => {
  return `<div>
            <h4>Author:</h4>
            <ul>
              <li>avatar: ${data.author.avatar}</li>
              <li>name: ${data.author.name}</li>
            </ul>
            <h4>Offer:</h4>
            <ul>
               <li>title: ${data.offer.title}</li>
               <li>address: ${data.offer.address}</li>
               <li>price: ${data.offer.price}</li>
               <li>type: ${data.offer.type}</li>
               <li>rooms: ${data.offer.rooms}</li>
               <li>guests: ${data.offer.guests}</li>
               <li>checkin: ${data.offer.checkin}</li>             
               <li>checkout: ${data.offer.checkout}</li>             
               <li>features: ${data.offer.features}</li>             
               <li>description: ${data.offer.description}</li>             
               <li>photos: ${data.offer.photos}</li>             
            </ul>
            <h4>Location:</h4>
            <ul>
              <li>x: ${data.location.x}</li>
              <li>y: ${data.location.y}</li>
            </ul>
            <h4>Date:</h4>
            <ul>
              <li>date: ${data.date}</li>
            </ul>            
          </div>`;
};

const generateAllOffersHtml = (data, skip, limit, offersCount) => {
  let htmlFull = ``;
  data.forEach((item) => {
    htmlFull += generateOfferHtml(item);
    htmlFull += `<hr>`;
  });
  const infoPart = `<div>
            <h4>Parameters:</h4>
            <ul>
              <li>skip: ${skip}</li>
              <li>limit: ${limit}</li>
              <li>total: ${offersCount}</li>              
            </ul>          
          </div>`;
  htmlFull += infoPart;

  return htmlFull;
};

const generateSimpleErrorHtml = (code, message) => {
  return `<div>
           <h4>Error</h4>
            <ul>
              <li>Code: ${code}</li>
              <li>Message: ${message}</li>
            </ul>
          </div>`;
};

const generateCombineErrorHtml = (message, errors) => {
  let htmlFull = `<h4>Error: ${message}</h4>`;
  errors.forEach((item) => {
    htmlFull += `<div>
                   <ul>
                     <li>Field: ${item.fieldName}</li>
                     <li>Message: ${item.errorMessage}</li>
                   </ul>
                 </div>
                 <hr>`;
  });

  return htmlFull;
};

module.exports = {
  checkFiles,
  queryCheck,
  checkDate,
  modifyRequestToResponse,
  modifyRequestToDatabase,
  generateOfferHtml,
  generateAllOffersHtml,
  generateSimpleErrorHtml,
  generateCombineErrorHtml
};
