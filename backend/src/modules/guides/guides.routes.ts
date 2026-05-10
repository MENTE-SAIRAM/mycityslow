import { Router } from 'express';
import { guidesController } from './guides.controller';

const router = Router();

router.get('/', guidesController.getAll);
router.get('/:citySlug', guidesController.getByCity);

export default router;
