import Note from '@models/note.model';
import { Op, Sequelize } from 'sequelize';

export const cleanupNotes = async (): Promise<void> => {
	try {
		await Note.destroy({
			where: {
				temporary: true,
				[Op.and]: [Sequelize.literal(`created_at < NOW() - INTERVAL '1 day'`)],
			},
		});
		console.log('Cleanup notes done!');
	} catch (error) {}
};
