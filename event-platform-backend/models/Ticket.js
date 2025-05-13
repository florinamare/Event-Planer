// models/Ticket.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  ticketType: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Ticket", TicketSchema);
