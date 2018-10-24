"use strict";

const {MongoClient} = require(`mongodb`);

const url = `mongodb://localhost:27017`;


const initializeDb = async () => {
  let client;
  let dataBase;
  try {
    client = await MongoClient.connect(url, {useNewUrlParser: true});
    dataBase = client.db(`keksobooking`);
  } catch (err) {
    console.error(`Failed to connect to MongoDB`, err);
    process.exit(1);
  }

  return dataBase;
};

module.exports = initializeDb;
