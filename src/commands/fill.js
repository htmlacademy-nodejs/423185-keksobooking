"use strict";

const https = require(`https`);
const entity = require(`../data/entity`);
const offersStore = require(`../offers/store`);
const imagesStore = require(`../images/store`);

const fillDatabase = async () => {
  const cnt = 20;
  const entities = entity.generateMultipleEntities(cnt);

  await entities.forEach(async (item) => {
    let offer = item.date;
    await new Promise((success, _fail) => {
      https.get(item.author.avatar, async (res) => {
        await imagesStore.save(offer, res);
        success();
      });
    });
  });

  await entities.forEach((item) => {
    item.author.avatar = `api/offers/${item.date}/avatar`;
  });

  await offersStore.saveAllOffers(entities);
};

module.exports = {
  name: `fill`,
  description: `наполняет базу данных предложениями`,
  async execute() {
    await (fillDatabase()
    .catch((err) => console.error(err)));
    console.log(`Предложения загружены в базу данных`);
  }
};
