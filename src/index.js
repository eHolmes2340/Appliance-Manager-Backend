// File : index.js 
// Description: This file is the entry point of the application. It creates an Express server.

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import db from './model/db.js'; // Import the db variable

dotenv.config(); // Load environment variables from a .env file into process.env

const app = express();
const PORT = 3000; // Localhost

app.use(cors());
app.use(bodyParser.json());




// Start the server and store the server instance
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);

});



//Send data to the database  
// Create a POST endpoint to save user information
app.post('/usersInformation', (req, res) => {
  const { firstName, lastName, email, postalCode, country, freeAccount, accountVerified } = req.body;

  const query = 'INSERT INTO usersinformation (firstName, lastName, email, postalCode, country, freeAccount, accountVerified) VALUES (?, ?, ?, ?, ?, ?, ?)';

  // console.log('Saving user information:', req.body); //data being sent to the database
  // Use db.query() with a pool
  db.db.query(query, [firstName, lastName, email, postalCode, country, freeAccount, accountVerified], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error saving user information');
      return;
    }

    console.log('User information saved successfully');
    res.status(201).send('User information saved successfully');
  });
});


app.post('/userProfileInformation', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const query = `SELECT * FROM usersinformation WHERE email = ?`;

  db.db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: "Error retrieving user information" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log('User information retrieved successfully');

    // Convert database fields to match Flutter's expectations
    const userInfo = {
      firstName: results[0].firstName,
      lastName: results[0].lastName,
      email: results[0].email,
      postalCode: results[0].postalCode,
      country: results[0].country,
      freeAccount: Boolean(results[0].freeAccount), // Convert to boolean
      accountVerified: Boolean(results[0].accountVerified) // Convert to boolean
    };

    res.status(200).json(userInfo);
  });
});





// Graceful shutdown function
const shutdown = () => {
  console.log('\nShutting down gracefully...');
  
  // If the database has a close or end method, call it
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

// Handle termination signals
process.on('SIGINT', shutdown); // Handle Ctrl+C
process.on('SIGTERM', shutdown); // Handle termination signals
