// File name  : applianceController.js
// Programmer : Erik Holmes
// Date       : Feb 4, 2025
// Description: This file will handle all the appliance information.
// Import the database connection

import db from '../model/db.js';

//Function    :addApplianceInformation
//Description :Function to add appliance information
export const addApplianceInformation = (req, res) => {
  const { userId, applianceName, applianceType, brand, model, warrantyExpirationDate, applianceImageURL,manualURL } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const applianceTypeValue = applianceType || null;
  const brandValue = brand || null;
  const modelValue = model || null;
  const warrantyExpirationDateValue = warrantyExpirationDate || null;
  const applianceImage = applianceImageURL || null;

  const query = `
  INSERT INTO userAppliances (userId, applianceName, applianceType, brand, model, warrantyExpirationDate, applianceImageURL, manualURL)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

db.db.query(query, [
  userId,
  applianceName,
  applianceTypeValue,
  brandValue,
  modelValue,
  warrantyExpirationDateValue,
  applianceImage,
  manualURL || null  // Ensure manualURL is always passed
], (err, result) => {
  if (err) {
    console.error('Error inserting appliance data:', err);
    return res.status(500).json({ message: 'Error inserting appliance data' });
  }

    return res.status(201).json({
      message: 'Appliance added successfully',
      applianceId: result.insertId
    });
  });

};


//Function    :listAppilanceInformation
//Description :Function to list appliance information 
export const listApplianceInformation = (req, res) => {
  const userId = req.query.userId;
  if(!userId){
    return res.status(400).json({ error: "User ID is required" });
  }
  const query = 'SELECT * FROM userAppliances WHERE userId = ?';
  db.db.query(query, [userId], (err, result) => {
    if(err)
    {
      console.error('Error fetching appliance data:', err);
      return res.status(500).json({ message: 'Error fetching appliance data' });
    }
    return res.json(result);
  });
};


//Function   :updateApplianceInformation
//Description:Function to update appliance information
export const updateApplianceInformation = (req, res) => {
  const { userID, oldApplianceInformation, newApplianceInformation } = req.body;

  // Validate the request
  if (!userID || !oldApplianceInformation || !newApplianceInformation) {
    return res.status(400).json({ error: "Invalid request. Missing parameters." });
  }

  // Ensure warrantyExpirationDate is NULL if it's an empty string
  let warrantyExpirationDate = newApplianceInformation.warrantyExpirationDate || null;

  // Construct the update query using parameterized values
  const query = `
    UPDATE userAppliances 
    SET 
      applianceName = ?, 
      applianceType = ?, 
      brand = ?, 
      model = ?, 
      warrantyExpirationDate = ?, 
      applianceImageURL = ?, 
      manualURL = ?
    WHERE 
      userId = ? 
      AND applianceName = ? 
      AND applianceType = ? 
      AND brand = ? 
      AND (model = ? OR model IS NULL)
      AND (applianceImageURL = ? OR applianceImageURL IS NULL)
      AND (manualURL = ? OR manualURL IS NULL);
`;


  // Define the values array
  const values = [
    newApplianceInformation.applianceName, 
    newApplianceInformation.applianceType, 
    newApplianceInformation.brand, 
    newApplianceInformation.model,
    warrantyExpirationDate, 
    newApplianceInformation.applianceImageURL,
    newApplianceInformation.manualURL,
    userID,  // User ID in WHERE clause
    oldApplianceInformation.applianceName, 
    oldApplianceInformation.applianceType,
    oldApplianceInformation.brand, 
    oldApplianceInformation.model, 
    oldApplianceInformation.applianceImageURL, 
    oldApplianceInformation.manualURL
  ];

  // Execute the query safely using parameterized queries
  db.db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error updating appliance information:", err);
      return res.status(500).json({ error: "Database update failed" });
    }

    if (result.affectedRows === 0) {
      console.log("Appliance not found or no changes made");
      return res.status(404).json({ error: "Appliance not found or no changes made" });
    }

    return res.status(200).json({ message: "Appliance updated successfully" });
  });
};



//Function  :deleteApplianceInformation
//Description:Function to delete appliance information
export const deleteApplianceInformation = (req, res) => {
  const { userId, applianceName, applianceType, brand, model } = req.body;

  if (!userId || !applianceName || !applianceType || !brand || !model) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    DELETE FROM userAppliances
    WHERE userId = ? AND applianceName = ? AND applianceType = ? AND brand = ? AND model = ?
  `;

  db.db.query(query, [userId, applianceName, applianceType, brand, model], (err, result) => {
    if (err) {
      console.error("Error deleting appliance:", err);
      return res.status(500).json({ error: "Database deletion failed" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appliance not found" });
    }

    return res.status(200).json({ message: "Appliance deleted successfully" });
  });
};

//Function   :saveManual
//Description:Function to save manual 
export const saveManual = (req, res) => {
  const { id, brand, model, manualUrl } = req.body;

  if (!id || !brand || !model) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  
  // Check if appliance exists using query with explicit string handling
  db.db.query(
    "SELECT * FROM userAppliances WHERE userId = ? AND brand = ? AND model = ?",
    [id, brand, model],
    (error, result) => {
      if (error) {
        console.error("Error querying appliance:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
      }

      
      // Check if result contains rows
      if (!result || result.length === 0) {
        console.log('No appliance found with the provided details.');
        return res.status(404).json({ message: "Appliance not found" });
      }

     

      // Update the manualURL in the database
      db.db.query(
        "UPDATE userAppliances SET manualURL = ? WHERE userId = ? AND brand = ? AND model = ?",
        [manualUrl, id, brand, model],
        (updateError, updateResult) => {
          if (updateError) {
            console.error("Error updating manual URL:", updateError);
            return res.status(500).json({ message: "Server error", error: updateError.message });
          }
          res.status(200).json({ message: "Manual URL updated successfully!" });
        }
      );
    }
  );
};
