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
  return colors.red(`Неизвестная команда '${com}'.\n Чтобы прочитать правила использования приложения, наберите '--help'`);
};

const createConsoleInterface = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt(defaultMessage.execute());
  rl.prompt();

  rl.on(`line`, (val) => {
    const commandAvailable = commands.find((item) => val === `--${item.name}`);
    if (commandAvailable) {
      commandAvailable.execute(commands);
    } else {
      console.log(showError(val));
    }
  });
};

// If any arguments
const consoleArguments = process.argv.slice(2);
const argumentToConsole = consoleArguments[0];

if (argumentToConsole) {
  const command = commands.find((item) => argumentToConsole === `--${item.name}`);
  if (command) {
    command.execute(commands);
    if (argumentToConsole !== `--server`) {
      process.exit(0);
    }
  } else {
    console.error(showError(argumentToConsole));
    process.exit(1);
  }
} else {
  createConsoleInterface();
}
