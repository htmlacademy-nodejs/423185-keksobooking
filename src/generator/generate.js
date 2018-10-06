'use strict';

const generateEntity = require(`../data/entity.js`);
const fs = require(`fs`);
const path = require(`path`);

const CURRENT_PATH = __dirname;
const data = generateEntity();

module.exports = {
  execute(gotPath = CURRENT_PATH) {
    return new Promise((success, fail) => {
      fs.writeFile(path.join(gotPath, `/generatedData.json`), JSON.stringify(data), {encoding: `utf-8`}, (err) => {
        if (err) {
          return fail(err);
        }

        return success();
      });
    });
  }
};
