'use strict';

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

const randomChoice = (arr) => arr[generateRandomInteger(0, arr.length - 1)];

module.exports = {
  generateRandomString, generateDate, generateRandomInteger, shuffle, randomChoice
};
