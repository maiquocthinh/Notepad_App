import { Express } from 'express';
import accountRouter from './account.router';
import apiRouter from './api.router';
import { noteController } from '@controllers/index';
import { checkLoggedInNote, checkNotLoggedInNote } from '@middlewares/auth.middleware';

const { write, share, raw, code, markdown, userBackup, noteLogin } = noteController;

const mountRoutes = (app: Express) => {
	app.use('/account', accountRouter);
	app.use('/api', apiRouter);
	app.get('/:slug', checkNotLoggedInNote, write);
	app.get('/login/:slug', checkLoggedInNote, noteLogin);
	app.get('/login/:shareType/:externalSlug', checkLoggedInNote, noteLogin);
	app.get('/share/:externalSlug', checkNotLoggedInNote, share);
	app.get('/raw/:externalSlug', checkNotLoggedInNote, raw);
	app.get('/code/:externalSlug', checkNotLoggedInNote, code);
	app.get('/markdown/:externalSlug', checkNotLoggedInNote, markdown);
	app.get('/user-backup/:backupNoteId', userBackup);
	app.get('/', write);
};

export default mountRoutes;
