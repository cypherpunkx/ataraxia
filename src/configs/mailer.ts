import nodemailer from 'nodemailer';
import logger from './logger';
import configs from '.';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Membuat transporter dengan pengaturan yang aman
const transporter = nodemailer.createTransport({
  service: configs.SMTP_SERVICE,
  host: configs.SMTP_HOST, // Ganti dengan SMTP host Anda
  port: configs.SMTP_PORT, // Gunakan port 465 untuk SSL
  secure: configs.SMTP_SECURE, // True untuk SSL/TLS
  auth: {
    user: configs.SMTP_USER, // Masukkan username email dari environment variable
    pass: configs.SMTP_PASS, // Masukkan password email dari environment variable
  },
});

// Verifikasi koneksi
export function verifyMailConnection() {
  transporter.verify((error, success) => {
    if (error) {
      logger.error(`SMTP connection error: ${error.message}`, { error });
    } else {
      logger.info(`SMTP connected successfully: ${success}`, success);
    }
  });
}

export default transporter;
