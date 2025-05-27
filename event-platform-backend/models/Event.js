const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  image: { type: String },
  title: { type: String, required: true },
  description: { type: String },
  type: {
    type: String,
    enum: [
      'conference',
      'festival',
      'sport',
      'workshop',
      'concert',
      'theatre',
      'cinema',
      'exhibition',
      'business',
      'family'
    ],
    required: true,
    lowercase: true
  },
  date: { type: Date, required: true },
  location: {
    address: String,
    coordinates: { type: [Number], index: '2dsphere' }
  },
  organizer: { type: Schema.Types.ObjectId, ref: 'User' },
  tickets: [{
    type: { type: String, required: true },
    price: Number,
    quantity: Number
  }]
}, { timestamps: true });

module.exports = mongoose.models.Event || mongoose.model('Event', EventSchema);
