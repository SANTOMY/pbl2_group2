const appRoot = require('app-root-path');
const winston = require('winston');
const {format } = winston;
const { combine, timestamp, label, printf } = format;

const logFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});


let  options = {
    file: {
      level: 'debug',
      filename: `${appRoot}/logger/logs/app.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 10,
      colorize: false,
    },
    error: {
        level: 'error',
        filename: `${appRoot}/logger/logs/errors.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
    },
    console: {
      level: 'debug',
      handleExceptions: true,
      json: true,
      colorize: true,
    },
};

let logger = winston.createLogger({
    format: combine(
        timestamp(),
        logFormat
    ),
    transports: [
      new winston.transports.File(options.file),
      new winston.transports.File(options.error),
      new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
    write: function(message, encoding) {
      logger.info({label:'stream', message:message});
    },
};

const stream = logger.stream;
const info = (label, message)=>{
    logger.info({label:label, message:message});
};

const debug = (label, message)=>{
    logger.debug({label:label, message:message});
};

const warning = (label, message)=>{
    logger.warn({label:label, message:message});
};

const error = (label, message)=>{
    logger.error({label:label, message:message});
};

module.exports={info,debug,warning,error};