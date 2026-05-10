// ─────────────────────────────────────────────────────────────
// Cities: Routes
// ─────────────────────────────────────────────────────────────
import { Router } from 'express';
import { citiesController } from './cities.controller';

const router = Router();

router.get('/', citiesController.getAll);
router.get('/:citySlug', citiesController.getBySlug);

export default router;
