import { Sequelize } from 'sequelize-typescript';
import env from '@utils/env';

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASS } = env;

const sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASS, {
	host: POSTGRES_HOST,
	dialect: 'postgres',
	define: { timestamps: true, underscored: true },
	logging: false,
});

export default sequelize;
