const RentalCenter = require('../models/RentalCenter');

// @desc    Create a new Rental Center
// @route   POST /api/centers
// @access  Private (Super Admin or Center Admin)
exports.createCenter = async (req, res) => {
  try {
    const { name, address, city, lat, lng } = req.body;

    const center = await RentalCenter.create({
      name,
      address,
      city,
      location: {
        type: 'Point',
        coordinates: [lng, lat] // MongoDB expects [Longitude, Latitude]
      },
      owner: req.user.id
    });

    res.status(201).json(center);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a Partner Center (Form a "Hub")
// @route   PUT /api/centers/:id/add-partner
// @access  Private (Owner only)
exports.addPartner = async (req, res) => {
  try {
    const center = await RentalCenter.findById(req.params.id);
    const { partnerCenterId } = req.body; // The ID of the center to partner with

    if (!center) return res.status(404).json({ message: 'Center not found' });

    // Check if already partners
    const alreadyPartner = center.partners.find(
      (p) => p.centerId.toString() === partnerCenterId
    );

    if (alreadyPartner) {
      return res.status(400).json({ message: 'Already partners' });
    }

    // Add partnership
    center.partners.push({ centerId: partnerCenterId, status: 'active' });
    await center.save();

    res.status(200).json({ message: 'Partner added successfully', center });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all centers
// @route   GET /api/centers
exports.getAllCenters = async (req, res) => {
  try {
    const centers = await RentalCenter.find().populate('partners.centerId', 'name city');
    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};