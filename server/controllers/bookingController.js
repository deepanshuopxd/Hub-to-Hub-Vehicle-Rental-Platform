const Booking = require('../models/Booking');
const RentalCenter = require('../models/RentalCenter');
const Vehicle = require('../models/Vehicle');

// @desc    Step 1: User Initiates Booking Request (A -> B)
// @route   POST /api/bookings/request
exports.createBookingRequest = async (req, res) => {
  try {
    const { vehicleId, pickupCenterId, dropoffCenterId, startDate, endDate, totalPrice } = req.body;

    // 1. Verify Centers are Partners
    const originCenter = await RentalCenter.findById(pickupCenterId);
    const isPartner = originCenter.partners.some(
      (p) => p.centerId.toString() === dropoffCenterId && p.status === 'active'
    );

    if (!isPartner && pickupCenterId !== dropoffCenterId) {
      return res.status(400).json({ message: 'These centers do not have a partnership for one-way drops.' });
    }

    // 2. Create Booking with 'pending_origin' status
    const booking = await Booking.create({
      user: req.user.id,
      vehicle: vehicleId,
      pickupCenter: pickupCenterId,
      dropoffCenter: dropoffCenterId,
      startDate,
      endDate,
      totalPrice,
      status: 'pending_origin'
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Step 2: Origin Center Approves (Handover Key)
// @route   PUT /api/bookings/:id/approve-origin
exports.approveOrigin = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    // Security: Check if req.user owns the pickup center (omitted for brevity)

    if (booking.status !== 'pending_origin') {
      return res.status(400).json({ message: 'Booking not in correct state' });
    }

    booking.status = 'pending_dest'; // Move state forward
    await booking.save();

    // OPTIONAL: Here you would emit a Socket.io event to Center B
    // io.to(booking.dropoffCenter).emit('incoming_request', booking);

    res.json({ message: 'Origin Approved. Waiting for Destination Center.', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Step 3: Destination Center Approves (Accept Incoming)
// @route   PUT /api/bookings/:id/approve-dest
exports.approveDest = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (booking.status !== 'pending_dest') {
      return res.status(400).json({ message: 'Origin center has not approved yet' });
    }

    booking.status = 'confirmed'; // Final Confirmation
    await booking.save();

    // Lock the vehicle
    await Vehicle.findByIdAndUpdate(booking.vehicle, { isAvailable: false });

    res.json({ message: 'Booking Confirmed! Trip ready.', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};