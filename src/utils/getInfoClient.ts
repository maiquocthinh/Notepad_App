import { Request } from 'express';
import fetch from 'cross-fetch';
import { SessionDataClient } from '../types/session.types';

const getInfoClient = async (req: Request): Promise<SessionDataClient | null> => {
	try {
		const ip = req.ip;
		const location = await ip2location(ip);
		const platform = req.useragent?.platform;
		const browser = req.useragent?.browser;
		const deviceType = ((): string => {
			if (req.useragent?.isMobile) {
				return 'Mobile';
			} else if (req.useragent?.isTablet) {
				return 'Tablet';
			} else {
				return 'Desktop';
			}
		})();

		return {
			ip,
			location: `${location?.countryName || 'unknown'} (${location?.regionName || 'unknown'})`,
			platform: platform || 'unknown',
			browser: browser || 'unknown',
			deviceType,
		};
	} catch (error) {
		return null;
	}
};

const ip2location = async (ip: string): Promise<location | null> => {
	return fetch(
		`http://apiip.net/api/check?ip=${ip}&accessKey=e3d31808-d8f5-4341-b261-b2911c501d85&fields=countryName,regionName`,
	).then(async (response: any) => {
		const data = await response.json();
		if (response.ok) return { countryName: data.countryName, regionName: data.regionName };
		else return null;
	});
};

type location = {
	countryName: string | null;
	regionName: string | null;
};

export default getInfoClient;
