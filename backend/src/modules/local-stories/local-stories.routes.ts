import { Router } from 'express';
import { localStoriesController } from './local-stories.controller';
import { authenticate } from '../../middleware/auth';

const router = Router();

router.get('/', localStoriesController.getAll);
router.get('/spot/:spotId', localStoriesController.getBySpot);
router.get('/experience/:experienceId', localStoriesController.getByExperience);
router.get('/:id', localStoriesController.getById);

router.post('/', authenticate, localStoriesController.create);
router.post('/:id/like', authenticate, localStoriesController.like);

export default router;
