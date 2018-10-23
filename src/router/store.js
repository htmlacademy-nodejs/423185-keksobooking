"use strict";

const initializeDb = require(`../database/db`);

const setupCollection = async () => {
  const db = await initializeDb();
  const collectionOffers = await db.collection(`offers`);

  return collectionOffers;
};

class OffersStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getOffers(date) {
    return await (this.collection).findOne(date);
  }

  async getAllOffers() {
    return await (this.collection).find();
  }

  async saveOffer(data) {
    return await (this.collection).insertOne(data);
  }

}

module.exports = new OffersStore(setupCollection().
  catch((e) => console.error(`Failed to set up offers-collection`, e)));
