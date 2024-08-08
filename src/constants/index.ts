const loginMessages = {
  success: 'Login successful! Welcome back.',
  failure: 'Login failed. Please check your credentials and try again.',
  invalidEmail: 'Invalid email address.',
  invalidPassword:
    'Password is incorrect. Please make sure your password is correct.',
  invalidUsernamePassword:
    'Username or Password is incorrect. Please make sure your username or password is correct.',
  invalidConfirmPassword: 'Passwords do not match.',
  invalidNewPassword:
    'New password cannot be the same as the previous password.',
};

const registrationMessages = {
  success:
    'Registration successful! Please check your email to confirm your account.',
  failure:
    'Registration failed. The email might already be registered or the information provided is invalid.',
  emailTaken:
    'Email is already registered. Please use a different email address.',
  passwordRequirements:
    'Password must be at least 8 characters long and include uppercase letters, lowercase letters, and numbers.',
};

const passwordResetMessages = {
  success: 'Password reset email has been sent. Please check your inbox.',
  failure: 'Failed to send password reset email. Please try again later.',
  invalidEmail: 'Invalid email address or email not registered.',
};

export { loginMessages, registrationMessages, passwordResetMessages };
