// controllers/adminController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const db = low(new FileSync('db.json'));
const SECRET = process.env.JWT_SECRET || 'secret';

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const admin = db.get('admin').value();
  const match = await bcrypt.compare(password, admin.passwordHash);
  if (!match || username !== admin.username) return res.status(400).json({ message: 'Invalid admin credentials' });
  const token = jwt.sign({ role: 'admin' }, SECRET);
  res.json({ token });
};

exports.listUsers = (req, res) => {
  const users = db.get('users').value();
  res.json(users);
};

exports.approveUser = (req, res) => {
  const { studentNumber } = req.params;
  db.get('users').find({ studentNumber }).assign({ approved: true }).write();
  res.json({ message: 'User approved' });
};

exports.deleteUser = (req, res) => {
  const { studentNumber } = req.params;
  db.get('users').remove({ studentNumber }).write();
  res.json({ message: 'User deleted' });
};
