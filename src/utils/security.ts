import configs from '@/configs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const REFRESH_TOKENS = new Map();

function hashPassword(
  password: string,
  salt = crypto.randomBytes(16).toString('hex')
) {
  const iteration = 10000;
  const keylen = 64;
  const digest = 'sha256';

  const hash = crypto
    .pbkdf2Sync(password, salt, iteration, keylen, digest)
    .toString('hex');

  return { salt, hash };
}

function verifyPassword(password: string, hash: string, salt: string) {
  const { hash: hashedPassword } = hashPassword(password, salt);

  return hashedPassword === hash;
}

function generateAccessToken(username: string) {
  return jwt.sign({ data: username }, configs.SECRET, {
    expiresIn: '1h',
  });
}

function generateRefreshToken(username: string) {
  const refreshToken = jwt.sign({ data: username }, configs.SECRET, {
    expiresIn: '7d',
  });
  REFRESH_TOKENS.set(refreshToken, username);
  return refreshToken;
}

export {
  hashPassword,
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
};
