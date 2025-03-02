import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { beforeAll, beforeEach, afterAll } from '@jest/globals';
import jwt from 'jsonwebtoken';

import { app } from '../app';

interface GlobalSigninOutput {
	cookie: string[];
	user: {
		email: string;
		password: string;
	};
}
declare global {
	var signin: () => string[];
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

global.signin = () => {
	const payload = {
		id: '1las23lla',
		email: 'test@test.com',
	};

	const token = jwt.sign(payload, process.env.JWT_KEY!);

	const session = { jwt: token };

	const sessionJSON = JSON.stringify(session);

	const base64 = Buffer.from(sessionJSON).toString('base64');

	return [`session=${base64}`];
};
