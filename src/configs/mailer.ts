import nodemailer from 'nodemailer';
import logger from './logger';
import configs from '.';

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
  tls: { rejectUnauthorized: false },
});

// Verifikasi koneksi
export function verifyMailConnection() {
  transporter.verify((error, success) => {
    if (error) {
      logger.error(`SMTP connection error: ${error.message}`, { error });
    } else {
      logger.info(`SMTP connected successfully: ${success}`, { success });
    }
  });
}

// Testing email sending
export function testingEmail() {
  nodemailer.createTestAccount((error, account) => {
    if (error) {
      logger.error('Failed to create a testing account. ' + error.message, {
        error,
      });
      return process.exit(1);
    }

    logger.debug('Credentials obtained, sending message...');

    // create reusable transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: account.user, // generated ethereal user
        pass: account.pass, // generated ethereal password
      },
      tls: { rejectUnauthorized: false },
    });

    transporter.sendMail(
      {
        from: 'kryptonx1x3@gmail.com',
        to: 'littleeyes17@gmail.com',
        text: 'asds',
      },
      (error, info) => {
        if (error) {
          logger.error('Error occurred. ' + error.message, { error });
          return process.exit(1);
        }

        const testMessageUrl = nodemailer.getTestMessageUrl(info);

        logger.info(`Preview URL: ${testMessageUrl}`);
      }
    );
  });
}

export default transporter;
