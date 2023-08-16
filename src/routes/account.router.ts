import { Router, Request, Response } from 'express';

import { accountController } from '@controllers/index';
import { checkLogin } from '@middlewares/auth.middleware';

const {
	login,
	register,
	logout,
	forgot,
	resetPassword,
	panel,
	captcha,
	forgotPost,
	loginPost,
	registerPost,
	updateAccount,
	resetPasswordPost,
} = accountController;

const router = Router();

router.get('/login', login);
router.post('/login', loginPost);
router.get('/register', register);
router.post('/register', registerPost);
router.get('/logout', logout);
router.get('/forgot', forgot);
router.post('/forgot', forgotPost);
router.get('/reset-password/:token', resetPassword);
router.post('/reset-password/:token', resetPasswordPost);
router.get('/panel', checkLogin, panel);
router.get('/captcha', captcha);
router.patch('/', checkLogin, updateAccount);
router.get('*', (req: Request, res: Response) => {
	return res.redirect('/account/panel');
});

export default router;
