// index.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import db from './model/db.js'; // Import the db variable
import userRoutes from './routes/userRoutes.js'; // Import user routes
import applianceRoutes from './routes/applianceRoutes.js'; // Import appliance routes
import health from './routes/health.js'; // Import health routes

//Local host
// LOCAL_HOST= http://10.0.0.105
// PORT_NUMBER=3000


//This is for cloud 
//Port number = 8080 
//Local host = 0.0.0.0

dotenv.config(); // Load environment variables from a .env file into process.env

const app = express();
const PORT = 8080; // Localhost

app.use(cors());
app.use(bodyParser.json());

// Use the imported routes
app.use('/api', userRoutes);
app.use('/api', applianceRoutes);
app.use('/api',health);

const server = app.listen(PORT, '34.121.172.202', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
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
