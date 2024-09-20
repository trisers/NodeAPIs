import { MESSAGES } from "../constants/messages.js";
import Blog from "../models/blogs.js";
import {
  isValidMongoDbId,
  parseFormDataBody,
  validateRequestBody,
} from "../utils/index.js";

/**
 * @description Create an Blog
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const createBlog = async (req, res) => {
  try {
    const parsedBody = parseFormDataBody(req.body, ["blog_tags"]);
    parsedBody.blog_thumbnail = `uploads/blogs/${req.file.filename}`;
    const validate = validateRequestBody(
      {
        blog_title: true,
        blog_content: true,
        blog_category: true,
        blog_tags: true,
        blog_thumbnail: true,
      },
      parsedBody
    );
    if (validate) {
      return res.status(422).json({ message: validate });
    }
    let {
      blog_title,
      blog_content,
      blog_category,
      blog_tags,
      blog_thumbnail,
      publishDate,
      drafted,
    } = parsedBody;
    const newBlog = await Blog.create({
      blog_title,
      blog_content,
      blog_category,
      blog_tags,
      blog_thumbnail,
      publishDate,
      drafted,
    });
    if (!newBlog) {
      throw new Error(MESSAGES.DB_FAILURE);
    }

    res.status(201).json({ message: MESSAGES.BLOG.CREATED });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

/**
 * @description Fetch All Blogs
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page || 1);
    const pageSize = parseInt(req.query.pageSize || 10);
    const skip = (page - 1) * pageSize;

    const [result] = await Blog.aggregate([
      {
        $facet: {
          blogs: [{ $skip: skip }, { $limit: pageSize }],
          totalblogs: [{ $count: "count" }],
        },
      },
    ]);
    const blogs = result.blogs;
    const totalblogs = result.totalblogs[0]?.count || 0;
    const totalPages = Math.ceil(totalblogs / pageSize);

    res.status(200).json({
      blogs: blogs ? blogs : [],
      currentPage: page,
      totalblogs,
      nextPage: page < totalPages ? page + 1 : null,
    });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

/**
 * @description Fetch Blog By slug
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    if (!slug) {
      return res.status(400).json({ message: MESSAGES.BLOG.MISSING_SLUG });
    }

    const blog = await Blog.findOne({ slug });
    if (!blog) {
      return res.status(404).json({ message: MESSAGES.BLOG.NOT_FOUND });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
/**
 * @description Update Blog By id
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!req.body) {
      return res.send("body not found");
    }

    const parsedBody = parseFormDataBody(req.body, ["blog_tags"]);

    if (!id) {
      return res.status(400).json({ message: MESSAGES.BLOG.MISSING_ID });
    }
    if (!isValidMongoDbId(id)) {
      return res.status(400).json({ message: MESSAGES.BLOG.INVALID_ID });
    }
    if (req?.file && req?.file.filename) {
      blog_thumbnail = `/uploads/blogs/${file.filename}`;
    }
    const {
      blog_title,
      blog_content,
      blog_category,
      blog_tags,
      blog_thumbnail,
      drafted,
      publishDate,
    } = parsedBody;

    const updateBlog = await Blog.findByIdAndUpdate(
      id,
      {
        blog_title,
        blog_content,
        blog_category,
        blog_tags,
        blog_thumbnail,
        drafted,
        publishDate,
      },
      { new: true }
    );

    if (!updateBlog) {
      return res.status(404).json({ message: MESSAGES.BLOG.NOT_FOUND });
    }

    res.status(200).json(updateBlog);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: MESSAGES.BLOG.DUPLICATE_ENTRIES,
        value: error.keyValue,
      });
    }
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};

/**
 * @description Delete Blog By ID
 * @param {Express.Request} req - The request object.
 * @param {Express.Response} res - The response object.
 * @returns {Promise<void>}
 */
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: MESSAGES.BLOG.MISSING_ID });
    }
    if (!isValidMongoDbId(id)) {
      return res.status(400).json({ message: MESSAGES.BLOG.INVALID_ID });
    }
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ message: MESSAGES.BLOG.NOT_FOUND });
    }

    res.status(200).json({
      message: MESSAGES.BLOG.DELETED,
    });
  } catch (error) {
    res.status(500).json({ message: MESSAGES.SERVER_ERROR });
  }
};
