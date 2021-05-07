import {repository} from '@loopback/repository';
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
    console.log('username:' + username + '  and password:' + password);
    let user = await this.userRepository.findOne({where: {username: username}});
    if (user) {
      let cryptPass = new EncryptDecrypt(ServiceKeys.LOGIN_CRYPT_METHOD).Encrypt(password);
      console.log('password:' + user.password + ' y el crypyPass: ' + cryptPass)
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
      let data = jwt.verify(token, ServiceKeys.JWT_SECRET_KEY);
      return data;
    } catch {
      return null;
    }
  }



}
