import dotenv from 'dotenv';
import { cleanEnv, port, str } from 'envalid';
dotenv.config();

const env = cleanEnv(process.env, {
	PORT: port({ default: 8080 }),
	CORS_ORIGIN: str(),
	SESSION_SECRET: str(),
	POSTGRES_HOST: str(),
	POSTGRES_DB: str(),
	POSTGRES_USER: str(),
	POSTGRES_PORT: port({ default: 5432 }),
	POSTGRES_PASS: str(),
});

export default env;
