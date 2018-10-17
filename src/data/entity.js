'use strict';

const {generateRandomString, generateRandomInteger, randomChoice, shuffle, generateDate} = require(`./util`);
const data = require(`./raw-data`);

let setLocation;
const location = () => ({
  x: generateRandomInteger(300, 900),
  y: generateRandomInteger(150, 500)
});

const author = () => ({
  avatar: `https://robohash.org/${generateRandomString(10)}`
});

const offer = () => {
  setLocation = location();
  return {
    title: randomChoice(data.placeTitles),
    address: `${setLocation.x}, ${setLocation.y}`,
    price: generateRandomInteger(1000, 1000000),
    type: randomChoice(data.placeTypes),
    rooms: generateRandomInteger(1, 5),
    guests: generateRandomInteger(1, 5),
    checkin: randomChoice(data.time),
    checkout: randomChoice(data.time),
    features: shuffle(data.features).slice(generateRandomInteger(0, data.features.length)),
    description: ``,
    photos: data.photos
  };
};

module.exports = {
  generateEntity() {
    return {
      author: author(),
      offer: offer(),
      location: setLocation,
      date: generateDate()
    };
  },

  generateMultipleEntities(cnt) {
    let dataArray = [];
    for (let i = 0; i < cnt; i++) {
      dataArray.push(this.generateEntity());
    }

    return dataArray;
  }
};
