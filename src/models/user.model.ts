import {
	Column,
	DataType,
	Model,
	PrimaryKey,
	Table,
	HasMany,
	Default,
	BeforeCreate,
	Unique,
	BeforeUpdate,
} from 'sequelize-typescript';
import Note from './note.model';
import BackupNote from './backupNote.model';
import Session from './session.model';
import bcrypt from 'bcryptjs';
import { createUserId } from '@utils/nanoid';

@Table
class User extends Model {
	@Default(createUserId)
	@PrimaryKey
	@Column(DataType.STRING(12))
	id!: string;

	@Unique({
		name: 'unique_email_constraint',
		msg: 'This email already exists. Please use another email.',
	})
	@Column(DataType.STRING)
	email!: string;

	@Unique({
		name: 'unique_username_constraint',
		msg: 'This username already exists. Please choose another username.',
	})
	@Column(DataType.STRING)
	username!: string;

	@Default('https://i.imgur.com/iNsPoYP.jpg')
	@Column(DataType.STRING)
	avatar!: string;

	@Column(DataType.STRING)
	hashPassword?: string;

	@HasMany(() => Note)
	notes!: Note[];

	@HasMany(() => BackupNote)
	backupNotes!: BackupNote[];

	@HasMany(() => Session)
	sessions!: Session[];

	@BeforeCreate
	static hashPasswordBeforeCreate(user: User) {
		if (user.hashPassword) {
			const salt = bcrypt.genSaltSync(10);
			const hashedPassword = bcrypt.hashSync(user.hashPassword, salt);
			user.hashPassword = hashedPassword;
		}
	}

	@BeforeUpdate
	static hashPasswordBeforeUpdate(user: User) {
		if (user.changed('hashPassword') && user.hashPassword) {
			const salt = bcrypt.genSaltSync(10);
			const hashedPassword = bcrypt.hashSync(user.hashPassword, salt);
			user.hashPassword = hashedPassword;
		}
	}
}

export default User;
