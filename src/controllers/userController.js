//File       : userController.js
//Programmer : Erik Holmes
//Date       : Feb 1, 2025
//Description: This file will handle all the user information.
import db from '../model/db.js';

// Save user information
export const saveUserInformation = (req, res) => {
  const { firstName, lastName, email, postalCode, country, freeAccount, accountVerified } = req.body;
  const query = 'INSERT INTO usersInformation (firstName, lastName, email, postalCode, country, freeAccount, accountVerified) VALUES (?, ?, ?, ?, ?, ?, ?)';

  db.query(query, [firstName, lastName, email, postalCode, country, freeAccount, accountVerified], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error saving user information');
      return;
    }

    console.log('User information saved successfully');
    res.status(201).send('User information saved successfully');
  });
};

// Get user profile information
export const getUserProfileInformation = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const query = `SELECT * FROM usersInformation WHERE email = ?`;

  db.db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: "Error retrieving user information" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const userInfo = {
      id: results[0].id,
      firstName: results[0].firstName,
      lastName: results[0].lastName,
      email: results[0].email,
      postalCode: results[0].postalCode,
      country: results[0].country,
      freeAccount: Boolean(results[0].freeAccount),
      accountVerified: Boolean(results[0].accountVerified)
    };

    console.log('User information:', userInfo.email);
    res.status(200).json(userInfo);
  });
};



// Function    : updateUserProfile
// Description : Updates user profile information by ID.
export const updateUserProfile = (req, res) => {
  const { id, firstName, lastName, postalCode, country, freeAccount, accountVerified } = req.body;

  if (!id) {
      return res.status(400).json({ error: "User ID is required" });
  }

  const updateQuery = `
      UPDATE usersInformation
      SET firstName = ?, lastName = ?, postalCode = ?, country = ?, freeAccount = ?, accountVerified = ?
      WHERE id = ?;
  `;

 db.db.query(updateQuery, [firstName, lastName, postalCode, country, freeAccount, accountVerified,id], (error, result) => {
      if (error) {
          console.error("Error updating user profile:", error);
          return res.status(500).json({ error: "Internal Server Error" });
      }

      if (result.affectedRows > 0) {
          return res.status(200).json({ message: "Profile updated successfully" });
      } else {
          return res.status(404).json({ error: "User not found" });
      }
  });
};
