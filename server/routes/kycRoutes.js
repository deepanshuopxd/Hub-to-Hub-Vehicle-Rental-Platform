const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { uploadSingle } = require('../middlewares/uploadMiddleware'); // You created this earlier
const { uploadKYC } = require('../controllers/kycController');

// Route: /api/kyc/upload
// Expects form-data with key 'image'
router.post('/upload', protect, uploadSingle, uploadKYC);

module.exports = router;