import { Request, Response } from 'express';
import { backupNoteService, deleteNoteService, downloadNoteService, setPasswordForNoteService } from '@services/api.services';

// ╔═══════════╗
// ║	API	   ║
// ╚═══════════╝

export const setPasswordForNote = async (req: Request, res: Response) => {
	return setPasswordForNoteService(req, res);
};

export const downloadNote = async (req: Request, res: Response) => {
	return downloadNoteService(req, res);
};

export const deleteNote = async (req: Request, res: Response) => {
	return deleteNoteService(req, res);
};

export const backupNote = async (req: Request, res: Response) => {
	return backupNoteService(req, res);
};
