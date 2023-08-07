import { Express, Request, Response } from 'express';
import accountRouter from './account.router';
import { noteController } from '@controllers/index';

const { write, share, raw, code, markdown, userBackup } = noteController;

const mountRoutes = (app: Express) => {
	app.use('/account', accountRouter);
	app.get('/:slug', write);
	app.get('/share/:externalSlug', share);
	app.get('/raw/:externalSlug', raw);
	app.get('/code/:externalSlug', code);
	app.get('/markdown/:externalSlug', markdown);
	app.get('/user-backup/:backupNoteId', userBackup);

	app.get('/', (_req: Request, res: Response) => {
		res.status(200).json({ msg: 'home' });
	});
};

export default mountRoutes;
