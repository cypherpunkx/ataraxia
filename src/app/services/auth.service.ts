import { Unauthorized } from 'http-errors';
import UserRepository from '@/app/repositories/user.repository';
import { loginMessages } from '@/constants';
import AuthSchema, {
  LoginSchema,
  ProfileSchema,
  RegisterSchema,
} from '@/models/auth.model';
import { verifyPassword } from '@/utils/security';
import Validator from '@/utils/validator';
import jwt from 'jsonwebtoken';
import configs from '@/configs';

class AuthService {
  constructor(private _repository: UserRepository) {
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.getUserDetails = this.getUserDetails.bind(this);
    this.editUserDetails = this.editUserDetails.bind(this);
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

  async getUserDetails(username: string) {
    const user = await this._repository.getByUsernameDetails(username);

    return user;
  }

  async editUserDetails(username: string, payload: ProfileSchema) {
    payload = Validator.validate(AuthSchema.Profile, payload);

    const result = await this._repository.edit(username, payload);

    return result;
  }
}

export default AuthService;
