const Slot = require('../models/Slot');

exports.list = async (req, res, next) => {
  try {
    const { hospitalId, vaccineId, date } = req.query;
    const filter = {};
    if (hospitalId) filter.hospitalId = hospitalId;
    if (vaccineId) filter.vaccineId = vaccineId;
    if (date) filter.date = date;
    const slots = await Slot.find(filter)
      .populate('hospitalId', 'name')
      .populate('vaccineId', 'name pricePerDose');
    res.json({ slots });
  } catch (err) { next(err); }
};

exports.upsert = async (req, res, next) => {
  try {
    const { hospitalId, vaccineId, date, totalCapacity, pricePerDose } = req.body;
    const slot = await Slot.findOneAndUpdate(
      { hospitalId, vaccineId, date },
      { $set: { totalCapacity, pricePerDose }, $setOnInsert: { bookedCount: 0 } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(201).json({ slot });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const slot = await Slot.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    res.json({ slot });
  } catch (err) { next(err); }
};
