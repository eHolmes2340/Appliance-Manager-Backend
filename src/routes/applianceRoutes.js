// routes/applianceRoutes.js
import express from 'express';
import { addApplianceInformation } from '../controllers/applianceController.js';

const router = express.Router();

// POST endpoint to add appliance information
router.post('/applianceInformation', addApplianceInformation);

export default router;
