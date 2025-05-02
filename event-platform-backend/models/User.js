const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "organizer", "pending_organizer"],
    default: "user",
  }
  
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
