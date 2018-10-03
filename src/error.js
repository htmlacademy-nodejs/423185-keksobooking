'use strict';

const colors = require(`colors`);

const showError = (command) =>
  colors.red(`Неизвестная команда ${command}.\n Чтобы прочитать правила использования приложения, наберите '--help'`);

module.exports = {
  name: `error`,
  description: `Shows program error`,
  execute(com) {
    console.error(showError(com));
  }
};
