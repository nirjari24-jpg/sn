import express from 'express';
import { registerUser, loginUser, getMe, getUserState, updateUserState } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/state', protect, getUserState);
router.post('/state', protect, updateUserState);

export default router;
