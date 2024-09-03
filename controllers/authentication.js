import { MESSAGES } from "../constants/messages.js";
import {
  checkUserExistWithEmail,
  checkUserExistWithPhone,
  comparePassword,
  hashPassword,
} from "../helper/helper.js";
import User from "../models/user.js";
import { generateOTP, isValidOTP, validateRequestBody } from "../utils/index.js";

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
    if (await checkUserExistWithPhone(phone)) {
      return res
        .status(409)
        .json({ message: MESSAGES.USER.PHONE_ALREADY_EXIST });
    }
    if (await checkUserExistWithEmail(email)) {
      return res
        .status(409)
        .json({ message: MESSAGES.USER.EMAIL_ALREADY_EXIST });
    }

    let hashedPassword = await hashPassword(password);
    let generatedOtp = generateOTP();
    let hassedOtp = await hashPassword(generatedOtp);

    const newResigration = await User.create({
      full_name,
      email,
      password: hashedPassword,
      phone,
      profile_picture,
      otp: hassedOtp,
    });
    if (!newResigration) {
      throw new Error(MESSAGES.DB_FAILURE);
    }


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
    const savedUser = await User.findOne({ email }).select("email_verified otp");
    if (!savedUser){
      return res.status(404).json({message:MESSAGES.USER.NOT_FOUND})
    }
    if(savedUser.email_verified){
      return res.status(409).json({ message: MESSAGES.USER.EMAIL_ALREADY_VERIFIED })
    }
    if (!isValidOTP(otp)) {
      return res.status(400).json({ message: MESSAGES.USER.INVALID_OTP });
    }
    let isOTPCorrect = await comparePassword(otp, savedUser.otp);

    if (!isOTPCorrect) {
      return res.status(401).json({ message: MESSAGES.USER.INCORRECT_OTP });
    }
    savedUser.email_verified = true;
    savedUser.status = "active";
    savedUser.otp = "";
    await savedUser.save();

    res.status(200).json({ message: MESSAGES.USER.EMAIL_VERIFICATION_SUCCESS });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

