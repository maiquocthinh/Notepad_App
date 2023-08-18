import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { updateNoteContent } from '@services/note.services';
import { sessionMiddleware } from '@config/session';
import debounce from '@utils/debounce';
import env from '@utils/env';

type DataEditing = {
	roomId: string;
	content: string;
	cursorLocation: number;
};

const debounceUpdateNoteContent = debounce(updateNoteContent, 5000);

const socketConfig = (io: Server, sessionMiddleware: express.RequestHandler) => {
	// use session middleware
	io.engine.use(sessionMiddleware);

	io.on('connection', (socket: Socket) => {
		console.log('A user connected');

		socket.on('joinRoom', (roomId) => {
			socket.join(roomId);
			console.log(`User joined room: ${roomId}`);
		});

		socket.on('editing', (data: DataEditing) => {
			// update on db
			debounceUpdateNoteContent(data.roomId, data.content, socket.request.session?.user?.id);

			io.to(data.roomId).emit('update', {
				...data,
				roomId: undefined,
			});
		});

		socket.on('disconnect', () => {
			console.log('A user disconnected');
		});
	});
};

const initSocketServer = (server: http.Server) => {
	const io: Server = new Server(server, {
		cors: {
			origin: env.SITE_URL,
			methods: ['GET', 'POST'],
		},
	});
	socketConfig(io, sessionMiddleware);
};

export default initSocketServer;
