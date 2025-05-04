// middleware/upload.js
const multer = require("multer");
const path = require("path");

// Setare destinație și denumire fișier
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // asigură-te că ai folderul uploads/
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueName}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (isValid) {
      cb(null, true);
    } else {
      cb(new Error("Doar imaginile .jpeg, .jpg, .png, .gif sunt permise."));
    }
  },
});

module.exports = upload;
