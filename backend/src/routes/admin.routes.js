const router = require('express').Router();
const ctrl = require('../controllers/admin.controller');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

router.get('/bookings', auth, requireAdmin, ctrl.bookingsByDay);
router.get('/stats', auth, requireAdmin, ctrl.stats);

module.exports = router;
