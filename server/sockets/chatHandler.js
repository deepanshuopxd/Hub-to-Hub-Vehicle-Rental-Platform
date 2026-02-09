module.exports = (io, socket) => {
  socket.on('join_chat', (bookingId) => {
    socket.join(bookingId);
  });

  socket.on('send_message', (data) => {
    // data = { bookingId, senderId, text, timestamp }
    
    // Send to everyone in the room EXCEPT sender (optional, or send to all)
    socket.to(data.bookingId).emit('receive_message', data);
  });

  // Vendor sends a "Revised Offer" card
  socket.on('send_offer', (data) => {
    io.to(data.bookingId).emit('receive_offer', {
      newPrice: data.price,
      validUntil: data.validUntil
    });
  });
};