import { MailerOptions } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

export const mailConfig: MailerOptions = {
  transport: {
    host: process.env.HOST,
    secure: true,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  },
  defaults: {
    from: process.env.FROM,
  },
  template: {
    adapter: new EjsAdapter(), // or new PugAdapter() or new EjsAdapter()
    options: {
      strict: true,
    },
  },
};
