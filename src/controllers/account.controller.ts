import { Request, Response } from 'express';
import svgCaptcha, { CaptchaObj } from 'svg-captcha';
import bcrypt from 'bcryptjs';

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

export const forgot = async (req: Request, res: Response) => {
	return res.status(200).render('forgot');
};

export const resetPassword = async (req: Request, res: Response) => {
	return res.status(200).render('reset-password');
};

export const panel = async (req: Request, res: Response) => {
	return res.status(200).render('panel');
};

export const captcha = async (_req: Request, res: Response) => {
	const captcha: CaptchaObj = svgCaptcha.create({
		size: 4,
		ignoreChars: '0o1i',
		noise: 2,
	});

	// ignore cache svg
	res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
	res.setHeader('Pragma', 'no-cache');
	res.setHeader('Expires', '0');

	// save captcha after hash to client
	const hashedCaptcha = bcrypt.hashSync(captcha.text, 10);
	res.cookie('cc_hash', hashedCaptcha, { httpOnly: true, maxAge: 900000 }); // 15m

	return res.type('svg').send(captcha.data);
};
