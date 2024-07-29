import 'dotenv/config';
import 'module-alias/register';

export default {
  HOST: process.env.HOST,
  PORT: +process.env.PORT!,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_PORT: process.env.DB_PORT,
  DB_NAME: process.env.DB_NAME,
  SECRET: process.env.SECRET || 'secret',
};
