'use strict';

const author = require(`./src/author`);
const defaultMessage = require(`./src/default-message`);
const description = require(`./src/description`);
const error = require(`./src/error`);
const help = require(`./src/help`);
const license = require(`./src/license`);
const version = require(`./src/version`);

const args = process.argv.slice(2);

switch (args[0]) {
  case `--author`:
    author.execute();
    break;
  case `--description`:
    description.execute();
    break;
  case `--version`:
    version.execute();
    break;
  case `--license`:
    license.execute();
    break;
  case `--help`:
    help.execute();
    break;
  case undefined:
    defaultMessage.execute();
    break;
  default:
    error.execute(args[0]);
}
