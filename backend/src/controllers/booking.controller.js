const crypto = require('crypto');
const Slot = require('../models/Slot');
const Booking = require('../models/Booking');

function makeCode() {
  return 'VX-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

exports.create = async (req, res, next) => {
  try {
    const { hospitalId, vaccineId, date, patientName, patientAge } = req.body;

    const slot = await Slot.findOneAndUpdate(
      { hospitalId, vaccineId, date, $expr: { $lt: ['$bookedCount', '$totalCapacity'] } },
      { $inc: { bookedCount: 1 } },
      { new: true }
    );

    if (!slot) {
      return res.status(409).json({ message: 'No slots available for the selected date' });
    }

    const booking = await Booking.create({
      userId: req.user.id,
      hospitalId,
      vaccineId,
      slotId: slot._id,
      date,
      lockedPrice: slot.pricePerDose,
      patientName,
      patientAge,
      confirmationCode: makeCode(),
    });

    res.status(201).json({ booking });
  } catch (err) { next(err); }
};

exports.myBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('hospitalId', 'name city')
      .populate('vaccineId', 'name')
      .sort({ date: -1 });
    res.json({ bookings });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hospitalId', 'name city address')
      .populate('vaccineId', 'name');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (String(booking.userId) !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json({ booking });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (String(booking.userId) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    const { patientName, patientAge } = req.body;
    if (patientName) booking.patientName = patientName;
    if (patientAge != null) booking.patientAge = patientAge;
    await booking.save();
    res.json({ booking });
  } catch (err) { next(err); }
};

exports.cancel = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (String(booking.userId) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
    if (booking.status === 'cancelled') return res.json({ booking });
    booking.status = 'cancelled';
    await booking.save();
    await Slot.findByIdAndUpdate(booking.slotId, { $inc: { bookedCount: -1 } });
    res.json({ booking });
  } catch (err) { next(err); }
};
