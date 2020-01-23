import express from 'express';
import controller from '../controllers/advertiser';
import authenticate from '../middleware/authenticate';

const router = express.Router();

router.post('/announcement', authenticate, controller.createAnnouncement);
router.patch('/announcement/:id', authenticate, controller.updateAnnouncement);

export default router;
