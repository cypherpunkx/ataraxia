import 'dotenv/config';
import 'module-alias/register';

export default {
  HOST: process.env.HOST || '0.0.0.0',
  PORT: +process.env.PORT! || 3000,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASS: process.env.DB_PASS || '',
  DB_PORT: process.env.DB_PORT || 3306,
  DB_NAME: process.env.DB_NAME || '',
  SMTP_SERVICE: process.env.SMTP_SERVICE || 'gmail',
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: +process.env.SMTP_PORT! || 587,
  SMTP_SECURE: Boolean(process.env.SMTP_SECURE) || false,
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || '',
  RETRY_COUNT: +process.env.RETRY_COUNT! || 3,
  RETRY_DELAY_MS: +process.env.RETRY_DELAY_MS! || 1000,
  SECRET: process.env.SECRET || 'secret',
};
