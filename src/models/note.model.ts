import { Column, DataType, Model, PrimaryKey, Table, BelongsTo, ForeignKey, Default, Unique } from 'sequelize-typescript';
import User from './user.model';
import { createNoteId, createUniqueSlug } from '@utils/nanoid';

@Table
class Note extends Model {
	@Default(createNoteId)
	@PrimaryKey
	@Column(DataType.STRING(12))
	id!: string;

	@Column(DataType.TEXT({ length: 'long' }))
	content!: string;

	@Unique
	@Default(createUniqueSlug)
	@Column(DataType.STRING(20))
	slug!: string;

	@Unique
	@Default(createUniqueSlug)
	@Column(DataType.STRING(20))
	externalSlug!: string;

	@Default(false)
	@Column(DataType.BOOLEAN)
	needPassword!: boolean;

	@Column(DataType.STRING)
	hashPassword?: string | null;

	@ForeignKey(() => User)
	@Column(DataType.STRING(12))
	userId?: string;

	@BelongsTo(() => User)
	user!: User;
}

export default Note;
