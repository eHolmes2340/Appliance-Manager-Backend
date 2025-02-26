//File      : checkServerHealth.js
//Date      : Feb 16, 2025
//Description: This file is used to check the health of the server.

//Function   : checkServerHealth
//Description: This function is used to check the health of the server.
export const checkServerHealth = (req, res) => {
    res.status(200).json({ message: 'Server is up and running' });
   // console.log('Server is up and running');
}

