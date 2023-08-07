import { Request, Response } from 'express';

// ╔════════════╗
// ║	PAGE	║
// ╚════════════╝
export const login = async (req: Request, res: Response) => {
	return res.status(200).render('login');
};

export const register = async (req: Request, res: Response) => {
	return res.status(200).render('register');
};

export const logout = async (req: Request, res: Response) => {
	return res.status(200).json({ msg: 'logout' });
};

export const panel = async (req: Request, res: Response) => {
	return res.status(200).render('panel');
};
