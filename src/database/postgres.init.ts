import sequelize from './sequelize';

export default async () => {
	try {
		await sequelize.authenticate();
		console.log('🔌 Connection to Postgres has been established successfully.');
	} catch (error) {
		console.error('💥 Unable to connect to Postgres');
		throw error;
	}
	await sequelize.sync();
};
