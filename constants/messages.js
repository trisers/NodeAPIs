export const MESSAGES = {
  GENERAL: {
    SUCCESS: "Request completed.",
    FAILURE: "Request failed. Please try again.",
    INVALID_REQUEST: "Invalid request parameters.",
  },
  ORDER: {
    DELETED: "Order has been deleted.",
    NOT_FOUND: "Order not found.",
    MISSING_ID: "Missing order ID.",
    INVALID_ID: "Invalid order ID.",
  },
  PRODUCT: {
    CREATED: "Product has been created.",
    UPDATED: "Product has been updated.",
    DELETED: "Product has been deleted.",
    NOT_FOUND: "Product not found.",
    MISSING_ID: "Missing product ID.",
    INVALID_ID: "Invalid product ID.",
  },
  USER: {
    EMAIL_ALREADY_EXIST: "Email already in use.",
    PHONE_ALREADY_EXIST: "Phone number already in use.",
    OTP_SENT: "An one-time verification password sent to your email.",
    INCORRECT_OTP: "Wrong otp",
    INVALID_OTP: "Invalid otp",
    EMAIL_VERIFICATION_SUCCESS: "Email has been verified.",
    EMAIL_ALREADY_VERIFIED: "Email already verified.",
    NOT_FOUND: "User not found.",
    EMAIL_NOT_VERIFIED:
      "Email is not verified. Please verify email before login .",
    ACCOUNT_PENDING:
      "Your account is not active. Contact support team for help.",
    ACCOUNT_SUSPENDED:
      "Your account is suspended. Contact support team for help.",
    INCORRECT_PASSWORD: "Incorrect password.",
    OTP_EXPIRED: "OTP has been expired.",
    NEW_CONFIRM_NOT_MATCH: "Password and confirm password should be same.",
    PASSWORD_CHANGED: "Password has been changed.",
  },
  DB_FAILURE: "Database failure.",
  SERVER_ERROR: "Server error. Please try again later.",
  UNAUTHORIZED: "Unauthorized access.",
};
