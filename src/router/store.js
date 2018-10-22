"use strict";

const db = require(`../database/db`);

const setupCollection = () => {
  return new Promise((success) => {
    db()
      .then((dBase) => {
        dBase.collection(`offers`);
      })
      .then((coll) => {
        success(coll);
      });
  });
};

class OffersStore {
  constructor(collection) {
    this.collection = collection;
  }

  getOffers(date) {
    this.collection
      .then((res) => {
        find({ date })
      });
  }

  getAllOffers() {
    return new Promise((success, _fail) => {
      success(this.collection.findOne());
    });
  }

  saveOffer(data) {
    return new Promise((success, _fail) => {
      console.log(this.collection);
      success(this.collection.insertOne(data));
    });
  }

}

module.exports = new OffersStore(setupCollection().
  catch((e) => console.error(`Failed to set up offers-collection`, e)));
