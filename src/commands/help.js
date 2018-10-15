'use strict';

const colors = require(`colors`);

module.exports = {
  name: `help`,
  description: `Печатает этот текст`,
  execute(modules) {
    console.log(`Доступные команды:\n`);
    modules.forEach((item) => {
      console.log(`--${colors.grey(item.name)} - ${colors.green(item.description)}`);
    });
  }
};
