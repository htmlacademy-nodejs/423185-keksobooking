'use strict';

const project = {
  name: `keksobooking`,
  version: `v0.0.1`,
  author: `Anton Lantukh`
};

const output = {
  default: `Привет пользователь!\n
    Эта программа будет запускать сервер «${project.name}».\n
    Автор: ${project.author}.;\n`,
  help: `Доступные команды:\n
    --help    — печатает этот текст;\n
    --version — печатает версию приложения;`
};

const args = process.argv.slice(2);
const showError = (command) =>
  `Неизвестная команда ${command}.\n Чтобы прочитать правила использования приложения, наберите '--help'`;

switch (args[0]) {
  case `--version`:
    console.log(project.version);
    process.exit(0);
    break;
  case `--help`:
    console.log(output.help);
    process.exit(0);
    break;
  case undefined:
    console.log(output.default);
    process.exit(0);
    break;
  default:
    console.error(showError(args[0]));
    process.exit(1);
}
