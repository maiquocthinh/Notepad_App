import { Request, Response } from 'express';

// ╔════════════╗
// ║	PAGE	║
// ╚════════════╝
export const write = async (req: Request, res: Response) => {
	return res.status(200).render('write');
};

export const share = async (req: Request, res: Response) => {
	return res.status(200).render('share');
};

export const raw = async (req: Request, res: Response) => {
	return res.status(200).send('raw');
};

export const code = async (req: Request, res: Response) => {
	return res.status(200).render('code');
};

export const markdown = async (req: Request, res: Response) => {
	return res.status(200).render('markdown');
};

export const userBackup = async (req: Request, res: Response) => {
	return res.status(200).render('backup');
};
