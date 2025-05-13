const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  type: { type: String, required: true }, // ex: VIP, early-bird etc.
  quantity: { type: Number, required: true },
});

const cartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
