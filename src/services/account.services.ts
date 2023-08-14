import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { validateOrReject, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import sequelize from 'sequelize';
import { LoginParams, RegisterParams } from '../types/account.types';
import { User, Note } from '@models/index';
import getInfoClient from '@utils/getInfoClient';
import { calculateElapsedTime } from '@utils/time';

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
			return res.status(200).render('register', {
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
			return res.status(200).render('login', {
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
		],
		order: [[{ model: Note, as: 'notes' }, 'updatedAt', 'DESC']],
	});

	return res.status(200).render('panel', {
		notes: user?.notes.map((note) => ({
			...note.dataValues,
			lastUpdated: calculateElapsedTime(note.updatedAt),
		})),
	});
};
