"use strict";

const https = require(`https`);
const entity = require(`../data/entity`);
const offersStore = require(`../offers/store`);
const imagesStore = require(`../images/store`);

const getImage = async (avatar, date) => {
  return new Promise((success, _fail) => {
    https.get(avatar, async (res) => {
      await imagesStore.save(date, res);
      success();
    });
  });
};

const fillDatabase = async () => {
  const cnt = 20;
  const entities = entity.generateMultipleEntities(cnt);

  const images = entities.map(async (item) => {
    return await getImage(item.author.avatar, item.date);
  });

  await Promise.all(images);

  entities.forEach((item) => {
    item.author.avatar = `api/offers/${item.date}/avatar`;
  });

  await offersStore.saveAllOffers(entities);
};

module.exports = {
  name: `fill`,
  description: `наполняет базу данных предложениями`,
  async execute() {
    await fillDatabase()
      .then(() => {
        console.log(`Предложения загружены в базу данных`);
      })
      .catch((err) => console.error(err));
  }
};
