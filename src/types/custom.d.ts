import 'express-session';

declare module 'express-session' {
	interface SessionData {
		user?: {
			id: string;
			email: string;
			username: string;
			avatar: string;
		};
		client?: {
			address: string;
			ip: string;
			os: string;
			browser: string;
		};
	}
}
