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
  accountLocked:
    'Your account has been locked due to multiple failed login attempts. Please try again later or reset your password.',
  accountNotActivated:
    'Your account has not been activated. Please check your email to activate your account.',
  sessionExpired: 'Your session has expired. Please log in again.',
  accountDisabled:
    'Your account has been disabled. Please contact support for assistance.',
  loginRequired: 'Please log in to access this feature.',
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
  usernameTaken:
    'Username is already taken. Please choose a different username.',
  emailInvalid: 'Please enter a valid email address.',
  ageRequirement: 'You must be at least 18 years old to register.',
  termsNotAccepted: 'You must accept the terms and conditions to register.',
  captchaFailed: 'CAPTCHA verification failed. Please try again.',
  referralCodeInvalid: 'Referral code is invalid or expired.',
};

const passwordResetMessages = {
  success: 'Password reset email has been sent. Please check your inbox.',
  failure: 'Failed to send password reset email. Please try again later.',
  invalidEmail: 'Invalid email address or email not registered.',
  linkExpired: 'Password reset link has expired. Please request a new link.',
  tokenInvalid:
    'Password reset token is invalid or has been used. Please request a new link.',
  passwordUpdated:
    'Your password has been successfully updated. You can now log in with your new password.',
  resetNotAllowed:
    'Password reset is not allowed at this time. Please contact support.',
};

const accountSettingsMessages = {
  updateSuccess: 'Your account settings have been updated successfully.',
  updateFailure: 'Failed to update account settings. Please try again later.',
  invalidCurrentPassword: 'Current password is incorrect. Please try again.',
  emailUpdateSuccess:
    'Your email address has been updated. Please check your new email to confirm the change.',
  emailUpdateFailure:
    'Failed to update email address. The new email might already be registered.',
  passwordUpdateSuccess: 'Your password has been updated successfully.',
  passwordUpdateFailure: 'Failed to update password. Please try again later.',
  usernameUpdateSuccess: 'Your username has been updated successfully.',
  usernameUpdateFailure:
    'Failed to update username. Please choose a different username.',
  profilePictureUpdateSuccess:
    'Your profile picture has been updated successfully.',
  profilePictureUpdateFailure:
    'Failed to update profile picture. Please try again later.',
};

const securityMessages = {
  twoFactorEnabled:
    'Two-factor authentication has been enabled for your account.',
  twoFactorDisabled:
    'Two-factor authentication has been disabled for your account.',
  twoFactorSetupFailure:
    'Failed to set up two-factor authentication. Please try again later.',
  suspiciousActivityDetected:
    'Suspicious activity detected on your account. Please verify your identity.',
  deviceNotRecognized:
    'This device is not recognized. Please complete the verification process.',
  securityQuestionsUpdated:
    'Your security questions have been updated successfully.',
  securityQuestionsUpdateFailure:
    'Failed to update security questions. Please try again later.',
  accountRecoverySetupSuccess:
    'Account recovery options have been set up successfully.',
  accountRecoverySetupFailure:
    'Failed to set up account recovery options. Please try again later.',
};

const emailVerificationMessages = {
  emailSent:
    'A verification email has been sent. Please check your inbox to verify your email address.',
  emailAlreadyVerified: 'Your email address is already verified.',
  emailVerificationSuccess:
    'Your email address has been successfully verified.',
  emailVerificationFailure:
    'Failed to verify email address. The verification link might have expired.',
  resendEmailSuccess:
    'Verification email has been resent. Please check your inbox.',
  resendEmailFailure:
    'Failed to resend verification email. Please try again later.',
};

const logoutMessages = {
  success: 'You have been logged out successfully.',
  failure: 'Failed to log out. Please try again.',
  sessionExpired:
    'Your session has expired. You have been logged out automatically.',
};

const accountDeletionMessages = {
  success:
    'Your account has been deleted successfully. We are sad to see you go.',
  failure: 'Failed to delete your account. Please try again later.',
  accountPendingDeletion:
    'Your account deletion request is pending. You will receive a confirmation email once the process is complete.',
  accountDeletionCanceled: 'Account deletion request has been canceled.',
};

const generalMessages = {
  actionSuccess: 'Action completed successfully.',
  actionFailure: 'Action failed. Please try again.',
  networkError:
    'Network error. Please check your internet connection and try again.',
  serverError: 'Server error. Please try again later.',
  unauthorizedAccess:
    'Unauthorized access. You do not have permission to view this content.',
  featureNotAvailable:
    'This feature is not available at this time. Please try again later.',
  maintenanceMode:
    'The system is currently under maintenance. Please try again later.',
};

const feedbackMessages = {
  feedbackReceived: 'Thank you for your feedback! We appreciate your input.',
  feedbackFailed: 'Failed to submit feedback. Please try again later.',
  ratingSubmitted: 'Your rating has been submitted successfully.',
  ratingFailed: 'Failed to submit your rating. Please try again later.',
  commentTooShort: 'Your comment is too short. Please provide more details.',
  commentTooLong: 'Your comment is too long. Please shorten it.',
  feedbackSpamDetected:
    'Your feedback appears to be spam and was not submitted.',
  feedbackAlreadySubmitted:
    'You have already submitted feedback for this item.',
  feedbackPendingReview:
    'Your feedback is pending review. It will be visible once approved.',
  invalidRating:
    'The rating you provided is invalid. Please provide a rating between 1 and 5 stars.',
  noFeedbackProvided:
    'No feedback provided. Please write a comment or provide a rating.',
};

const uploadMessages = {
  uploadSuccess: 'Your file has been uploaded successfully.',
  uploadFailure: 'Failed to upload the file. Please try again later.',
  fileTooLarge:
    'The file you selected is too large. Please choose a smaller file.',
  fileTypeNotAllowed:
    'The file type you selected is not allowed. Please choose a different file.',
  uploadCancelled: 'Your file upload has been cancelled.',
  uploadInProgress: 'Your file is being uploaded. Please wait...',
  insufficientStorage: 'There is not enough storage space to upload this file.',
  duplicateFile:
    'A file with the same name already exists. Please rename your file and try again.',
  networkErrorDuringUpload:
    'Network error occurred during file upload. Please check your connection and try again.',
  virusDetected:
    'The file you tried to upload contains a virus and has been rejected.',
};

const transactionMessages = {
  transactionSuccess:
    'Your transaction was successful. Thank you for your purchase!',
  transactionFailure:
    'Transaction failed. Please try again or use a different payment method.',
  transactionPending:
    'Your transaction is pending. Please wait while we process your payment.',
  insufficientFunds:
    'Transaction failed due to insufficient funds. Please check your balance and try again.',
  paymentDeclined:
    'Your payment was declined by the bank. Please contact your bank or use a different card.',
  cardExpired:
    'The card you used has expired. Please update your card details and try again.',
  invalidCardDetails:
    'The card details you entered are invalid. Please check and try again.',
  paymentGatewayError:
    'There was an error with the payment gateway. Please try again later.',
  transactionCancelled: 'Your transaction has been cancelled.',
  transactionTimeout: 'Your transaction timed out. Please try again.',
  refundInitiated:
    'A refund has been initiated. It may take a few days to reflect in your account.',
  refundFailed:
    'Failed to process the refund. Please contact customer support.',
  receiptSent: 'A receipt has been sent to your email.',
  invalidCouponCode: 'The coupon code you entered is invalid or expired.',
  couponApplied: 'Coupon applied successfully. Your discount has been added.',
  maxRedemptionsReached:
    'This coupon has reached its maximum number of redemptions.',
  transactionInReview:
    'Your transaction is under review. We will notify you once it is completed.',
  currencyNotSupported:
    'The currency you selected is not supported. Please choose a different currency.',
  recurringPaymentSuccess: 'Your recurring payment was successful.',
  recurringPaymentFailure:
    'Failed to process your recurring payment. Please check your payment details.',
  paymentMethodUpdated: 'Your payment method has been updated successfully.',
  paymentMethodUpdateFailed:
    'Failed to update your payment method. Please try again later.',
  paymentMethodNotSupported:
    'The payment method you selected is not supported. Please choose a different method.',
  duplicateTransactionDetected:
    'A duplicate transaction was detected and has been prevented.',
  transactionLimitExceeded:
    'You have exceeded your transaction limit. Please try a smaller amount.',
  taxCalculationError:
    'There was an error calculating the tax for your transaction. Please try again.',
  transactionHistoryFetched:
    'Your transaction history has been fetched successfully.',
  transactionHistoryFetchFailed:
    'Failed to fetch transaction history. Please try again later.',
};

export {
  loginMessages,
  registrationMessages,
  passwordResetMessages,
  accountSettingsMessages,
  securityMessages,
  emailVerificationMessages,
  logoutMessages,
  accountDeletionMessages,
  generalMessages,
  feedbackMessages,
  uploadMessages,
  transactionMessages,
};
