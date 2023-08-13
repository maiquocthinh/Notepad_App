import { Request, Response, NextFunction } from 'express';

export const checkLogin = (req: Request, res: Response, next: NextFunction) => {
	const user = req.session.user;
	if (!user) return res.redirect('/account/login');

	return next();
};
