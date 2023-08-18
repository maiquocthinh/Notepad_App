import app from './app';
import env from '@utils/env';
import postgresInit from './database/postgres.init';
import * as http from 'http';
import initCronJobs from '@config/cronJobs';
import initSocketServer from '@config/socket';

const { PORT } = env;
const server: http.Server = http.createServer(app);

(async () => {
	await postgresInit();

	initCronJobs();

	initSocketServer(server);

	server.listen(PORT, () => {
		console.log(`⚡[Server]: Server is running at http://localhost:${PORT}`);
	});
})();
