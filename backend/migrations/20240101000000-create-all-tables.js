'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Criar tabela employees
    await queryInterface.createTable('employees', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      cpf: {
        type: Sequelize.STRING(11),
        allowNull: false,
        unique: true
      },
      rg: Sequelize.STRING(20),
      birth_date: Sequelize.DATE,
      admission_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      position: {
        type: Sequelize.STRING,
        allowNull: false
      },
      department: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contract_type: {
        type: Sequelize.ENUM('clt', 'pj', 'temporary', 'intern'),
        defaultValue: 'clt'
      },
      salary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      phone: Sequelize.STRING(20),
      address: Sequelize.TEXT,
      emergency_contact: Sequelize.STRING,
      emergency_phone: Sequelize.STRING(20),
      email: Sequelize.STRING,
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Criar tabela users
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      role: {
        type: Sequelize.ENUM('admin', 'manager', 'employee'),
        defaultValue: 'employee'
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      employee_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'employees',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Criar tabela time_entries
    await queryInterface.createTable('time_entries', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      entry_type: {
        type: Sequelize.ENUM('clock_in', 'clock_out', 'break_start', 'break_end'),
        allowNull: false
      },
      entry_time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      notes: Sequelize.TEXT,
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Criar tabela leave_requests
    await queryInterface.createTable('leave_requests', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      leave_type: {
        type: Sequelize.ENUM('vacation', 'sick', 'personal', 'other'),
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      reason: Sequelize.TEXT,
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      approved_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Criar tabela medical_certificates
    await queryInterface.createTable('medical_certificates', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      issue_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      doctor_name: Sequelize.STRING,
      doctor_crm: Sequelize.STRING,
      diagnosis: Sequelize.TEXT,
      document_path: Sequelize.STRING,
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Criar tabela payslips
    await queryInterface.createTable('payslips', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      employee_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'employees',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      reference_month: {
        type: Sequelize.DATE,
        allowNull: false
      },
      gross_salary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      deductions: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0
      },
      net_salary: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      payment_date: Sequelize.DATE,
      document_path: Sequelize.STRING,
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'paid'),
        defaultValue: 'pending'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Criar tabela notifications
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('info', 'warning', 'error', 'success'),
        defaultValue: 'info'
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Criar tabela audit_logs
    await queryInterface.createTable('audit_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false
      },
      entity_type: Sequelize.STRING,
      entity_id: Sequelize.INTEGER,
      changes: Sequelize.TEXT,
      ip_address: Sequelize.STRING,
      user_agent: Sequelize.STRING,
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('audit_logs');
    await queryInterface.dropTable('notifications');
    await queryInterface.dropTable('payslips');
    await queryInterface.dropTable('medical_certificates');
    await queryInterface.dropTable('leave_requests');
    await queryInterface.dropTable('time_entries');
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('employees');
  }
};
