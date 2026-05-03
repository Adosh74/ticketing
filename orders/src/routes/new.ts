import { Request, Response, Router } from 'express';
import {
	BadRequestError,
	NotFound,
	OrderStatus,
	requireAuth,
	validateRequest,
} from '@mshebltickets/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';

const router = Router();

const EXPIRATION_WINDOW_SECOND = 15 * 60;

router.post(
	'/api/orders',
	requireAuth,
	[
		body('ticketId')
			.not()
			.isEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
			.withMessage('TicketId must be provided'),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { ticketId } = req.body;

		const ticket = await Ticket.findById(ticketId);

		if (!ticket) {
			throw new NotFound();
		}

		const isReserved = await ticket?.isReserved();

		if (isReserved) {
			throw new BadRequestError('Ticket is already reserved');
		}

		const expiration = new Date();

		// set expiration after 15 min
		expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECOND);

		const order = Order.build({
			userId: req.currentUser!.id,
			status: OrderStatus.Created,
			expiresAt: expiration,
			ticket,
		});

		await order.save();

		// publish event for order created

		res.status(201).send(order);
	}
);

export { router as createOrderRouter };
