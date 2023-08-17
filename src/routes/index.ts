import { Express } from 'express';
import accountRouter from './account.router';
import apiRouter from './api.router';
import { noteController } from '@controllers/index';
import { checkBackupNoteBelongToUser, checkLoggedInNote, checkLogin, checkNotLoggedInNote } from '@middlewares/auth.middleware';
import { updateNoteView } from '@middlewares/view.middleware';

const { write, share, raw, code, markdown, userBackup, noteLogin } = noteController;

const mountRoutes = (app: Express) => {
	app.use('/account', accountRouter);
	app.use('/api', apiRouter);
	app.get('/:slug', checkNotLoggedInNote, write);
	app.get('/login/:slug', checkLoggedInNote, noteLogin);
	app.get('/login/:shareType/:externalSlug', checkLoggedInNote, noteLogin);
	app.get('/share/:externalSlug', checkNotLoggedInNote, updateNoteView, share);
	app.get('/raw/:externalSlug', checkNotLoggedInNote, updateNoteView, raw);
	app.get('/code/:externalSlug', checkNotLoggedInNote, updateNoteView, code);
	app.get('/markdown/:externalSlug', checkNotLoggedInNote, updateNoteView, markdown);
	app.get('/user-backup/:backupNoteId', checkLogin, checkBackupNoteBelongToUser, userBackup);
	app.get('/', write);
};

export default mountRoutes;
