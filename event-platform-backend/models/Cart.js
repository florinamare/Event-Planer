// cart.js (MODEL)
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartItemSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: "Event" },
  type: String,
  quantity: Number,
  price: Number, //  Adaugă acest camp
});

const CartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: [CartItemSchema],
});

module.exports = mongoose.model("Cart", CartSchema);
