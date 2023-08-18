import { updateNoteContent } from '@services/note.services';

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
