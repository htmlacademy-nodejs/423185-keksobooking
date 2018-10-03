'use strict';

const packageInfo = require(`../package.json`);

module.exports = {
  name: `version`,
  description: `печатает версию приложения`,
  execute() {
    console.log(`v${packageInfo.version}`);
  }
};
