import { Router, Request, Response } from 'express';
import { body } from 'express-validator';

import { requireAuth, validateRequest } from '@mshebltickets/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

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

		
		new TicketCreatedPublisher(natsWrapper.client).publish({
			id: ticket.id,
			title: ticket.title,
			price: ticket.price,
			userId: ticket.userId
		})

		res.status(201).send(ticket);
	}
);

export { router as createTicketRouter };
