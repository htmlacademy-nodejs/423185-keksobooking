"use strict";

const {MongoClient} = require(`mongodb`);
const logger = require(`../logger`);

const {
  DB_HOST = `localhost`,
  DB_PORT = 27017,
  DB_NAME = `keksobooking`
} = process.env;

const url = `mongodb://${DB_HOST}:${DB_PORT}`;


const initializeDb = async () => {
  let client;
  let dataBase;
  try {
    client = await MongoClient.connect(url, {useNewUrlParser: true});
    dataBase = client.db(DB_NAME);
  } catch (err) {
    logger.error(`Failed to connect to MongoDB`, err);
    process.exit(1);
  }

  return dataBase;
};

module.exports = initializeDb;
