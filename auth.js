// routes/auth.js
const router = require('express').Router();
const { register, login, me, uploadFields } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', uploadFields, register);
router.post('/login', login);
router.get('/me', verifyToken, me);

module.exports = router;
