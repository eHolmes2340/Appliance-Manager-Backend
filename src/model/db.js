//File         : src/model/db.js
//Programmer   : Erik Holmes 
//Date         : Jan 15/25 
//Description  : This file will create a connection to the MySQL database.

import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
    host: process.env.MYSQL_HOST,        
    user: process.env.MYSQL_USER,        
    password: process.env.MYSQL_PASSWORD, 
    database: process.env.MYSQL_DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Check and see if the connection is successful 
db.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }
  console.log('Connected as id ' + connection.threadId);
});


export default {db};