// routes/admin.js
const router = require('express').Router();
const { login, listUsers, approveUser, deleteUser } = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/adminAuth');

router.post('/login', login);
router.get('/users', verifyAdmin, listUsers);
router.post('/users/:studentNumber/approve', verifyAdmin, approveUser);
router.delete('/users/:studentNumber', verifyAdmin, deleteUser);

module.exports = router;
