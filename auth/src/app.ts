import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { NotFound, requestLoggerMiddleware, errorHandler } from '@mshebltickets/common';
import { healthCheckRouter } from './routes/health-check';

const app = express();

app.set('trust proxy', true);
app.use(json());
app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== 'test',
	})
);

if (process.env.NODE_ENV !== 'test') {
	app.use(requestLoggerMiddleware);
}

app.use(healthCheckRouter);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', () => {
	throw new NotFound();
});

app.use(errorHandler);

export { app };
