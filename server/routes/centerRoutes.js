const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middlewares/authMiddleware');
const { createCenter, addPartner, getAllCenters } = require('../controllers/centerController');

router.route('/')
  .get(getAllCenters)
  .post(protect, restrictTo('center_admin', 'super_admin'), createCenter);

router.route('/:id/add-partner')
  .put(protect, restrictTo('center_admin'), addPartner);

module.exports = router;