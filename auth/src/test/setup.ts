import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../app';

interface GlobalSigninOutput {
	cookie: string[];
	user: {
		email: string;
		password: string;
	};
}
declare global {
	var signin: () => Promise<GlobalSigninOutput>;
}

let mongo: MongoMemoryServer;

beforeAll(async () => {
	process.env.JWT_KEY = 'asdf';
	process.env.NODE_ENV = 'test';
	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();
	await mongoose.connect(mongoUri);
});

beforeEach(async () => {
	const collections = await mongoose.connection.db?.collections();
	if (collections) {
		for (let collection of collections) {
			await collection.deleteMany({});
		}
	}
});

afterAll(async () => {
	mongo ? await mongo.stop() : null;
	await mongoose.connection.close();
});

global.signin = async () => {
	const userData = {
		email: 'signin@test.com',
		password: 'password',
	};
	const response = await request(app)
		.post('/api/users/signup')
		.send(userData)
		.expect(201);

	const cookie = response.get('Set-Cookie');

	if (!cookie) {
		throw new Error('Expected cookie but got undefined.');
	}

	return {
		cookie,
		user: userData,
	};
};
