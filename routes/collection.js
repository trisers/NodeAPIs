import express from "express";

import {
  createCollection,
  deleteCollection,
  getAllCollections,
  getCollection,
  updateCollection,
} from "../controllers/collection.js";
import { verifySuperAdminToken } from "../middlewares/superadmin.js";

const router = express.Router();

router.post("/", verifySuperAdminToken, createCollection);
router.get("/", verifySuperAdminToken, getAllCollections);

router.get("/:collection_id", getCollection);
router.put("/:collection_id", updateCollection);
router.delete("/:collection_id", deleteCollection);

export default router;
