import express from 'express';
import { Server, Socket } from 'socket.io';
import debounce from '@utils/debounce';
import { updateNoteContent } from '@services/note.services';

const debounceUpdateNoteContent = debounce(updateNoteContent, 5000);

export const socketConfig = (io: Server, sessionMiddleware: express.RequestHandler) => {
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

type DataEditing = {
	roomId: string;
	content: string;
	cursorLocation: number;
};
