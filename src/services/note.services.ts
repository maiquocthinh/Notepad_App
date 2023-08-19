import { Request, Response } from 'express';
import MarkdownIt from 'markdown-it';
import { User, Note, BackupNote } from '@models/index';
import env from '@utils/env';
import { calculateElapsedTime } from '@utils/time';

export const renderWriteService = async (req: Request, res: Response) => {
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
			title: `${new URL(env.SITE_URL).host} / share / ${note.slug}`,
		});
	} catch (error: any) {
		throw error;
	}
};

export const renderNoteLogin = async (req: Request, res: Response) => {
	const { slug, externalSlug, shareType } = req.params;

	if (slug) {
		// check note
		const note = slug && (await Note.findOne({ where: { slug }, attributes: ['id'] }));
		if (!note) return res.redirect('/' + slug);

		return res.status(200).render('note_login', { slug });
	} else {
		// check note
		const note = externalSlug && (await Note.findOne({ where: { externalSlug }, attributes: ['id'] }));
		if (!note) return res.redirect('/' + externalSlug);

		return res.status(200).render('note_login', { externalSlug, shareType });
	}
};

export const renderShareNote = async (req: Request, res: Response) => {
	const externalSlug = req.params.externalSlug;
	const title = `${new URL(env.SITE_URL).host} / share / ${externalSlug}`;

	const note =
		externalSlug &&
		(await Note.findOne({
			where: { externalSlug },
			attributes: ['content'],
			include: [
				{
					model: User,
					attributes: ['username', 'avatar'],
				},
			],
		}));
	if (!note) return res.status(404).render('404');

	return res.status(200).render('share', { note, title });
};

export const renderRawNote = async (req: Request, res: Response) => {
	const externalSlug = req.params.externalSlug;

	const note = externalSlug && (await Note.findOne({ where: { externalSlug }, attributes: ['content'] }));
	if (!note) return res.status(404).render('404');

	return res.status(200).type('text').send(note.content);
};

export const renderCodeNote = async (req: Request, res: Response) => {
	const externalSlug = req.params.externalSlug;
	const title = `${new URL(env.SITE_URL).host} / code / ${externalSlug}`;

	const note =
		externalSlug &&
		(await Note.findOne({
			where: { externalSlug },
			attributes: ['content'],
			include: [
				{
					model: User,
					attributes: ['username', 'avatar'],
				},
			],
		}));
	if (!note) return res.status(404).render('404');

	return res.status(200).render('code', { note, title });
};

export const renderMarkdownNote = async (req: Request, res: Response) => {
	const externalSlug = req.params.externalSlug;
	const title = `${new URL(env.SITE_URL).host} / markdown / ${externalSlug}`;

	const note = externalSlug && (await Note.findOne({ where: { externalSlug }, attributes: ['content'] }));
	if (!note) return res.status(404).render('404');

	const md = new MarkdownIt();
	const content = md.render(note.content);

	return res.status(200).render('markdown', { content, title });
};

export const renderBackupNote = async (req: Request, res: Response) => {
	const backupNoteId = req.params.backupNoteId;
	const title = `${new URL(env.SITE_URL).host} / user-backup / ${backupNoteId}`;

	const backupNote = backupNoteId && (await BackupNote.findOne({ where: { id: backupNoteId }, attributes: ['content'] }));
	if (!backupNote) return res.status(404).render('404');

	return res.status(200).render('backup', { backupNote, title });
};

export const updateNoteContent = async (noteId: string, noteContent: string, userId?: string) => {
	try {
		// get note form db
		const note = await Note.findByPk(noteId);

		if (!note) return;

		note.content = noteContent;
		if (note.temporary) {
			note.userId = userId;
			note.temporary = false;
		}

		await note.save();
	} catch (error) {}
};
