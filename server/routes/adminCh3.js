import express from 'express';
import controller from '../controllers/adminCh3';
import authenticate from '../middleware/authenticate';
import isUserAdmin from '../middleware/isUserAdmin';
import checkId from '../middleware/isInteger';

const router = express.Router();

router.delete('/announcements/:announcementId', authenticate, isUserAdmin, checkId, controller.deleteAnnouncement);

export default router;
