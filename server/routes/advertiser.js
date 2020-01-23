import express from 'express';
import controller from '../controllers/advertiser';
import authenticate from '../middleware/authenticate';
import checkId from '../middleware/isInteger';

const router = express.Router();

router.post('/announcement', authenticate, controller.createAnnouncement);
router.patch('/announcement/:id', authenticate, controller.updateAnnouncement);
router.get('/announcement/:announcementId', checkId, controller.viewSpecificAnnouncement);

export default router;
