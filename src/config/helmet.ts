import env from '@utils/env';
import helmet from 'helmet';

const { SITE_URL, NODE_ENV } = env;

export const helmetMiddleware = helmet({
	contentSecurityPolicy: {
		useDefaults: false,
		directives: {
			'default-src': ["'self'"],
			'script-src': ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
			'script-src-attr': ["'unsafe-inline'"],
			'style-src': ["'self'"],
			'style-src-elem': ["'self'", "'unsafe-inline'"],
			'img-src': ['*'],
			'connect-src': [
				"'self'",
				'https://tame-red-clownfish-tutu.cyclic.app',
				NODE_ENV === 'production' ? `wss://${new URL(SITE_URL).host}` : `ws://${new URL(SITE_URL).host}`,
			],
		},
	},
});
