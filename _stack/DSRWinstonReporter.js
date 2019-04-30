// @see https://github.com/nuxt/consola/blob/master/src/reporters/winston.js
//
// This reporter is compatible with Winston 3
// https://github.com/winstonjs/winston

// eslint-disable-next-line
const _require = typeof __non_webpack_require__ !== 'undefined' ? __non_webpack_require__ : require // bypass webpack

export default class DSRWinstonReporter {
  constructor (logger) {
    if (logger && logger.log) {
      this.logger = logger
    } else {
      const winston = _require('winston')

      this.logger = winston.createLogger(Object.assign({
        level: 'verbose',
        format: winston.format.json(),
        transports: [
          //
          // - Write all logs to `access.log`
          //
          new winston.transports.File({ filename: '/var/log/access.log' }),
        ]
      }, logger))
    }
  }

  log (logObj) {
    const data = logObj.args[0];

    // Detect auth token
    const authToken = data &&
      data.config &&
      data.config.headers &&
      data.config.headers.Authorization &&
      'Bearer *****';

    // If we found a token, scrub it before logging
    if (authToken) {
      data.config.headers.Authorization = authToken;
    }

    // Send to logs
    this.logger.log({
      name: 'dsreports',
      level: levels[logObj.level] || 'info',
      label: logObj.tag,
      msg: data.message,
      args: data,
      timestamp: logObj.date,
    })
  }
}

const levels = {
  0: 'error',
  1: 'warn',
  2: 'info',
  3: 'verbose',
  4: 'debug',
  5: 'silly'
}
