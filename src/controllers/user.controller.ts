// Uncomment these imports to begin using these cool features!

import {post, requestBody} from '@loopback/openapi-v3';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserRepository} from '../repositories';
import {AuthService} from '../services/auth.service';

// import {inject} from '@loopback/core';

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
    public userRepository: UserRepository
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
  ): Promise<boolean> {
    let randonPassword = this.authService.ResetPassword(passwordResetData.username);
    if (randonPassword) {

      switch (passwordResetData.type) {
        case 1:
          //send sms
          console.log('sending sms : ' + randonPassword);
          return true;
          break;
        case 2:
          //send email
          console.log('sending email : ' + randonPassword);
          return true;
          break;

        default:
          throw new HttpErrors[400]('this notification not soport');
          break;
      }

    } throw new HttpErrors[400]('user no found');
  }
}
