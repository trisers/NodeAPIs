import { MESSAGES } from "../constants/messages.js";
import Order from "../models/order.js";
import { isValidMongoDbId, validateRequestBody } from "../utils/index.js";
/**
 * @description Retrieves all orders.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("items.product_ID");
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

/**
 * @description Retrieves a specific order by ID.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const getOrderById = async (req, res) => {
  try {
    const OrderId = req.params.order_id;
    if (!OrderId) {
      return res.status(400).json({ message: MESSAGES.ORDER.MISSING_ID });
    }
    if (!isValidMongoDbId(OrderId)) {
      return res.status(400).json({ message: MESSAGES.ORDER.INVALID_ID });
    }

    const order = await Order.findById(OrderId).populate("items.product_ID");

    if (!order) {
      return res.status(404).json({ message: MESSAGES.ORDER.NOT_FOUND });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
/**
 * @description Creates a new order.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const createOrder = async (req, res) => {
  try {
    const {
      customer_ID,
      items,
      total_amount,
      status,
      payment,
      shipping_address,
    } = req.body;

    const validate = validateRequestBody(
      {
        customer_ID: true,
        items: true,
        total_amount: true,
        status: false,
        payment: true,
        shipping_address: true,
      },
      req.body
    );
    if (validate) {
      return res.status(422).json({ message: validate });
    }

    const order = await Order.create({
      customer_ID,
      items,
      total_amount,
      status,
      payment,
      shipping_address,
    });
    if (!order) {
      throw new Error(MESSAGES.DB_FAILURE);
    }
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
/**
 * @description Updates an existing order by ID.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const updateOrder = async (req, res) => {
  try {
    const { items, total_amount, status, payment, shipping_address } = req.body;
    const OrderId = req.params.order_id;
    if (!OrderId) {
      return res.status(400).json({ message: MESSAGES.ORDER.MISSING_ID });
    }
    if (!isValidMongoDbId(OrderId)) {
      return res.status(400).json({ message: MESSAGES.ORDER.INVALID_ID });
    }

    const validate = validateRequestBody(
      {
        items: true,
        total_amount: true,
        status: true,
        payment: true,
        shipping_address: true,
      },
      req.body
    );
    if (validate) {
      return res.status(422).json({ message: validate });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      OrderId,
      {
        items,
        total_amount,
        status,
        payment,
        shipping_address,
      },
      { new: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ message: MESSAGES.ORDER.NOT_FOUND });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
/**
 * @description Deletes an existing order by ID.
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const deleteOrder = async (req, res) => {
  try {
    const OrderId = req.params.order_id;
    if (!OrderId) {
      return res.status(400).json({ message: MESSAGES.ORDER.MISSING_ID });
    }
    if (!isValidMongoDbId(OrderId)) {
      return res.status(400).json({ message: MESSAGES.ORDER.INVALID_ID });
    }

    const deletedOrder = await Order.findByIdAndDelete(OrderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: MESSAGES.ORDER.NOT_FOUND });
    }
    res.status(200).json({ message: MESSAGES.ORDER.DELETED });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
