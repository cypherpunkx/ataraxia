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
import {
  accountSettingsMessages,
  loginMessages,
  passwordResetMessages,
  registrationMessages,
} from '@/constants';

class AuthController {
  constructor(private _authService: AuthService) {
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

      const result = await this._authService.register(payload);

      return sendResponse(
        {
          statusCode: StatusCodes.OK,
          status: 'success',
          message: registrationMessages.success,
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

      const result = await this._authService.login(payload);

      return sendResponse(
        {
          statusCode: StatusCodes.OK,
          status: 'success',
          message: loginMessages.success,
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

      const result = await this._authService.getUserDetails(claims.data);

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

      const result = await this._authService.editUserDetails(
        claims.data,
        payload,
        file!
      );

      return sendResponse(
        {
          statusCode: StatusCodes.OK,
          status: 'success',
          message: accountSettingsMessages.updateSuccess,
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

      const result = await this._authService.refresh(refreshToken);

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

      const result = await this._authService.changePassword(
        payload,
        claims.data
      );

      return sendResponse(
        {
          statusCode: StatusCodes.OK,
          status: 'success',
          message: passwordResetMessages.passwordUpdated,
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
