// ─────────────────────────────────────────────────────────────
// Home: Routes
// ─────────────────────────────────────────────────────────────
import { Router } from 'express';
import { homeController } from './home.controller';
import { optionalAuth } from '../../middleware/auth';

const router = Router();

// Optional auth — works with or without login
router.get('/', optionalAuth, homeController.getHome);

export default router;
