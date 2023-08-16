import { NextFunction, Request, Response } from 'express';
import svgCaptcha, { CaptchaObj } from 'svg-captcha';
import bcrypt from 'bcryptjs';
import {
	createAccount,
	handleLogin,
	renderPanel,
	updateAccountService,
	forgotPasswordService,
	renderResetPasswordService,
	handleResetPasswordService,
} from '@services/account.services';

// ╔════════════╗
// ║	PAGE	║
// ╚════════════╝

// [GET] /account/login
export const login = async (req: Request, res: Response) => {
	if (req.session?.user) return res.redirect('/account/panel');
	return res.status(200).render('login');
};

// [POST] /account/login
export const loginPost = async (req: Request, res: Response) => {
	return handleLogin(req, res);
};

// [GET] /account/register
export const register = async (req: Request, res: Response) => {
	if (req.session?.user) return res.redirect('/account/panel');
	return res.status(200).render('register');
};

// [GET] /account/register
export const registerPost = async (req: Request, res: Response) => {
	return await createAccount(req, res);
};

// [GET] /account/logout
export const logout = async (req: Request, res: Response) => {
	req.session.destroy((err) => {
		if (err) return res.status(500).json({ message: err.message });
		return res.redirect('/account/login');
	});
};

// [GET] /account/forgot
export const forgot = async (req: Request, res: Response) => {
	return res.status(200).render('forgot');
};

// [POST] /account/forgot
export const forgotPost = async (req: Request, res: Response) => {
	return await forgotPasswordService(req, res);
};

// [GET] /account/reset-password
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
	return renderResetPasswordService(req, res, next);
};

// [POST] /account/reset-password
export const resetPasswordPost = async (req: Request, res: Response) => {
	return await handleResetPasswordService(req, res);
};

// [GET] /account/panel
export const panel = async (req: Request, res: Response) => {
	return await renderPanel(req, res);
};

// [GET] /account/captcha
export const captcha = async (_req: Request, res: Response) => {
	const captcha: CaptchaObj = svgCaptcha.create({
		height: 30,
		size: 5,
		ignoreChars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', // only number
		noise: 2,
	});

	// ignore cache svg
	res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
	res.setHeader('Pragma', 'no-cache');
	res.setHeader('Expires', '0');

	// save hash captcha to client
	const hashedCaptcha = bcrypt.hashSync(captcha.text, 10);
	res.cookie('cc_hash', hashedCaptcha, { httpOnly: true, maxAge: 900000 }); // 15m

	return res.type('svg').send(captcha.data);
};

// ╔═══════════╗
// ║	API    ║
// ╚═══════════╝

// [PATCH] /account
export const updateAccount = async (req: Request, res: Response) => {
	return updateAccountService(req, res);
};
