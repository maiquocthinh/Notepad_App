import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import useragent from 'express-useragent';
import path from 'path';
import mountRoutes from './routes';
import env from '@utils/env';
import { sessionMiddleware } from '@config/session';
import { helmetMiddleware } from '@config/helmet';

const app: Express = express();

// Express configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmetMiddleware);
app.use(morgan('dev'));
app.use(compression());
app.use(cookieParser());
app.use(useragent.express());
app.use(
	cors({
		credentials: true,
		origin: env.SITE_URL,
	}),
);
app.use(sessionMiddleware);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Mount Routes
mountRoutes(app);

// Middleware handle error not found endpoint
app.use((_req: Request, res: Response) => {
	return res.status(404).render('404');
});

// Middleware error
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
	console.error(error);
	res.status(error.status || 500).json({
		error: {
			status: error.status || 500,
			message: error.message || 'Internal Server Error',
		},
	});
});

export default app;
