//File name  : recallController.js
//Programmer : Erik Holmes
//Date       : May 10, 2025
//Description: This file will handle all the recall routes.

import db from '../model/db.js';


// Function      : getRecallListFiltered
// Description   : This function filters recalls by keyword, hazard, or date range and adds pagination.
export const getRecallListFiltered = (req, res) =>{
    const { search = '', hazard = '', startDate = '', endDate = '', page = 1, limit = 10 } = req.query;

    // Ensure page and limit are integers
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const maxLimit = 100; // Optional: You can set a max limit to prevent users from fetching too many rows
    const finalLimit = Math.min(parseInt(limit), maxLimit);

    let query = `SELECT * FROM recalls WHERE 1=1`; 
    const params = [];

    // Add search condition
    if (search) {
        query += ` AND (product_name LIKE ? OR recall_heading LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }

    // Add hazard condition
    if (hazard) {
        query += ` AND hazard_description LIKE ?`;
        params.push(`%${hazard}%`);
    }

    // Add date range condition
    if (startDate && endDate) {
        query += ` AND STR_TO_DATE(recall_date, '%M %d, %Y') BETWEEN STR_TO_DATE(?, '%M %d, %Y') AND STR_TO_DATE(?, '%M %d, %Y')`;
        params.push(startDate, endDate);
    }

    // Add pagination to the query
    query += ` LIMIT ? OFFSET ?`;
    params.push(finalLimit, offset);

    db.db.query(query, params, (err, results) => {
        if (err) {
            console.error('Error fetching filtered recalls:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        res.json(results);
    });
};



