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
	const signupData = await signin();
	await request(app)
		.post('/api/users/signin')
		.send({
			email: signupData.user.email,
			password: 'wrongPassword',
		})
		.expect(400);
});

it('response with cookie when send valid credentials', async () => {
	const signupData = await signin();

	const response = await request(app)
		.post('/api/users/signin')
		.send(signupData.user)
		.expect(200);

	expect(response.get('Set-Cookie')).toBeDefined();
});
