import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import readline from 'readline'; // Import readline module

import db from './model/db.js'; // Import the db variable
import userRoutes from './routes/userRoutes.js'; // Import user routes
import applianceRoutes from './routes/applianceRoutes.js'; // Import appliance routes
import recallRoutes from './routes/recallRoutes.js'; // Import recall routes
import { startDownload } from './common/downloadCSV.js'; // Import the startDownload function
import notificationRoutes from './routes/notificationRoutes.js'; // Import notification routes

startDownload(); 

const app = express();

// Network configuration
//google cloud 
const ipAddress='34.172.208.51'; 
//const ipAddress = '10.0.0.215'; 
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Use the imported routes
app.use('/api', userRoutes);
app.use('/api', applianceRoutes);
app.use('/api', recallRoutes);
app.use('/api', notificationRoutes);

// Listen for requests on the defined port
const server = app.listen(PORT, ipAddress, () => {
  console.log(`Server running on http://${ipAddress}:${PORT}`);
});

// Command-line interface setup
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to reload the .csv file
const reloadCSVFile = () => {
  console.log('Reloading CSV file...');
  startDownload(); // This is assuming startDownload triggers a reload of the CSV file
  console.log('CSV file reloaded successfully.');
};

// Listen for 'update list' command
rl.on('line', (input) => {
  if (input === 'update list') {
    reloadCSVFile(); // Reload CSV file when command is entered 
    console.log('Command "update list" executed.');
  }
});

// Graceful shutdown
const shutdown = () => {
  console.log('\nShutting down gracefully...');
  
  // Ensure db.db is the correct active connection
  const connection = db.db;

  // Check if the connection is valid
  if (!connection) {
    console.error('Database connection not available!');
    return;
  }
  
  // Log the query being executed
  const truncateTableQuery = 'TRUNCATE TABLE recalls';
  console.log('Executing Query:', truncateTableQuery);
  
  connection.query(truncateTableQuery, (err, result) => {
    if (err) {
      console.error('Error truncating table:', err);
    } else {
      console.log('Table "recalls" truncated successfully.');
    }

    // Delete the CSV file (recalls.csv)
    const csvFilePath = path.join('./', 'recalls.csv');
    fs.unlink(csvFilePath, (err) => {
      if (err && err.code !== 'ENOENT') {  // Ignore error if file doesn't exist
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
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
    
  // Shut down the server
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};

// Handle termination signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
