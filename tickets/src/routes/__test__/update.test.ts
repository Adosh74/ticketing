import request from 'supertest';
import { app } from '../../app';
import { it, expect } from '@jest/globals';
import { Types } from 'mongoose';

it('returns a 404 if the provided id does not exist', async () => {
	const id = new Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.set('Cookie', global.signin())
		.send({ title: 'title', price: 20 })
		.expect(404);
});

it('returns a 401 if the user not authenticated', async () => {
	const id = new Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.send({ title: 'title', price: 20 })
		.expect(401);
});

it('returns a 401 if user does not own the ticket', async () => {
	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({ title: 'title', price: 24 })
		.expect(201);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', global.signin())
		.send({
			title: 'title',
			price: 23,
		})
		.expect(401);
});

it('returns a 400 if the user provided invalid title or price', async () => {
	const cookie = global.signin();

	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({ title: 'title', price: 24 })
		.expect(201);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: '',
			price: 10,
		})
		.expect(400);

	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: 'title',
			price: -10,
		})
		.expect(400);
});

it('updates the ticket provided valid inputs', async () => {
	const cookie = global.signin();

	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', cookie)
		.send({ title: 'title', price: 24 })
		.expect(201);

	const updatedTitle = 'new title';
	const updatedPrice = 50;
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set('Cookie', cookie)
		.send({
			title: updatedTitle,
			price: updatedPrice,
		})
		.expect(200);

	const updatedTicketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.send()
		.expect(200);

	expect(updatedTicketResponse.body.title).toEqual(updatedTitle);
	expect(updatedTicketResponse.body.price).toEqual(updatedPrice);
});
