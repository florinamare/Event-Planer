const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads";

    // Dacă e imagine pentru eveniment
    if (req.originalUrl.includes("/events")) {
      folder = "uploads/events";
    }

    // Creează folderul dacă nu exista
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueName}${ext}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5mb
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
