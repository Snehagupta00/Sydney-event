const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    email: { type: String, required: true },
    consent: { type: Boolean, required: true },
    eventRef: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    eventTitle: { type: String },
    originalUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Lead', LeadSchema);
