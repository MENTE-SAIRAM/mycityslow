import { Router } from 'express';
import { experiencesController } from './experiences.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/', experiencesController.discover);
router.get('/filters', experiencesController.getFilters);
router.get('/:id', experiencesController.getById);
router.post('/', authenticate, experiencesController.submit);

export default router;
