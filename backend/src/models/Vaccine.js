const mongoose = require('mongoose');

const vaccineSchema = new mongoose.Schema(
  {
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    manufacturer: { type: String, trim: true },
    pricePerDose: { type: Number, required: true, min: 0 },
    description: { type: String, trim: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

vaccineSchema.index({ hospitalId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Vaccine', vaccineSchema);
