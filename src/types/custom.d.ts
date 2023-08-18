import 'express-session';
import 'http';
import { Session, SessionData } from 'express-session';
import { SessionDataClient, SessionDataNotesLoggedIn, SessionDataUser } from '../types/session.types';

declare module 'express-session' {
	interface SessionData {
		user?: SessionDataUser;
		client?: SessionDataClient | null;
		notesLoggedIn: SessionDataNotesLoggedIn;
	}
}

declare module 'http' {
	interface IncomingMessage {
		session: Session & Partial<SessionData>;
	}
}
