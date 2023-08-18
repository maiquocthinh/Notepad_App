import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import env from '@utils/env';
import mountRoutes from './routes';
import { sessionMiddleware } from '@config/session';
import useragent from 'express-useragent';

const app: Express = express();

// Express configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
	helmet({
		contentSecurityPolicy: {
			useDefaults: false,
			directives: {
				'default-src': ["'self'"],
				'script-src': ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
				'script-src-attr': ["'unsafe-inline'"],
				'style-src': ["'self'"],
				'style-src-elem': ["'self'", "'unsafe-inline'"],
				'img-src': ['*'],
				'connect-src': ["'self'", 'https://tame-red-clownfish-tutu.cyclic.app'],
			},
		},
	}),
);
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
