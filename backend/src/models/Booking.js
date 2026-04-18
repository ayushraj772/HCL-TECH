const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    vaccineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vaccine', required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
    date: { type: String, required: true, index: true },
    lockedPrice: { type: Number, required: true, min: 0 },
    patientName: { type: String, required: true, trim: true },
    patientAge: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
      index: true,
    },
    confirmationCode: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
