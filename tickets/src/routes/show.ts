import { Router, Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { NotFound } from '@mshebltickets/common';

const router = Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
	const ticket = await Ticket.findById(req.params.id);

	if (!ticket) {
		throw new NotFound();
	}

	res.status(200).send(ticket);
});

export { router as showRouter };
