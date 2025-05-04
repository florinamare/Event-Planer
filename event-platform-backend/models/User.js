// models/User.js
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "pending_organizer", "organizer", "admin"],
    default: "user",
  },
  name: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String, // Stocăm doar calea relativă sau URL-ul imaginii
    default: "", // Poate fi și un placeholder
  },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
