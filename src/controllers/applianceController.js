// File name  : applianceController.js
// Programmer : Erik Holmes
// Date       : Feb 4, 2025
// Description: This file will handle all the appliance information.
// Import the database connection

import db from '../model/db.js';

// Function    : addApplianceInformation
// Description : Function to add appliance information
export const addApplianceInformation = async (req, res) => {
  const { userId, applianceName, applianceType, brand, model, warrantyExpirationDate, applianceImageURL, manualURL } = req.body;

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

  try {
    // Use the promise-based mysql2 query method
    const [result] = await db.db.promise().query(query, [
      userId,
      applianceName,
      applianceTypeValue,
      brandValue,
      modelValue,
      warrantyExpirationDateValue,
      applianceImage,
      manualURL || null
    ]);

    return res.status(201).json({
      message: 'Appliance added successfully',
      applianceId: result.insertId
    });

  } catch (err) {
    console.error('Error inserting appliance data:', err);
    return res.status(500).json({ message: 'Error inserting appliance data' });
  }
};



// Function    : listApplianceInformation
// Description : Function to list appliance information
export const listApplianceInformation = async (req, res) => {
  const userId = req.query.userId;
  
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const query = 'SELECT * FROM userAppliances WHERE userId = ?';

  try {
    // Use the promise-based mysql2 query method
    const [result] = await db.db.promise().query(query, [userId]);

    return res.json(result);

  } catch (err) {
    console.error('Error fetching appliance data:', err);
    return res.status(500).json({ message: 'Error fetching appliance data' });
  }
};



///^^^^^6
//fix the update function 



// Function  : deleteApplianceInformation
// Description: Function to delete appliance information
export const deleteApplianceInformation = async (req, res) => {
  const { userId, applianceName, applianceType, brand, model } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `
    DELETE FROM userAppliances
    WHERE userId = ? AND applianceName = ?
  `;

  try {
    // Execute the query safely using parameterized values
    const [result] = await db.db.promise().query(query, [userId, applianceName, applianceType, brand, model]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Appliance not found" });
    }

    return res.status(200).json({ message: "Appliance deleted successfully" });
  } catch (err) {
    console.error("Error deleting appliance:", err);
    return res.status(500).json({ error: "Database deletion failed" });
  }
};



// Function   : saveManual
// Description: Function to save manual 
export const saveManual = async (req, res) => {
  const { id, brand, model, manualUrl } = req.body;

  if (!id|| !manualUrl) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Check if appliance exists using query with explicit string handling
    const [result] = await db.db.promise().query(
      "SELECT * FROM userAppliances WHERE userId = ?",
      [id,]
    );

    // Check if result contains rows
    if (!result || result.length === 0) {
      console.log('No appliance found with the provided details.');
      return res.status(404).json({ message: "Appliance not found" });
    }

    // Update the manualURL in the database
    const [updateResult] = await db.db.promise().query(
      "UPDATE userAppliances SET manualURL = ? WHERE userId = ? AND brand = ? AND model = ?",
      [manualUrl, id, brand, model]
    );

    res.status(200).json({ message: "Manual URL updated successfully!" });

  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

  
//Function   : updateApplianceInformation
//Description: Function to update appliance information
export const updateApplianceInformation = async (req, res) => {
  const { oldApplianceInformation, newApplianceInformation } = req.body;
  const userId = oldApplianceInformation.userId;

   console.log("Old appliance information:", oldApplianceInformation);
  console.log("New appliance information:", newApplianceInformation);

  if (!userId) {
    return res.status(400).json({ error: "Invalid request. Missing parameters." });
  }

  // Convert empty strings or undefined to null
  const handleEmptyStringAsNull = (value) =>
    value === '' || value === undefined ? null : value;

  // New values
  const newApplianceName = handleEmptyStringAsNull(newApplianceInformation.applianceName);
  const newApplianceType = handleEmptyStringAsNull(newApplianceInformation.applianceType);
  const newBrand = handleEmptyStringAsNull(newApplianceInformation.brand);
  const newModel = handleEmptyStringAsNull(newApplianceInformation.model);
  const newWarrantyExpirationDate = handleEmptyStringAsNull(newApplianceInformation.warrantyExpirationDate);
  const newImageURL = handleEmptyStringAsNull(newApplianceInformation.applianceImageURL);
  const newManualURL = handleEmptyStringAsNull(newApplianceInformation.manualURL);

  // Old values (used in WHERE clause)
  const oldApplianceName = handleEmptyStringAsNull(oldApplianceInformation.applianceName);
  const oldApplianceType = handleEmptyStringAsNull(oldApplianceInformation.applianceType);

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
      AND LOWER(TRIM(applianceName)) = LOWER(TRIM(?)) 
      AND LOWER(TRIM(applianceType)) = LOWER(TRIM(?));
  `;

  const values = [
    newApplianceName,
    newApplianceType,
    newBrand,
    newModel,
    newWarrantyExpirationDate,
    newImageURL,
    newManualURL,

    userId,
    oldApplianceName,
    oldApplianceType
  ];

  try {
    const [result] = await db.db.promise().query(query, values);

    if (result.affectedRows === 0) {
      console.log("Appliance not found or no changes made");
      return res.status(404).json({ error: "Appliance not found or no changes made" });
    }

    return res.status(200).json({ message: "Appliance updated successfully" });
  } catch (err) {
    console.error("Error updating appliance information:", err);
    return res.status(500).json({ error: "Database update failed" });
  }
};




//fix manualURL to be saved and 