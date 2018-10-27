"use strict";

const entity = require(`../data/entity`);
const offersStore = require(`../offers/store`);
const imagesStore = require(`../images/store`);
const GridStream = require(`../offers/route/stream`);
const util = require(`../data/util`);

const fillDatabase = async () => {
  const cnt = 20;
  const entities = entity.generateMultipleEntities(cnt);

  await offersStore.saveAllOffers(entities);

  await entities.forEach(async (item) => {
    let offer = item.date;
    const avatar = await util.downloadImage(item.author.avatar);
    await imagesStore.save(offer, new GridStream(avatar));
  });
};

module.exports = {
  name: `fill`,
  description: `наполняет базу данных предложениями`,
  execute() {
    fillDatabase()
      .then(() => console.log(`Предложения загружены в базу данных`))
      .catch((err) => console.error(err));
  }
};
