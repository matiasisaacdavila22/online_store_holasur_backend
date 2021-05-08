// Uncomment these imports to begin using these cool features!

import {post, requestBody} from '@loopback/openapi-v3';
import {repository} from '@loopback/repository';
import {getModelSchemaRef, HttpErrors, response} from '@loopback/rest';
import {ResetPass} from '../models';
import {UserRepository} from '../repositories';
import {AuthService} from '../services/auth.service';

// import {inject} from '@loopback/core';

class Credentials {
  username: string;
  password: string;
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

  @post('/reset-password')
  @response(200, {
    description: 'reset password for SMS',
    content: {'application/json': {schema: getModelSchemaRef(ResetPass)}},
  })
  async resetPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ResetPass),
        },
      },
    })
    resetPass: ResetPass,
  ): Promise<Object> {
    let usuario = await this.userRepository.findOne({where: {username: resetPass.correo}})
    if (!usuario) {
      throw new HttpErrors[401]('este usuario no exite');
    }
    let mensage = `hola ${usuario.username} se a solicitado una nueva clave para la plataforma mercado negro.`

    return {
      envio: "ok"
    }
  }
}
