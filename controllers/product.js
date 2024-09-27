import { MESSAGES } from "../constants/messages.js";
import Product from "../models/product.js";
import {
  isValidMongoDbId,
  parseFormDataBody,
  validateRequestBody,
} from "../utils/index.js";

/**
 * Create a product
 * @param {Object} req - Request object containing the body
 * @param {Object} res - Response object
 * @returns {Object} - JSON response with success or error message
 */
export const createProduct = async (req, res) => {
  try {
    const parsedBody = parseFormDataBody(req.body, [
      "product_tags",
      "product_colors",
      "product_sizes",
    ]);
    let {
      product_name,
      product_description,
      product_type,
      product_tags,
      quantity,
      price,
      discount,
      tax,
      product_brand,
      product_category,
      product_colors,
      product_sizes,
      product_status,
      product_code,
    } = parsedBody;
    let product_gallery = [];

    req?.files?.map((file) => {
      product_gallery.push(`/uploads/products/${file.filename}`);
    });

    const validate = validateRequestBody(
      {
        product_name: true,
        product_description: true,
        product_type: true,
        product_tags: false,
        product_gallery: false,
        quantity: true,
        price: true,

        product_brand: true,
        product_category: true,
        product_colors: true,
        product_sizes: true,
        product_status: true,
        product_code: true,
      },
      parsedBody
    );
    if (validate) {
      return res.status(422).json({ message: validate });
    }
    let sku = generateSKU();
    const product = await Product.create({
      product_name,
      product_description,
      product_type,
      product_tags,
      product_gallery,
      quantity,
      price,
      discount,
      tax,
      sku,
      product_brand,
      product_category,
      product_colors,
      product_sizes,
      product_status,
      product_code,
    });

    if (!product) {
      throw new Error(MESSAGES.DB_FAILURE);
    }

    res.status(201).json({ message: MESSAGES.PRODUCT.CREATED });
  } catch (error) {
    console.log(error);
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
    const parsedBody = parseFormDataBody(req.body, [
      "product_tags",
      "product_gallery",
      "product_colors",
      "product_sizes",
    ]);
    const { product_id } = req.params;
    const {
      product_name,
      product_description,
      product_type,
      product_tags,
      product_gallery,
      quantity,
      price,
      discount,
      tax,
      sku,
      product_brand,
      product_category,
      product_colors,
      product_sizes,
      product_status,
    } = parsedBody;

    req?.files?.map((file) => {
      product_gallery.push(`/uploads/products/${file.filename}`);
    });

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
        price: true,
        sku: true,
        product_brand: true,
        product_category: true,
        product_colors: true,
        product_sizes: true,
        product_status: true,
      },
      parsedBody
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
      price,
      discount,
      tax,
      sku,
      product_brand,
      product_category,
      product_colors,
      product_sizes,
      product_status,
    });

    if (!product) {
      return res.status(404).json({ message: MESSAGES.PRODUCT.NOT_FOUND });
    }

    res.status(200).json({ message: MESSAGES.PRODUCT.UPDATED });
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
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ message: MESSAGES.PRODUCT.MISSING_SLUG });
    }
    const product = await Product.findOne({ slug });
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
    const q = req.query.q || "published";
    const page = parseInt(req.query.page || 1);
    const pageSize = parseInt(req.query.pageSize || 10);
    const skip = (page - 1) * pageSize;

    const [result] = await Product.aggregate([
      {
        $match: { product_status: q },
      },
      {
        $facet: {
          products: [{ $skip: skip }, { $limit: pageSize }],
          totalProducts: [{ $count: "count" }],
        },
      },
    ]);
    const products = result.products;
    const totalProducts = result.totalProducts[0]?.count || 0;
    const totalPages = Math.ceil(totalProducts / pageSize);

    res.status(200).json({
      products: products ? products : [],
      currentPage: page,
      totalProducts,
      nextPage: page < totalPages ? page + 1 : null,
    });
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

/**
 * Generates unique product ID
 * @param {Object} req - Request object containing the product ID
 * @param {Object} res - Response object
 * @returns {Object} - JSON response with success or error message
 */

export const getUniqueProductCode = async (req, res) => {
  try {
    let prefix = "PR-";

    const lastProduct = await Product.findOne({})
      .sort({ product_code: -1 })
      .select("product_code");

    let newCode;
    if (lastProduct) {
      // Extract the numeric part from the last product code

      let lastCode = lastProduct.product_code.replace(prefix, "");

      let nextCode = (parseInt(lastCode, 10) + 1).toString().padStart(7, "0");
      newCode = prefix + nextCode;
    } else {
      // If no products exist, start from PR-0000001
      newCode = prefix + "0000001";
    }

    // Check if the new code exists (just to be sure)
    const existingProduct = await Product.findOne({ product_code: newCode });
    if (existingProduct) {
      return res.status(400).json({ message: "Duplicate product code found." });
    }

    // Return the new product code
    res.status(200).json({ code: newCode });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
