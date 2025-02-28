import { Router, Request, Response } from 'express';
import { currentUser } from '@mshebltickets/common';

const router = Router();

router.get('/api/users/currentUser', currentUser, (req: Request, res: Response) => {
	res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
