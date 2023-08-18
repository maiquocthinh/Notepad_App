import sequelize from '@database/sequelize';
import env from '@utils/env';
import SequelizeStore from 'connect-session-sequelize';
import session from 'express-session';

const sequelizeStoreConstructor = SequelizeStore(session.Store);

export const sessionStore = new sequelizeStoreConstructor({
	db: sequelize,
	table: 'Session',
	extendDefaultFields: (defaults, session) => ({
		data: defaults.data,
		expires: defaults.expires,
		userId: session?.user?.id,
	}),
});

export const sessionMiddleware = session({
	secret: env.SESSION_SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		maxAge: 2 * 60 * 60 * 1000, // 2 hours
	},
	store: sessionStore,
});
