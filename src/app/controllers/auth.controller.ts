import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import AuthService from '@/app/services/auth.service';
import { sendResponse } from '@/utils/sendResponse';
import {
  RegisterSchema,
  LoginSchema,
  ProfileSchema,
  RefreshTokenSchema,
  ChangePasswordSchema,
} from '@/models/auth.model';
import { ResultSetHeader } from 'mysql2';
import { JwtPayload } from 'jsonwebtoken';
class AuthController {
  constructor(private _service: AuthService) {
    this.registerNewUser = this.registerNewUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.editProfile = this.editProfile.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.changeUserPassword = this.changeUserPassword.bind(this);
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
          message: 'Register successfully',
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
          message: 'Login successfully',
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

      const { name, email, address, age, birthdate } =
        req.body as ProfileSchema;

      const file = req.file;

      const payload: ProfileSchema = {
        name,
        email,
        address,
        age,
        birthdate,
      };

      const result = await this._service.editUserDetails(
        claims.data,
        payload,
        file!
      );

      return sendResponse(
        {
          statusCode: StatusCodes.OK,
          status: 'success',
          message: 'Profile updated',
          data: result,
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body as RefreshTokenSchema;

      const result = await this._service.refresh(refreshToken);

      return sendResponse(
        {
          statusCode: StatusCodes.OK,
          status: 'success',
          message: 'Refresh token successfully',
          data: result,
        },
        res
      );
    } catch (error) {
      next(error);
    }
  }

  async changeUserPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { oldPassword, confirmPassword, newPassword } =
        req.body as ChangePasswordSchema;
      const claims = req.user as JwtPayload & {
        data: string;
      };

      const payload: ChangePasswordSchema = {
        oldPassword,
        newPassword,
        confirmPassword,
      };

      const result = await this._service.changePassword(payload, claims.data);

      return sendResponse(
        {
          statusCode: StatusCodes.OK,
          status: 'success',
          message: 'Change password successfully',
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
