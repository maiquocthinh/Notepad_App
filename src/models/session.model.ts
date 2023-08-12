import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table
class Session extends Model {
	@PrimaryKey
	@Column(DataType.STRING)
	sid!: string;

	@Column(DataType.DATE)
	expires!: Date;

	@Column(DataType.TEXT)
	data?: string;

	@Column(DataType.STRING(12))
	userId!: string;
}

export default Session;
