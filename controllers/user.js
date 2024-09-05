import { MESSAGES } from "../constants/messages.js";
import { comparePassword, hashPassword } from "../helper/helper.js";
import User from "../models/user.js";
/**
 * @description Updates profile
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.user;
    const { full_name, phone, profile_picture } = req.body;

    const updates = {};
    if (phone) updates.phone = phone;
    if (full_name) updates.full_name = full_name;
    if (profile_picture) updates.profile_picture = profile_picture;

    const savedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });
    if (!savedUser)
      return res.status(404).json({ message: MESSAGES.USER.NOT_FOUND });

    res.status(200).json({ message: MESSAGES.USER.PROFILE_UPDATED });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

/**
 * @description Change password when user is authenticated
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const changePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { old_password, newPassword, confirmPassword } = req.body;

    const validate = validateRequestBody(
      { old_password: true, new_password: true, repeat_password: true },
      req.body
    );
    if (validate) {
      return res.status(422).json({ message: validate });
    }
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: MESSAGES.USER.NEW_CONFIRM_NOT_MATCH });
    }
    const savedUser = await User.findById(userId).select("email password");

    if (!savedUser) {
      return res.status(404).json({ message: MESSAGES.USER.NOT_FOUND });
    }

    let isPassowrdMatched = await comparePassword(
      old_password,
      savedUser.password
    );
    if (!isPassowrdMatched) {
      return res
        .status(401)
        .json({ message: MESSAGES.USER.INCORRECT_PASSWORD });
    }

    let hashedPassword = await hashPassword(newPassword);
    savedUser.password = hashedPassword;
    await savedUser.save();

    res.status(200).json({ message: MESSAGES.USER.PASSWORD_CHANGED });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

