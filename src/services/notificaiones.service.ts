import {BindingScope, injectable} from '@loopback/core';

@injectable({scope: BindingScope.TRANSIENT})
export class NotificacionesService {
  constructor() { }

  EnviarCorreoElectronico() {
    /* se tiene que terminar de configurar la cuenta en sendgrid*/
  }

  EnviarCorreoSMS() { // se tiene que terminar de configurar la cuenta en twilio
    /*  var accountSid = "ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
      const authToken = 'your_auth_token';

      var twilio = require('twilio');
      const client = new twilio(accountSid, authToken);

      client.messages
        .create({
          body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
          from: '+15017122661',
          to: '+15558675310'
        })
        .then(message) => console.log(message.sid));
  */
  }
}
