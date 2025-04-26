// controllers/coursesController.js
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = low(new FileSync('db.json'));

exports.getAll = (req, res) => {
  res.json(db.get('courses').value());
};
