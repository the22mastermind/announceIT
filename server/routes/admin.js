import express from 'express';
import controller from '../controllers/admin';
import authenticate from '../middleware/authenticate';
import isUserAdmin from '../middleware/isUserAdmin';
import checkId from '../middleware/isInteger';
import checkUserId from '../middleware/checkUserId';

const router = express.Router();

router.get('/announcements', authenticate, isUserAdmin, controller.viewAllUsersAnnouncements);
router.delete('/announcements/:announcementId', authenticate, isUserAdmin, checkId, controller.deleteAnnouncement);
router.patch('/announcements/:announcementId', authenticate, isUserAdmin, checkId, controller.changeAnnouncementStatus);
router.patch('/users/:id', authenticate, isUserAdmin, checkUserId.checkUserId, controller.blacklistUser);

export default router;
