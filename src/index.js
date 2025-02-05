import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000; // local host

app.use(cors());
app.use(bodyParser.json());

app.post('/userInformation', (req, res) => {
  const userInfo = req.body;
  console.log(userInfo);
  res.send('User information received');
});

// Start the server and store the server instance
const server = app.listen(PORT, '0.0.0.0', () => { // Listening on all network interfaces
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

// Handle SIGTERM signal
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated');
  });
});

// Handle SIGINT signal (e.g., Ctrl+C)
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Process interrupted');
  });
});


