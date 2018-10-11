'use strict';

const readline = require(`readline`);
const fs = require(`fs`);
const path = require(`path`);

const generate = require(`./generator/generate`);
const defaultMessage = require(`./default`);

let regime = `Approve not granted`;
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

const checkPath = (rl, cmd) => {
  const parsedPath = path.parse(cmd);
  const fileDir = parsedPath.dir ? parsedPath.dir : `/`;
  const fileExt = parsedPath.ext;
  const fileBase = parsedPath.base;

  fs.readdir(fileDir, (err, files) => {
    if (err) {
      rl.setPrompt(`Нужно указать корректный путь до файла\n`);
      rl.prompt();
    } else if (fileExt !== `.json`) {
      rl.setPrompt(`Нужно указать файл в формате .json\n`);
      rl.prompt();
    } else {
      const fileExists = files.find((item) => item === fileBase);
      data.path = cmd;
      if (!fileExists) {
        createFile(rl);
      } else {
        regime = `File rewrite`;
        rl.setPrompt(`Файл уже существует. Перезаписать?\n`);
        rl.prompt();
      }
    }
  });
};

const fileRewrite = (rl, cmd) => {
  if (cmd.trim() === `y`) {
    createFile(rl);
  } else if (cmd.trim() === `n`) {
    rl.close();
    process.exit(0);
  } else {
    rl.setPrompt(`Неверная команда\n`);
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
    switch (regime) {
      case `Approve not granted`:
        getApprove(rl, command);
        break;
      case `Approve granted`:
        setupGeneration(rl, command);
        break;
      case `Path setup`:
        checkPath(rl, command);
        break;
      case `File rewrite`:
        fileRewrite(rl, command);
        break;
    }
  });
};

module.exports = createConsoleInterface;
