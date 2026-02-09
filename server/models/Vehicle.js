const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  make: { type: String, required: true }, // e.g., Maruti
  model: { type: String, required: true }, // e.g., Swift
  type: { 
    type: String, 
    enum: ['car', 'bike', 'scooter'], 
    required: true 
  },
  regNumber: { type: String, required: true, unique: true },
  
  // Pricing
  basePrice: { type: Number, required: true }, // Per day rate
  pricePerKm: { type: Number, default: 0 },
  
  // Location Logic (The Core of your USP)
  homeLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RentalCenter',
    required: true
  },
  currentLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RentalCenter',
    required: true
  },
  
  // Status
  isAvailable: { type: Boolean, default: true },
  status: {
    type: String,
    enum: ['available', 'booked', 'maintenance', 'in-transit'],
    default: 'available'
  },
  
  // Visuals & Condition
  images: [String], // Array of URLs
  damages: [String], // List of existing scratches/dents
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);