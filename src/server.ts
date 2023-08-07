import app from './app';
import env from '@utils/env';
import postgresInit from './database/postgres.init';

const { PORT } = env;

(async () => {
	await postgresInit();

	app.listen(PORT, () => {
		console.log(`⚡[Server]: Server is running at http://localhost:${PORT}`);
	});
})();
