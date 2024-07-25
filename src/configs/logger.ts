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
  trace: 5,
};

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: 'combined-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxFiles: '14d',
});

const consoleTransport = new winston.transports.Console({
  format: combine(
    timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
    colorize(),
    printf(
      (info) =>
        `[${chalk.yellow(info.timestamp)}] ${info.level}: ${info.message}`
    )
  ),
});

const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp(), colorize(), json()),
  transports: [consoleTransport, fileRotateTransport],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'exception.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'rejections.log' }),
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
