const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { createBookingRequest, approveOrigin, approveDest } = require('../controllers/bookingController');

// User routes
router.post('/request', protect, createBookingRequest);

// Vendor/Admin routes (Approvals)
router.put('/:id/approve-origin', protect, restrictTo('center_admin'), approveOrigin);
router.put('/:id/approve-dest', protect, restrictTo('center_admin'), approveDest);

module.exports = router;