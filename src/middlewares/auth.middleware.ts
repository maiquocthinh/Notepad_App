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
	const { slug, externalSlug } = req.params;
	const notesLoggedIn = req.session.notesLoggedIn;

	if (slug) {
		// get note from db
		const note = await Note.findOne({ where: { slug }, attributes: ['needPassword'] });

		// if note don't need password, go to note
		if (!note?.needPassword) return next();

		// if note no logged in, redirect to login page
		if (!notesLoggedIn?.includes(slug)) return res.redirect('/login/' + slug);
	} else if (externalSlug) {
		const shareType = req.url.match(/\/([^\/]+)\//)?.[1];

		// get note from db
		const note = await Note.findOne({ where: { externalSlug }, attributes: ['slug', 'needPassword'] });

		// if note don't need password, go to note
		if (!note?.needPassword) return next();

		// if note no logged in, redirect to login page
		if (!notesLoggedIn?.includes(note.slug)) return res.redirect(`/login/${shareType}/${externalSlug}`);
	}
	return next();
};

export const checkLoggedInNote = async (req: Request, res: Response, next: NextFunction) => {
	const { slug, externalSlug, shareType } = req.params;
	const notesLoggedIn = req.session.notesLoggedIn;

	if (slug) {
		// if note logged in, redirect to note (skip login)
		if (notesLoggedIn?.includes(slug)) return res.redirect('/' + slug);

		// get note from db
		const note = await Note.findOne({ where: { slug }, attributes: ['needPassword'] });

		// if note not exists, redirect to create new note
		if (!note) return res.redirect('/' + slug);

		// if note don't need password, redirect to note
		if (!note.needPassword) return res.redirect('/' + slug);
	} else if (externalSlug) {
		// get note from db
		const note = await Note.findOne({ where: { externalSlug }, attributes: ['slug', 'needPassword'] });

		// if note not exists, redirect to create new note
		if (!note) return res.redirect('/' + slug);

		// if note logged in, redirect to note(share link) (skip login)
		if (notesLoggedIn?.includes(note.slug)) return res.redirect(`/${shareType}/${externalSlug}`);

		// if note don't need password, redirect to note(share link)
		if (!note.needPassword) return res.redirect(`/${shareType}/${externalSlug}`);
	}

	return next();
};
