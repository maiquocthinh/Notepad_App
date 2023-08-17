import Note from '@models/note.model';

const debounce = <T extends (...args: any[]) => void>(func: T, timeout: number = 300): ((...args: Parameters<T>) => void) => {
	let timer: ReturnType<typeof setTimeout> | undefined;
	return function (this: any, ...args: Parameters<T>): void {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			func.apply(this, args);
		}, timeout);
	};
};
export default debounce;

export const createDebounceUpdateNoteContent = (delay: number = 3000) =>
	debounce(async (noteId: string, content: string) => {
		try {
			await Note.update({ content }, { where: { id: noteId } });
		} catch (error) {}
	}, delay);
