import { Router, Request, Response } from 'express';

import { accountController } from '@controllers/index';
import { registerPost } from '@controllers/account.controller';

const { login, register, logout, forgot, resetPassword, panel, captcha } = accountController;

const router = Router();

router.get('/login', login);
router.get('/register', register);
router.post('/register', registerPost);
router.get('/logout', logout);
router.get('/forgot', forgot);
router.get('/reset-password', resetPassword);
router.get('/panel', panel);
router.get('/captcha', captcha);
router.get('*', (req: Request, res: Response) => {
	return res.redirect('/account/panel');
});

export default router;
