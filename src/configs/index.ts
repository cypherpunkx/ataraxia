import 'dotenv/config';
import 'module-alias/register';

export default {
  HOST: process.env.HOST || '0.0.0.0',
  PORT: +process.env.PORT! || 3000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASS: process.env.DB_PASS || '',
  DB_PORT: process.env.DB_PORT || 3306,
  DB_NAME: process.env.DB_NAME,
  SECRET: process.env.SECRET || 'secret',
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
};
