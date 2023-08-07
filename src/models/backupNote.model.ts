import { Column, DataType, Model, PrimaryKey, Table, BelongsTo, ForeignKey, Default } from 'sequelize-typescript';
import User from './user.model';
import { createBackupNoteId } from '@utils/nanoid';

@Table
class BackupNote extends Model {
	@Default(createBackupNoteId)
	@PrimaryKey
	@Column(DataType.STRING(12))
	id!: string;

	@Column(DataType.TEXT({ length: 'long' }))
	content!: string;

	@ForeignKey(() => User)
	@Column(DataType.STRING(12))
	userId?: string;

	@BelongsTo(() => User)
	user!: User;
}

export default BackupNote;
