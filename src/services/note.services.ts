import Note from '@models/note.model';
import { calculateElapsedTime } from '@utils/time';
import { Request, Response } from 'express';

export const writeService = async (req: Request, res: Response) => {
	try {
		const slug = req.params?.slug;
		let isCreateNewNote = true;
		let note;

		if (slug) {
			note = await Note.findOne({ where: { slug } });
			if (note) isCreateNewNote = false;
		}

		if (isCreateNewNote) {
			// create new note
			const note = await Note.create({ slug }, { returning: ['slug'] });

			// redirect to new note
			return res.redirect('/' + note.slug);
		}

		if (note?.needPassword) {
			// redirect to login
			return res.status(200).send('Need Login :))');
		} else {
			// render note
			return res.status(200).render('write', {
				note: {
					...note?.dataValues,
					lastUpdated: calculateElapsedTime(note?.updatedAt),
				},
			});
		}
	} catch (error: any) {
		throw error;
	}
};
