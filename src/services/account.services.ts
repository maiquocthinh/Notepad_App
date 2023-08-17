import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { validateOrReject, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import sequelize, { Op } from 'sequelize';
import {
	LoginParams,
	RegisterParams,
	UpdateAccountParams,
	ForgotPasswordParams,
	ResetPasswordParams,
} from '../types/account.types';
import { User, Note, BackupNote, Session } from '@models/index';
import getInfoClient from '@utils/getInfoClient';
import { calculateElapsedTime } from '@utils/time';
import { DeviceIcons } from '@config/constants';
import { sendResetPasswordLink } from '@utils/email';
import { createToken, verifyToken } from '@utils/jwt';

export const createAccount = async (req: Request, res: Response) => {
	try {
		const data = plainToClass(RegisterParams, req.body);

		// compare captcha
		if (!bcrypt.compareSync(data.captcha, req.cookies.cc_hash)) throw new Error('Captcha invalid!');

		// validate
		await validateOrReject(data);

		// save new account to db
		await User.create({
			email: data.email,
			username: data.username,
			hashPassword: data.password,
		});

		// render success
		return res.status(200).render('register', {
			success: { message: 'Register success. Go login!' },
		});
	} catch (errors: any) {
		if (Array.isArray(errors) && errors.every((error) => error instanceof ValidationError)) {
			return res.status(400).render('register', {
				errors: errors.map((error) => error.constraints && Object.values(error.constraints)).flat(),
			});
		} else if (errors instanceof sequelize.ValidationError) {
			return res.status(400).render('register', {
				errors: errors.errors.map((err) => err.message),
			});
		} else {
			return res.status(400).render('register', {
				errors: [errors.message],
			});
		}
	}
};

export const handleLogin = async (req: Request, res: Response) => {
	try {
		const data = plainToClass(LoginParams, req.body);

		// validate
		await validateOrReject(data);

		// check user
		const user = await User.findOne({
			where: {
				username: data.username,
			},
			attributes: ['id', 'username', 'email', 'hashPassword', 'avatar'],
		});
		if (!user) throw new Error('Username or Password invalid!');

		// compare password
		if (!bcrypt.compareSync(data.password, user.hashPassword || '')) throw new Error('Username or Password invalid!');

		// set session
		user.hashPassword = undefined;
		req.session.user = user;
		req.session.client = await getInfoClient(req);

		// redirect to panel
		return res.redirect('/account/panel');
	} catch (errors: any) {
		if (Array.isArray(errors) && errors.every((error) => error instanceof ValidationError)) {
			return res.status(400).render('login', {
				errors: errors.map((error) => error.constraints && Object.values(error.constraints)).flat(),
			});
		} else if (errors instanceof sequelize.ValidationError) {
			return res.status(400).render('login', {
				errors: errors.errors.map((err) => err.message),
			});
		} else {
			return res.status(400).render('login', {
				errors: [errors.message],
			});
		}
	}
};

export const renderPanel = async (req: Request, res: Response) => {
	const userId = req.session.user?.id;
	const user = await User.findOne({
		where: { id: userId },
		include: [
			{
				model: Note,
				attributes: ['id', 'slug', 'views', 'needPassword', 'updatedAt'],
			},
			{
				model: BackupNote,
				attributes: ['id', 'updatedAt'],
			},
			{
				model: Session,
				where: {
					[Op.and]: [sequelize.where(sequelize.fn('NOW'), '<', sequelize.col('expires'))],
				},
				attributes: ['sid', 'data'],
			},
		],
		order: [
			[{ model: Note, as: 'notes' }, 'updatedAt', 'DESC'],
			[{ model: BackupNote, as: 'backupNotes' }, 'updatedAt', 'DESC'],
			[{ model: Session, as: 'sessions' }, 'createdAt', 'DESC'],
		],
	});

	const notes = user?.notes.map((note) => ({
		...note.dataValues,
		lastUpdated: calculateElapsedTime(note.updatedAt),
	}));

	const backupNotes = user?.backupNotes.map((note) => ({
		...note.dataValues,
		lastUpdated: calculateElapsedTime(note.updatedAt),
	}));

	const sessions = user?.sessions.map((session) => {
		const data = JSON.parse(session.data as string);
		return {
			sid: session.sid,
			user: data.user,
			client: data.client,
			isThisSession: session.sid === req.sessionID,
		};
	});

	return res.status(200).render('panel', {
		user: { ...user?.dataValues, notes: undefined, backupNotes: undefined, sessions: undefined },
		notes,
		backupNotes,
		sessions,
		DeviceIcons,
	});
};

export const updateAccountService = async (req: Request, res: Response) => {
	try {
		const userId = req.session.user?.id;
		const data = plainToClass(UpdateAccountParams, req.body);

		// validate
		await validateOrReject(data);

		// update
		await User.update(
			{
				email: data.email,
				avatar: data.avatar,
				hashPassword: data.password,
			},
			{ where: { id: userId }, individualHooks: true },
		);

		return res.status(200).json({ message: 'Update account success!' });
	} catch (errors: any) {
		if (Array.isArray(errors) && errors.every((error) => error instanceof ValidationError)) {
			return res.status(400).json({
				errors: errors.map((error) => error.constraints && Object.values(error.constraints)).flat(),
			});
		} else if (errors instanceof sequelize.ValidationError) {
			return res.status(400).json({
				errors: errors.errors.map((err) => err.message),
			});
		} else {
			return res.status(400).render('login', {
				errors: [errors.message],
			});
		}
	}
};

export const forgotPasswordService = async (req: Request, res: Response) => {
	try {
		const data = plainToClass(ForgotPasswordParams, req.body);

		// compare captcha
		if (!bcrypt.compareSync(data.captcha, req.cookies.cc_hash)) throw new Error('Captcha invalid!');

		// validate
		await validateOrReject(data);

		// check account exists?
		const user = await User.findOne({ where: { email: data.email }, attributes: ['username'] });
		if (!user) throw new Error('Account does not exist!');

		// create token
		const token = createToken.resetPasswordToken({ username: user.username });

		// send email
		await sendResetPasswordLink(data.email, token);

		// render success
		return res.status(200).render('forgot', {
			success: { message: 'Reset Password link sent to your E-mail!' },
		});
	} catch (errors: any) {
		if (Array.isArray(errors) && errors.every((error) => error instanceof ValidationError)) {
			return res.status(400).render('forgot', {
				errors: errors.map((error) => error.constraints && Object.values(error.constraints)).flat(),
			});
		} else if (errors instanceof sequelize.ValidationError) {
			return res.status(400).render('forgot', {
				errors: errors.errors.map((err) => err.message),
			});
		} else {
			return res.status(400).render('forgot', {
				errors: [errors.message],
			});
		}
	}
};

export const renderResetPasswordService = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// get token
		const token = req.params.token;
		if (!token) throw new Error('This link is wrong!');

		// verify token
		try {
			verifyToken.resetPasswordToken(token);
		} catch (error) {
			throw new Error('This link is expired or wrong!');
		}

		// render success
		return res.status(200).render('reset_password');
	} catch (error) {
		(error as any).status = 400;
		return next(error);
	}
};

export const handleResetPasswordService = async (req: Request, res: Response) => {
	try {
		const data = plainToClass(ResetPasswordParams, req.body);

		// validate
		await validateOrReject(data);

		// get token
		const token = req.params.token;
		if (!token) throw new Error('Reset Password fail. Maybe this link is expired!');

		// verify token
		const { username } = verifyToken.resetPasswordToken(token);
		if (!username) throw new Error('Reset Password fail. Maybe this link is expired!');

		// reset password
		await User.update({ hashPassword: data.password }, { where: { username }, individualHooks: true });

		// render success
		return res.status(200).render('reset_password', {
			success: { message: 'Reset Password success. Go login!' },
		});
	} catch (errors: any) {
		if (Array.isArray(errors) && errors.every((error) => error instanceof ValidationError)) {
			return res.status(400).render('reset_password', {
				errors: errors.map((error) => error.constraints && Object.values(error.constraints)).flat(),
			});
		} else if (errors instanceof sequelize.ValidationError) {
			return res.status(400).render('reset_password', {
				errors: errors.errors.map((err) => err.message),
			});
		} else {
			return res.status(400).render('reset_password', {
				errors: [errors.message],
			});
		}
	}
};
