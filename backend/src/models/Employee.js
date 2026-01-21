const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Employee = sequelize.define('Employee', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: {
          msg: 'Email deve ter formato válido'
        },
        notEmptyIfProvided(value) {
          if (value === '') return true;
          if (value && !value.includes('@')) {
            throw new Error('Email deve ter formato válido');
          }
        }
      },
    },
    cpf: {
      type: DataTypes.STRING(11),
      unique: false,
      allowNull: true,
      validate: {
        validCPF(value) {
          if (value && value.length !== 11) {
            throw new Error('CPF deve ter 11 dígitos');
          }
        }
      },
    },
    rg: {
      type: DataTypes.STRING(20),
    },
    birth_date: {
      type: DataTypes.DATEONLY,
    },
    admission_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
    dismissal_date: {
      type: DataTypes.DATEONLY,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: '',
    },
    contract_type: {
      type: DataTypes.ENUM('clt', 'pj', 'intern', 'temporary'),
      defaultValue: 'clt',
    },
    salary: {
      type: DataTypes.DECIMAL(12, 2),
    },
    phone: {
      type: DataTypes.STRING(20),
    },
    address: {
      type: DataTypes.TEXT,
    },
    emergency_contact: {
      type: DataTypes.STRING,
    },
    emergency_phone: {
      type: DataTypes.STRING(20),
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'employees',
    indexes: [
      { fields: ['cpf'] },
      { fields: ['department'] },
      { fields: ['manager_id'] },
      { fields: ['is_active'] },
    ],
  });

  Employee.associate = (models) => {
    // Self-reference para manager
    Employee.belongsTo(models.Employee, {
      foreignKey: 'manager_id',
      as: 'manager',
    });
    
    Employee.hasMany(models.Employee, {
      foreignKey: 'manager_id',
      as: 'subordinates',
    });

    // Um employee pode ter um user
    Employee.hasOne(models.User, {
      foreignKey: 'employee_id',
      as: 'user',
    });

    // Relacionamentos com outras entidades
    Employee.hasMany(models.MedicalCertificate, {
      foreignKey: 'employee_id',
      as: 'medical_certificates',
    });

    Employee.hasMany(models.LeaveRequest, {
      foreignKey: 'employee_id',
      as: 'leave_requests',
    });

    Employee.hasMany(models.TimeEntry, {
      foreignKey: 'employee_id',
      as: 'time_entries',
    });

    Employee.hasMany(models.Payslip, {
      foreignKey: 'employee_id',
      as: 'payslips',
    });
  };

  return Employee;
};