'use strict';

const db = require(`../database/db`);
const mongodb = require(`mongodb`);

const setupBucket = () => {
  return new Promise((success, _fail) => {
    db()
    .then((dBase) => {
      const bucket = new mongodb.GridFSBucket(dBase, {
        chunkSizeBytes: 512 * 1024,
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
      const results = this.bucket.find({filename}).toArray();
      const entity = results[0];
      if (!entity) {
        fail();
      }
      success({info: entity, stream: this.bucket.openDownloadStreamByName(filename)});
    });
  }

  save(filename, stream) {
    return new Promise((success, fail) => {
      stream.pipe(this.bucket.openUploadStream(filename)).on(`error`, fail).on(`finish`, success);
    });
  }

}

module.exports = new ImagesStore(setupBucket().
    catch((e) => console.error(`Failed to set up bucket`, e)));
