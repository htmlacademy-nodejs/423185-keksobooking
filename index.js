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
    process.exit(0);
    break;
  case `--description`:
    description.execute();
    process.exit(0);
    break;
  case `--version`:
    version.execute();
    process.exit(0);
    break;
  case `--license`:
    license.execute();
    process.exit(0);
    break;
  case `--help`:
    help.execute();
    process.exit(0);
    break;
  case undefined:
    defaultMessage.execute();
    process.exit(0);
    break;
  default:
    error.execute(args[0]);
    process.exit(1);
}
