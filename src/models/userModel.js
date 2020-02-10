module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'user',
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      login: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      age: { type: DataTypes.SMALLINT, allowNull: false },
      isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false, field: 'isdeleted' },
    },
    {
      timestamps: false,
    },
  );
};
