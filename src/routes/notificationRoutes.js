import express from 'express';
import { getRecallNotifications,getWarrantyNotifications } from '../controllers/notificationsController.js'; // Import the controller function

const router = express.Router();

router.get('/recall/notifications/:userId',getRecallNotifications); 
//router.get('/warranty/notifications',getWarrantyNotifications);

export default router