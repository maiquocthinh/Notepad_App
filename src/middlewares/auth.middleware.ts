import Note from '@models/note.model';
import { Request, Response, NextFunction } from 'express';
import { where } from 'sequelize';

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
