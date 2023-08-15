import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import path from 'path';
import env from '@utils/env';
import mountRoutes from './routes';
import sessionStore from '@config/sessionStore';
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
				'script-src-attr': ["'unsafe-inline'"],
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
		origin: env.CORS_ORIGIN,
	}),
);
app.use(
	session({
		secret: env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			httpOnly: true,
			maxAge: 2 * 60 * 60 * 1000, // 2 hours
		},
		store: sessionStore,
	}),
);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Mount Routes
mountRoutes(app);

// Middleware handle error not found endpoint
app.use((req: Request, res: Response, next: NextFunction) => {
	const error = new Error('Page not found!');
	(error as any).status = 404;
	next(error);
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
