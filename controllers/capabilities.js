import { MESSAGES } from "../constants/messages.js";
import Capabilities from "../models/capabilities.js";

import { isValidMongoDbId, validateRequestBody } from "../utils/index.js";

/**
 * @description Create an capability
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const createCapability = async (req, res) => {
  try {
    const { name, description } = req.body;

    const validate = validateRequestBody({ name: true }, req.body);
    if (validate) {
      return res.status(422).json({ message: validate });
    }
    const newCapability = await Capabilities.create({
      name,
      description,
    });
    if (!newCapability) {
      throw new Error(MESSAGES.DB_FAILURE);
    }

    res.status(201).json({ message: MESSAGES.CAPABILITIES.CREATED });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: MESSAGES.CAPABILITIES.DUPLICATE_ENTRIES,
        value: error.keyValue,
      });
    }
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

/**
 * @description Fetch All capabilitiess
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const getAllCapabilities = async (req, res) => {
  try {
    const capabilities = await Capabilities.find();
    res.status(200).json(capabilities ? capabilities : []);
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

/**
 * @description Fetch capability By ID
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const getCapabilityById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: MESSAGES.CAPABILITIES.MISSING_ID });
    }
    if (!isValidMongoDbId(id)) {
      return res
        .status(400)
        .json({ message: MESSAGES.CAPABILITIES.INVALID_ID });
    }

    const capability = await Capabilities.findById(id);
    if (!capability) {
      return res.status(404).json({ message: MESSAGES.CAPABILITIES.NOT_FOUND });
    }
    res.status(200).json(capability);
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
/**
 * @description Update capability By ID
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const updateCapability = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    if (!id) {
      return res
        .status(400)
        .json({ message: MESSAGES.CAPABILITIES.MISSING_ID });
    }
    if (!isValidMongoDbId(id)) {
      return res
        .status(400)
        .json({ message: MESSAGES.CAPABILITIES.INVALID_ID });
    }
    const validate = validateRequestBody(
      {
        name: true,
      },
      req.body
    );
    if (validate) {
      return res.status(422).json({ message: validate });
    }

    const updatedCapability = await Capabilities.findByIdAndUpdate(
      id,
      { name, description },
      { new: true }
    );

    if (!updatedCapability) {
      return res.status(404).json({ message: MESSAGES.CAPABILITIES.NOT_FOUND });
    }

    res.status(200).json(updatedCapability);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: MESSAGES.CAPABILITIES.DUPLICATE_ENTRIES,
        value: error.keyValue,
      });
    }
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

/**
 * @description Delete capability By ID
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const deleteCapability = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: MESSAGES.CAPABILITIES.MISSING_ID });
    }
    if (!isValidMongoDbId(id)) {
      return res
        .status(400)
        .json({ message: MESSAGES.CAPABILITIES.INVALID_ID });
    }
    const deletedCapability = await Capabilities.findByIdAndDelete(id);

    if (!deletedCapability) {
      return res.status(404).json({ message: MESSAGES.CAPABILITIES.NOT_FOUND });
    }

    res.status(200).json({
      message: MESSAGES.CAPABILITIES.DELETED,
    });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
