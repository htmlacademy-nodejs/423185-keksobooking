'use strict';

const generateEntity = require(`../data/entity.js`);
const fs = require(`fs`);

const CURRENT_PATH = __dirname;
const fileWriteOptions = {encoding: `utf-8`};
const data = generateEntity();

module.exports = {
  execute(path = CURRENT_PATH) {
    return new Promise((success, fail) => {
      fs.writeFile(`${path}/generatedData.json`, JSON.stringify(data), fileWriteOptions, (err) => {
        if (err) {
          return fail(err);
        }

        return success();
      });
    });
  }
};
