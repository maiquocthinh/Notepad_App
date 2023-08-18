import app from './app';
import env from '@utils/env';
import postgresInit from './database/postgres.init';
import * as http from 'http';
import * as socketio from 'socket.io';
import { socketConfig } from '@config/socket';
import { sessionMiddleware } from '@config/session';

const { PORT } = env;

(async () => {
	await postgresInit();

	const server: http.Server = http.createServer(app);

	const io: socketio.Server = new socketio.Server(server);
	socketConfig(io, sessionMiddleware);

	server.listen(PORT, () => {
		console.log(`⚡[Server]: Server is running at http://localhost:${PORT}`);
	});
})();
