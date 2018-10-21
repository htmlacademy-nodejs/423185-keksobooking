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
