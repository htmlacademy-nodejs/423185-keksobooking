"use strict";

const http = require(`http`);
const entity = require(`../data/entity`);
const offersStore = require(`../offers/store`);
const imagesStore = require(`../images/store`);

const fillDatabase = async () => {
  const cnt = 20;
  const entities = entity.generateMultipleEntities(cnt);

  await offersStore.saveAllOffers(entities);

  await entities.forEach(async (item) => {
    let offer = item.date;
    await new Promise((success, _fail) => {
      http.get(item.author.avatar, async (res) => {
        await imagesStore.save(offer, res);
        success();
      });
    });
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
