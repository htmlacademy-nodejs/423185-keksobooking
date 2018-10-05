'use strict';

const functions = require(`./util`);
const data = require(`./raw-data`);

const location = {
  x: functions.generateRandomInteger(300, 900),
  y: functions.generateRandomInteger(150, 500)
};

const author = {
  avatar: `https://robohash.org/${functions.generateRandomString(10)}`
};

const offer = {
  title: data.placeTitle[functions.generateRandomInteger(0, data.placeTitle.length - 1)],
  address: `${location.x}, ${location.y}`,
  price: functions.generateRandomInteger(1000, 1000000),
  type: data.placeType[functions.generateRandomInteger(0, data.placeType.length - 1)],
  rooms: functions.generateRandomInteger(1, 5),
  guests: functions.generateRandomInteger(1, 5),
  checkin: data.time[functions.generateRandomInteger(0, data.time.length - 1)],
  checkout: data.time[functions.generateRandomInteger(0, data.time.length - 1)],
  features: functions.shuffle(data.features).slice(functions.generateRandomInteger(0, data.features.length)),
  description: ``,
  photos: data.photos
};

module.exports = () => ({
  author,
  offer,
  location,
  date: functions.generateDate()
});
