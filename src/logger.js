"use strict";

const winston = require(`winston`);

const {combine, timestamp, prettyPrint} = winston.format;

const logger = winston.createLogger({
  level: `info`,
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: `error.log`, level: `error`, format: combine(
          timestamp(),
          prettyPrint())
    }),
    new winston.transports.File({
      filename: `combined.log`, format: combine(
          timestamp(),
          prettyPrint())
    }),
  ]
});

if (process.env.NODE_ENV !== `production`) {
  logger.add(new winston.transports.Console({
    level: `silly`,
    format: combine(combine(
        timestamp(),
        prettyPrint()
    ))
  }));
}

module.exports = logger;
