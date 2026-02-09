const cron = require('node-cron');
const Booking = require('../models/Booking');
const User = require('../models/User');

const setupJobs = () => {
  // Schedule: Run every day at midnight ('0 0 * * *')
  cron.schedule('0 0 * * *', async () => {
    console.log('--- CRON: Checking for Deposits to Release ---');
    
    // Find bookings completed > 24 hours ago, strictly 'completed', not yet refunded
    const cutoffDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    const bookingsToRefund = await Booking.find({
      status: 'completed',
      paymentStatus: 'paid', // Assuming 'paid' means deposit is held
      endDate: { $lte: cutoffDate }
    });

    for (const booking of bookingsToRefund) {
      // 1. Release logic
      const user = await User.findById(booking.user);
      if (user) {
        user.wallet.frozenAmount -= booking.securityDeposit;
        user.wallet.balance += booking.securityDeposit; // Move back to main balance
        await user.save();
        
        // 2. Update Booking
        booking.paymentStatus = 'refunded'; // Or 'deposit_released'
        await booking.save();
        
        console.log(`Refunded deposit for Booking ${booking._id}`);
      }
    }
  });
};

module.exports = setupJobs;