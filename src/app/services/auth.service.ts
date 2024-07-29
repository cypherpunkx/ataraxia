import { Unauthorized } from 'http-errors';
import UserRepository from '@/app/repositories/user.repository';
import { loginMessages } from '@/constants';
import AuthSchema, { LoginSchema, RegisterSchema } from '@/models/auth.model';
import { verifyPassword } from '@/utils/security';
import Validator from '@/utils/validator';
import jwt from 'jsonwebtoken';
import configs from '@/configs';

class AuthService {
  constructor(private _repository: UserRepository) {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
  }

  async register(payload: RegisterSchema) {
    payload = Validator.validate(AuthSchema.Register, payload);

    const affectedRows = await this._repository.create(payload);

    return affectedRows;
  }

  async login(payload: LoginSchema) {
    payload = Validator.validate(AuthSchema.Login, payload);

    const user = await this._repository.getByUsername(payload.username);

    if (!user) {
      throw Unauthorized(loginMessages.invalidUsernamePassword);
    }

    const verifiedPassword = verifyPassword(
      payload.password,
      user.hash,
      user.salt
    );

    if (!verifiedPassword) {
      throw Unauthorized(loginMessages.invalidUsernamePassword);
    }

    const token = jwt.sign({ data: payload.username }, configs.SECRET, {
      expiresIn: '1h',
    });

    const response = {
      token,
      expiresIn: 1000 * 60 * 60 * 24, // Token expiry time in seconds
      user: {
        id: user.id,
        username: payload.username,
      },
    };

    return response;
  }
}

export default AuthService;
