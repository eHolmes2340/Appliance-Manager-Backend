import axios from 'axios';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import db from '../model/db.js'; // Import MySQL connection

const CSV_URL = 'https://www.cpsc.gov/product_recalls_download?tabset=on&search_combined_fields=&field_rc_date_value=&field_rc_date_value_1=&field_rc_hazards_target_id=All&field_rc_recall_by_product_target_id=187&field_rc_manufactured_in_value=&tab=csv&page&_format=csv';
const FILE_PATH = path.join('./', 'recalls.csv'); // Save file locally

//Function    : startDownload
//Arguments   : None
//Description : This function downloads the CSV file from the provided URL.
export async function startDownload() {
    try {
        console.log('Downloading CSV file...');
        
        // Fetch CSV file
        const response = await axios({
            method: 'GET',
            url: CSV_URL,
            responseType: 'stream'
        });

        // Save CSV file
        const writer = fs.createWriteStream(FILE_PATH);
        response.data.pipe(writer);

        writer.on('finish', async () => {
            console.log('CSV file downloaded successfully.');
            await checkAndCreateTable();
        });

        writer.on('error', (err) => {
            console.error('Error writing file:', err);
        });

    } catch (error) {
        console.error('Error downloading CSV:', error);
    }
}

//Fuction       : checkAndCreateTable
//Arguments     : None
//Description   : This function checks if the table exists in the database and creates it if it does not.
async function checkAndCreateTable() {
    const connection = db.db;

    // Query to check if the table exists
    const checkTableQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = ? AND table_name = 'recalls'`;

    connection.query(checkTableQuery, [process.env.MYSQL_DB], (err, results) => {
        if (err) {
            console.error('Error checking table existence:', err);
            return;
        }

        if (results[0].count === 0) {
            console.log('Table "recalls" does not exist. Creating table and populating...');
            createTable();
        } else {
            console.log('Table "recalls" already exists. Skipping population...');
        }
    });
}

//Function      : createTable
//Arguments     : None
//Description   : This function creates the table in the database.
async function createTable() {
    const connection = db.db;

    // Create the recalls table
    const createTableQuery = `
        CREATE TABLE recalls (
            id INT AUTO_INCREMENT PRIMARY KEY,
            recall_date VARCHAR(50),
            safety_warning_date VARCHAR(50),
            recall_heading TEXT,
            product_name TEXT,
            description TEXT,
            hazard_description TEXT,
            consumer_action TEXT
        );
    `;

    connection.query(createTableQuery, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Table "recalls" created successfully.');
            populateTable();
        }
    });
}

//Function      : populateTable
//Arguments     : None
//Description   : This function reads the CSV file and populates the table with the data.
async function populateTable() {
    const connection = db.db;
    console.log('Populating table with data from CSV...');

    const results = [];
    fs.createReadStream(FILE_PATH)
        .pipe(csv())
        .on('data', (data) => {
            // Select only the required columns and keep dates as strings
            results.push({
                recall_date: data['Date'] ? String(data['Date']).trim() : null,
                safety_warning_date: data['Product Safety Warning Date'] ? String(data['Product Safety Warning Date']).trim() : null,
                recall_heading: data['Recall Heading'] ? String(data['Recall Heading']).trim() : null,
                product_name: data['Name of product'] ? String(data['Name of product']).trim() : null,
                description: data['Description'] ? String(data['Description']).trim() : null,
                hazard_description: data['Hazard Description'] ? String(data['Hazard Description']).trim() : null,
                consumer_action: data['Consumer Action'] ? String(data['Consumer Action']).trim() : null
            });
        })
        .on('end', async () => {
            console.log('CSV file parsed successfully.');
            await saveToDatabase(results);
        })
        .on('error', (err) => {
            console.error('Error parsing CSV:', err);
        });
}

//Function      : saveToDatabase
//Arguments     : data
//Description   : This function saves the data to the database.
//Returns       : None
async function saveToDatabase(data) {
    const connection = db.db;

    if (!data.length) {
        console.log('No data found in CSV.');
        return;
    }

    const insertQuery = `
        INSERT INTO recalls (recall_date, safety_warning_date, recall_heading, product_name, description, hazard_description, consumer_action) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    data.forEach((row) => {
        const values = [
            row.recall_date || 'N/A',
            row.safety_warning_date || 'N/A',
            row.recall_heading || 'N/A',
            row.product_name || 'N/A',
            row.description || 'N/A',
            row.hazard_description || 'N/A',
            row.consumer_action || 'N/A'
        ];

        connection.query(insertQuery, values, (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
            } else {
                //console.log('Inserted row:', result.insertId);
            }
        });
    });

   // console.log('Data inserted successfully.');
}
