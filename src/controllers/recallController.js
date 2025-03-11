//File      : recallController.js
//Programmer: Erik Holmes 
//Date: 2021-06-23
//Description: This file contains the controller for fetching the CSV from CPSC and saving it locally.


import axios from 'axios';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import csvParser from 'csv-parser';

// Workaround for ES Modules: Get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


//Function    :downloadCSV
//Description :This function downloads the CSV file from CPSC and extracts the first 10 rows 
export const downloadCSV = async (req, res) => {
  const csvUrl = 'https://www.cpsc.gov/product_recalls_download?tabset=on&search_combined_fields=&field_rc_date_value=&field_rc_date_value_1=&field_rc_hazards_target_id=All&field_rc_recall_by_product_target_id=187&field_rc_manufactured_in_value=&tab=csv&page&_format=csv';
  const filePath = join(__dirname, 'recalls.csv'); // Save CSV locally

  console.log('Downloading CSV...');
  try {
    const response = await axios.get(csvUrl, { responseType: 'stream' });

    const fileStream = fs.createWriteStream(filePath);
    response.data.pipe(fileStream);

    fileStream.on('finish', () => {
      console.log('CSV Downloaded. Now processing...');

      const results = [];
      fs.createReadStream(filePath)
        .pipe(csvParser()) // Parse CSV automatically
        .on('data', (row) => {
          if (results.length < 10) {
            results.push({
              name: row['Name of product'],
              hazard: row['Hazard Description'],
              date: row['Date']
            });
          }
        })
        .on('end', () => {
          res.json(results); // Send the extracted data

          // Delete the file after sending response
          fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting file:', err);
            else console.log('File deleted successfully.');
          });
        });
    });
  } catch (error) {
    console.error('Error downloading CSV:', error);
    res.status(500).send('Error downloading the CSV file');
  }
};
