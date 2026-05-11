// ─────────────────────────────────────────────────────────────
// Discovery: Routes — mounted at /api/discovery/spots
// ─────────────────────────────────────────────────────────────
import { Router } from 'express';
import { discoveryController } from './discovery.controller';

const router = Router();

router.get('/', discoveryController.discover);
router.get('/filters', discoveryController.getFilters);
router.get('/mobile/ui-text', discoveryController.getMobileUiText);
router.get('/mobile/card-data', discoveryController.getMobileCardData);
router.get('/:id', discoveryController.getById);

export default router;
