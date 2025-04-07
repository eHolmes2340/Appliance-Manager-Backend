//File       : routes/applianceRoutes.js
//Programmer : Erik Holmes 
//Date       : Feb 20, 2025
//Description: This file will handle all the routes for the appliance information.

import express from 'express';
import { addApplianceInformation,listApplianceInformation,updateApplianceInformation,deleteApplianceInformation,saveManual} from '../controllers/applianceController.js';
import { getApplianceInformationForDashboard } from '../controllers/dashboardControllers.js';

const router = express.Router();

    // POST endpoint to add appliance information
    router.post('/applianceInformation', addApplianceInformation);
    router.get('/listApplianceInformation', listApplianceInformation);
    router.put('/updateApplianceInformation', updateApplianceInformation);
    router.delete('/deleteApplianceInformation', deleteApplianceInformation);
    router.post('/saveManual', saveManual);

   
    //router.get('/getApplianceInformation', getApplianceInformation);
    
    router.get('/getApplianceInformationForDashboard', getApplianceInformationForDashboard);

export default router;
