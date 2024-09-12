import mongoose, { Schema } from "mongoose";
import { createSlug } from "../utils/index.js";

const collectionSchema = new Schema(
  {
    collection_name: {
      type: String,
      required: [true, "Collection name is required."],
      trim: true,
    },
    slug: {
      type: String,
    },
    collection_description: {
      type: String,
      required: [true, "Collection description is required."],
      trim: true,
    },
    collection_products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
    ],

    collection_tags: {
      type: [String],
      default: [],
    },
    collection_image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Pre-save hook to automatically create a unique slug
collectionSchema.pre("save", async function (next) {
  if (this.isModified("collection_name") || this.isNew) {
    let baseSlug = createSlug(`${this.collection_name}`, {
      lower: true,
      strict: true,
    });
    let uniqueSlug = baseSlug;
    let counter = 1;

    // Check for existing slugs and increment the suffix until a unique one is found
    while (await mongoose.models.Collection.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = uniqueSlug;
  }
  next();
});

export default mongoose.model("Collection", collectionSchema);
