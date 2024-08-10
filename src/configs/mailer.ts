import nodemailer, { SendMailOptions } from 'nodemailer';
import path from 'path';
import logger from './logger';
import configs from '.';
import { renderTemplate } from '@/utils/nodemailerHelper';

interface SendEmailOptions {
  from: string;
  to: string;
}

// Membuat transporter dengan pengaturan yang aman
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com', // Ganti dengan SMTP host Anda
  port: 465, // Gunakan port 465 untuk SSL
  secure: true, // True untuk SSL/TLS
  auth: {
    user: configs.EMAIL_USER, // Masukkan username email dari environment variable
    pass: configs.EMAIL_PASS, // Masukkan password email dari environment variable
  },
});

// Verifikasi koneksi
transporter.verify((error, success) => {
  if (error) {
    logger.error(`SMTP connection error: ${error.message}`, { error });
  } else {
    logger.info(`SMTP connected successfully: ${success}`, success);
  }
});

// Contoh pengiriman email
async function sendEmail(options: SendEmailOptions) {
  try {
    const templatePath = path.join(
      'src',
      'app',
      'views',
      'email',
      'template.ejs'
    );

    const mailOptions: SendMailOptions = {
      from: `"Saritem" ${options.from}`,
      to: options.to,
      subject: 'Welcome to Our Service',
      html: await renderTemplate(templatePath, {
        header: 'Saritem.co',
        title: 'Welcome!',
        body: 'Thank you for joining our service. We are glad to have you on board. Kita mengundang anda untuk bergabung dengan saritem team dan akan diadakan audisi untuk pemilihan germo',
        buttonText: 'Get Started',
        buttonUrl: 'www.pornhub.com',
        footer: '&copy; 2024 Your Company Name. All rights reserved.',
      }),
    };

    const info = await transporter.sendMail(mailOptions);

    logger.info(`Email sent: ${info.response}`);
  } catch (error) {
    logger.error(`Error sending email: ${(error as Error).message}`, { error });
  }
}

export default {
  sendEmail,
};
