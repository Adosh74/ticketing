import { Router, Request, Response, NextFunction } from 'express';
import { NotFound } from '@mshebltickets/common';

const router = Router();

router.get('/api/users/healthz', (req: Request, res: Response, next: NextFunction) => {
	res.sendStatus(200);
});

export { router as healthCheckRouter };
