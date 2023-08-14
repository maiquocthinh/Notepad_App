import Note from '@models/note.model';
import { Request, Response } from 'express';
import { Readable } from 'stream';
import bcrypt from 'bcryptjs';
import BackupNote from '@models/backupNote.model';

export const setPasswordForNoteService = async (req: Request, res: Response) => {
	try {
		const noteId = req.params.noteId;
		const password = req.body.password;

		if (!noteId) throw new Error('Set password for note fail!');

		const note = await Note.findByPk(noteId);
		if (!note) throw new Error('Set password for note fail!');

		const salt = bcrypt.genSaltSync(10);
		note.needPassword = !!password;
		note.hashPassword = password ? bcrypt.hashSync(password, salt) : null;

		await note.save();

		if (password) return res.status(200).json({ message: 'Set password for note success!' });
		else return res.status(200).json({ message: 'Remove password from note success!' });
	} catch (error: any) {
		return res.status(400).json({ message: error.message });
	}
};

export const downloadNoteService = async (req: Request, res: Response) => {
	try {
		const noteId = req.params.noteId;

		if (!noteId) throw new Error('Download note fail!');

		const note = await Note.findByPk(noteId, { attributes: ['content', 'slug'] });
		if (!note) throw new Error('Delete note fail!');

		// send download txt
		res.setHeader('Content-Type', 'text/plain');
		res.setHeader('Content-disposition', `attachment; filename=${note.slug}.txt`);
		const textStream = new Readable();
		textStream.push(note.content);
		textStream.push(null);
		textStream.pipe(res);
		return;
	} catch (error: any) {
		return res.status(400).json({ error: error.message });
	}
};

export const deleteNoteService = async (req: Request, res: Response) => {
	try {
		const noteId = req.params.noteId;

		if (!noteId) throw new Error('Delete note fail!');

		await Note.destroy({ where: { id: noteId } });

		return res.status(200).json({ message: 'Delete note success' });
	} catch (error: any) {
		return res.status(400).json({ error: error.message });
	}
};

export const backupNoteService = async (req: Request, res: Response) => {
	try {
		const userId = req.session.user?.id;
		const noteId = req.params.noteId;

		if (!noteId) throw new Error('Backup note fail!');

		const note = await Note.findByPk(noteId, { attributes: ['content'] });
		if (!note) throw new Error('Backup note fail!');

		await BackupNote.create({ content: note.content, userId });

		return res.status(200).json({ message: 'Backup note success' });
	} catch (error: any) {
		return res.status(400).json({ error: error.message });
	}
};
