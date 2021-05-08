import {repository} from '@loopback/repository';
import {generate as generator} from 'generate-password';
import {PasswordKeys} from '../keys/password-keys';
import {ServiceKeys} from '../keys/service-keys';
import {User} from '../models/user.model';
import {UserRepository} from '../repositories';
import {EncryptDecrypt} from './encrypt-decrypt.service';
const jwt = require('jsonwebtoken');

export class AuthService {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository
  ) {
  }
  async Identify(username: string, password: string): Promise<User | false> {
    let user = await this.userRepository.findOne({where: {username: username}});
    if (user) {
      let cryptPass = new EncryptDecrypt(ServiceKeys.LOGIN_CRYPT_METHOD).Encrypt(password);
      if (user.password == cryptPass) {
        return user;
      }
    }
    return false;
  }

  async GenerateToken(user: User) {
    user.password = '';
    let token = jwt.sign({
      exp: ServiceKeys.TOKEN_EXPIRATION_TIME,
      data: {
        _id: user.id,
        username: user.username,
        role: user.role,
        paternId: user.customerId
      }
    },
      ServiceKeys.JWT_SECRET_KEY);
    return token;
  }

  async VerifyToken(token: string) {
    try {
      let data = jwt.verify(token, ServiceKeys.JWT_SECRET_KEY).data;
      return data;
    } catch {
      return null;
    }
  }

  async ResetPassword(username: string): Promise<string | false> {
    let user = this.userRepository.findOne({where: {username: username}}).then(user => {
      console.log('******************' + user)
      if (user) {

        let randonPassword = generator({
          length: PasswordKeys.LENGTH,
          numbers: PasswordKeys.NUMBERS,
          lowercase: PasswordKeys.LOWERCASE,
          uppercase: PasswordKeys.UPPERCASE
        });
        let crypter = new EncryptDecrypt(ServiceKeys.LOGIN_CRYPT_METHOD);
        let password = crypter.Encrypt(crypter.Encrypt(randonPassword));
        user.password = password;
        this.userRepository.replaceById(user.id, user);

        return randonPassword;

      }
      return false;
    });

    return user;
  }

}

