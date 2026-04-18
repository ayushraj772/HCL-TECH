const router = require('express').Router();
const ctrl = require('../controllers/booking.controller');
const auth = require('../middleware/auth');

router.post('/', auth, ctrl.create);
router.get('/me', auth, ctrl.myBookings);
router.get('/:id', auth, ctrl.getById);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.cancel);

module.exports = router;
