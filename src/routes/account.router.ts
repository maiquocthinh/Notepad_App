import { Router, Request, Response } from 'express';

import { accountController } from '@controllers/index';

const { login, register, logout, panel } = accountController;

const router = Router();

router.get('/login', login);
router.get('/register', register);
router.get('/logout', logout);
router.get('/panel', panel);
router.get('*', (req: Request, res: Response) => {
	return res.redirect('/account/panel');
});

export default router;
