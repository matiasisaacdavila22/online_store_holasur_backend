// Uncomment these imports to begin using these cool features!

import {post, requestBody} from '@loopback/openapi-v3';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {Customer} from '../models/customer.model';
import {EmailNotifications} from '../models/email-notifications.model';
import {SmsNotification} from '../models/sms-notification.model';
import {CustomerRepository, UserRepository} from '../repositories';
import {AuthService} from '../services/auth.service';
import {NotificacionesService} from '../services/notificaiones.service';

class Credentials {
  username: string;
  password: string;
}

class PasswordResetData {
  username: string;
  type: number;
}

export class UserController {

  authService: AuthService;

  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @repository(CustomerRepository)
    public customerRepository: CustomerRepository
  ) {
    this.authService = new AuthService(this.userRepository)
  }


  @post('/login', {
    responses: {
      '200': {
        description: 'login for users'
      }
    }
  })
  async login(
    @requestBody() credentials: Credentials
  ): Promise<object> {
    let user = await this.authService.Identify(credentials.username, credentials.password);
    if (user) {
      let tk = await this.authService.GenerateToken(user);
      return {
        data: user,
        token: tk
      }
    } else {
      throw new HttpErrors[401]('user or Password invalid.')
    }
  }


  @post('/password-reset', {
    responses: {
      '200': {
        description: 'reset for password'
      }
    }
  })
  async reset(
    @requestBody() passwordResetData: PasswordResetData
  ): Promise<Customer> {
    let customer = await this.customerRepository.findOne({where: {document: passwordResetData.username}});
    if (!customer) {
      throw new HttpErrors[400]('user not found');
    }
    let randonPassword = await this.authService.ResetPassword(passwordResetData.username);
    if (!randonPassword) {
      throw new HttpErrors[400]('password not genery');
    }
    console.log(randonPassword)
    switch (passwordResetData.type) {
      case 1:
        let notificationSms = new SmsNotification({
          body: `Su nueva contrasenia es : ${randonPassword}`,
          to: customer.phone
        })
        let sms = await new NotificacionesService().SmsNotification(notificationSms);
        if (sms) {
          console.log('sending sms : ' + randonPassword);
          return customer;
        }
        return customer;
        break;

      case 2:
        if (customer) {
          let notificationEmail = new EmailNotifications({
            textBody: `Su nueva contrasenia es : ${randonPassword}`,
            htmlBody: `Su nueva contrasenia es : ${randonPassword}`,
            to: customer.email,
            subject: 'Nueva contrasenia'
          });
          let email = await new NotificacionesService().EmailNotifications(notificationEmail);
          if (email) {
            console.log('sending email : ' + randonPassword);
            return customer;
          }
        }
        return customer;

        break;

      default:
        throw new HttpErrors[400]('this notification not soport');

        break;

    }
    throw new HttpErrors[400]('user no found');
  }
}

