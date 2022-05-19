const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, `${new Date().toISOString()}-${file.originalname}`);
  }
});
const fileFilterPdf = (req, file, cb) => {
    const filter = (file.mimetype === 'text/plain') ? cb(null, true) : cb(new Error('Wrong file type'))
    return filter
  }
const fileUpload = multer({ storage: storage, fileFilter: fileFilterPdf });
module.exports = {  fileUpload };