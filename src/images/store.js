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
    const bucket = await this.bucket;
    const results = await (bucket).find({filename}).toArray();
    const entity = results[0];
    if (!entity) {
      return false;
    }

    return {info: entity, stream: bucket.openDownloadStreamByName(filename)};
  }

  async save(filename, stream) {
    const bucket = await this.bucket;
    const uploadStream = bucket.openUploadStream(filename);
    stream.pipe(uploadStream);
  }

}

module.exports = new ImagesStore(setupBucket().
  catch((e) => console.error(`Failed to set up bucket`, e)));
