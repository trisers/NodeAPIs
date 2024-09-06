import { MESSAGES } from "../constants/messages.js";
import {
  checkUserExistWithEmail,
  checkUserExistWithPhone,
  hashPassword,
} from "../helper/helper.js";
import User from "../models/user.js";

import {
  generateDBValidateErrorMessage,
  generateRandomPassword,
  validateRequestBody,
} from "../utils/index.js";
import { MailDashboardUserRegistrationTemplate } from "../utils/nodemailer_templates.js";

/**
 * @description Verify User Email
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const addDashboardUser = async (req, res) => {
  try {
    const { full_name, email, phone, profile_picture, role, access_levels } =
      req.body;

    const validate = validateRequestBody(
      {
        full_name: true,
        email: true,
        phone: true,
        profile_picture: false,
        role: true,
        access_levels: true,
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
    let randomPassword = generateRandomPassword();
    let hashedPassword = await hashPassword(randomPassword);

    const newResigration = await User.create({
      full_name,
      email,
      password: hashedPassword,
      phone,
      profile_picture,
      role,
      access_levels,
    });
    if (!newResigration) {
      throw new Error(MESSAGES.DB_FAILURE);
    }
    // nodemailer
    await MailDashboardUserRegistrationTemplate(randomPassword, email, role);

    res.status(201).json({
      message: `${role} ${MESSAGES.DASHBOARD_USER.ADDED}`,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(500)
        .json({ message: generateDBValidateErrorMessage(error) });
    }
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
/**
 * @description Verify User Email
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const updateDashboardUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: MESSAGES.DASHBOARD_USER.MISSING_ID });
    }
    const { _id, email, last_login, otp, otp_expire, ...payload } = req.body;

    const savedUser = await User.findByIdAndUpdate(id, payload, { new: true });
    if (!savedUser) {
      return res.status(404).json({ message: MESSAGES.USER.NOT_FOUND });
    }

    res.status(200).json(savedUser);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res
        .status(500)
        .json({ message: generateDBValidateErrorMessage(error) });
    }
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
