import { MESSAGES } from "../constants/messages.js";
import Product from "../models/product.js";
import { isValidMongoDbId, validateRequestBody } from "../utils/index.js";

/**
 * Create a product
 * @param {Object} req - Request object containing the body
 * @param {Object} res - Response object
 * @returns {Object} - JSON response with success or error message
 */
export const createProduct = async (req, res) => {
  const {
    product_name,
    product_description,
    product_type,
    product_tags,
    product_gallery,
    quantity,
    original_price,
    sale_price,
    sku,
  } = req.body;

  try {
    const validate = validateRequestBody(
      {
        product_name: true,
        product_description: true,
        product_type: true,
        product_tags: true,
        product_gallery: true,
        quantity: true,
        original_price: true,
        sale_price: true,
        sku: true,
      },
      req.body
    );
    if (validate) {
      return res.status(422).json({ message: validate });
    }
    const product = await Product.create({
      product_name,
      product_description,
      product_type,
      product_tags,
      product_gallery,
      quantity,
      original_price,
      sale_price,
      sku,
    });
    if (!product) {
      throw new Error(MESSAGES.DB_FAILURE);
    }

    res.status(201).json({ message: MESSAGES.PRODUCT.CREATED });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

/**
 * Update a product by ID
 * @param {Object} req - Request object containing the product ID and body
 * @param {Object} res - Response object
 * @returns {Object} - JSON response with success or error message
 */
export const updateProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const {
      product_name,
      product_description,
      product_type,
      product_tags,
      product_gallery,
      quantity,
      original_price,
      sale_price,
      sku,
    } = req.body;
    if (!product_id) {
      return res.status(400).json({ message: MESSAGES.PRODUCT.MISSING_ID });
    }
    if (!isValidMongoDbId(product_id)) {
      return res.status(400).json({ message: MESSAGES.PRODUCT.INVALID_ID });
    }
    const validate = validateRequestBody(
      {
        product_name: true,
        product_description: true,
        product_type: true,
        product_tags: true,
        product_gallery: true,
        quantity: true,
        original_price: true,
        sale_price: true,
        sku: true,
      },
      req.body
    );
    if (validate) {
      return res.status(422).json({ message: validate });
    }
    const product = await Product.findByIdAndUpdate(product_id, {
      product_name,
      product_description,
      product_type,
      product_tags,
      product_gallery,
      quantity,
      original_price,
      sale_price,
      sku,
    });

    if (!product) {
      return res.status(404).json({ message: MESSAGES.PRODUCT.NOT_FOUND });
    }

    res.status(204).json({ message: MESSAGES.PRODUCT.UPDATED });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

/**
 * Get a single product by ID
 * @param {Object} req - Request object containing the product ID
 * @param {Object} res - Response object
 * @returns {Object} - JSON response with product data or error message
 */
export const getProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    if (!product_id) {
      return res.status(400).json({ message: MESSAGES.PRODUCT.MISSING_ID });
    }
    if (!isValidMongoDbId(product_id)) {
      return res.status(400).json({ message: MESSAGES.PRODUCT.INVALID_ID });
    }
    const product = await Product.findById(product_id);

    if (!product) {
      return res.status(404).json({ message: MESSAGES.PRODUCT.NOT_FOUND });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
/**
 * Get all products
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object} - JSON response with all products data or error message
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products ? products : []);
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

/**
 * Delete a product by ID
 * @param {Object} req - Request object containing the product ID
 * @param {Object} res - Response object
 * @returns {Object} - JSON response with success or error message
 */

export const deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    if (!product_id) {
      return res.status(400).json({ message: MESSAGES.PRODUCT.MISSING_ID });
    }
    if (!isValidMongoDbId(product_id)) {
      return res.status(400).json({ message: MESSAGES.PRODUCT.INVALID_ID });
    }
    const product = await Product.findByIdAndDelete(product_id);

    if (!product) {
      return res.status(404).json({ message: MESSAGES.PRODUCT.NOT_FOUND });
    }

    res.status(200).json({ message: MESSAGES.PRODUCT.DELETED });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
