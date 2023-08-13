export type SessionDataUser = {
	id: string;
	email: string;
	username: string;
	avatar: string;
};

export type SessionDataClient = {
	ip: string | null;
	location: string;
	platform: string;
	browser: string;
	deviceType: string;
};
