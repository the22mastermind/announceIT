import express from 'express';
import controller from '../controllers/admin';
import authenticate from '../middleware/authenticate';
import isUserAdmin from '../middleware/isUserAdmin';

const router = express.Router();

router.get('/announcements', authenticate, isUserAdmin, controller.viewAllUsersAnnouncements);

export default router;
