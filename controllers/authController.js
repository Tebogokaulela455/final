// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const SECRET = process.env.JWT_SECRET || 'secret';

const adapter = new FileSync('db.json');
const db = low(adapter);

exports.uploadFields = upload.fields([
  { name: 'idDoc' },
  { name: 'slc' },
  { name: 'hq' },
  { name: 'parentId' },
  { name: 'address' }
]);

exports.register = async (req, res) => {
  const { fullName, email, password } = req.body;
  if (!req.files.idDoc || !req.files.slc || !req.files.hq || !req.files.parentId || !req.files.address) {
    return res.status(400).json({ message: 'All documents are required' });
  }
  const exists = db.get('users').find({ email }).value();
  if (exists) return res.status(400).json({ message: 'Email already registered' });
  const hash = await bcrypt.hash(password, 10);
  const studentNumber = 'NCU' + Date.now();
  const user = {
    fullName,
    email,
    password: hash,
    studentNumber,
    approved: false,
    idDoc: req.files.idDoc[0].path,
    slc: req.files.slc[0].path,
    hq: req.files.hq[0].path,
    parentId: req.files.parentId[0].path,
    address: req.files.address[0].path
  };
  db.get('users').push(user).write();
  res.json({ studentNumber, message: 'Registered. Await admin approval.' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = db.get('users').find({ email }).value();
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });
  if (!user.approved) return res.status(403).json({ message: 'Awaiting approval' });
  const token = jwt.sign({ email, role: 'user' }, SECRET);
  res.json({ token, studentNumber: user.studentNumber });
};

exports.me = (req, res) => {
  const user = db.get('users').find({ email: req.user.email }).value();
  if (!user) return res.status(404).json({ message: 'User not found' });
  const { password, ...rest } = user;
  res.json(rest);
};
