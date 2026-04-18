const router = require('express').Router();
const ctrl = require('../controllers/hospital.controller');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

router.get('/', ctrl.search);
router.get('/:id', ctrl.getById);
router.get('/:id/vaccines', ctrl.listVaccines);
router.get('/:id/availability', ctrl.availability);

router.post('/', auth, requireAdmin, ctrl.create);
router.put('/:id', auth, requireAdmin, ctrl.update);

module.exports = router;
