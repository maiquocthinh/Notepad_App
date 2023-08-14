import { Express, Request, Response } from 'express';
import accountRouter from './account.router';
import apiRouter from './api.router';
import { noteController } from '@controllers/index';

const { write, share, raw, code, markdown, userBackup } = noteController;

const mountRoutes = (app: Express) => {
	app.use('/account', accountRouter);
	app.use('/api', apiRouter);
	app.get('/:slug', write);
	app.get('/share/:externalSlug', share);
	app.get('/raw/:externalSlug', raw);
	app.get('/code/:externalSlug', code);
	app.get('/markdown/:externalSlug', markdown);
	app.get('/user-backup/:backupNoteId', userBackup);
	app.get('/', write);
};

export default mountRoutes;
