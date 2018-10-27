'use strict';

const readline = require(`readline`);
const fs = require(`fs`);
const path = require(`path`);

const commands = [
  require(`./commands/author`),
  require(`./commands/fill`),
  require(`./commands/version`),
  require(`./commands/help`),
  require(`./commands/server`)
];

const generate = require(`./generator/generate`);
const defaultMessage = require(`./commands/default`);

let inputCommand;
let data = {
  count: 0,
  path: ``
};

const createFile = (rl) => {
  generate.execute(data.path, data.count).then(() => {
    rl.setPrompt(`Элементы созданы!\n`);
    rl.prompt();
    rl.close();
    process.exit(0);
  });
};

const getApprove = (rl, cmd) => {
  if (cmd.trim() === `y`) {
    regime = `Approve granted`;
    rl.setPrompt(`Cколько элементов нужно создать?\n`);
    rl.prompt();
  } else if (cmd.trim() === `n`) {
    rl.close();
    process.exit(0);
  } else {
    rl.setPrompt(`Неверная команда\n`);
    rl.prompt();
  }
};

const setupGeneration = (rl, cmd) => {
  if (parseInt(cmd, 10) && cmd >= 1 && cmd <= 20) {
    regime = `Path setup`;
    data.count = parseInt(cmd, 10);
    rl.setPrompt(`Пожалуйста, укажите путь для сохранения данных\n`);
    rl.prompt();
  } else if (!parseInt(cmd.trim(), 10)) {
    rl.setPrompt(`Нужно указать число\n`);
    rl.prompt();
  } else {
    rl.setPrompt(`Число не должно быть меньше 1 и больше 20\n`);
    rl.prompt();
  }
};

const createConsoleInterface = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.setPrompt(defaultMessage.execute());
  rl.prompt();

  rl.on(`line`, (command) => {
    const value = commands.find((item) => value === `--${item.name}`);
    if (value) {
      command.execute(commands);
    } else {
      showDefault(value);
    }
  });
};

module.exports = createConsoleInterface;
