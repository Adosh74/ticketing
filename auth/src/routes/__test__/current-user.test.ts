import request from 'supertest';
import { app } from './../../app';

it('responds with details about current user', async () => {
	const data = {
		email: 'currentUser@tets.com',
		password: 'test123',
	};

	const authResponse = await request(app)
		.post('/api/users/signup')
		.send(data)
		.expect(201);

	const cookie = authResponse.get('Set-Cookie');

	if (!cookie) {
		throw new Error('Expected cookie but got undefined.');
	}

	const response = await request(app)
		.get('/api/users/currentUser')
		.set('Cookie', cookie)
		.send({})
		.expect(200);

	expect(response.body.currentUser.email).toEqual(data.email);
});
