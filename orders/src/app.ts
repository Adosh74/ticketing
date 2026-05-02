import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { indexOrderRouter } from './routes';
import { createOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { deleteOrderRouter } from './routes/delete';

import {
	NotFound,
	requestLoggerMiddleware,
	errorHandler,
	currentUser,
} from '@mshebltickets/common';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== 'test',
	})
);

app.use(currentUser);

app.use(indexOrderRouter);
app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);

if (process.env.NODE_ENV !== 'test') {
	app.use(requestLoggerMiddleware);
}

app.all('*', () => {
	throw new NotFound();
});

app.use(errorHandler);

export { app };
