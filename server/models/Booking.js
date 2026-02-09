const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  
  // Trip Details
  pickupCenter: { type: mongoose.Schema.Types.ObjectId, ref: 'RentalCenter', required: true },
  dropoffCenter: { type: mongoose.Schema.Types.ObjectId, ref: 'RentalCenter', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  
  // The "Handshake" State Machine
  status: {
    type: String,
    enum: ['pending_origin', 'pending_dest', 'confirmed', 'active', 'completed', 'cancelled'],
    default: 'pending_origin'
  },

  // Financials
  totalPrice: { type: Number, required: true },
  securityDeposit: { type: Number, default: 5000 },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },

  // Dispute Resolution Layer
  preTripPhotos: [String],  // URLs
  postTripPhotos: [String], // URLs
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);