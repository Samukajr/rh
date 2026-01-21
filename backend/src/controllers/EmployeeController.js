const db = require('../models');
const Joi = require('joi');
const { Op } = require('sequelize');

class EmployeeController {

  /**
   * GET /api/employees
   * Lista todos os funcionários com paginação e filtros
   */
  async list(req, res, next) {
    try {
      const schema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        sortBy: Joi.string().valid(
          'first_name', 'last_name', 'admission_date', 'position', 
          'department', 'created_at'
        ).default('created_at'),
        sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC'),
        search: Joi.string().optional(),
        department: Joi.string().optional(),
        position: Joi.string().optional(),
        contract_type: Joi.string().valid('clt', 'pj', 'intern', 'temporary').optional(),
        is_active: Joi.boolean().optional(),
        manager_id: Joi.string().uuid().optional()
      });

      const { error, value } = schema.validate(req.query);
      if (error) {
        return res.status(400).json({
          error: 'Parâmetros inválidos',
          details: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        });
      }

      const {
        page, limit, sortBy, sortOrder,
        search, department, position, contract_type, is_active, manager_id
      } = value;

      const offset = (page - 1) * limit;
      
      // Construir filtros
      const where = {};
      
      if (search) {
        where[Op.or] = [
          { first_name: { [Op.iLike]: `%${search}%` } },
          { last_name: { [Op.iLike]: `%${search}%` } },
          { cpf: { [Op.like]: `%${search}%` } },
          { position: { [Op.iLike]: `%${search}%` } }
        ];
      }
      
      if (department) where.department = department;
      if (position) where.position = { [Op.iLike]: `%${position}%` };
      if (contract_type) where.contract_type = contract_type;
      if (typeof is_active === 'boolean') where.is_active = is_active;
      if (manager_id) where.manager_id = manager_id;

      const { count, rows: employees } = await db.Employee.findAndCountAll({
        where,
        include: [
          {
            model: db.Employee,
            as: 'manager',
            attributes: ['id', 'first_name', 'last_name', 'position']
          },
          {
            model: db.User,
            as: 'user',
            attributes: ['id', 'email', 'role', 'is_active', 'last_login']
          }
        ],
        order: [[sortBy, sortOrder]],
        limit,
        offset,
        distinct: true
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: {
          employees,
          pagination: {
            page,
            limit,
            total: count,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/employees/:id
   * Busca funcionário por ID
   */
  async getById(req, res, next) {
    try {
      const schema = Joi.object({
        id: Joi.string().uuid().required()
      });

      const { error, value } = schema.validate(req.params);
      if (error) {
        return res.status(400).json({
          error: 'ID inválido'
        });
      }

      const employee = await db.Employee.findByPk(value.id, {
        include: [
          {
            model: db.Employee,
            as: 'manager',
            attributes: ['id', 'first_name', 'last_name', 'position']
          },
          {
            model: db.Employee,
            as: 'subordinates',
            attributes: ['id', 'first_name', 'last_name', 'position', 'department']
          },
          {
            model: db.User,
            as: 'user',
            attributes: ['id', 'email', 'role', 'is_active', 'last_login']
          }
        ]
      });

      if (!employee) {
        return res.status(404).json({
          error: 'Funcionário não encontrado'
        });
      }

      res.json({
        success: true,
        data: { employee }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/employees
   * Cria novo funcionário
   */
  async create(req, res, next) {
    try {
      const schema = Joi.object({
        first_name: Joi.string().min(1).required(),
        last_name: Joi.string().optional().allow('', null).default(''),
        cpf: Joi.string().pattern(/^\d{11}$/).optional().allow('', null),
        rg: Joi.string().optional().allow('', null),
        birth_date: Joi.date().iso().optional().allow('', null),
        admission_date: Joi.date().iso().optional().allow('', null),
        position: Joi.string().optional().allow('', null).default(''),
        department: Joi.string().optional().allow('', null).default(''),
        contract_type: Joi.string().valid('clt', 'pj', 'intern', 'temporary').optional().allow('', null).default('clt'),
        salary: Joi.number().positive().optional().allow(null),
        phone: Joi.string().pattern(/^\d{10,11}$/).optional().allow('', null),
        address: Joi.string().optional().allow('', null),
        emergency_contact: Joi.string().optional().allow('', null),
        emergency_phone: Joi.string().pattern(/^\d{10,11}$/).optional().allow('', null),
        manager_id: Joi.string().uuid().optional().allow(null)
      });

      const body = { ...req.body };

      // Normalizar campos numéricos/strings removendo máscaras
      if (body.cpf) body.cpf = body.cpf.replace(/\D/g, '');
      if (body.phone) body.phone = body.phone.replace(/\D/g, '');
      if (body.emergency_phone) body.emergency_phone = body.emergency_phone.replace(/\D/g, '');

      const { error, value } = schema.validate(body, { convert: true, stripUnknown: true });
      if (error) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        });
      }

      // Limpar campos vazios para null/undefined e aplicar defaults simples
      if (!value.cpf) delete value.cpf;
      if (!value.birth_date) value.birth_date = null;
      if (!value.admission_date) value.admission_date = null;
      if (!value.phone) value.phone = null;
      if (!value.emergency_phone) value.emergency_phone = null;
      if (!value.contract_type || value.contract_type === '') value.contract_type = 'clt';

      // Verificar se CPF já existe
      if (value.cpf) {
        const existingEmployee = await db.Employee.findOne({
          where: { cpf: value.cpf }
        });
        
        if (existingEmployee) {
          return res.status(409).json({
            error: 'CPF já cadastrado'
          });
        }
      }

      const employee = await db.Employee.create(value);
      
      res.status(201).json({
        success: true,
        message: 'Funcionário criado com sucesso',
        data: { employee }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/employees/:id
   * Atualiza funcionário
   */
  async update(req, res, next) {
    try {
      const paramsSchema = Joi.object({
        id: Joi.string().uuid().required()
      });

      const bodySchema = Joi.object({
        first_name: Joi.string().optional(),
        last_name: Joi.string().optional(),
        rg: Joi.string().optional(),
        birth_date: Joi.date().iso().optional(),
        position: Joi.string().optional(),
        department: Joi.string().optional(),
        contract_type: Joi.string().valid('clt', 'pj', 'intern', 'temporary').optional(),
        salary: Joi.number().positive().optional(),
        phone: Joi.string().pattern(/^\d{10,11}$/).optional(),
        address: Joi.string().optional(),
        emergency_contact: Joi.string().optional(),
        emergency_phone: Joi.string().pattern(/^\d{10,11}$/).optional(),
        manager_id: Joi.string().uuid().allow(null).optional(),
        dismissal_date: Joi.date().iso().allow(null).optional(),
        is_active: Joi.boolean().optional()
      });

      const { error: paramsError, value: params } = paramsSchema.validate(req.params);
      if (paramsError) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const { error: bodyError, value: updateData } = bodySchema.validate(req.body);
      if (bodyError) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: bodyError.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        });
      }

      const employee = await db.Employee.findByPk(params.id);
      
      if (!employee) {
        return res.status(404).json({
          error: 'Funcionário não encontrado'
        });
      }

      await employee.update(updateData);
      
      res.json({
        success: true,
        message: 'Funcionário atualizado com sucesso',
        data: { employee }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/employees/:id
   * Remove funcionário (soft delete)
   */
  async delete(req, res, next) {
    try {
      const schema = Joi.object({
        id: Joi.string().uuid().required()
      });

      const { error, value } = schema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const employee = await db.Employee.findByPk(value.id);
      
      if (!employee) {
        return res.status(404).json({
          error: 'Funcionário não encontrado'
        });
      }

      // Soft delete - marcar como inativo
      await employee.update({ 
        is_active: false,
        dismissal_date: new Date()
      });
      
      res.json({
        success: true,
        message: 'Funcionário removido com sucesso'
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/employees/departments
   * Lista departamentos únicos
   */
  async getDepartments(req, res, next) {
    try {
      const departments = await db.Employee.findAll({
        attributes: [
          [db.sequelize.fn('DISTINCT', db.sequelize.col('department')), 'department']
        ],
        where: { is_active: true },
        order: [['department', 'ASC']],
        raw: true
      });

      res.json({
        success: true,
        data: { departments: departments.map(d => d.department) }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/employees/positions
   * Lista cargos únicos
   */
  async getPositions(req, res, next) {
    try {
      const positions = await db.Employee.findAll({
        attributes: [
          [db.sequelize.fn('DISTINCT', db.sequelize.col('position')), 'position']
        ],
        where: { is_active: true },
        order: [['position', 'ASC']],
        raw: true
      });

      res.json({
        success: true,
        data: { positions: positions.map(p => p.position) }
      });

    } catch (error) {
      next(error);
    }
  }

}

module.exports = new EmployeeController();