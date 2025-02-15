// index.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import db from './model/db.js'; // Import the db variable
import userRoutes from './routes/userRoutes.js'; // Import user routes
import applianceRoutes from './routes/applianceRoutes.js'; // Import appliance routes

dotenv.config(); // Load environment variables from a .env file into process.env

const app = express();
const PORT = 3000; // Localhost

app.use(cors());
app.use(bodyParser.json());

// Use the imported routes
app.use('/api', userRoutes);
app.use('/api', applianceRoutes);

const server = app.listen(PORT, '10.0.0.105', () => {
  console.log(`Server running on http://10.0.0.105:${PORT}`);
});

const shutdown = () => {
  console.log('\nShutting down gracefully...');
  if (db && typeof db.end === 'function') {
    db.end((err) => {
      if (err) console.error('Error closing database connection:', err);
      else console.log('Database connection closed.');
    });
  }

  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
