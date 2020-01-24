import express from 'express';
import userRoutes from './users';
import advertiserRoutes from './advertiser';
import adminrRoutes from './admin';

const router = express.Router();

router.use('/api/v1/auth', userRoutes);
router.use('/api/v1/advertiser', advertiserRoutes);
router.use('/api/v1/admin', adminrRoutes);

export default router;
