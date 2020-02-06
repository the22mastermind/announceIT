import express from 'express';
import controller from '../controllers/usersCh3';

const router = express.Router();

router.post('/signup', controller.userSignup);
router.post('/signin', controller.userSignin);
router.post('/reset_password', controller.userPasswordReset);

export default router;
