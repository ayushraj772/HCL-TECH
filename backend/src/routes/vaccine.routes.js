const router = require('express').Router();
const ctrl = require('../controllers/vaccine.controller');
const auth = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

router.get('/', ctrl.list);
router.post('/', auth, requireAdmin, ctrl.create);
router.put('/:id', auth, requireAdmin, ctrl.update);
router.delete('/:id', auth, requireAdmin, ctrl.remove);

module.exports = router;
