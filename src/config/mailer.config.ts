import { MailerOptions } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

export const mailConfig: MailerOptions = {
  transport: {
    host: process.env.HOST_EMAIL,
    secure: true,
    auth: {
      type: process.env.TYPE_EMAIL,
      user: process.env.USER_EMAIL,
      pass: process.env.PASS_EMAIL,
    },
    port: process.env.PORT_EMAIL_EMAIL,
  },
  defaults: {
    from: process.env.FROM_EMAIL,
  },
  template: {
    adapter: new EjsAdapter(), // or new PugAdapter() or new EjsAdapter()
    options: {
      strict: true,
    },
  },
};
