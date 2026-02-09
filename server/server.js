require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const connectDB = require('./config/db');
const { initSocket } = require('./sockets/socketManager');

// --- NEW IMPORTS (For KYC & Scheduled Jobs) ---
const setupJobs = require('./jobs/depositRelease'); // Cron Job
// Note: Ensure you created server/routes/kycRoutes.js previously
// const kycRoutes = require('./routes/kycRoutes'); 

// Connect to Database
connectDB();

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// --- Routes ---
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/centers', require('./routes/centerRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/vehicles', require('./routes/vehicleRoutes'));

// --- NEW: Add KYC Route ---
// (Uncomment this line once you have created the kycRoutes.js file)
// app.use('/api/kyc', require('./routes/kycRoutes'));

// --- Error Handling ---
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// --- Server Setup ---
const server = http.createServer(app);

// 1. Initialize Socket.io
initSocket(server);

// 2. Start Scheduled Jobs (Cron)
setupJobs(); 

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Socket.io is active`);
});