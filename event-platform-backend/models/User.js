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
    type: String, // Stocam doar calea relativa sau URL-ul imaginii
    default: "", //mplaceholder
  },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
