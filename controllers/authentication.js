import { MESSAGES } from "../constants/messages.js";
import {
  checkUserExistWithEmail,
  checkUserExistWithPhone,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
} from "../helper/helper.js";
import User from "../models/user.js";
import {
  generateOTP,
  isOtpExpired,
  isValidOTP,
  validateRequestBody,
} from "../utils/index.js";
import {
  MailOtpRequestTemplate,
  MailUserRegistrationTemplate,
} from "../utils/nodemailer_templates.js";

/**
 * @description Register User
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const userRegister = async (req, res) => {
  try {
    const { full_name, email, password, phone, profile_picture } = req.body;

    const validate = validateRequestBody(
      {
        full_name: true,
        email: true,
        password: true,
        phone: true,
        profile_picture: false,
      },
      req.body
    );
    if (validate) {
      return res.status(422).json({ message: validate });
    }
    if (await checkUserExistWithEmail(email)) {
      return res
        .status(409)
        .json({ message: MESSAGES.USER.EMAIL_ALREADY_EXIST });
    }
    if (await checkUserExistWithPhone(phone)) {
      return res
        .status(409)
        .json({ message: MESSAGES.USER.PHONE_ALREADY_EXIST });
    }

    let hashedPassword = await hashPassword(password);
    let generatedOtp = generateOTP();
    let otpExpireTime = new Date(Date.now() + 5 * 60 * 1000);
    let hashedOtp = await hashPassword(generatedOtp);

    const newResigration = await User.create({
      full_name,
      email,
      password: hashedPassword,
      phone,
      profile_picture,
      otp: hashedOtp,
      otp_expire: otpExpireTime,
    });
    if (!newResigration) {
      throw new Error(MESSAGES.DB_FAILURE);
    }
    // nodemailer
    await MailUserRegistrationTemplate(generatedOtp, email);

    res.status(201).json({ message: MESSAGES.USER.OTP_SENT });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
/**
 * @description Verify User Email
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const validate = validateRequestBody(
      {
        email: true,
        otp: true,
      },
      req.body
    );
    if (validate) {
      return res.status(422).json({ message: validate });
    }
    if (!isValidOTP(otp)) {
      return res.status(400).json({ message: MESSAGES.USER.INVALID_OTP });
    }
    const savedUser = await User.findOne({ email }).select(
      "full_name email role email_verified otp otp_expire"
    );
    if (!savedUser) {
      return res.status(404).json({ message: MESSAGES.USER.NOT_FOUND });
    }
    if (savedUser.email_verified) {
      return res
        .status(409)
        .json({ message: MESSAGES.USER.EMAIL_ALREADY_VERIFIED });
    }

    if (isOtpExpired(savedUser.otp_expire)) {
      return res.status(410).json({ message: MESSAGES.USER.OTP_EXPIRED });
    }
    let isOTPCorrect = await comparePassword(otp, savedUser.otp);

    if (!isOTPCorrect) {
      return res.status(401).json({ message: MESSAGES.USER.INCORRECT_OTP });
    }
    savedUser.email_verified = true;
    savedUser.status = "active";
    savedUser.otp = "";

    await savedUser.save();

    let accessToken = generateAccessToken({
      name: savedUser.full_name,
      email: savedUser.email,
      role: savedUser.role,
    });
    let refreshToken = generateRefreshToken({
      name: savedUser.full_name,
      email: savedUser.email,
      role: savedUser.role,
    });

    res.status(200).json({
      message: MESSAGES.USER.EMAIL_VERIFICATION_SUCCESS,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
/**
 * @description Resends OTP
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const validate = validateRequestBody({ email: true }, req.body);
    if (validate) {
      return res.status(422).json({ message: validate });
    }
    const savedUser = await User.findOne({ email }).select("email");
    if (!savedUser) {
      return res.status(404).json({ message: MESSAGES.USER.NOT_FOUND });
    }
    let generatedOtp = generateOTP();
    let otpExpireTime = new Date(Date.now() + 5 * 60 * 1000);
    let hashedOtp = await hashPassword(generatedOtp);

    savedUser.otp = hashedOtp;
    savedUser.otp_expire = otpExpireTime;
    await savedUser.save();

    // nodemailer
    await MailOtpRequestTemplate(generatedOtp, email);

    res.status(200).json({ message: MESSAGES.USER.OTP_SENT });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
/**
 * @description Resends OTP
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validate = validateRequestBody(
      { email: true, password: true },
      req.body
    );
    if (validate) {
      return res.status(422).json({ message: validate });
    }
    const savedUser = await User.findOne({ email }).select(
      "full_name email role email_verified status password"
    );
    if (!savedUser) {
      return res.status(404).json({ message: MESSAGES.USER.NOT_FOUND });
    }
    if (!savedUser.email_verified) {
      return res
        .status(403)
        .json({ message: MESSAGES.USER.EMAIL_NOT_VERIFIED });
    }
    if (savedUser.status === "pending" || savedUser.status === "suspended") {
      let STATUS = savedUser.status === "pending" ? 403 : 423;
      let MESSAGE =
        savedUser.status === "pending"
          ? MESSAGES.USER.ACCOUNT_PENDING
          : MESSAGES.USER.ACCOUNT_SUSPENDED;
      return res.status(STATUS).json({ message: MESSAGE });
    }
    let isPassowrdMatched = await comparePassword(password, savedUser.password);
    if (!isPassowrdMatched) {
      return res
        .status(401)
        .json({ message: MESSAGES.USER.INCORRECT_PASSWORD });
    }

    let accessToken = generateAccessToken({
      name: savedUser.full_name,
      email: savedUser.email,
      role: savedUser.role,
    });
    let refreshToken = generateRefreshToken({
      name: savedUser.full_name,
      email: savedUser.email,
      role: savedUser.role,
    });

    res.status(200).json({ accessToken, refreshToken });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
/**
 * @description Request OTP for forget password
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */

export const requestOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const validate = validateRequestBody({ email: true }, req.body);
    if (validate) {
      return res.status(422).json({ message: validate });
    }
    let savedUser = await User.findOne({ email }).select("email");
    if (!savedUser) {
      return res.status(404).json({ message: MESSAGES.USER.NOT_FOUND });
    }
    let generatedOtp = generateOTP();
    let otpExpireTime = new Date(Date.now() + 5 * 60 * 1000);
    let hashedOtp = await hashPassword(generatedOtp);

    savedUser.otp = hashedOtp;
    savedUser.otp_expire = otpExpireTime;
    await savedUser.save();
    // nodemailer
    await MailOtpRequestTemplate(generatedOtp, email);

    res.status(200).json({ message: MESSAGES.USER.OTP_SENT });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
/**
 * @description Forget password
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;
    const validate = validateRequestBody(
      {
        email: true,
        otp: true,
        newPassword: true,
        confirmPassword: true,
      },
      req.body
    );
    if (validate) {
      return res.status(422).json({ message: validate });
    }
    if (!isValidOTP(otp)) {
      return res.status(400).json({ message: MESSAGES.USER.INVALID_OTP });
    }
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: MESSAGES.USER.NEW_CONFIRM_NOT_MATCH });
    }
    const savedUser = await User.findOne({ email }).select(
      "full_name email role email_verified otp otp_expire"
    );
    if (!savedUser) {
      return res.status(404).json({ message: MESSAGES.USER.NOT_FOUND });
    }
    if (!savedUser.email_verified) {
      return res
        .status(403)
        .json({ message: MESSAGES.USER.EMAIL_NOT_VERIFIED });
    }
    if (savedUser.status === "pending" || savedUser.status === "suspended") {
      let STATUS = savedUser.status === "pending" ? 403 : 423;
      let MESSAGE =
        savedUser.status === "pending"
          ? MESSAGES.USER.ACCOUNT_PENDING
          : MESSAGES.USER.ACCOUNT_SUSPENDED;
      return res.status(STATUS).json({ message: MESSAGE });
    }
    if (isOtpExpired(savedUser.otp_expire)) {
      return res.status(410).json({ message: MESSAGES.USER.OTP_EXPIRED });
    }
    let isOTPCorrect = await comparePassword(otp, savedUser.otp);
    if (!isOTPCorrect) {
      return res.status(401).json({ message: MESSAGES.USER.INCORRECT_OTP });
    }
    let hashedPassword = await hashPassword(newPassword);
    savedUser.password = hashedPassword;
    savedUser.otp = "";
    await savedUser.save();

    res.status(200).json({ message: MESSAGES.USER.PASSWORD_CHANGED });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
