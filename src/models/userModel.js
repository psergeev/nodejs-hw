const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize(
  'postgres://dcvhhhcf:tcPBPmnFOJbVKfyPUgOPTo9PBTMNcMgT@manny.db.elephantsql.com:5432/dcvhhhcf',
);

export class UserModel extends Model {}

UserModel.init(
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    login: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    age: { type: DataTypes.SMALLINT, allowNull: false },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false, field: 'isdeleted' },
  },
  { sequelize, modelName: 'user', timestamps: false },
);
