// ─────────────────────────────────────────────────────────────
// Discovery: Controller — filtered spot discovery
// Mounted at /api/discovery/spots
// ─────────────────────────────────────────────────────────────
import { Request, Response, NextFunction } from 'express';
import { spotsService } from './spots.service';

export const discoveryController = {
    /** GET /api/discovery/spots — main discovery feed with filters */
    async discover(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await spotsService.discoverSpots({
                city: req.query.city as string,
                category: req.query.category as string,
                vibe: req.query.vibe as string,
                bestTime: req.query.bestTime as string,
                crowdLevel: req.query.crowdLevel as string,
                activity: req.query.activity as string,
                travelerType: req.query.travelerType as string,
                lat: req.query.lat ? parseFloat(req.query.lat as string) : undefined,
                lng: req.query.lng ? parseFloat(req.query.lng as string) : undefined,
                radius: req.query.radius ? parseFloat(req.query.radius as string) : undefined,
                search: req.query.search as string,
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
            });
            res.json(result);
        } catch (error) {
            next(error);
        }
    },

    /** GET /api/discovery/spots/:id — single spot detail */
    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const spot = await spotsService.getSpotById(req.params.id);
            res.json(spot);
        } catch (error) {
            next(error);
        }
    },

    /** GET /api/discovery/spots/mobile/ui-text — mobile UI copy payload */
    async getMobileUiText(req: Request, res: Response, next: NextFunction) {
        try {
            const uiText = spotsService.getMobileSpotDetailUiText();
            res.json(uiText);
        } catch (error) {
            next(error);
        }
    },

    /** GET /api/discovery/spots/mobile/card-data — Mobile card payloads (iOS & Android) */
    async getMobileCardData(req: Request, res: Response, next: NextFunction) {
        try {
            const cardData = spotsService.getMobileCardData();
            res.json(cardData);
        } catch (error) {
            next(error);
        }
    },

    /** GET /api/discovery/spots/filters — metadata for filters */
    async getFilters(req: Request, res: Response, next: NextFunction) {
        try {
            const metadata = await spotsService.getDiscoveryMetadata();
            res.json(metadata);
        } catch (error) {
            next(error);
        }
    },
};
