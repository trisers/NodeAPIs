// multerConfig.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Multer instance with custom folder
export const createMulter = (folder) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, `../${folder}`);

      // Create folder if it doesn't exist
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      cb(null, `${basename}-${Date.now()}${ext}`);
    },
  });

  return multer({ storage });
};

// Upload multiple files using single field
export const uploadMultipleFiles = (folder, fieldName, maxCount) => {
  const upload = createMulter(folder);
  return upload.array(fieldName, maxCount);
};

// Function to handle file uploads from multiple fields
export const uploadFilesFromMultipleFields = (folder, fields) => {
  const upload = createMulter(folder);
  return upload.fields(fields);
};
