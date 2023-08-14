import { Router } from 'express';
import { apiController } from '@controllers/index';
import { checkBackupNoteBelongToUser, checkLogin, checkNoteBelongToUser } from '@middlewares/auth.middleware';
import { deleteBackupNote, downloadBackupNote } from '@controllers/api.controller';

const router = Router();

const { setPasswordForNote, deleteNote, backupNote, downloadNote } = apiController;

router.post('/note/set-password/:noteId', setPasswordForNote);
router.delete('/note/delete/:noteId', checkLogin, checkNoteBelongToUser, deleteNote);
router.post('/note/backup/:noteId', checkLogin, checkNoteBelongToUser, backupNote);
router.get('/note/download/:noteId', checkLogin, checkNoteBelongToUser, downloadNote);
router.delete('/backup-note/delete/:backupNoteId', checkLogin, checkBackupNoteBelongToUser, deleteBackupNote);
router.get('/backup-note/download/:backupNoteId', checkLogin, checkBackupNoteBelongToUser, downloadBackupNote);

export default router;
