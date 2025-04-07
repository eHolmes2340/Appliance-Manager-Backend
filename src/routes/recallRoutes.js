//File        : recallRoutes.js
//Programmer  : Erik Holmes
//Date        : May 10, 2025
//Description : This file will handle all the routes for the recalls.
import express from 'express';
import { getRecallListFiltered } from '../controllers/recallController.js';
import {getRecallInformationForDashboard } from '../controllers/dashboardControllers.js'; 

const router = express.Router();


//If the user wants to filter the recall list by something speficic
router.get('/recalls/filter',getRecallListFiltered)
 
//Dashboard
router.get('/getRecallInformationForDashboard',getRecallInformationForDashboard )

export default router;