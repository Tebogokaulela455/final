// controllers/applicationsController.js
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const db = low(new FileSync('db.json'));

exports.uploadFields = upload.fields([
  { name: 'idDoc' },
  { name: 'slc' },
  { name: 'hq' },
  { name: 'parentId' },
  { name: 'address' },
  { name: 'pace' }
]);

exports.apply = (req, res) => {
  if (
    !req.files.idDoc ||
    !req.files.slc ||
    !req.files.hq ||
    !req.files.parentId ||
    !req.files.address ||
    !req.files.pace
  ) {
    return res
      .status(400)
      .json({ message: 'All documents and pace test are required' });
  }

  const { course, qualification } = req.body;
  const email = req.user.email;
  const id = Date.now().toString();

  const app = {
    id,
    course,
    qualification,
    email,
    idDoc: req.files.idDoc[0].path,
    slc: req.files.slc[0].path,
    hq: req.files.hq[0].path,
    parentId: req.files.parentId[0].path,
    address: req.files.address[0].path,
    pace: req.files.pace[0].path,
    approved: false,
    date: new Date().toISOString()
  };

  db.get('applications').push(app).write();
  res.json({ id, message: 'Application submitted. Await approval.' });
};

exports.listUser = (req, res) => {
  const email = req.user.email;
  const apps = db.get('applications').filter({ email }).value();
  res.json(apps);
};

exports.listAll = (req, res) => {
  res.json(db.get('applications').value());
};

exports.approve = (req, res) => {
  const { id } = req.params;
  db.get('applications').find({ id }).assign({ approved: true }).write();
  res.json({ message: 'Application approved' });
};

// renamed from `delete` to `deleteApplication`
exports.deleteApplication = (req, res) => {
  const { id } = req.params;
  db.get('applications').remove({ id }).write();
  res.json({ message: 'Application deleted' });
};
