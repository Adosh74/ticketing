import request from 'supertest';
import { expect, it } from '@jest/globals';
import { Ticket } from '../../models/ticket';
import { app } from '../../app';
import { Types } from 'mongoose';

it('fetch user order', async () => {
	const ticket = Ticket.build({
		title: 'aa',
		price: 25,
	});
	await ticket.save();

	const user = global.signin();

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(201);

	const { body: fetchedOrder } = await request(app)
		.get(`/api/orders/${order.id}`)
		.set('Cookie', user)
		.expect(200);

	expect(fetchedOrder.id).toEqual(order.id);
});

it('return an error if user try fetch order not exist', async () => {
	const ticket = Ticket.build({
		title: 'aa',
		price: 25,
	});
	await ticket.save();

	const user = global.signin();

	const { body: order } = await request(app)
		.post('/api/orders')
		.set('Cookie', user)
		.send({ ticketId: ticket.id })
		.expect(201);

	await request(app)
		.get(`/api/orders/${order.id}`)
		.set('Cookie', global.signin())
		.expect(401);
});

it('return an error if user try fetch other user order', async () => {
	const ticket = Ticket.build({
		title: 'aa',
		price: 25,
	});
	await ticket.save();

	const user = global.signin();

	const mongoId = new Types.ObjectId();
	await request(app)
		.get(`/api/orders/${mongoId}`)
		.set('Cookie', global.signin())
		.expect(404);
});
