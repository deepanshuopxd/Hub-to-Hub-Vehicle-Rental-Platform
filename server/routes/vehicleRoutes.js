const express = require('express');
const router = express.Router();
// We import the controller functions (ensure these exist too!)
const { addVehicle, getVehicles, getVehicleById } = require('../controllers/vehicleController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

// Public routes (Searching)
router.get('/', getVehicles);
router.get('/:id', getVehicleById);

// Protected routes (Inventory Management)
// Note: We use 'protect' to ensure they are logged in, 
// and 'restrictTo' to ensure only admins can add cars.
router.post('/', protect, restrictTo('center_admin', 'super_admin'), addVehicle);

module.exports = router;