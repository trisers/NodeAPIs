import mongoose, { Schema } from "mongoose";
import { createSlug } from "../utils/index.js";

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: [true, "Product name is required."],
      trim: true,
    },
    slug: {
      type: String,
      // No need to make this required, as it's auto-generated
    },
    product_description: {
      type: String,
      required: [true, "Product description is required."],
      trim: true,
    },
    product_type: {
      type: String,
      required: [true, "Product type is required."],
      trim: true,
    },
    product_tags: {
      type: [String], // Changed to array of strings
      default: [],
    },
    product_gallery: {
      type: [String], // Changed to array of strings
      required: [true, "Product gallery is required."],
    },
    quantity: {
      type: Number,
      min: [0, "Quantity cannot be negative."],
      default: 0,
    },
    original_price: {
      type: Number,
      min: [0, "Original price cannot be negative."],
    },
    sale_price: {
      type: Number,
      required: [true, "Sale price is required."],
      min: [0, "Sale price cannot be negative."],
    },
    product_status: {
      type: String,
      default: "draft",
      enum: ["draft", "published"],
    },

    sku: {
      type: String,
      trim: true,
    },
    product_brand: {
      type: String,
    },
    product_category: {
      type: String,
    },

    product_colors: [{ name: String, value: String }],
    product_sizes: [{ name: String, value: String }],
  },
  { timestamps: true }
);

// Pre-save hook to automatically create a unique slug
productSchema.pre("save", async function (next) {
  if (this.isModified("product_name") || this.isNew) {
    let baseSlug = createSlug(`${this.product_name}`, {
      lower: true,
      strict: true,
    });
    let uniqueSlug = baseSlug;
    let counter = 1;

    // Check for existing slugs and increment the suffix until a unique one is found
    while (await mongoose.models.Product.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = uniqueSlug;
  }
  next();
});

export default mongoose.model("Product", productSchema);
