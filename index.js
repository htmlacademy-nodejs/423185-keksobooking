const PROJECT = {
  NAME: "keksobooking",
  VERSION: "v0.0.1",
  AUTHOR: "Anton Lantukh"
};

const OUTPUT = {
  DEFAULT: `Привет пользователь!\n
    Эта программа будет запускать сервер «${PROJECT.NAME}».\n
    Автор: ${PROJECT.AUTHOR}.;\n`,
  HELP: `Доступные команды:\n
    --help    — печатает этот текст;\n
    --version — печатает версию приложения;`
};

const args = process.argv.slice(2);
const showError = command =>
  `Неизвестная команда ${command}.\n Чтобы прочитать правила использования приложения, наберите "--help"`;

switch (args[0]) {
  case "--version":
    console.log(PROJECT.VERSION);
    break;
  case "--help":
    console.log(OUTPUT.HELP);
    break;
  case undefined:
    console.log(OUTPUT.DEFAULT);
    break;
  default:
    console.error(showError(args[0]));
}
