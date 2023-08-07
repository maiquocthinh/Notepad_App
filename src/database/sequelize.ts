import { Sequelize } from 'sequelize-typescript';
import env from '@utils/env';
import { User, Note, BackupNote } from '@models/index';

const { POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASS } = env;

const sequelize = new Sequelize(POSTGRES_DB, POSTGRES_USER, POSTGRES_PASS, {
	host: POSTGRES_HOST,
	dialect: 'postgres',
	models: [User, Note, BackupNote],
	define: { timestamps: true, underscored: true },
	logging: false,
});

User.init({}, { sequelize, modelName: 'User', tableName: 'users' });
Note.init({}, { sequelize, modelName: 'Note', tableName: 'notes' });
BackupNote.init({}, { sequelize, modelName: 'BackupNote', tableName: 'backup_notes' });

sequelize.addModels([User, Note, BackupNote]);

export default sequelize;
