import {AuthenticationStrategy} from '@loopback/authentication';
import {service} from '@loopback/core';
import {HttpErrors, Request} from '@loopback/rest';
import {UserProfile} from '@loopback/security';
import parseBearerToken from 'parse-bearer-token';
import {AuthService} from '../services/auth.service';


export class AdminStrategy implements AuthenticationStrategy {

  name: string = 'admin';


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
        if (data.data) {
          if (data.data.role == 1) {
            let perfil: UserProfile = Object.assign({
              nombre_usuario: data.data.username,
              rol: 1
            });
            console.log('es todo ok es admin ************************** ')
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
