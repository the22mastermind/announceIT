import express from 'express';
import controller from '../controllers/users';

const router = express.Router();

router.post('/signup', controller.userSignup);

export default router;
