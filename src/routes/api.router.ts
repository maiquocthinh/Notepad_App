import { Router } from 'express';
import { apiController } from '@controllers/index';
import { checkLogin, checkNoteBelongToUser } from '@middlewares/auth.middleware';

const router = Router();

const { setPasswordForNote, deleteNote, backupNote, downloadNote } = apiController;

router.post('/note/set-password/:noteId', setPasswordForNote);
router.delete('/note/delete/:noteId', checkLogin, checkNoteBelongToUser, deleteNote);
router.post('/note/backup/:noteId', checkLogin, checkNoteBelongToUser, backupNote);
router.get('/note/download/:noteId', checkLogin, checkNoteBelongToUser, downloadNote);

export default router;
