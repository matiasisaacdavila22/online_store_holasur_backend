import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {AuthService} from '../services/auth.service';


export class UserStrategy implements AuthenticationStrategy {

  name: string = 'user';


  constructor(@service(AuthService)
  public authService: AuthService) {

  }

  async authenticate(request: Request): Promise<UserProfile | undefined> {

    const token = parseBearerToken(request)
    if (!token) {
      throw new HttpErrors[401]('no cuenta con un token');
    }
    let perfil = await this.authService.VerifyToken(token).then(data => {
      try {
        if (data) {
          if (data.role == 0) {
            let perfil: UserProfile = Object.assign({
              nombre_usuario: data.username,
              rol: 0
            });
            console.log('es todo ok es usuario ************************** ')
            return perfil;
          } else {
            console.log('no tiene una cuenta con rol para ejecutar esta action*************************** ')
            throw new HttpErrors[401]('no cuenta con rol para ejecutar esta accion');
          }
        }
      } catch (error) {

        console.log('no tiene un token valido*************************** ')
        throw new HttpErrors[401]('no tiene un token valido');


      }
    });

    return perfil;

  }

}
