const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    city: { type: String, required: true, trim: true, index: true },
    pincode: { type: String, required: true, trim: true, index: true },
    address: { type: String, required: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

hospitalSchema.index({ name: 'text', city: 'text' });

module.exports = mongoose.model('Hospital', hospitalSchema);
