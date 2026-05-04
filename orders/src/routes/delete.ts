import { Request, Response, Router } from 'express';
import { Order } from '../models/order';
import {
	NotAuthorizedError,
	NotFound,
	OrderStatus,
	requireAuth,
} from '@mshebltickets/common';

const router = Router();

router.delete(
	'/api/orders/:orderId',
	requireAuth,
	async (req: Request, res: Response) => {
		const { orderId } = req.params;
		const order = await Order.findById(orderId);

		if (!order) {
			throw new NotFound();
		}

		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}

		order.status = OrderStatus.Cancelled;
		order.save();

		// emit order cancelled event

		res.status(204).send(order);
	}
);

export { router as deleteOrderRouter };
