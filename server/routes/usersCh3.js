import express from 'express';
import controller from '../controllers/usersCh3';

const router = express.Router();

router.post('/signup', controller.userSignup);

export default router;
