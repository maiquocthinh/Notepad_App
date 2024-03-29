export const calculateElapsedTime = (timeCreated: string): string => {
	const created = new Date(timeCreated).getTime();
	const periods: Record<string, number> = {
		year: 365 * 30 * 24 * 60 * 60 * 1000,
		month: 30 * 24 * 60 * 60 * 1000,
		week: 7 * 24 * 60 * 60 * 1000,
		day: 24 * 60 * 60 * 1000,
		hour: 60 * 60 * 1000,
		minute: 60 * 1000,
	};
	const diff = Date.now() - created;

	for (const key in periods) {
		if (diff >= periods[key]) {
			const result = Math.floor(diff / periods[key]);
			return `${result} ${result === 1 ? key : key + 's'} ago`;
		}
	}

	return 'Just now';
};
