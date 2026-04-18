const Booking = require('../models/Booking');
const Slot = require('../models/Slot');

exports.bookingsByDay = async (req, res, next) => {
  try {
    const { date, hospitalId } = req.query;
    const filter = {};
    if (date) filter.date = date;
    if (hospitalId) filter.hospitalId = hospitalId;
    const bookings = await Booking.find(filter)
      .populate('hospitalId', 'name')
      .populate('vaccineId', 'name')
      .populate('userId', 'name email phone');
    res.json({ bookings });
  } catch (err) { next(err); }
};

exports.stats = async (req, res, next) => {
  try {
    const [totalBookings, totalSlots] = await Promise.all([
      Booking.countDocuments({ status: 'confirmed' }),
      Slot.countDocuments(),
    ]);
    res.json({ totalBookings, totalSlots });
  } catch (err) { next(err); }
};
