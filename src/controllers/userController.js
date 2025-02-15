// controllers/userController.js
import db from '../model/db.js';

// Save user information
export const saveUserInformation = (req, res) => {
  const { firstName, lastName, email, postalCode, country, freeAccount, accountVerified } = req.body;
  const query = 'INSERT INTO usersinformation (firstName, lastName, email, postalCode, country, freeAccount, accountVerified) VALUES (?, ?, ?, ?, ?, ?, ?)';

  db.db.query(query, [firstName, lastName, email, postalCode, country, freeAccount, accountVerified], (err, result) => {
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

  const query = `SELECT * FROM usersinformation WHERE email = ?`;

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
