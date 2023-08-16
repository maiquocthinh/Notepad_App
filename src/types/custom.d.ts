import 'express-session';
import { SessionDataClient, SessionDataNotesLoggedIn, SessionDataUser } from '../types/session.types';

declare module 'express-session' {
	interface SessionData {
		user?: SessionDataUser;
		client?: SessionDataClient | null;
		notesLoggedIn: SessionDataNotesLoggedIn;
	}
}
