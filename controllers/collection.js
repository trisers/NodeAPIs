import { MESSAGES } from "../constants/messages.js";
import Collection from "../models/collections.js";
import {
  isValidMongoDbId,
  parseFormDataBody,
  validateRequestBody,
} from "../utils/index.js";

/**
 * Create a Collection
 * @param {Object} req - Request object containing the body
 * @param {Object} res - Response object
 * @returns {Object} - JSON response with success or error message
 */
export const createCollection = async (req, res) => {
  try {
    let parsedBody = parseFormDataBody(req.body, [
      "collection_tags",
      "collection_products",
    ]);

    let {
      collection_name,
      collection_description,
      collection_tags,
      collection_image,
      collection_products,
    } = parsedBody;
    if (req?.file?.filename) {
      collection_image = `/uploads/collections/${req?.file?.filename}`;
    } else {
      collection_image = `/uploads/static/no-image.png`;
    }

    const validate = validateRequestBody(
      {
        collection_name: true,
        collection_description: true,
        collection_tags: true,
        collection_image: false,
      },
      parsedBody
    );
    if (validate) {
      return res.status(422).json({ message: validate });
    }

    const collection = await Collection.create({
      collection_name,
      collection_description,
      collection_tags,
      collection_image,
      collection_products,
    });
    if (!collection) {
      throw new Error(MESSAGES.DB_FAILURE);
    }

    res.status(201).json({ message: MESSAGES.COLLECTION.CREATED });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

/**
 * Fetch all collections
 * @param {Object} req - Request object containing the body
 * @param {Object} res - Response object
 * @returns {Object} - JSON response with success or error message
 */
export const getAllCollections = async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1);
    const pageSize = parseInt(req.query.pageSize || 10);
    const skip = (page - 1) * pageSize;

    const [result] = await Collection.aggregate([
      {
        $facet: {
          collections: [{ $skip: skip }, { $limit: pageSize }],
          totalCollections: [{ $count: "count" }],
        },
      },
    ]);

    const collections = result.collections;
    const totalCollections = result.totalCollections[0]?.count || 0;
    const totalPages = Math.ceil(totalCollections / pageSize);

    res.status(200).json({
      collections: collections ? collections : [],
      currentPage: page,
      totalCollections,
      nextPage: page < totalPages ? page + 1 : null,
    });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

/**
 * Fetch Single Collection
 * @param {Object} req - Request object containing the body
 * @param {Object} res - Response object
 * @returns {Object} - JSON response with success or error message
 */
export const getCollection = async (req, res) => {
  try {
    const { collection_id } = req.params;
    if (!collection_id) {
      return res.status(400).json({ message: MESSAGES.COLLECTION.MISSING_ID });
    }
    if (!isValidMongoDbId(collection_id)) {
      return res.status(400).json({ message: MESSAGES.COLLECTION.INVALID_ID });
    }
    const collection = await Collection.findById(collection_id).populate({
      path: "collection_products",
      select: "",
    });
    if (!collection) {
      return res.status(404).json({ message: MESSAGES.COLLECTION.NOT_FOUND });
    }

    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

/**
 * Update Collection
 * @param {Object} req - Request object containing the body
 * @param {Object} res - Response object
 * @returns {Object} - JSON response with success or error message
 */
export const updateCollection = async (req, res) => {
  try {
    let parsedBody = parseFormDataBody(req.body, [
      "collection_tags",
      "collection_products",
    ]);
    const {
      collection_name,
      collection_description,
      collection_tags,
      collection_products,
    } = parsedBody;

    const { collection_id } = req.params;
    let new_collection_image = ``;

    if (!collection_id) {
      return res.status(400).json({ message: MESSAGES.COLLECTION.MISSING_ID });
    }
    if (!isValidMongoDbId(collection_id)) {
      return res.status(400).json({ message: MESSAGES.COLLECTION.INVALID_ID });
    }
    const validate = validateRequestBody(
      {
        collection_name: true,
        collection_description: true,
        collection_tags: false,
        collection_image: false,
        collection_products: false,
      },
      parsedBody
    );
    if (validate) {
      return res.status(422).json({ message: validate });
    }
    if (req?.file?.filename) {
      new_collection_image = `/uploads/collections/${req?.file?.filename}`;
    }
    let bodyTobeUpdate = {
      collection_name,
      collection_description,
      collection_tags,
      collection_products,
    };
    if (new_collection_image) {
      bodyTobeUpdate = {
        ...bodyTobeUpdate,
        collection_image: new_collection_image,
      };
    }
    const collection = await Collection.findByIdAndUpdate(
      collection_id,
      bodyTobeUpdate,
      { new: true }
    );
    if (!collection) {
      return res.status(404).json({ message: MESSAGES.COLLECTION.NOT_FOUND });
    }

    res.status(200).json(collection);
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

/**
 * @description Deletes an existing Collection by ID.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const deleteCollection = async (req, res) => {
  try {
    const { collection_id } = req.params;
    if (!collection_id) {
      return res.status(400).json({ message: MESSAGES.COLLECTION.MISSING_ID });
    }
    if (!isValidMongoDbId(collection_id)) {
      return res.status(400).json({ message: MESSAGES.COLLECTION.INVALID_ID });
    }

    const deletedCollection = await Collection.findByIdAndDelete(collection_id);
    if (!deletedCollection) {
      return res.status(404).json({ message: MESSAGES.COLLECTION.NOT_FOUND });
    }
    res.status(200).json({ message: MESSAGES.COLLECTION.DELETED });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
