import crypto from 'crypto';

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

export { hashPassword, verifyPassword };
