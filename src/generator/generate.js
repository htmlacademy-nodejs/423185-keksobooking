'use strict';

const fs = require(`fs`);

const generateEntity = require(`../data/entity.js`);

const getData = (cnt) => {
  let data = [];
  for (let i = 0; i < cnt; i++) {
    data.push(generateEntity());
  }

  return data;
};

module.exports = {
  execute(filePath, count) {
    const data = getData(count);
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
