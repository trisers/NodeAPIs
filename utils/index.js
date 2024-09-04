import mongoose from "mongoose";

/**
 * Converts a string to a URL-friendly slug.
 * @param {string} str - The string to convert.
 * @returns {string} - The generated slug.
 */
export const createSlug = (str) => {
  str = str.toLowerCase();
  str = str.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return str;
};

/**
 * Check for required fields
 * @param {Object} required - Object containing required fields
 * @param {Object} body - Object containing the request body to validate
 * @returns {string} - Message for missing or empty values
 */
export const validateRequestBody = (required, body) => {
  const missingFields = [];

  for (const [field, isRequired] of Object.entries(required)) {
    if (isRequired && (!body.hasOwnProperty(field) || !body[field])) {
      // Collect missing or empty fields
      missingFields.push(field.replace(/_/g, " ")); // Convert snake_case to space-separated words
    }
  }

  if (missingFields.length > 0) {
    return `Missing - ${missingFields.join(", ")}`;
  }

  return "";
};

/**
 * Check for Valid Mongodb ID
 * @param {Object} required - ID
 * @returns {Boolean} - true or false
 */
export const isValidMongoDbId = (ID) => mongoose.Types.ObjectId.isValid(ID);
/**
 * Generates a 6-digit OTP.
 *
 * @returns {string} - A 6-digit OTP as a string.
 */
export const generateOTP = () => {
  // Generate a random number between 100000 and 999999
  const otp = Math.floor(100000 + Math.random() * 900000);

  return otp.toString();
};

/**
 * Validates if the provided OTP is a valid 6-digit number.
 *
 * @param {string} otp - The OTP to validate.
 * @returns {boolean} - Returns true if the OTP is valid, false otherwise.
 */
export const isValidOTP = (otp) => {
  const otpRegex = /^\d{6}$/; // Regular expression to match exactly 6 digits
  return otpRegex.test(otp);
};

/**
 * Checks if the OTP is expired based on the provided future time.
 *
 * @param {string} futureTimeString - The future time as a date string.
 * @returns {boolean} - Returns true if the OTP is expired, false otherwise.
 */
export const isOtpExpired = (futureTimeString) => {
  const currentTime = new Date();
  const futureTime = new Date(futureTimeString);
  return futureTime < currentTime;
};



