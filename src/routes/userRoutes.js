// routes/userRoutes.js
import express from 'express';
import { saveUserInformation, getUserProfileInformation } from '../controllers/userController.js';

const router = express.Router();

// POST endpoint to save user information
router.post('/usersInformation', saveUserInformation);

// POST endpoint to retrieve user profile information
router.post('/userProfileInformation', getUserProfileInformation);

export default router;
