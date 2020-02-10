import { PERMISSIONS } from '../constants/permissions';

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'group',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      permissions: {
        type: DataTypes.ARRAY(
          DataTypes.ENUM({
            values: PERMISSIONS,
          }),
        ),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    },
  );
};
