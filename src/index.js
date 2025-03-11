// index.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import db from './model/db.js'; // Import the db variable
import userRoutes from './routes/userRoutes.js'; // Import user routes
import applianceRoutes from './routes/applianceRoutes.js'; // Import appliance routes



//Local host
//This is for cloud 
//Port number = 8080 
//const localhost = '0.0.0.0';

const app = express();
//Google cloud
// const PORT = 8080; // Localhost
// const googleIPAddress='0.0.0.0'

const localhost='127.0.0.1'; 
//const localhost='127.0.0.1'; 
const PORT=3000
app.use(cors());
app.use(bodyParser.json());

// Use the imported routes
app.use('/api', userRoutes);
app.use('/api', applianceRoutes);
//app.use('/api', recallRoutes); //This is for the recall 


const server = app.listen(PORT, localhost, () => {
  console.log(`Server running on http://${localhost}:${PORT}`);
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
