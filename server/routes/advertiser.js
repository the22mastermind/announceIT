import express from 'express';
import controller from '../controllers/advertiser';
import authenticate from '../middleware/authenticate';

const router = express.Router();

router.post('/announcement', authenticate, controller.createAnnouncement);

export default router;
