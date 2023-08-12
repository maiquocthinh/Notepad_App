import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { validateOrReject, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import sequelize from 'sequelize';
import { RegisterParams } from 'src/types/account.types';
import User from '@models/user.model';

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
