const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema(
  {
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true, index: true },
    vaccineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vaccine', required: true, index: true },
    date: { type: String, required: true, index: true },
    totalCapacity: { type: Number, required: true, min: 0 },
    bookedCount: { type: Number, default: 0, min: 0 },
    pricePerDose: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

slotSchema.index({ hospitalId: 1, vaccineId: 1, date: 1 }, { unique: true });

slotSchema.virtual('available').get(function () {
  return Math.max(0, this.totalCapacity - this.bookedCount);
});

slotSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Slot', slotSchema);
