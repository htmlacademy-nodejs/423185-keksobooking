"use strict";

const initializeDb = require(`../database/db`);
const logger = require(`../logger`);

const {
  DB_COLLECTION = `offers`
} = process.env;

const setupCollection = async () => {
  const db = await initializeDb();
  const collection = db.collection(DB_COLLECTION);
  return collection;
};

class OffersStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getOffer(date) {
    const cursor = await this.collection;

    return cursor.findOne({date});
  }

  async getAllOffers() {
    const cursor = await this.collection;

    return cursor.find();
  }

  async saveOffer(data) {
    const cursor = await this.collection;

    return cursor.insertOne(data);
  }

}

module.exports = new OffersStore(setupCollection()
  .then(() => {
    logger.ingo(`Offers-collection was set up`);
  })
  .catch((err) => logger.error(`Failed to set up offers-collection`, err)));
