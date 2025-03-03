import request from 'supertest';
import { app } from '../../app';
import { it } from '@jest/globals';
import { Types } from 'mongoose';

it('Returns 404 if the ticket is not found', async () => {
	const id = new Types.ObjectId().toHexString();
	await request(app).get(`/api/tickets/${id}`).expect(404);
});

it('Returns the ticket if the ticket is found', async () => {
	const title = 'new test title';
	const price = 25;

	const response = await request(app)
		.post('/api/tickets')
		.set('Cookie', global.signin())
		.send({ title, price })
		.expect(201);

	const ticketResponse = await request(app)
		.get(`/api/tickets/${response.body.id}`)
		.expect(200);

	expect(ticketResponse.body.title).toEqual(title);
	expect(ticketResponse.body.price).toEqual(price);
});
