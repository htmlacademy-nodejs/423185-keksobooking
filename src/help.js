'use strict';

module.exports = {
  name: `help`,
  description: `Shows available commands`,
  execute() {
    console.log(`Доступные команды:\n
    --help    — печатает этот текст;\n
    --version — печатает версию приложения;\n
    --author    — печатает версию приложения;\n
    --license    — печатает лицензию приложения;\n
    --description    — печатает описание приложения;\n`);
  }
};
