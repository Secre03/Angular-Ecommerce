const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const createStorage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `uploads/${folder}`);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${uuidv4()}${ext}`);
    },
  });

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const extname = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowed.test(file.mimetype);
  if (extname && mimetype) return cb(null, true);
  cb(new Error("Only image files are allowed (jpeg, jpg, png, webp)"));
};

const limits = {
  fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024,
};

const uploadProfile = multer({
  storage: createStorage("profiles"),
  fileFilter: imageFilter,
  limits,
});
const uploadStore = multer({
  storage: createStorage("stores"),
  fileFilter: imageFilter,
  limits,
});
const uploadProduct = multer({
  storage: createStorage("products"),
  fileFilter: imageFilter,
  limits,
});

module.exports = { uploadProfile, uploadStore, uploadProduct };
