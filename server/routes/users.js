import express from 'express';
import controller from '../controllers/users';

const router = express.Router();

router.post('/signin', controller.userSignin);

export default router;
