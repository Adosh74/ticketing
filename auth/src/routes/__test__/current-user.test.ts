import request from 'supertest';
import { app } from './../../app';

it('responds with details about current user', async () => {
	const signinData = await signin();

	const response = await request(app)
		.get('/api/users/currentUser')
		.set('Cookie', signinData.cookie)
		.send({})
		.expect(200);

	expect(response.body.currentUser.email).toEqual(signinData.user.email);
});

it('responds with null if not authenticated user', async () => {
	const response = await request(app)
		.get('/api/users/currentUser')
		.send({})
		.expect(200);

	expect(response.body.currentUser).toBeNull();
});
