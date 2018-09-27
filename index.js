const projectName = "keksobooking";
const currentVersion = "v0.0.1";
const author = "Anton Lantukh";
const defaultOutput = `Привет пользователь!\n
Эта программа будет запускать сервер «${projectName}».\n
Автор: ${author}.;\n`;
const helpOption = `Доступные команды:\n
--help    — печатает этот текст;\n
--version — печатает версию приложения;`;

const showError = command =>
  `Неизвестная команда ${command}.\n Чтобы прочитать правила использования приложения, наберите "--help"`;
const renderInput = key => {
  switch (key) {
    case "--version":
      console.log(currentVersion);
      break;
    case "--help":
      console.log(helpOption);
      break;
    default:
      console.error(showError(key));
  }
};

process.stdout.write(defaultOutput);
process.stdin.on("data", data => {
  renderInput(data.toString().trim());
});
