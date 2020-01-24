import express from 'express';
import controller from '../controllers/advertiser';
import authenticate from '../middleware/authenticate';
import checkId from '../middleware/isInteger';
import checkState from '../middleware/isStateValid';

const router = express.Router();

router.post('/announcement', authenticate, controller.createAnnouncement);
router.patch('/announcement/:id', authenticate, controller.updateAnnouncement);
router.get('/announcement/:announcementId', checkId, authenticate, controller.viewSpecificAnnouncement);
router.get('/announcements/:announcementStatus', checkState, authenticate, controller.viewAnnouncementsOfState);
router.get('/announcements', authenticate, controller.viewAllAnnouncements);

export default router;
