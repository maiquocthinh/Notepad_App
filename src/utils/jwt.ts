import * as jwt from 'jsonwebtoken';
import env from './env';
import { ResetPasswordPayload } from 'src/types/account.types';

const { JWT_SECRET } = env;

export class createToken {
	static resetPasswordToken(payload: ResetPasswordPayload): string {
		return jwt.sign(payload, JWT_SECRET, { expiresIn: '5m' });
	}
}

export class verifyToken {
	static resetPasswordToken(token: string): ResetPasswordPayload {
		return jwt.verify(token, JWT_SECRET) as ResetPasswordPayload;
	}
}
