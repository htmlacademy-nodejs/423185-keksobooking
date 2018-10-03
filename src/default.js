'use strict';

const packageInfo = require(`../package.json`);

module.exports = {
  name: `default`,
  description: `показывает стандартное сообщение`,
  execute() {
    console.log(`Привет пользователь!\n
    Эта программа будет запускать сервер «${packageInfo.name}».\n
    Автор: ${packageInfo.author}.;\n`);
  }
};
