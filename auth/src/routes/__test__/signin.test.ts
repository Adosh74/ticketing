import request from 'supertest';
import { app } from './../../app';

it('fails when a email does not exist is supplied', async () => {
	await request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@test.com',
			password: 'test1234',
		})
		.expect(400);
});

it('fails when an incorrect password is supplied', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'user@test.com',
			password: 'password1234',
		})
		.expect(201);

	await request(app)
		.post('/api/users/signin')
		.send({
			email: 'test@test.com',
			password: 'test1234',
		})
		.expect(400);
});
