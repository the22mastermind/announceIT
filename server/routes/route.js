import express from 'express';
import userRoutes from './users';
import advertiserRoutes from './advertiser';

const router = express.Router();

router.use('/api/v1/auth', userRoutes);
router.use('/api/v1/advertiser', advertiserRoutes);

export default router;
