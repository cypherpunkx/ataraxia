import type { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import AuthService from '@/app/services/auth.service';
import { sendResponse } from '@/utils/sendResponse';
import { RegisterSchema, LoginSchema } from '@/models/auth.model';
import { ResultSetHeader } from 'mysql2';

class AuthController {
  constructor(private _service: AuthService) {
    this.registerNewUser = this.registerNewUser.bind(this);
    this.loginUser = this.loginUser.bind(this);
  }

  async registerNewUser(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        name,
        username,
        password,
        email,
        address,
        age,
        birthdate,
        status,
      } = req.body as RegisterSchema;

      const payload: RegisterSchema = {
        name,
        username,
        password,
        email,
        address,
        age,
        birthdate,
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
}

export default AuthController;
