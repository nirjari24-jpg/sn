import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import * as aiController from '../controllers/aiController.js';

const router = express.Router();

// Apply auth middleware to all AI routes
router.use(requireAuth);

router.post('/chat', aiController.chat);
router.post('/assessment/next', aiController.assessmentNext);
router.post('/analyze', aiController.assessmentNext); // Fallback for old route
router.post('/discover', aiController.discover);
router.post('/roadmap', aiController.roadmap);
router.post('/planner', aiController.planner);
router.post('/evaluate', aiController.evaluate);
router.post('/score', aiController.score);

export default router;
