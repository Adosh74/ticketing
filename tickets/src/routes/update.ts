import { Router, Request, Response } from 'express';
import { Ticket } from '../models/ticket';
import { body } from 'express-validator';
import {
	requireAuth,
	NotFound,
	NotAuthorizedError,
	validateRequest,
} from '@mshebltickets/common';

const router = Router();

router.put(
	'/api/tickets/:id',
	requireAuth,
	[
		body('title').notEmpty().withMessage('Title is required'),
		body('price')
			.isFloat({ gt: 0 })
			.withMessage('price must be provided and greater than 0'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const ticket = await Ticket.findById(req.params.id);

		if (!ticket) throw new NotFound();

		if (req.currentUser!.id !== ticket.userId) throw new NotAuthorizedError();

		ticket.set({
			title: req.body.title,
			price: req.body.price,
		});

		await ticket.save();

		res.send(ticket);
	}
);

export { router as updateTicketRouter };
