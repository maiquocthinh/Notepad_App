import { cleanupNotes } from '@utils/cleanupDB';
import { CronJob } from 'cron';

const cleanupNotesJob: CronJob = new CronJob({
	cronTime: '* 3 * * *',
	onTick: async () => await cleanupNotes(),
	start: false,
	timeZone: 'Asia/Ho_Chi_Minh',
});

const initCronJobs = (): void => {
	cleanupNotesJob.start();
	console.log('📅 Initial cron jobs success!');
};

export default initCronJobs;
