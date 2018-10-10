'use strict';

const fs = require(`fs`);
const path = require(`path`);

const generateEntity = require(`../data/entity.js`);

const getData = (cnt) => {
  let data = [];
  for (let i = 0; i < cnt; i++) {
    data.push(generateEntity());
  }

  return data;
};

module.exports = {
  execute(directory, count) {
    const data = getData(count);
    return new Promise((success, fail) => {
      fs.writeFile(path.join(directory, `generated-data.json`), JSON.stringify(data), {encoding: `utf-8`}, (err) => {
        if (err) {
          return fail(err);
        }

        return success();
      });
    });
  }
};
