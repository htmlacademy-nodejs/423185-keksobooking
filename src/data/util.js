'use strict';

const request = require(`request`);

const generateRandomString = (setLength) => {
  let text = ``;
  const possible = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`;
  for (let i = 0; i < setLength; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

const generateRandomInteger = (min, max) => {
  let rand = min - 0.5 + Math.random() * (max - min + 1);
  rand = Math.round(rand);
  return rand;
};

const generateDate = () => {
  const sevenDays = 86400000;
  const currentDate = Date.now();

  return generateRandomInteger(currentDate, currentDate - sevenDays);
};

const shuffle = (array) => {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
};

const timestampToDate = (ts) => {
  const d = new Date();
  if (d.setTime(ts)) {
    return (`0` + d.getDate()).slice(-2) + `.` + (`0` + (d.getMonth() + 1)).slice(-2) + `.` + d.getFullYear();
  } else {
    return false;
  }
};


const downloadImage = (url) => new Promise((resolve, _reject) => {
  request.get({uri: url, encoding: null}, (err, res, body) => {
    resolve(body);
  });
});

const randomChoice = (arr) => arr[generateRandomInteger(0, arr.length - 1)];

module.exports = {
  generateRandomString, generateDate, generateRandomInteger, shuffle, randomChoice, timestampToDate, downloadImage
};
