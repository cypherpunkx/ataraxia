import { hashPassword } from '@/utils/security';
import {
  date,
  email,
  enum_,
  InferOutput,
  minLength,
  nonEmpty,
  number,
  object,
  optional,
  picklist,
  pipe,
  string,
  transform,
  custom,
  pick,
} from 'valibot';

enum Role {
  GUEST = 'GUEST',
  ADMIN = 'ADMIN',
}

class AuthSchema {
  static Register = object({
    username: pipe(
      string('Username must be string'),
      nonEmpty('Name is required.')
    ),
    password: pipe(
      string('Password must be string'),
      nonEmpty('Password is required'),
      minLength(8, 'Your password must have 8 characters or more.'),
      custom<string>((input) => {
        // Check for at least one lowercase letter
        return /[a-z]/.test(input as string);
      }, 'Password must contain at least one lowercase letter.'),
      custom<string>((input) => {
        // Check for at least one uppercase letter
        return /[A-Z]/.test(input as string);
      }, 'Password must contain at least one uppercase letter.'),
      custom<string>((input) => {
        // Check for at least one digit
        return /\d/.test(input as string);
      }, 'Password must contain at least one digit.'),
      custom<string>((input) => {
        // Check for at least one special character
        return /[!@#$%^&*(),.?":{}|<>]/.test(input as string);
      }, 'Password must contain at least one special character (e.g., !@#$%^&*()).'),
      custom<string>((input) => {
        // Check for no whitespace characters
        return !/\s/.test(input as string);
      }, 'Password must not contain any whitespace characters.'),
      custom<string>((input) => {
        // Check for length
        return (input as string).length > 8 || (input as string).length > 20;
      }, 'Password must be between 8 and 20 characters long.'),

      transform((input) => {
        const hashedPassword = hashPassword(input);

        return hashedPassword;
      })
    ),
    role: optional(
      pipe(
        string('Role must be string'),
        enum_(Role, 'Role must be either GUEST or ADMIN.')
      )
    ),
    status: optional(
      pipe(
        number('status must be number'),
        picklist([0, 1], 'Status must be either 0 or 1.')
      )
    ),
  });

  static Login = object({
    ...pick(this.Register, ['username']).entries,
    password: pipe(
      string('Password must be string'),
      nonEmpty('Password is required')
    ),
  });

  static Profile = object({
    name: string('Name must be string.'),

    username: optional(pick(this.Register, ['username']).entries.username),

    email: optional(
      pipe(
        string('Email must be string.'),
        nonEmpty('Email is required'),
        email('Email is invalid')
      )
    ),
    address: optional(string('Address must be string.')),
    age: optional(number('Age must be number')),
    birthdate: optional(
      pipe(
        string('Birthdate must be string.'),
        nonEmpty('Birthdate is required'),
        custom<string>((input) => {
          const regex =
            /^(?:19|20)\d\d-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])|(?:0[1-9]|1[0-9]|2[0-8])-(?:02)|(?:29-02-(?:19|20)\d\d))$/;

          return regex.test(input as string);
        }, 'Invalid date format. Please use YYYY-MM-DD.'),
        transform((input) => new Date(input)),
        date('Invalid date format'),
        transform((input) => {
          const year = new Intl.DateTimeFormat('en', {
            year: 'numeric',
          }).format(input);
          const month = new Intl.DateTimeFormat('en', {
            month: '2-digit',
          }).format(input);
          const day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(
            input
          );

          return `${year}-${month}-${day}`;
        })
      )
    ),
    avatar: optional(string('Avatar must be string')),
  });

  static RefreshToken = object({
    refreshToken: pipe(
      string('Token must be string'),
      nonEmpty('Token is required')
    ),
  });
}

export type RegisterSchema = InferOutput<typeof AuthSchema.Register>;
export type LoginSchema = InferOutput<typeof AuthSchema.Login>;
export type ProfileSchema = InferOutput<typeof AuthSchema.Profile>;
export type RefreshTokenSchema = InferOutput<typeof AuthSchema.RefreshToken>;

export default AuthSchema;
