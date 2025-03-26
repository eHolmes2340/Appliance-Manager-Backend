//File       : userRoutes.js
//Programmer : Erik Holmes
//Date       : Feb 20, 2025
//Description: This file will handle all the routes for the user information.
import express from 'express';
import { saveUserInformation, getUserProfileInformation,updateUserProfile } from '../controllers/userController.js';

const router = express.Router();


// POST endpoint to save user information
router.post('/usersInformation', saveUserInformation);

// POST endpoint to retrieve user profile information
router.post('/userProfileInformation', getUserProfileInformation);

router.put('/updateUserProfile', updateUserProfile);



export default router;
