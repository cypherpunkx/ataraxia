import winston from 'winston';
import chalk from 'chalk';
import 'winston-daily-rotate-file';

const { combine, timestamp, printf, json, colorize } = winston.format;

const logLevels = {
  fatal: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
  sql: 5,
};

const logColors = {
  colors: {
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
    sql: 'cyan',
  },
};

winston.addColors(logColors.colors);

const fileRotateTransport = new winston.transports.DailyRotateFile({
  dirname: 'logs',
  filename: 'combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
});

const consoleTransport = new winston.transports.Console({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
    colorize({ all: true }),
    printf((info) => {
      return `[${chalk.yellow(info.timestamp)}] ${info.level}: ${info.message}`;
    })
  ),
  level: 'sql',
});

const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), colorize(), json()),
  transports: [consoleTransport, fileRotateTransport],
  exceptionHandlers: [
    new winston.transports.File({ dirname: 'logs', filename: 'exception.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      dirname: 'logs',
      filename: 'rejections.log',
    }),
  ],
});

// fired when a log file is created
fileRotateTransport.on('new', (_filename) => {});
// fired when a log file is rotated
fileRotateTransport.on('rotate', (_oldFilename, _newFilename) => {});
// fired when a log file is archived
fileRotateTransport.on('archive', (_zipFilename) => {});
// fired when a log file is deleted
fileRotateTransport.on('logRemoved', (_removedFilename) => {});

export default logger;
