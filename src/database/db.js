"use strict";

const {MongoClient} = require(`mongodb`);

const url = `mongodb://localhost:27017`;

module.exports = () => {
  return new Promise((success) => {
    MongoClient.connect(url, {useNewUrlParser: true})
    .then((client) => {
      const dataBase = client.db(`keksobooking`);
      success(dataBase);
    })
    .catch((e) => {
      console.error(`Failed to connect to MongoDB`, e);
      process.exit(1);
    });
  });
};
