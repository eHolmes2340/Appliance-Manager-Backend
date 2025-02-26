// routes/applianceRoutes.js
import express from 'express';
import { addApplianceInformation,listApplianceInformation,updateApplianceInformation } from '../controllers/applianceController.js';

const router = express.Router();

// POST endpoint to add appliance information
router.post('/applianceInformation', addApplianceInformation);
router.get('/listApplianceInformation', listApplianceInformation);
router.put('/updateApplianceInformation', updateApplianceInformation);

export default router;
