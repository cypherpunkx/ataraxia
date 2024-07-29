import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import AuthService from '@/app/services/auth.service';
import { sendResponse } from '@/utils/sendResponse';
import {
  RegisterSchema,
  LoginSchema,
  ProfileSchema,
} from '@/models/auth.model';
import { ResultSetHeader } from 'mysql2';
import { JwtPayload } from 'jsonwebtoken';

class AuthController {
  constructor(private _service: AuthService) {
    this.registerNewUser = this.registerNewUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.editProfile = this.editProfile.bind(this);
  }

  async registerNewUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password, status = 1 } = req.body as RegisterSchema;

      const payload: RegisterSchema = {
        username,
        password,
        status,
      };

      const result = await this._service.register(payload);

      return sendResponse(
        {
          statusCode: StatusCodes.OK,
          status: 'success',
          message: 'Register successful',
          data: (result as ResultSetHeader).affectedRows,
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }

  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { username, password } = req.body as LoginSchema;

      const payload: LoginSchema = {
        username,
        password,
      };

      const result = await this._service.login(payload);

      return sendResponse(
        {
          statusCode: StatusCodes.OK,
          status: 'success',
          message: 'Login successful',
          data: result,
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const claims = req.user as JwtPayload & {
        data: string;
      };

      const result = await this._service.getUserDetails(claims.data);

      return sendResponse(
        {
          statusCode: StatusCodes.OK,
          status: 'success',
          message: 'Get Profile',
          data: result,
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }

  async editProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const claims = req.user as JwtPayload & {
        data: string;
      };

      const { name, email, address, age, birthdate, avatar } =
        req.body as ProfileSchema;

      const payload: ProfileSchema = {
        name,
        email,
        address,
        age,
        birthdate,
        avatar,
      };

      const result = await this._service.editUserDetails(claims.data, payload);

      return sendResponse(
        {
          statusCode: StatusCodes.OK,
          status: 'success',
          message: 'Edit Profile',
          data: result,
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
