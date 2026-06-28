import { Request, Response, Router } from 'express';
import { Order } from '../models/order';
import {
	NotAuthorizedError,
	NotFound,
	OrderStatus,
	requireAuth,
} from '@mshebltickets/common';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = Router();

router.delete(
	'/api/orders/:orderId',
	requireAuth,
	async (req: Request, res: Response) => {
		const { orderId } = req.params;
		const order = await Order.findById(orderId).populate('ticket');

		if (!order) {
			throw new NotFound();
		}

		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		order.status = OrderStatus.Cancelled;
		order.save();

		// emit order cancelled event
		new OrderCancelledPublisher(natsWrapper.client).publish({
			id: order.id,
			version: order.version,
			ticket: {
				id: order.ticket.id,
			},
		});

		res.status(204).send(order);
	}
);

export { router as deleteOrderRouter };
