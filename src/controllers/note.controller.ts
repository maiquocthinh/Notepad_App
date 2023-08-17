import { Request, Response } from 'express';
import {
	writeService,
	renderNoteLogin,
	renderShareNote,
	renderRawNote,
	renderCodeNote,
	renderMarkdownNote,
	renderBackupNote,
} from '@services/note.services';

// ╔════════════╗
// ║	PAGE	║
// ╚════════════╝

export const write = async (req: Request, res: Response) => {
	return await writeService(req, res);
};

export const noteLogin = async (req: Request, res: Response) => {
	return await renderNoteLogin(req, res);
};

export const share = async (req: Request, res: Response) => {
	return await renderShareNote(req, res);
};

export const raw = async (req: Request, res: Response) => {
	return await renderRawNote(req, res);
};

export const code = async (req: Request, res: Response) => {
	return await renderCodeNote(req, res);
};

export const markdown = async (req: Request, res: Response) => {
	return await renderMarkdownNote(req, res);
};

export const userBackup = async (req: Request, res: Response) => {
	return renderBackupNote(req, res);
};
