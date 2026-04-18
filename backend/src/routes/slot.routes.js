const router = require('express').Router();
const ctrl = require('../controllers/slot.controller');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

router.get('/', ctrl.list);
router.post('/', auth, requireAdmin, ctrl.upsert);
router.put('/:id', auth, requireAdmin, ctrl.update);

module.exports = router;
