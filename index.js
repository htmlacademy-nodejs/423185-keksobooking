'use strict';

const commands = [
  require(`./src/author`),
  require(`./src/description`),
  require(`./src/license`),
  require(`./src/version`),
  require(`./src/help`)
];

const defaultMessage = require(`./src/default`);
const error = require(`./src/error`);

const arg = process.argv.slice(2);
const value = arg[0];

if (value) {
  const command = commands.find((item) => value === `--${item.name}`);
  if (command) {
    command.execute(commands);
  } else {
    error.execute(value);
    process.exit(1);
  }
} else {
  defaultMessage.execute(commands);
}

process.exit(0);
