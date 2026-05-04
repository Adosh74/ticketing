import request from 'supertest';
import { expect, it } from '@jest/globals';
import { Ticket } from '../../models/ticket';
import { app } from '../../app';
import { Order } from '../../models/order';
import { OrderStatus } from '@mshebltickets/common';

it('marks ana order as cancelled', async () => {
	const ticket = Ticket.build({
		title: 'aaa',
		price: 25,
	});

	await ticket.save();

	const user = global.signin();

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({
			ticketId: ticket.id,
		})
		.expect(201);

	await request(app).delete(`/api/orders/${order.id}`).set('Cookie', user).expect(204);

	const cancelledOrder = await Order.findById(order.id);

	expect(cancelledOrder?.status).toEqual(OrderStatus.Cancelled);
});

it.todo('emit order cancelled event');
