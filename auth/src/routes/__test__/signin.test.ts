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

it('response with cookie when send valid credentials', async () => {
	const creationResponse = await request(app)
		.post('/api/users/signup')
		.send({
			email: 'user@test.com',
			password: 'password1234',
		})
		.expect(201);

	const response = await request(app)
		.post('/api/users/signin')
		.send({
			email: 'user@test.com',
			password: 'password1234',
		})
		.expect(200);

	expect(response.get('Set-Cookie')).toBeDefined();
});
