const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('employee', 'manager', 'hr', 'finance', 'admin'),
      allowNull: false,
      defaultValue: 'employee',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    last_login: {
      type: DataTypes.DATE,
    },
    password_reset_token: {
      type: DataTypes.STRING,
    },
    password_reset_expires: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'users',
    indexes: [
      { fields: ['email'] },
      { fields: ['role'] },
    ],
  });

  User.associate = (models) => {
    User.belongsTo(models.Employee, {
      foreignKey: 'employee_id',
      as: 'employee',
    });
  };

  return User;
};