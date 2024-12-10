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

it('Returns a 400 with an invalid email', async () => {
	const response = await request(app).post('/api/users/signup').send({
		email: 'invalid-email',
		password: 'password1234',
	});

	expect(response.body.errors[0]?.message === 'Email must be valid');
});

it('Returns a 400 with an invalid password', async () => {
	const response = await request(app).post('/api/users/signup').send({
		email: 'user@test.com',
		password: 'p',
	});

	expect(
		response.body.errors[0]?.message ===
			'Password must be between 4 and 20 characters'
	);
});

it('Returns a 400 with missing email', async () => {
	const response = await request(app).post('/api/users/signup').send({
		password: 'password1234',
	});

	expect(
		response.body.errors?.length === 1 && response.body.errors[0]?.field === 'email'
	);
});

it('Returns a 400 with missing password', async () => {
	const response = await request(app).post('/api/users/signup').send({
		email: 'user@test.com',
	});

	expect(
		response.body.errors?.length === 1 &&
			response.body.errors[0]?.field === 'password'
	);
});

it('Returns a 400 with missing email and password', async () => {
	const response = await request(app)
		.post('/api/users/signup')
		.send({ email: 'user@test.com' });

	expect(response.body.errors?.length === 2);
});

it('Returns a 400 with email in use', async () => {
	await request(app)
		.post('/api/users/signup')
		.send({
			email: 'user@test.com',
			password: 'password1234',
		})
		.expect(201);

	const response = await request(app).post('/api/users/signup').send({
		email: 'user@test.com',
		password: 'password1234',
	});

	expect(response.body.errors[0]?.message === 'Email in use');
});

// it('Sets a cookie after successful signup', async () => {
// 	const response = await request(app)
// 		.post('/api/users/signup')
// 		.send({
// 			email: 'user@test.com',
// 			password: 'password1234',
// 		})
// 		.expect(201);
// 	console.log('response.body', response.body);

// 	expect(response.get('Set-Cookie')).toBeDefined();
// });
