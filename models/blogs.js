import mongoose from "mongoose";
import { createSlug } from "../utils/index.js";

const { Schema, model } = mongoose;

const blogSchema = new Schema(
  {
    blog_title: {
      type: String,
    },
    blog_content: {
      type: String,
      default: "",
    },
    blog_tags: {
      type: [String],
      default: [],
    },
    blog_category: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
    },
    blog_thumbnail: {
      type: String,
    },
    publish_date: {
      type: Date,
      default: Date.now,
    },
    blog_status: {
      type: String,
      default: "draft",
      enum: ["draft", "published", "scheduled"],
    },
  },
  {
    timestamps: true,
  }
);
// Pre-save hook to automatically create a unique slug
blogSchema.pre("save", async function (next) {
  if (this.isModified("blog_title") || this.isNew) {
    let baseSlug = createSlug(`${this.blog_title}`, {
      lower: true,
      strict: true,
    });
    let uniqueSlug = baseSlug;
    let counter = 1;

    // Check for existing slugs and increment the suffix until a unique one is found
    while (await mongoose.models.Blog.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = uniqueSlug;
  }
  next();
});

export default model("Blog", blogSchema);
