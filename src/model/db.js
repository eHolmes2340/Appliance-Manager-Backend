import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,        
    user: process.env.MYSQL_USER,        
    password: process.env.MYSQL_PASSWORD, 
    database: process.env.MYSQL_DB       
});

// Using the promise API for async/await support
const dbPromise = db.promise();

// Check and see if the connection is successful
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);
});

// Export the Promise-based db connection
export default dbPromise;
