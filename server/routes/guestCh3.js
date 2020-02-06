import express from 'express';
import controller from '../controllers/usersCh3';
import checkId from '../middleware/isInteger';

const router = express.Router();

router.post('/announcement/:announcementId', checkId, controller.flagAnnouncement);

export default router;
