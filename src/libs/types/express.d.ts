declare namespace Express {
  interface Request {
    user: string | import('jsonwebtoken').JwtPayload;
  }
}
