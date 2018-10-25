'use strict';

const placeTitles = [
  `Большая уютная квартира`,
  `Маленькая неуютная квартира`,
  `Огромный прекрасный дворец`,
  `Маленький ужасный дворец`,
  `Красивый гостевой домик`,
  `Некрасивый негостеприимный домик`,
  `Уютное бунгало далеко от моря`,
  `Неуютное бунгало по колено в воде`
];

const placeTypes = [
  `flat`,
  `palace`,
  `house`,
  `bungalo`
];

const time = [
  `12:00`,
  `13:00`,
  `14:00`
];

const features = [
  `wifi`,
  `dishwasher`,
  `parking`,
  `washer`,
  `elevator`,
  `conditioner`
];

const photos = [
  `http://o0.github.io/assets/images/tokyo/hotel1.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel2.jpg`,
  `http://o0.github.io/assets/images/tokyo/hotel3.jpg`
];

const imageMimes = [`image/jpg`, `image/jpeg`, `image/png`];

const defaultNames = [`Keks`, `Pavel`, `Nikolay`, `Alex`, `Ulyana`, `Anastasyia`, `Julia`];

module.exports = {
  placeTitles, placeTypes, time, features, photos, imageMimes, defaultNames
};
