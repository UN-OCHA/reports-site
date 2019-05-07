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
    // Receive logs in the default format expected from the consola package.
    let data = [].concat(logObj.args)[0];

    // To ensure consistency in the logs, transform strings back into an object
    // with the string set as the `message` prop.
    data = (typeof data === 'string')
        ? {message: data}
        : data;

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

    // Detect HTTP Basic auth
    const httpBasicAuth = data &&
      data.headers &&
      data.headers.authorization &&
      data.headers.authorization.indexOf('Basic') !== -1 &&
      'Basic *****';

    // If we found a header, scrub it before logging
    if (httpBasicAuth) {
      data.headers.authorization = httpBasicAuth;
    }

    // Send to logs
    this.logger.log({
      name: 'dsr-nuxt',
      level: levels[logObj.level] || 'info',
      label: logObj.tag,
      ...data,
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
