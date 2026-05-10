import { Router } from 'express';
import { citiesController } from './cities.controller';

const router = Router();

router.get('/', citiesController.getAll);
router.get('/:citySlug', citiesController.getBySlug);
router.get('/:citySlug/slow-guide', citiesController.getSlowGuide);
router.get('/:citySlug/guides', citiesController.getSlowGuide);

export default router;
