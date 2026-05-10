// ─────────────────────────────────────────────────────────────
// Admin: Routes — protected by auth + admin guard
// ─────────────────────────────────────────────────────────────
import { Router } from 'express';
import { adminController } from './admin.controller';
import { authenticate, requireAdmin } from '../../middleware/auth';

const router = Router();

// All admin routes require authentication + admin role
router.use(authenticate, requireAdmin);

// Dashboard
router.get('/dashboard', adminController.dashboard);

// Cities management
router.get('/cities', adminController.getCities);
router.post('/cities', adminController.createCity);
router.put('/cities/:id', adminController.updateCity);
router.delete('/cities/:id', adminController.deleteCity);

// Spots management
router.get('/spots', adminController.getSpots);
router.post('/spots', adminController.createSpot);
router.put('/spots/:id', adminController.updateSpot);
router.delete('/spots/:id', adminController.deleteSpot);
router.put('/spots/:id/approve', adminController.approveSpot);
router.put('/spots/:id/reject', adminController.rejectSpot);

// Submissions moderation
router.get('/submissions', adminController.getSubmissions);
router.put('/submissions/:id/approve', adminController.approveSubmission);
router.put('/submissions/:id/reject', adminController.rejectSubmission);

// Global Settings (Home Page Content)
router.get('/settings', adminController.getSettings);
router.put('/settings', adminController.updateSettings);

export default router;
