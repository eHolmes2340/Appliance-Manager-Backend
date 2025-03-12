// index.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';

import db from './model/db.js'; // Import the db variable
import userRoutes from './routes/userRoutes.js'; // Import user routes
import applianceRoutes from './routes/applianceRoutes.js'; // Import appliance routes
import {startDownload} from './common/downloadCSV.js'; // Import the startDownload function

startDownload(); 
//Local host
//This is for cloud 
//Port number = 8080 
//const localhost = '0.0.0.0';


//startDownload(); 

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



const server = app.listen(PORT, localhost, () => {
  console.log(`Server running on http://${localhost}:${PORT}`);
});
const shutdown = () => {
  console.log('\nShutting down gracefully...');
  
  const connection = db.db;
  
  // Drop the 'recalls' table
  const dropTableQuery = 'DROP TABLE IF EXISTS recalls';
  
  connection.query(dropTableQuery, (err, result) => {
    if (err) {
      console.error('Error dropping table:', err);
    } else {
      console.log('Table "recalls" dropped successfully.');
    }

    // Delete the CSV file (recalls.csv)
    const csvFilePath = path.join('./', 'recalls.csv');
    fs.unlink(csvFilePath, (err) => {
      if (err) {
        console.error('Error deleting CSV file:', err);
      } else {
        console.log('CSV file deleted successfully.');
      }
    });

    // Close the database connection
    if (db && typeof db.end === 'function') {
      db.end((err) => {
        if (err) {
          console.error('Error closing database connection:', err);
        } else {
          console.log('Database connection closed.');
        }
      });
    }

    // Shut down the server
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });
};

// Handle termination signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
