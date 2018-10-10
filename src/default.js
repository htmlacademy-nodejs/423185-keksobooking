'use strict';

const colors = require(`colors`);

module.exports = {
  name: `default`,
  description: `показывает стандартное сообщение`,
  execute() {
    return (
      colors.cyan(`Привет пользователь!
      Эта программа будет генерировать данные.
      Хотите сгенерировать сейчас?(y/n)\n`)
    );
  }
};
