import { Note } from '@models/index';
import { NextFunction, Request, Response } from 'express';

export const updateNoteView = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const externalSlug = req.params.externalSlug;
		if (externalSlug) await Note.increment('views', { by: 1, where: { externalSlug }, silent: true });
	} catch (error) {}
	return next();
};
