import request from 'supertest';
import { app } from '../../app';

it('Returns a 201 on successful signup', async () => {
	return request(app)
		.post('/api/users/signup')
		.send({
			email: 'user@test.com',
			password: 'password1234',
		})
		.expect(201);
});
