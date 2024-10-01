import express from "express";

import {
  createCollection,
  deleteCollection,
  getAllCollections,
  getCollection,
  updateCollection,
} from "../controllers/collection.js";
import { verifySuperAdminToken } from "../middlewares/superadmin.js";
import { createMulter } from "../config/multer.js";

const router = express.Router();
const UploadCollectionImage = createMulter("uploads/collections");

// SUPERADMIN
router.post(
  "/",
  verifySuperAdminToken,
  UploadCollectionImage.single("image"),
  createCollection
);
router.get("/", verifySuperAdminToken, getAllCollections);
router.put(
  "/:collection_id",
  verifySuperAdminToken,
  UploadCollectionImage.single("image"),
  updateCollection
);
router.delete("/:collection_id", deleteCollection);

// USER
router.get("/:collection_id", getCollection);

export default router;
