//File name  : recallController.js
//Programmer : Erik Holmes
//Date       : May 10, 2025
//Description: This file will handle all the recall routes.

import db from '../model/db.js';


// Function      : getRecallListFiltered
// Description   : This function filters recalls by keyword, hazard, or date range and adds pagination.
export const getRecallListFiltered = async (req, res) => {
    const {
      search = '',
      hazard = '',
      startDate = '',
      endDate = '',
      page = 1,
      limit = 10
    } = req.query;
  
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const maxLimit = 100;
    const finalLimit = Math.min(parseInt(limit), maxLimit);
  
    let query = `SELECT * FROM recalls WHERE 1=1`;
    const params = [];
  
    // Search term
    if (search) {
      query += ` AND (product_name LIKE ? OR recall_heading LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }
  
    // Hazard term
    if (hazard) {
      query += ` AND hazard_description LIKE ?`;
      params.push(`%${hazard}%`);
    }
  
    // Date range filtering
    if (startDate && endDate) {
      query += ` AND STR_TO_DATE(recall_date, '%M %d, %Y') BETWEEN STR_TO_DATE(?, '%M %d, %Y') AND STR_TO_DATE(?, '%M %d, %Y')`;
      params.push(startDate, endDate);
    }
  
    // Pagination
    query += ` LIMIT ? OFFSET ?`;
    params.push(finalLimit, offset);
  
    try {
      const [results] = await db.db.promise().query(query, params);
      res.status(200).json(results);
    } catch (err) {
      console.error('Error fetching filtered recalls:', err);
      res.status(500).json({ error: 'Database query error' });
    }
  };
  