import express from 'express';
import { downloadCSV } from '../controllers/recallController.js';

const router = express.Router();

// Route to download the CSV
router.get('/downloadRecallsCSV', downloadCSV);

export default router;
