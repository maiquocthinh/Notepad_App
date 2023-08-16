import rateLimit from 'express-rate-limit';

export const forgotPasswordLimiter = rateLimit({
	windowMs: 24 * 60 * 60 * 1000, // 24h
	max: 3, // Maximum request in 24h
	message: 'Too many requests from this IP, please try again after 24 hours.',
});
