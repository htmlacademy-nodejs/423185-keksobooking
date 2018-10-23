'use strict';

const initializeDb = require(`../database/db`);
const mongodb = require(`mongodb`);

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
    const streamBucket = await this.bucket.openDownloadStreamByName(filename).on(`error`, Promise.reject());

    return streamBucket;
  }

  async save(filename, stream) {
    await stream.pipe(this.bucket.openUploadStream(filename))
    .on(`error`, Promise.reject())
    .on(`finish`, Promise.resolve());
  }

}

module.exports = new ImagesStore(setupBucket().
  catch((e) => console.error(`Failed to set up bucket`, e)));
