"use strict";


const entity = require(`../data/entity`);
const offersStore = require(`../offers/store`);
const imagesStore = require(`../images/store`);
const request = require(`request`);

const fillDatabase = async () => {
  const cnt = 20;
  const entities = entity.generateMultipleEntities(cnt);

  await offersStore.saveAllOffers(entities);

  await entities.forEach((item) => {
    let offer = item.date;
    imagesStore.save(offer, request(item.author.avatar));
  });
};

module.exports = {
  name: `fill`,
  description: `наполняет базу данных предложениями`,
  execute() {
    return new Promise(() => {
      fillDatabase()
        .then(() => console.log(`Предложения загружены в базу данных`))
        .catch((err) => console.error(err));
    });
  }
};
