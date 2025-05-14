// models/Ticket.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TicketSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  eventTitle: String,
  ticketType: { type: String, required: true }, // AICI ESTE PROBLEMA
  quantity: Number,
  price: Number,
});


module.exports = mongoose.model("Ticket", TicketSchema);
