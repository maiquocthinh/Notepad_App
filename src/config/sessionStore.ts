import sequelize from '@database/sequelize';
import SequelizeStore from 'connect-session-sequelize';
import session from 'express-session';

const SessionStore = SequelizeStore(session.Store);

const sessionStore = new SessionStore({
	db: sequelize,
	table: 'Session',
	extendDefaultFields: (defaults, session) => ({
		data: defaults.data,
		expires: defaults.expires,
		userId: session?.user?.id,
	}),
});

export default sessionStore;
