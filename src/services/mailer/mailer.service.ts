import { Injectable } from '@nestjs/common';
import sendgridMail from '@sendgrid/mail';

import { env } from '../../common/env';
import { transformAndValidate } from '../../common/utils';
import { InvitationEmailDto } from './dto/invitation-email.dto';

@Injectable()
export class MailerService {
  constructor() {
    if (env.SENDGRID_KEY) {
      this.sendgrid.setApiKey(env.SENDGRID_KEY);
    }
  }

  sendgrid = sendgridMail;

  active = Boolean(env.SENDGRID_KEY);

  async sendInvitationEmail(data: InvitationEmailDto) {
    if (this.active) {
      const { to } = await transformAndValidate(InvitationEmailDto, data);

      await this.sendgrid.send({
        to,
        from: 'studentbehaviorm@gmail.com',
        templateId: 'd-f711182591134e5aa09e6453feeffbb1',
        dynamicTemplateData: { to },
        // mailSettings: { sandboxMode: { enable: env.APP_ENV !== 'production' } },
      });
    }

    return true;
  }
}
