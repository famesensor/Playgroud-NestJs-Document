import { MailerOptions } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import * as config from 'config';

const mailerConfig = config.get('mailer');
export const mailConfig: MailerOptions = {
  transport: {
    host: mailerConfig.host,
    secure: mailerConfig.secure,
    auth: {
      user: mailerConfig.user,
      pass: mailerConfig.pass,
    },
  },
  defaults: {
    from: mailerConfig.from,
  },
  template: {
    adapter: new EjsAdapter(), // or new PugAdapter() or new EjsAdapter()
    options: {
      strict: true,
    },
  },
};
