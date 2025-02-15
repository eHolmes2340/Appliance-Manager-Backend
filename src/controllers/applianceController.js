// controllers/applianceController.js
import db from '../model/db.js';

export const addApplianceInformation = (req, res) => {
  const { userId, applianceName, applianceType, brand, model, warrantyExpirationDate, applianceImageURL } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const applianceTypeValue = applianceType || null;
  const brandValue = brand || null;
  const modelValue = model || null;
  const warrantyExpirationDateValue = warrantyExpirationDate || null;
  const applianceImage = applianceImageURL || null;

  const query = `
    INSERT INTO userAppliances (userId, applianceName, applianceType, brand, model, warrantyExpirationDate, applianceImageURL)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.db.query(query, [
    userId,
    applianceName,
    applianceTypeValue,
    brandValue,
    modelValue,
    warrantyExpirationDateValue,
    applianceImage
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
