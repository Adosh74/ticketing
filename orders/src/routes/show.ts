import { Request, Response, Router } from 'express';
import { Order } from '../models/order';
import { NotAuthorizedError, NotFound, requireAuth } from '@mshebltickets/common';

const router = Router();

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
	const order = await Order.findById(req.params.orderId).populate('ticket');

	if (!order) {
		throw new NotFound();
	}

	if (order.userId !== req.currentUser!.id) {
		throw new NotAuthorizedError();
	}

	res.send(order);
});

export { router as showOrderRouter };
