// Enterprise Mall - User Routes
// GET /api/users/profile, PUT /api/users/profile, GET /api/users/points

import express from 'express';
import { userController } from '../controllers/userController';
import { updateProfileValidation, paginationValidation, validate } from '../middleware/validate';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// All user routes require authentication
router.use(authMiddleware);

/** Get current user profile */
router.get('/profile', userController.getProfile);

/** Update current user profile */
router.put('/profile', updateProfileValidation, validate, userController.updateProfile);

/** Get current user's point records */
router.get('/points', paginationValidation, validate, userController.getPointRecords);

export { router as userRoutes };
