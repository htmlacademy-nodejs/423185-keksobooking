'use strict';

require(`dotenv`).config();
const colors = require(`colors`);

const commands = [
  require(`./src/commands/author`),
  require(`./src/commands/description`),
  require(`./src/commands/license`),
  require(`./src/commands/version`),
  require(`./src/commands/help`),
  require(`./src/commands/server`)
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
    // process.exit(0);
  } else {
    console.error(showError(value));
    process.exit(1);
  }
} else {
  createConsoleInterface();
}
