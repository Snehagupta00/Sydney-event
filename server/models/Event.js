const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: String },
  eventDate: { type: Date },
  time: { type: String },
  venue: { type: String },
  address: { type: String },
  city: { type: String, default: 'Sydney' },
  description: { type: String },
  summary: { type: String },
  category: { type: [String] },
  imageUrl: { type: String },
  sourceName: { type: String },
  originalUrl: { type: String, unique: true },
  lastScrapedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['new', 'updated', 'inactive', 'imported'],
    default: 'new'
  },
  importedAt: { type: Date },
  importedBy: { type: String },
  importNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
