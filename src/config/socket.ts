import { createDebounceUpdateNoteContent } from '@utils/debounce';
import { Server, Socket } from 'socket.io';

const debounceUpdateNoteContent = createDebounceUpdateNoteContent(5000);

export const socketConfig = (io: Server) => {
	io.on('connection', (socket: Socket) => {
		console.log('A user connected');

		socket.on('joinRoom', (roomId) => {
			socket.join(roomId);
			console.log(`User joined room: ${roomId}`);
		});

		socket.on('editing', (data: DataEditing) => {
			// update on db
			debounceUpdateNoteContent(data.roomId, data.content);

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
