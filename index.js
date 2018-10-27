'use strict';

require(`dotenv`).config();

const readline = require(`readline`);
const colors = require(`colors`);

const commands = [
  require(`./src/commands/author`),
  require(`./src/commands/fill`),
  require(`./src/commands/version`),
  require(`./src/commands/help`),
  require(`./src/commands/server`)
];
const defaultMessage = require(`./src/commands/default`);


const showError = (com) => {
  colors.red(`Неизвестная команда ${com}.\n Чтобы прочитать правила использования приложения, наберите '--help'`);
};

const arg = process.argv.slice(2);
const value = arg[0];

const createConsoleInterface = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt(defaultMessage.execute());
  rl.prompt();

  rl.on(`line`, (command) => {
    const com = commands.find((item) => value === `--${item.name}`);
    if (com) {
      command.execute(commands);
    } else {
      console.log(showError(com));
    }
  });
};

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
