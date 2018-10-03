'use strict';

const packageInfo = require(`../package.json`);

module.exports = {
  name: `license`,
  description: `печатает лицензию приложения`,
  execute() {
    console.log(packageInfo.license);
  }
};
