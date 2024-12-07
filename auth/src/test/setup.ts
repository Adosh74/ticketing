import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import { app } from '../app';

let mongo: MongoMemoryServer;

beforeAll(async () => {
	process.env.JWT_KEY = 'asdf';
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
