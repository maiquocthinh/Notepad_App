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

	console.log(user, sid);

	if (!user || !sid) return res.status(400).json({ error: 'Revoke session fail!' });

	const isSessionOfUser = Session.findOne({ where: { sid, userId: user.id }, attributes: ['sid'] });

	if (!isSessionOfUser) return res.status(400).json({ error: 'Revoke session fail!' });

	return next();
};
