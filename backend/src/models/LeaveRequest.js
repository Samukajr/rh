const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LeaveRequest = sequelize.define('LeaveRequest', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('vacation', 'sick', 'unpaid', 'maternity', 'paternity', 'other'),
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    total_days: {
      type: DataTypes.INTEGER,
    },
    reason: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled'),
      defaultValue: 'pending',
    },
    manager_notes: {
      type: DataTypes.TEXT,
    },
    hr_notes: {
      type: DataTypes.TEXT,
    },
    approved_by: {
      type: DataTypes.UUID,
    },
    approved_at: {
      type: DataTypes.DATE,
    },
    rejected_by: {
      type: DataTypes.UUID,
    },
    rejected_at: {
      type: DataTypes.DATE,
    },
    rejection_reason: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'leave_requests',
    indexes: [
      { fields: ['employee_id'] },
      { fields: ['status'] },
      { fields: ['type'] },
      { fields: ['start_date'] },
      { fields: ['end_date'] },
    ],
  });

  LeaveRequest.associate = (models) => {
    LeaveRequest.belongsTo(models.Employee, {
      foreignKey: 'employee_id',
      as: 'employee',
    });

    LeaveRequest.belongsTo(models.User, {
      foreignKey: 'approved_by',
      as: 'approver',
    });

    LeaveRequest.belongsTo(models.User, {
      foreignKey: 'rejected_by',
      as: 'rejector',
    });
  };

  return LeaveRequest;
};