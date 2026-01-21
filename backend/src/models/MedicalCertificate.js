const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const MedicalCertificate = sequelize.define('MedicalCertificate', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_name: {
      type: DataTypes.STRING,
    },
    file_size: {
      type: DataTypes.INTEGER,
    },
    mime_type: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending',
    },
    notes: {
      type: DataTypes.TEXT,
    },
    rejection_reason: {
      type: DataTypes.TEXT,
    },
    approved_by: {
      type: DataTypes.UUID,
    },
    approved_at: {
      type: DataTypes.DATE,
    },
    cid_code: {
      type: DataTypes.STRING(10),
    },
    doctor_crm: {
      type: DataTypes.STRING(20),
    },
    doctor_name: {
      type: DataTypes.STRING,
    },
  }, {
    tableName: 'medical_certificates',
    indexes: [
      { fields: ['employee_id'] },
      { fields: ['status'] },
      { fields: ['start_date'] },
      { fields: ['end_date'] },
    ],
  });

  MedicalCertificate.associate = (models) => {
    MedicalCertificate.belongsTo(models.Employee, {
      foreignKey: 'employee_id',
      as: 'employee',
    });

    MedicalCertificate.belongsTo(models.User, {
      foreignKey: 'approved_by',
      as: 'approver',
    });
  };

  return MedicalCertificate;
};