import { customAlphabet } from 'nanoid';

export const createUniqueSlug = (): string => {
	const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	const nanoid = customAlphabet(alphabet, 20);
	return nanoid();
};

export const createUserId = (): string => {
	const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
	const nanoid = customAlphabet(alphabet, 10);
	return 'u-' + nanoid();
};

export const createNoteId = (): string => {
	const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
	const nanoid = customAlphabet(alphabet, 10);
	return 'n-' + nanoid();
};

export const createBackupNoteId = (): string => {
	const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
	const nanoid = customAlphabet(alphabet, 10);
	return 'bk-' + nanoid();
};
