import { Router, Request, Response } from 'express';

import { requireAuth } from '@mshebltickets/common';

const router = Router();

router.post('/api/tickets', requireAuth, async (req: Request, res: Response) => {
	res.sendStatus(200);
});

export { router as createTicketRouter };
