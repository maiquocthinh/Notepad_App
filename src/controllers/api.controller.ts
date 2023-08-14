import { Request, Response } from 'express';
import {
	backupNoteService,
	deleteBackupNoteService,
	deleteNoteService,
	downloadBackupNoteService,
	downloadNoteService,
	setPasswordForNoteService,
} from '@services/api.services';

// ╔═══════════╗
// ║	API	   ║
// ╚═══════════╝

// [POST] /api/note/set-password/:noteId
export const setPasswordForNote = async (req: Request, res: Response) => {
	return setPasswordForNoteService(req, res);
};

// [GET] /api/note/download/:noteId
export const downloadNote = async (req: Request, res: Response) => {
	return downloadNoteService(req, res);
};

// [DELETE] /api/note/delete/:noteId
export const deleteNote = async (req: Request, res: Response) => {
	return deleteNoteService(req, res);
};

// [POST] /api/note/backup/:noteId
export const backupNote = async (req: Request, res: Response) => {
	return backupNoteService(req, res);
};

// [GET] /api/backup-note/download/:backupNoteId
export const downloadBackupNote = async (req: Request, res: Response) => {
	return downloadBackupNoteService(req, res);
};

// [DELETE] /api/backup-note/delete/:backupNoteId
export const deleteBackupNote = async (req: Request, res: Response) => {
	return deleteBackupNoteService(req, res);
};
