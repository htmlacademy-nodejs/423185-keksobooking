'use strict';

const colors = require(`colors`);

const packageInfo = require(`../../package.json`);

module.exports = {
  name: `version`,
  description: `печатает версию приложения`,
  async execute() {
    const version = packageInfo.version.split(`.`);
    const major = colors.red(version[0]);
    const minor = colors.green(version[1]);
    const patch = colors.blue(version[2]);

    console.log(`v${major}.${minor}.${patch}`);
  }
};
