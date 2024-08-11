import path from 'path';
import type { SendMailOptions } from 'nodemailer';
import logger from '@/configs/logger';
import transporter from '@/configs/mailer';
import { renderTemplate } from '@/utils/nodemailerHelper';
import configs from '@/configs';
import { retryDelay } from '@/utils/retryDelay';
import { generateOTP } from '@/utils/security';

interface SendEmailOptions {
  from?: string;
  to: string;
}

class MailService {
  constructor() {}

  async sendEmail(options: SendEmailOptions) {
    const retryCount = configs.RETRY_COUNT;
    const retryDelayMs = configs.RETRY_DELAY_MS;

    const templatePath = path.join(
      'src',
      'app',
      'views',
      'email',
      'template.ejs'
    );

    const from = options.from || configs.SMTP_FROM;

    const otp = generateOTP();

    const mailOptions: SendMailOptions = {
      from: `"Ataraxia" ${from}`,
      to: options.to,
      subject: 'Ataraxia Squad',
      html: await renderTemplate(templatePath, {
        header: 'Because of your smile, you make life more beautiful.',
        title: 'Welcome!',
        body: `
        Thank you for joining our service. We are glad to have you on board
        ${otp}
        `,
        buttonText: 'Join Team',
        buttonUrl: 'www.google.com',
        footer: '© 2024 Ataraxia, Corp. All rights reserved.',
      }),
    };

    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            logger.error(`Mail Error : ${err.message}`, { err });
            throw err;
          }

          logger.info(`Sending email from : ${info.envelope.from}`);
          logger.info(`Sending email to : ${info.envelope.to}`);
          logger.debug(`Attempt ${attempt} - Email sent: ${info.response}`, {
            info,
          });
        });

        return;
      } catch (error) {
        logger.error(
          `Attempt ${attempt} - Error sending email: ${(error as Error).message}`
        );

        if (attempt < retryCount) {
          logger.debug(`Attempt ${attempt} - Retrying in ${retryDelayMs}ms...`);

          await retryDelay(retryDelayMs);
        } else {
          logger.error(
            `Attempt ${attempt} - Max retry attempts reached. Giving up.`
          );

          throw error;
        }
      }
    }
  }
}

export default MailService;
