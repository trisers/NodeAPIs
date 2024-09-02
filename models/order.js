import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    // _id will use as OrderId
    customer_ID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product_ID: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    total_amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    payment: {
      method: { type: String, required: true },
      status: { type: String },
    },
    shipping_address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postal_code: { type: String, required: true },
      country: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
