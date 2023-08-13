import { Column, DataType, Model, PrimaryKey, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './user.model';

@Table
class Session extends Model {
	@PrimaryKey
	@Column(DataType.STRING)
	sid!: string;

	@Column(DataType.DATE)
	expires!: Date;

	@Column(DataType.TEXT)
	data?: string;

	@ForeignKey(() => User)
	@Column(DataType.STRING(12))
	userId!: string;

	@BelongsTo(() => User)
	user!: User;
}

export default Session;
