import { Unauthorized } from 'http-errors';
import UserRepository from '@/app/repositories/user.repository';
import { loginMessages } from '@/constants';
import AuthSchema, {
  LoginSchema,
  ProfileSchema,
  RegisterSchema,
} from '@/models/auth.model';
import {
  generateAccessToken,
  generateRefreshToken,
  REFRESH_TOKENS,
  verifyPassword,
} from '@/utils/security';
import Validator from '@/utils/validator';
import { Forbidden } from 'http-errors';
import jwt, { JwtPayload } from 'jsonwebtoken';
import configs from '@/configs';
import {} from 'http-errors';
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

    const token = generateAccessToken(payload.username);
    const refreshToken = generateRefreshToken(payload.username);

    const response = {
      token,
      refreshToken,
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

    if (!user) return null;

    const response = {
      name: user.name,
      username: user.username,
      email: user.email,
      address: user.address,
      age: user.age,
      birthdate: user.birthdate,
      avatar: user.avatar,
    };

    return response;
  }

  async editUserDetails(
    username: string,
    payload: ProfileSchema,
    file: Express.Multer.File
  ) {
    payload = Validator.validate(AuthSchema.Profile, payload);
    payload.file = { originalName: '', name: '', path: '', size: 0, type: '' };

    if (file) {
      const type = file.mimetype.split('/')[1];

      payload.file.originalName = file.originalname;
      payload.file.name = file.filename;
      payload.file.path = file.path;
      payload.file.type = type;
      payload.file.size = file.size;

      const result = await this._repository.editWithImage(username, payload);

      return result;
    }

    const result = await this._repository.edit(username, payload);

    return result;
  }

  async refresh(token: string) {
    if (!token || !REFRESH_TOKENS.has(token)) {
      throw Forbidden('Forbidden');
    }

    const claims = jwt.verify(token, configs.SECRET) as JwtPayload & {
      data: string;
    };

    const refreshToken = generateAccessToken(claims.data);

    const response = {
      refreshToken,
    };

    return response;
  }
}

export default AuthService;
