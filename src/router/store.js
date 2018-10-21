"use strict";

const db = require(`../database.db`);

const setupCollection = () => {
  return new Promise((success, _fail) => {
    db()
      .then((dBase) => {
        const collection = dBase.collection(`offers`);
        collection.createIndex({unique: true});
        success(collection);
      });
  });
};

class OffersStore {
  constructor(collection) {
    this.collection = collection;
  }

  getOffers(date) {
    return new Promise((success, _fail) => {
      success(this.collection.find({date}));
    });
  }

  getAllOffers() {
    return new Promise((success, _fail) => {
      success(this.collection.findOne());
    });
  }

  saveOffer(data) {
    return new Promise((success, _fail) => {
      success(this.collection.insertOne(data));
    });
  }

}

module.exports = new OffersStore(setupCollection().
  catch((e) => console.error(`Failed to set up offers-collection`, e)));
