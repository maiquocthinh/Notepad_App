import Note from '@models/note.model';
import { calculateElapsedTime } from '@utils/time';
import { Request, Response } from 'express';

export const writeService = async (req: Request, res: Response) => {
	try {
		const slug = req.params?.slug;

		// if note don't exist create new note
		const note = slug && (await Note.findOne({ where: { slug } }));
		if (!note) {
			const note = await Note.create({ slug }, { returning: ['slug'] });
			return res.redirect('/' + note.slug);
		}

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

export const renderNoteLogin = async (req: Request, res: Response) => {
	const { slug, externalSlug, shareType } = req.params;

	if (slug) {
		// check note
		const note = slug && (await Note.findOne({ where: { slug } }));
		if (!note) return res.redirect('/' + slug);

		return res.status(200).render('note_login', { slug });
	} else {
		// check note
		const note = externalSlug && (await Note.findOne({ where: { externalSlug } }));
		if (!note) return res.redirect('/' + externalSlug);

		return res.status(200).render('note_login', { externalSlug, shareType });
	}
};
