/* eslint consistent-return:0*/
"use strict";

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

let port;

const showError = (com) => {
  return colors.red(`Неизвестная команда '${com}'.\n Чтобы прочитать правила использования приложения, наберите '--help'`);
};

const findCommand = (val) => {
  const comArray = val.split(` `);
  if (comArray[0] === `--server`) {
    port = comArray[1];
    val = comArray[0];
  }
  const commandAvailable = commands.find((item) => val === `--${item.name}`);

  return commandAvailable;
};

const executeCommand = async (com, mode, pt) => {
  await com.execute(commands, pt);
  switch (mode) {
    case `console`:
      break;
    case `argument`:
      if (com.name !== `server`) {
        process.exit(0);
      }
      break;
  }
};

// If console interface chosen
const createConsoleInterface = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt(defaultMessage.execute());
  rl.prompt();

  rl.on(`line`, (val) => {
    const commandAvailable = findCommand(val);
    if (commandAvailable) {
      executeCommand(commandAvailable, `console`, port);
    } else {
      console.log(showError(val));
    }
  });
};

// If any arguments given
const consoleArguments = process.argv.slice(2);
const argumentToConsole = consoleArguments[0];

if (argumentToConsole) {
  const commandAvailable = findCommand(argumentToConsole);
  if (!commandAvailable) {
    console.error(showError(argumentToConsole));
    process.exit(1);
  }
  executeCommand(commandAvailable, `argument`);

} else {
  createConsoleInterface();
}
