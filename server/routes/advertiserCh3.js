import express from 'express';
import controller from '../controllers/advertiserCh3';
import authenticate from '../middleware/authenticate';
import checkId from '../middleware/isInteger';

const router = express.Router();

router.post('/announcement', authenticate, controller.createAnnouncement);
router.patch('/announcement/:id', authenticate, controller.updateAnnouncement);
router.get('/announcements', authenticate, controller.viewAllAnnouncements);
router.get('/announcement/:announcementId', checkId, authenticate, controller.viewSpecificAnnouncement);

export default router;
