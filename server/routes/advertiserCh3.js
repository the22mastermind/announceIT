import express from 'express';
import controller from '../controllers/advertiserCh3';
import authenticate from '../middleware/authenticate';

const router = express.Router();

router.post('/announcement', authenticate, controller.createAnnouncement);

export default router;
