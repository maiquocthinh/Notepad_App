import BackupNote from '@models/backupNote.model';
import { Note, Session } from '@models/index';
import { Request, Response, NextFunction } from 'express';

export const checkLogin = (req: Request, res: Response, next: NextFunction) => {
	const user = req.session.user;
	if (!user) return res.redirect('/account/login');

	return next();
};

export const checkNoteBelongToUser = (req: Request, res: Response, next: NextFunction) => {
	const user = req.session.user;
	const noteId = req.params.noteId;

	if (!user || !noteId) return res.redirect('/account/login');

	const isNoteBelongToUser = Note.findOne({ where: { id: noteId, userId: user.id }, attributes: ['id'] });

	if (!isNoteBelongToUser) return res.redirect('/account/login');

	return next();
};

export const checkBackupNoteBelongToUser = (req: Request, res: Response, next: NextFunction) => {
	const user = req.session.user;
	const backupNoteId = req.params.backupNoteId;

	if (!user || !backupNoteId) return res.redirect('/account/login');

	const isNoteBelongToUser = BackupNote.findOne({ where: { id: backupNoteId, userId: user.id }, attributes: ['id'] });

	if (!isNoteBelongToUser) return res.redirect('/account/login');

	return next();
};

export const checkSessionOfUser = (req: Request, res: Response, next: NextFunction) => {
	const user = req.session.user;
	const sid = req.body.sid;

	if (!user || !sid) return res.status(400).json({ error: 'Revoke session fail!' });

	const isSessionOfUser = Session.findOne({ where: { sid, userId: user.id }, attributes: ['sid'] });

	if (!isSessionOfUser) return res.status(400).json({ error: 'Revoke session fail!' });

	return next();
};

export const checkNotLoggedInNote = async (req: Request, res: Response, next: NextFunction) => {
	const slug = req.params?.slug;
	const notesLoggedIn = req.session.notesLoggedIn;

	const note = await Note.findOne({ where: { slug }, attributes: ['needPassword'] });
	if (!note?.needPassword) return next();

	if (!notesLoggedIn?.includes(slug)) return res.redirect('/login/' + slug);

	return next();
};

export const checkLoggedInNote = async (req: Request, res: Response, next: NextFunction) => {
	const slug = req.params.slug;
	const notesLoggedIn = req.session.notesLoggedIn;

	if (notesLoggedIn?.includes(slug)) return res.redirect('/' + slug);

	const note = await Note.findOne({ where: { slug }, attributes: ['needPassword'] });
	if (!note) return res.redirect('/' + slug);
	if (!note.needPassword) return res.redirect('/' + slug);

	return next();
};
