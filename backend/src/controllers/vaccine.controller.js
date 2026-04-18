const Vaccine = require('../models/Vaccine');

exports.list = async (req, res, next) => {
  try {
    const { hospitalId, name } = req.query;
    const filter = { active: true };
    if (hospitalId) filter.hospitalId = hospitalId;
    if (name) filter.name = new RegExp(name, 'i');
    const vaccines = await Vaccine.find(filter).populate('hospitalId', 'name city');
    res.json({ vaccines });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const vaccine = await Vaccine.create(req.body);
    res.status(201).json({ vaccine });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const vaccine = await Vaccine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vaccine) return res.status(404).json({ message: 'Vaccine not found' });
    res.json({ vaccine });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const vaccine = await Vaccine.findByIdAndUpdate(req.params.id, { active: false }, { new: true });
    if (!vaccine) return res.status(404).json({ message: 'Vaccine not found' });
    res.json({ vaccine });
  } catch (err) { next(err); }
};
