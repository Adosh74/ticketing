import { Router, Request, Response } from 'express';
import { body } from 'express-validator';

import { requireAuth, validateRequest } from '@mshebltickets/common';
import { Ticket } from '../models/ticket';

const router = Router();

router.post(
	'/api/tickets',
	requireAuth,
	[
		body('title').notEmpty().isString().withMessage('title is required'),
		body('price')
			.notEmpty()
			.isFloat({ gt: 0 })
			.withMessage('price must be greater 0'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { price, title } = req.body;

		const ticket = Ticket.build({ price, title, userId: req.currentUser!.id });

		await ticket.save();

		res.status(201).send(ticket);
	}
);

export { router as createTicketRouter };
