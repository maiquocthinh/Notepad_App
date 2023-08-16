import Note from '@models/note.model';
import { calculateElapsedTime } from '@utils/time';
import { Request, Response } from 'express';

export const writeService = async (req: Request, res: Response) => {
	try {
		const slug = req.params?.slug;

		// if note don't exist create new note
		const note = (await Note.findOne({ where: { slug } })) || (await Note.create({ slug }, { returning: ['slug'] }));

		return res.status(200).render('write', {
			note: {
				...note?.dataValues,
				lastUpdated: calculateElapsedTime(note?.updatedAt),
			},
		});
	} catch (error: any) {
		throw error;
	}
};
