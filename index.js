'use strict';

const colors = require(`colors`);

const commands = [
  require(`./src/author`),
  require(`./src/description`),
  require(`./src/license`),
  require(`./src/version`),
  require(`./src/help`)
];

const createConsoleInterface = require(`./src/console-interface`);

const showError = (com) =>
  colors.red(`Неизвестная команда ${com}.\n Чтобы прочитать правила использования приложения, наберите '--help'`);
const arg = process.argv.slice(2);
const value = arg[0];

if (value) {
  const command = commands.find((item) => value === `--${item.name}`);
  if (command) {
    command.execute(commands);
  } else {
    console.error(showError(value));
    process.exit(1);
  }
} else {
  createConsoleInterface();
}
