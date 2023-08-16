import dotenv from 'dotenv';
import { cleanEnv, port, str } from 'envalid';
dotenv.config();

const env = cleanEnv(process.env, {
	PORT: port({ default: 8080 }),
	SITE_URL: str(),
	SESSION_SECRET: str(),
	JWT_SECRET: str(),
	POSTGRES_HOST: str(),
	POSTGRES_DB: str(),
	POSTGRES_USER: str(),
	POSTGRES_PORT: port({ default: 5432 }),
	POSTGRES_PASS: str(),
	G_CLIENT_ID: str(),
	G_CLIENT_SECRET: str(),
	G_REFRESH_TOKEN: str(),
	ADMIN_EMAIL: str(),
});

export default env;
