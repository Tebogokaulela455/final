// routes/applications.js
const router = require('express').Router();
const {
  apply,
  listUser,
  listAll,
  approve,
  deleteApplication,
  uploadFields
} = require('../controllers/applicationsController');
const { verifyToken } = require('../middleware/auth');
const { verifyAdmin } = require('../middleware/adminAuth');

router.post('/', verifyToken, uploadFields, apply);
router.get('/user', verifyToken, listUser);
router.get('/', verifyAdmin, listAll);
router.post('/:id/approve', verifyAdmin, approve);
// now hooks up to deleteApplication instead of reserved word
router.delete('/:id', verifyAdmin, deleteApplication);

module.exports = router;
