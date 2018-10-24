"use strict";

const initializeDb = require(`../database/db`);

const setupCollection = async () => {
  const db = await initializeDb();
  const collection = db.collection(`offers`);
  return collection;
};

class OffersStore {
  constructor(collection) {
    this.collection = collection;
  }

  async getOffer(date) {
    const cursor = await this.collection;

    return cursor.findOne(date);
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

module.exports = new OffersStore(setupCollection().
  catch((err) => console.error(`Failed to set up offers-collection`, err)));
