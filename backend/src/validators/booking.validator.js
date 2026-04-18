const { body } = require('express-validator');

exports.createBooking = [
  body('hospitalId').isMongoId(),
  body('vaccineId').isMongoId(),
  body('date').isISO8601(),
  body('patientName').isString().trim().notEmpty(),
  body('patientAge').isInt({ min: 0, max: 120 }),
];
