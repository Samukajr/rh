const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TimeEntry = sequelize.define('TimeEntry', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('in', 'out', 'break_in', 'break_out'),
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    source: {
      type: DataTypes.ENUM('web', 'app', 'biometric', 'manual'),
      defaultValue: 'web',
    },
    ip_address: {
      type: DataTypes.INET,
    },
    geolocation: {
      type: DataTypes.JSONB,
    },
    notes: {
      type: DataTypes.TEXT,
    },
    is_manual: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    approved_by: {
      type: DataTypes.UUID,
    },
    approved_at: {
      type: DataTypes.DATE,
    },
    status: {
      type: DataTypes.ENUM('normal', 'pending_approval', 'approved', 'rejected'),
      defaultValue: 'normal',
    },
  }, {
    tableName: 'time_entries',
    indexes: [
      { fields: ['employee_id'] },
      { fields: ['timestamp'] },
      { fields: ['type'] },
      { fields: ['status'] },
    ],
  });

  TimeEntry.associate = (models) => {
    TimeEntry.belongsTo(models.Employee, {
      foreignKey: 'employee_id',
      as: 'employee',
    });

    TimeEntry.belongsTo(models.User, {
      foreignKey: 'approved_by',
      as: 'approver',
    });
  };

  return TimeEntry;
};