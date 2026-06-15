import express from 'express';
import { register, login, getMe } from '../controllers/authcontrollers.js';
import { authMiddleware } from '../middlewares/authmiddleware.js';
import { validate, registerValidation, loginValidation } from '../utils/validators.js';

const router = express.Router();

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.get('/me', authMiddleware, getMe);

export default router;
