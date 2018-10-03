'use strict';

module.exports = {
  name: `help`,
  description: `Печатает этот текст`,
  execute(modules) {
    console.log(`Доступные команды:\n`);
    modules.forEach((item) => {
      console.log(`--${item.name} - ${item.description}`);
    });
  }
};
