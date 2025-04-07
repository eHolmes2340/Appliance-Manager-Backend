//File      : dashboardControllers.js
//Programmer : Erik Holmes
//Date       : Mar 28, 2025
//Description: This file will handle all the routes for the dashboard information.

import db from "../model/db.js";

// Function    : getApplianceInformationForDashboard
// Description : Function to get appliance information for dashboard
export const getApplianceInformationForDashboard = async (req, res) => {
    const userId = req.query.userID; // Get the userID from the query parameter

    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    try {
        // Use mysql2 promise API to query the database asynchronously
        const [rows] = await db.db.promise().query(
            'SELECT * FROM userAppliances WHERE userId = ? LIMIT 4',
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "No appliances found for this user" });
        }

        // Send the appliance data in the response
        res.json(rows);
    } catch (err) {
        console.error("Error fetching appliance information:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};


// Function      : getRecallInformationForDashboard
// Description   : Function to get recall information for dashboard
export const getRecallInformationForDashboard = async (req, res) => {
    try {
        // Use mysql2 promise API to query the database asynchronously
        const [rows] = await db.db.promise().query("SELECT * FROM last5recalls");

        if (!rows || rows.length === 0) {
            return res.status(404).json({ error: "No recall information found" });
        }

        // Send the recall information in the response
        res.json(rows);
    } catch (err) {
        console.error("Error fetching recall information:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

