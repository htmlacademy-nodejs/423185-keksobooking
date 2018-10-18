'use strict';

const fs = require(`fs`);
const entity = require(`../data/entity.js`);

module.exports = {
  execute(filePath, count) {
    const data = entity.generateMultipleEntities(count);
    return new Promise((success, fail) => {
      fs.writeFile(filePath, JSON.stringify(data), {encoding: `utf-8`}, (err) => {
        if (err) {
          fail(err);
        }
        return success();
      });
    });
  }
};
