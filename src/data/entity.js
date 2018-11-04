'use strict';

const {generateRandomString, generateRandomInteger, randomChoice, shuffle, generateDate} = require(`./util`);
const data = require(`./raw-data`);

let setLocation;
const location = () => ({
  x: generateRandomInteger(300, 900),
  y: generateRandomInteger(150, 500)
});

const author = () => ({
  name: data.defaultNames[generateRandomInteger(0, data.length)],
  avatar: `https://robohash.org/${generateRandomString(10)}.jpeg`
});

const offer = () => {
  setLocation = location();
  return {
    title: randomChoice(data.placeTitles),
    address: `${setLocation.x}, ${setLocation.y}`,
    price: generateRandomInteger(0, 100000),
    type: randomChoice(data.placeTypes),
    rooms: generateRandomInteger(0, 1000),
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
  },

  entityToNewOfferRequest(entity) {
    return {
      name: ``,
      title: entity.offer.title,
      address: entity.offer.address,
      description: entity.offer.description,
      price: entity.offer.price,
      type: entity.offer.type,
      rooms: entity.offer.rooms,
      guests: entity.offer.guests,
      checkin: entity.offer.checkin,
      checkout: entity.offer.checkout,
      features: entity.offer.features
    };
  },
  author
};
