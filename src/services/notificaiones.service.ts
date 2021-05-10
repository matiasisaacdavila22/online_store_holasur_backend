import {NotificationDatasource} from '../datasources/notification.datasource';
import {EmailNotifications} from '../models/email-notifications.model';
import {SmsNotification} from '../models/sms-notification.model';

const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');

export class NotificacionesService {

  async SmsNotification(notification: SmsNotification) {
    try {
      const accountSid = process.env.TWILIO_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const client = twilio(accountSid, authToken);

      client.messages
        .create({
          body: notification.body,
          from: process.env.TWILIO_FROM,
          to: 'whatsapp:+549' + notification.to
        })
        .then((message: any) => console.log(message.sid))
        .done();
      return true;
    } catch (error) {
      return false;
    }

  }

  async EmailNotifications(notification: EmailNotifications): Promise<boolean> {

    sgMail.setApiKey(NotificationDatasource.SENDGRID_API_KEY)
    const msg = {
      to: notification.to, // Change to your recipient
      from: NotificationDatasource.SENDGRID_FROM, // Change to your verified sender
      subject: notification.subject,
      text: notification.textBody,
      html: notification.htmlBody,
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
        return true;
      })
      .catch((error: any) => {
        console.error(error)
        return false;
      });
    return true;
  }

}
