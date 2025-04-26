// routes/courses.js
const router = require('express').Router();
const { getAll } = require('../controllers/coursesController');

router.get('/', getAll);

module.exports = router;
