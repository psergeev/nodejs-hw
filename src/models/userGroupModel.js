module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'userGroup',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      group_id: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      timestamps: false,
      tableName: 'usergroups',
    },
  );
};
