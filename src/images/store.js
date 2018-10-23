'use strict';

const initializeDb = require(`../database/db`);
const mongodb = require(`mongodb`);
const fs = require(`fs`);

const setupBucket = () => {
  return new Promise((success, _fail) => {
    initializeDb()
    .then((dBase) => {
      const bucket = new mongodb.GridFSBucket(dBase, {
        bucketName: `avatars`
      });
      success(bucket);
    });
  });
};

class ImagesStore {
  constructor(bucket) {
    this.bucket = bucket;
  }

  get(filename) {
    return new Promise((success, fail) => {
      this.bucket.openDownloadStreamByName(filename)
      .pipe(fs.createWriteStream(filename))
      .on(`error`, () => {
        fail();
      })
      .on(`end`, () => {
        success();
      });
    });
  }

  save(filename, stream) {
    return new Promise((success, fail) => {
      stream.pipe(this.bucket.openUploadStream(filename))
      .on(`error`, fail())
      .on(`finish`, success());
    });
  }

}

module.exports = new ImagesStore(setupBucket().
    catch((e) => console.error(`Failed to set up bucket`, e)));
