import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import {
	NotFound,
	requestLoggerMiddleware,
	errorHandler,
	currentUser,
} from '@mshebltickets/common';
import { createTicketRouter } from './routes/new';
import { showRouter } from './routes/show';
import { indexTicketRouter } from './routes';
import { updateTicketRouter } from './routes/update';

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

app.use(createTicketRouter);
app.use(showRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

if (process.env.NODE_ENV !== 'test') {
	app.use(requestLoggerMiddleware);
}

app.all('*', () => {
	throw new NotFound();
});

app.use(errorHandler);

export { app };
