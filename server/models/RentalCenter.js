const mongoose = require('mongoose');

const rentalCenterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  
  // GeoJSON for Mapbox/Google Maps integration
  location: {
    type: {
      type: String,
      enum: ['Point'], 
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [Longitude, Latitude]
      required: true
    }
  },

  // The Owner of this center
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Inventory Management
  availableVehicles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  }],

  // The Partnership Network (Crucial for Hub-to-Hub)
  partners: [{
    centerId: { type: mongoose.Schema.Types.ObjectId, ref: 'RentalCenter' },
    status: { type: String, enum: ['pending', 'active'], default: 'pending' }
  }],

  createdAt: { type: Date, default: Date.now }
});

// Create a geospatial index so we can search "find centers within 5km"
rentalCenterSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('RentalCenter', rentalCenterSchema);