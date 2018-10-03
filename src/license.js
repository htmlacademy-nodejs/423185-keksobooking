'use strict';

const colors = require(`colors`);
const packageInfo = require(`../package.json`);

module.exports = {
  name: `license`,
  description: `печатает лицензию приложения`,
  execute() {
    console.log(colors.green(packageInfo.license));
  }
};
