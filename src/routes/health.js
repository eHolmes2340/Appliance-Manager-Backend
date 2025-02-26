
import express from 'express';
import { checkServerHealth } from '../controllers/checkServerHealth.js';

const router=express.Router();

router.get('/health',checkServerHealth); 

export default router;