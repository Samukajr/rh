const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Payslip = sequelize.define('Payslip', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    reference_month: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reference_year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gross_salary: {
      type: DataTypes.DECIMAL(12, 2),
    },
    net_salary: {
      type: DataTypes.DECIMAL(12, 2),
    },
    total_deductions: {
      type: DataTypes.DECIMAL(12, 2),
    },
    total_additions: {
      type: DataTypes.DECIMAL(12, 2),
    },
    worked_hours: {
      type: DataTypes.DECIMAL(8, 2),
    },
    overtime_hours: {
      type: DataTypes.DECIMAL(8, 2),
    },
    file_path: {
      type: DataTypes.STRING,
    },
    file_name: {
      type: DataTypes.STRING,
    },
    details: {
      type: DataTypes.JSONB, // Para armazenar detalhes dos cálculos
    },
    status: {
      type: DataTypes.ENUM('draft', 'sent', 'viewed'),
      defaultValue: 'draft',
    },
    sent_at: {
      type: DataTypes.DATE,
    },
    viewed_at: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'payslips',
    indexes: [
      { fields: ['employee_id'] },
      { fields: ['reference_month', 'reference_year'] },
      { fields: ['status'] },
    ],
  });

  Payslip.associate = (models) => {
    Payslip.belongsTo(models.Employee, {
      foreignKey: 'employee_id',
      as: 'employee',
    });
  };

  return Payslip;
};