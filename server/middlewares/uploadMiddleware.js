const multer = require('multer');
const path = require('path');

// Configure storage (Memory storage is best for Cloudinary uploads)
const storage = multer.memoryStorage();

// Filter to accept only images
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Export single file upload (e.g., 'image') and multiple (e.g., 'photos')
module.exports = {
  uploadSingle: upload.single('image'),
  uploadMultiple: upload.array('photos', 5)
};