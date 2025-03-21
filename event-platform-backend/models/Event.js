const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['conference', 'festival', 'sport', 'workshop', 'Concert'], required: true, lowercase: true },
  date: { type: Date, required: true },
  location: {
    address: String,
    coordinates: { type: [Number], index: '2dsphere' } // [longitude, latitude]
  },
  organizer: { type: Schema.Types.ObjectId, ref: 'User' },
  tickets: [{
    type: { type: String, enum: ['VIP', 'early-bird', 'group'], required: true },
    price: Number,
    quantity: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
