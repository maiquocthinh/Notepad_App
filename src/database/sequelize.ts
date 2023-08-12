import { Sequelize } from 'sequelize-typescript';
import env from '@utils/env';
import { User, Note, BackupNote, Session } from '@models/index';

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASS } = env;

const sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASS, {
	host: POSTGRES_HOST,
	dialect: 'postgres',
	models: [User, Note, BackupNote, Session],
	define: { timestamps: true, underscored: true },
	logging: false,
});

User.init({}, { sequelize, modelName: 'User', tableName: 'users' });
Note.init({}, { sequelize, modelName: 'Note', tableName: 'notes' });
BackupNote.init({}, { sequelize, modelName: 'BackupNote', tableName: 'backup_notes' });
Session.init({}, { sequelize, modelName: 'Session', tableName: 'sessions' });

sequelize.addModels([User, Note, BackupNote, Session]);

export default sequelize;
