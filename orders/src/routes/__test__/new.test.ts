import { Types } from 'mongoose';
import { expect, it } from '@jest/globals';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order } from '../../models/order';
import { OrderStatus } from '@mshebltickets/common';

it('return an error if ticket does not exist', async () => {
	const ticketId = new Types.ObjectId();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId })
		.expect(404);
});

it('return an error if ticket is already reserved', async () => {
	const ticket = Ticket.build({
		price: 20,
		title: 'aaa',
	});

	await ticket.save();

	const order = Order.build({
		ticket,
		userId: 'aaa',
		status: OrderStatus.Created,
		expiresAt: new Date(),
	});

	await order.save();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId: ticket.id })
		.expect(400);
});

it('reserve a ticket', async () => {
	const ticket = Ticket.build({
		price: 20,
		title: 'aaa',
	});

	await ticket.save();

	await request(app)
		.post('/api/orders')
		.set('Cookie', global.signin())
		.send({ ticketId: ticket.id })
		.expect(201);
});
