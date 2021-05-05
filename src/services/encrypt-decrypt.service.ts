import {ServiceKeys as keys} from '../keys/service-keys';
const CryptoJs = require('crypto-js');


export class EncryptDecrypt {
  type: String;
  constructor(type: String) {
    this.type = type;
  }

  Encrypt(text: string) {
    switch (this.type) {
      case keys.MD5:
        return CryptoJs.MD5(text).toString();
        break;
      case keys.AES:
        return CryptoJs.AES.Encrypt(text, keys.AES_SECRET_KEY).toString();
        break;
      case keys.SHA_512:

        break;
      default:
        return 'this type of crypt is not soported'
        break;
    }
  }
}
