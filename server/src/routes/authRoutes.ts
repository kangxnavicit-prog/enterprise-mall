// Enterprise Mall - Auth Routes
// POST /api/auth/login, POST /api/auth/logout

import express from 'express';
import { authController } from '../controllers/authController';
import { loginValidation, validate } from '../middleware/validate';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

/** Login with employee ID and password */
router.post('/login', loginValidation, validate, authController.login);

/** Logout (requires authentication) */
router.post('/logout', authMiddleware, authController.logout);

export { router as authRoutes };
