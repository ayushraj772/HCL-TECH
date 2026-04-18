const Hospital = require('../models/Hospital');
const Vaccine = require('../models/Vaccine');
const Slot = require('../models/Slot');

exports.search = async (req, res, next) => {
  try {
    const { city, pincode, name, vaccine, maxPrice } = req.query;
    const filter = { active: true };
    if (city) filter.city = new RegExp(`^${city}$`, 'i');
    if (pincode) filter.pincode = pincode;
    if (name) filter.name = new RegExp(name, 'i');

    let hospitals = await Hospital.find(filter).lean();

    if (vaccine || maxPrice) {
      const vFilter = { active: true };
      if (vaccine) vFilter.name = new RegExp(vaccine, 'i');
      if (maxPrice) vFilter.pricePerDose = { $lte: Number(maxPrice) };
      const vaccines = await Vaccine.find(vFilter).lean();
      const hospitalIds = new Set(vaccines.map(v => String(v.hospitalId)));
      hospitals = hospitals.filter(h => hospitalIds.has(String(h._id)));
    }

    res.json({ hospitals });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
    res.json({ hospital });
  } catch (err) { next(err); }
};

exports.listVaccines = async (req, res, next) => {
  try {
    const vaccines = await Vaccine.find({ hospitalId: req.params.id, active: true });
    res.json({ vaccines });
  } catch (err) { next(err); }
};

exports.availability = async (req, res, next) => {
  try {
    const { from, to, vaccineId } = req.query;
    const filter = { hospitalId: req.params.id };
    if (vaccineId) filter.vaccineId = vaccineId;
    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = from;
      if (to) filter.date.$lte = to;
    }
    const slots = await Slot.find(filter).populate('vaccineId', 'name pricePerDose').sort({ date: 1 });
    res.json({ slots });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const hospital = await Hospital.create(req.body);
    res.status(201).json({ hospital });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hospital) return res.status(404).json({ message: 'Hospital not found' });
    res.json({ hospital });
  } catch (err) { next(err); }
};
