// /server/middleware/uploadMiddleware.js
import multer from 'multer';
import path from 'path';

// Define storage location and file name
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // Save files to the 'uploads' folder relative to the server root
    cb(null, 'uploads/'); 
  },
  filename(req, file, cb) {
    // Create unique filename: fieldname-timestamp.ext
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Define file filter for image validation
function checkFileType(file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPEG, PNG, WEBP) are allowed!'));
  }
}

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB limit
  }
});

// Export the middleware configured to handle a single file named 'image'
const uploadImage = upload.single('image');

export { uploadImage };