'use strict';

const initializeDb = require(`../database/db`);
const mongodb = require(`mongodb`);
const fs = require(`fs`);

const setupBucket = async () => {
  const db = await initializeDb();
  const bucket = new mongodb.GridFSBucket(db, {bucketName: `avatars`});

  return bucket;
};

class ImagesStore {
  constructor(bucket) {
    this.bucket = bucket;
  }

  async get(filename) {
    return new Promise((success, fail) => {
      const bucket = this.bucket.openDownloadStreamByName(filename);
      bucket.on(`error`, fail());
      bucket.on(`finish`, success());

      return bucket;
    });
  }

  async save(filename, stream) {
    return new Promise((success, fail) => {
      stream.pipe(this.bucket.openUploadStream(filename))
      .on(`error`, fail())
      .on(`finish`, success());
    });
  }

}

module.exports = new ImagesStore(setupBucket().
    catch((e) => console.error(`Failed to set up bucket`, e)));
