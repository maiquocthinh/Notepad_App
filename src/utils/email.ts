import nodemailer from 'nodemailer';
import env from './env';

const { G_CLIENT_ID, G_CLIENT_SECRET, G_REFRESH_TOKEN, ADMIN_EMAIL, SITE_URL } = env;

const transporter = nodemailer.createTransport({
	pool: true,
	maxConnections: 10,
	service: 'gmail',
	auth: {
		type: 'OAuth2',
		user: ADMIN_EMAIL,
		clientId: G_CLIENT_ID,
		clientSecret: G_CLIENT_SECRET,
		refreshToken: G_REFRESH_TOKEN,
	},
});

export const sendResetPasswordLink = async (recipientEmail: string, token: string): Promise<void> => {
	await transporter.sendMail({
		from: ADMIN_EMAIL,
		subject: 'Reset Your Password',
		html: `<!DOCTYPE html>
				<html>
				<head>
				<title>Reset Your Password</title>
				</head>
				<body>
				<h2>Hello,</h2>
				<p>You are receiving this email because you requested to reset your password for your account. Click the link below to proceed with resetting your password:</p>
				<a href="${SITE_URL}/account/reset-password/${token}">Reset Password</a>
				<p>If you did not request a password reset, please ignore this email. Your account will not be affected.</p>
				<p>Best regards.</p>
				</body>
				</html>`,
		to: recipientEmail,
	});
};
