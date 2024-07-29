import * as winston from 'winston';

declare module 'winston' {
  interface Logger {
    sql: winston.LeveledLogMethod;
  }
}
