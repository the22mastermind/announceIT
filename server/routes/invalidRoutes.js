import express from 'express';
import controller from '../controllers/invalidRoutes';

const router = express.Router();

router.get('/*', controller.handleInvalidRoutes);
router.post('/*', controller.handleInvalidRoutes);
router.patch('/*', controller.handleInvalidRoutes);
router.put('/*', controller.handleInvalidRoutes);
router.delete('/*', controller.handleInvalidRoutes);

export default router;
