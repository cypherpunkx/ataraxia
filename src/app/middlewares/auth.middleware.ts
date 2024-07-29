import type { Request, Response, NextFunction } from 'express';
import { Unauthorized } from 'http-errors';
import jwt from 'jsonwebtoken';
import configs from '@/configs';

function errorMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    const authHeaders =
      req.headers['authorization'] &&
      req.headers['authorization'].split(' ')[1];

    if (!authHeaders) {
      throw Unauthorized('Authentication is required');
    }

    const claims = jwt.verify(authHeaders as string, configs.SECRET);

    req.user = claims;

    next();
  } catch (error) {
    next(error);
  }
}

export default errorMiddleware;
