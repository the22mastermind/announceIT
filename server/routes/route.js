import express from 'express';
import userRoutes from './users';
import advertiserRoutes from './advertiser';
import adminrRoutes from './admin';
import user from './usersCh3';
import advertiser from './advertiserCh3';
import admin from './adminCh3';

const router = express.Router();

router.use('/api/v1/auth', userRoutes);
router.use('/api/v1/advertiser', advertiserRoutes);
router.use('/api/v1/admin', adminrRoutes);
// Challenge 3 routes
router.use('/api/v2/auth', user);
router.use('/api/v2/advertiser', advertiser);
router.use('/api/v2/admin', admin);

export default router;
