import { Router, type Request, type Response } from 'express';
import { getCache } from './data.ts';

const router = Router();

// GET /api/attacks — all map data (12 core fields)
router.get('/attacks', (_req: Request, res: Response) => {
  const cache = getCache();
  res.json(cache.mapData);
});

// GET /api/details — all attack details bundled
router.get('/details', (_req: Request, res: Response) => {
  const cache = getCache();
  res.json(cache.detailMap);
});

// GET /api/stats — pre-computed stats
router.get('/stats', (_req: Request, res: Response) => {
  const cache = getCache();
  res.json(cache.stats);
});

// GET /api/filters — available filter options
router.get('/filters', (_req: Request, res: Response) => {
  const cache = getCache();
  res.json(cache.filterOptions);
});

export default router;
