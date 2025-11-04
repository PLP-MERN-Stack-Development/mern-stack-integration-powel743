// /server/routes/uploadRoutes.js
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { uploadImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// @desc    Upload image file
// @route   POST /api/upload
// @access  Private (must be logged in)
router.post('/', protect, uploadImage, (req, res) => {
  if (req.file) {
    // Multer saves the file and sets req.file.path
    // We replace backslashes with forward slashes for URL compatibility
    res.send({ 
        message: 'Image uploaded successfully', 
        imagePath: `/${req.file.path.replace(/\\/g, "/")}` 
    });
  } else {
    res.status(400);
    throw new Error('No file uploaded or file type is incorrect.');
  }
});

export default router;