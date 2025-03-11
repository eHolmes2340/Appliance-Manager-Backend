import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import csvParser from 'csv-parser';
import db from '../model/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const filePath = join(__dirname, 'recalls.csv');

// Function to attempt download with retries
const downloadCSVWithRetry = async (url, retries = 3, delay = 2000) => {
  let attempt = 0;

  while (attempt < retries) {
    try {
      const response = await axios.get(url, { responseType: 'stream' });
      return response; // Successful response
    } catch (error) {
      attempt++;
      console.error(`Attempt ${attempt} failed. Retrying in ${delay / 1000}s...`);

      if (attempt >= retries) {
        throw new Error('Max retries reached. Unable to download CSV.');
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

// Helper function to convert the date format
const formatDate = (dateString) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dateParts = dateString.split(' ');

  if (dateParts.length === 3) {
    const month = months.indexOf(dateParts[0]) + 1; // Get the month number
    const day = dateParts[1].replace(',', ''); // Remove comma from day
    const year = dateParts[2];

    // Format as YYYY-MM-DD
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }
  
  return null; // Return null if date string is not in the expected format
};

export const downloadAndStoreRecalls = async () => {
  const csvUrl = 'https://www.cpsc.gov/product_recalls_download?tabset=on&search_combined_fields=&field_rc_date_value=&field_rc_date_value_1=&field_rc_hazards_target_id=All&field_rc_recall_by_product_target_id=187&field_rc_manufactured_in_value=&tab=csv&page&_format=csv';

  console.log('Downloading CSV file...');
  try {
    // Attempt to download the CSV with retries
    const response = await downloadCSVWithRetry(csvUrl);

    const fileStream = fs.createWriteStream(filePath);
    response.data.pipe(fileStream);

    fileStream.on('finish', async () => {
      console.log('CSV Downloaded. Processing data...');
      const records = [];

      // Parse the CSV and push data into records array
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          const formattedDate = formatDate(row['Date']); // Format the date before inserting
          records.push([
            row['Recall Number'],
            row['Name of product'],
            row['Hazard Description'],
            formattedDate
          ]);
        })
        .on('end', async () => {
          console.log(`Processing ${records.length} records...`);

          if (records.length > 0) {
            const insertQuery = `
              INSERT INTO recall_information (recall_number, name_of_product, hazard_description, recall_date)
              VALUES ? 
              ON DUPLICATE KEY UPDATE 
              name_of_product=VALUES(name_of_product), 
              hazard_description=VALUES(hazard_description), 
              recall_date=VALUES(recall_date);
            `;

            // Insert into MySQL
            try {
              await db.query(insertQuery, [records]);
              console.log('Database updated successfully.');
            } catch (dbError) {
              console.error('Error inserting data into database:', dbError);
            }
          } else {
            console.log('No records found in CSV.');
          }

          fs.unlinkSync(filePath); // Delete CSV after processing
        });
    });
  } catch (error) {
    console.error('Error downloading CSV:', error);
  }
};
