module.exports = (io, socket) => {
  // Listen for driver location updates
  socket.on('location_update', (data) => {
    // data = { bookingId, lat, lng, speed }
    
    // Broadcast to the specific Booking Room (so the Customer sees it)
    io.to(data.bookingId).emit('track_driver', data);
    
    // Optional: Log to database if needed
    // console.log(`GPS Update for ${data.bookingId}: ${data.lat}, ${data.lng}`);
  });

  // Geofence Alert
  socket.on('geofence_breach', (data) => {
     io.to(data.bookingId).emit('alert', { 
       type: 'URGENT', 
       message: 'Vehicle has crossed state lines!' 
     });
  });
};