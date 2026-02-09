const Vehicle = require('../models/Vehicle');

// @desc    Add a new vehicle
// @route   POST /api/vehicles
// @access  Private (Center Admin)
exports.addVehicle = async (req, res) => {
  try {
    const { 
      make, model, type, regNumber, basePrice, 
      homeLocation, currentLocation, images 
    } = req.body;

    const vehicle = await Vehicle.create({
      make,
      model,
      type,
      regNumber,
      basePrice,
      homeLocation,     // ID of the center where it belongs
      currentLocation,  // ID of where it is physically right now
      images
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get vehicles (with "Return Load" logic)
// @route   GET /api/vehicles?city=Delhi&dest=Jaipur
exports.getVehicles = async (req, res) => {
  try {
    const { city, dest } = req.query; // e.g. ?city=Mumbai&dest=Pune

    // 1. Find vehicles currently sitting in the Origin City (via Center lookups)
    // Note: In a real app, you'd query RentalCenters first to get IDs for "Mumbai"
    // For simplicity, we assume the frontend sends the 'currentLocation' Center ID.
    let query = {};
    if (req.query.centerId) {
      query.currentLocation = req.query.centerId;
    }
    
    query.isAvailable = true;

    let vehicles = await Vehicle.find(query)
      .populate('homeLocation', 'name city')
      .populate('currentLocation', 'name city');

    // 2. The "Return Load" Algorithm
    const processedVehicles = vehicles.map(vehicle => {
      const v = vehicle.toObject();
      
      // Logic: If vehicle is NOT at home, and user wants to go to its home
      const isDisplaced = v.homeLocation._id.toString() !== v.currentLocation._id.toString();
      const isGoingHome = dest && v.homeLocation.city === dest;

      if (isDisplaced && isGoingHome) {
        v.isReturnTrip = true;
        v.discountedPrice = v.basePrice * 0.70; // 30% Discount
        v.tag = "RETURN HERO DEAL";
      } else {
        v.isReturnTrip = false;
        v.finalPrice = v.basePrice;
      }
      return v;
    });

    res.json(processedVehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single vehicle details
// @route   GET /api/vehicles/:id
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};