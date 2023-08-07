import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import env from '@utils/env';

const app: Express = express();

// Express configuration
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(compression());
app.use(cookieParser());
app.use(
	cors({
		credentials: true,
		origin: env.CORS_ORIGIN,
	}),
);
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req: Request, res: Response) => {
	res.status(200).render('home');
});

export default app;
