import path from 'path';
import type { SendMailOptions } from 'nodemailer';
import logger from '@/configs/logger';
import transporter from '@/configs/mailer';
import { renderTemplate } from '@/utils/nodemailerHelper';
import configs from '@/configs';
import { retryDelay } from '@/utils/retryDelay';

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

    const mailOptions: SendMailOptions = {
      from: `"Saritem" ${from}`,
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

    for (let attempt = 1; attempt <= retryCount; attempt++) {
      try {
        const info = await transporter.sendMail(mailOptions);

        logger.info(`Attempt ${attempt} - Email sent: ${info.response}`);

        return info;
      } catch (error) {
        logger.error(
          `Attempt ${attempt} - Error sending email: ${(error as Error).message}`
        );

        if (attempt < retryCount) {
          logger.info(`Attempt ${attempt} - Retrying in ${retryDelayMs}ms...`);

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
