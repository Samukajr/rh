const db = require('../models');
const Joi = require('joi');
const { Op } = require('sequelize');
const moment = require('moment');

class LeaveRequestController {

  /**
   * GET /api/leave-requests
   * Lista solicitações de férias
   */
  async list(req, res, next) {
    try {
      const schema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        sortBy: Joi.string().valid(
          'start_date', 'end_date', 'status', 'created_at'
        ).default('created_at'),
        sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC'),
        employee_id: Joi.string().uuid().optional(),
        status: Joi.string().valid('pending', 'approved', 'rejected').optional(),
        year: Joi.number().integer().min(2020).max(2030).optional()
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
        employee_id, status, year
      } = value;

      const offset = (page - 1) * limit;
      
      // Construir filtros
      const where = {};
      
      // Se não for HR/Admin/Manager, mostrar apenas próprias solicitações
      if (!['hr', 'admin', 'manager'].includes(req.userRole)) {
        where.employee_id = req.employee?.id;
      } else if (employee_id) {
        where.employee_id = employee_id;
      }
      
      if (status) where.status = status;
      
      if (year) {
        where.start_date = {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lt]: new Date(`${year + 1}-01-01`)
        };
      }

      const { count, rows: requests } = await db.LeaveRequest.findAndCountAll({
        where,
        include: [
          {
            model: db.Employee,
            as: 'employee',
            attributes: ['id', 'first_name', 'last_name', 'department', 'position']
          }
        ],
        order: [[sortBy, sortOrder]],
        limit,
        offset
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: {
          requests,
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
   * GET /api/leave-requests/:id
   * Busca solicitação por ID
   */
  async getById(req, res, next) {
    try {
      const schema = Joi.object({
        id: Joi.string().uuid().required()
      });

      const { error, value } = schema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const request = await db.LeaveRequest.findByPk(value.id, {
        include: [
          {
            model: db.Employee,
            as: 'employee',
            attributes: ['id', 'first_name', 'last_name', 'department', 'position']
          }
        ]
      });

      if (!request) {
        return res.status(404).json({
          error: 'Solicitação não encontrada'
        });
      }

      // Verificar permissão
      const canAccess = ['hr', 'admin'].includes(req.userRole) ||
                       (req.userRole === 'manager' && request.employee.manager_id === req.employee?.id) ||
                       request.employee_id === req.employee?.id;
      
      if (!canAccess) {
        return res.status(403).json({
          error: 'Acesso negado'
        });
      }

      res.json({
        success: true,
        data: { request }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/leave-requests
   * Cria nova solicitação de férias
   */
  async create(req, res, next) {
    try {
      const schema = Joi.object({
        start_date: Joi.date().iso().min('now').required(),
        end_date: Joi.date().iso().min(Joi.ref('start_date')).required(),
        type: Joi.string().valid('vacation', 'paid_leave', 'unpaid_leave').required(),
        reason: Joi.string().optional(),
        emergency_contact: Joi.string().optional(),
        emergency_phone: Joi.string().pattern(/^\d{10,11}$/).optional()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        });
      }

      // Calcular dias de férias
      const startDate = moment(value.start_date);
      const endDate = moment(value.end_date);
      const totalDays = endDate.diff(startDate, 'days') + 1;

      // Verificar se há conflitos com outras solicitações aprovadas
      const conflictingRequests = await db.LeaveRequest.findAll({
        where: {
          employee_id: req.employee.id,
          status: 'approved',
          [Op.or]: [
            {
              start_date: {
                [Op.between]: [value.start_date, value.end_date]
              }
            },
            {
              end_date: {
                [Op.between]: [value.start_date, value.end_date]
              }
            },
            {
              [Op.and]: [
                { start_date: { [Op.lte]: value.start_date } },
                { end_date: { [Op.gte]: value.end_date } }
              ]
            }
          ]
        }
      });

      if (conflictingRequests.length > 0) {
        return res.status(409).json({
          error: 'Já existem férias aprovadas para este período',
          conflicts: conflictingRequests
        });
      }

      const requestData = {
        ...value,
        employee_id: req.employee.id,
        total_days: totalDays,
        status: 'pending'
      };

      const leaveRequest = await db.LeaveRequest.create(requestData);
        
      res.status(201).json({
        success: true,
        message: 'Solicitação de férias enviada com sucesso',
        data: { request: leaveRequest }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/leave-requests/:id/status
   * Atualiza status da solicitação (Manager/HR/Admin)
   */
  async updateStatus(req, res, next) {
    try {
      // Verificar permissão
      if (!['hr', 'admin', 'manager'].includes(req.userRole)) {
        return res.status(403).json({
          error: 'Acesso negado. Apenas gestores e RH podem aprovar/rejeitar férias.'
        });
      }

      const paramsSchema = Joi.object({
        id: Joi.string().uuid().required()
      });

      const bodySchema = Joi.object({
        status: Joi.string().valid('approved', 'rejected').required(),
        rejection_reason: Joi.string().when('status', {
          is: 'rejected',
          then: Joi.required(),
          otherwise: Joi.optional()
        }),
        manager_observations: Joi.string().optional()
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

      const leaveRequest = await db.LeaveRequest.findByPk(params.id, {
        include: [
          {
            model: db.Employee,
            as: 'employee',
            attributes: ['id', 'manager_id']
          }
        ]
      });
      
      if (!leaveRequest) {
        return res.status(404).json({
          error: 'Solicitação não encontrada'
        });
      }

      // Verificar se manager pode aprovar este funcionário
      if (req.userRole === 'manager' && leaveRequest.employee.manager_id !== req.employee?.id) {
        return res.status(403).json({
          error: 'Você só pode aprovar solicitações de seus subordinados'
        });
      }

      if (leaveRequest.status !== 'pending') {
        return res.status(400).json({
          error: 'Solicitação já foi processada'
        });
      }

      await leaveRequest.update({
        ...updateData,
        approved_by: req.userId,
        approved_at: new Date()
      });
      
      res.json({
        success: true,
        message: `Solicitação ${updateData.status === 'approved' ? 'aprovada' : 'rejeitada'} com sucesso`,
        data: { request: leaveRequest }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/leave-requests/:id
   * Atualiza solicitação (apenas própria e se pendente)
   */
  async update(req, res, next) {
    try {
      const paramsSchema = Joi.object({
        id: Joi.string().uuid().required()
      });

      const bodySchema = Joi.object({
        start_date: Joi.date().iso().min('now').optional(),
        end_date: Joi.date().iso().optional(),
        type: Joi.string().valid('vacation', 'paid_leave', 'unpaid_leave').optional(),
        reason: Joi.string().optional(),
        emergency_contact: Joi.string().optional(),
        emergency_phone: Joi.string().pattern(/^\d{10,11}$/).optional()
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

      const leaveRequest = await db.LeaveRequest.findByPk(params.id);
      
      if (!leaveRequest) {
        return res.status(404).json({
          error: 'Solicitação não encontrada'
        });
      }

      // Verificar permissão
      if (leaveRequest.employee_id !== req.employee?.id && !['hr', 'admin'].includes(req.userRole)) {
        return res.status(403).json({
          error: 'Acesso negado'
        });
      }

      if (leaveRequest.status !== 'pending') {
        return res.status(400).json({
          error: 'Não é possível alterar solicitação já processada'
        });
      }

      // Recalcular dias se datas mudaram
      if (updateData.start_date || updateData.end_date) {
        const startDate = moment(updateData.start_date || leaveRequest.start_date);
        const endDate = moment(updateData.end_date || leaveRequest.end_date);
        updateData.total_days = endDate.diff(startDate, 'days') + 1;
      }

      await leaveRequest.update(updateData);
      
      res.json({
        success: true,
        message: 'Solicitação atualizada com sucesso',
        data: { request: leaveRequest }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/leave-requests/:id
   * Remove solicitação (apenas própria e se pendente)
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

      const leaveRequest = await db.LeaveRequest.findByPk(value.id);
      
      if (!leaveRequest) {
        return res.status(404).json({
          error: 'Solicitação não encontrada'
        });
      }

      // Verificar permissão
      if (leaveRequest.employee_id !== req.employee?.id && !['hr', 'admin'].includes(req.userRole)) {
        return res.status(403).json({
          error: 'Acesso negado'
        });
      }

      if (leaveRequest.status === 'approved') {
        return res.status(400).json({
          error: 'Não é possível excluir solicitação já aprovada'
        });
      }

      await leaveRequest.destroy();
      
      res.json({
        success: true,
        message: 'Solicitação removida com sucesso'
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/leave-requests/balance/:employeeId
   * Consulta saldo de férias
   */
  async getBalance(req, res, next) {
    try {
      const schema = Joi.object({
        employeeId: Joi.string().uuid().required()
      });

      const { error, value } = schema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      // Verificar permissão
      const canAccess = ['hr', 'admin'].includes(req.userRole) ||
                       value.employeeId === req.employee?.id;
      
      if (!canAccess) {
        return res.status(403).json({
          error: 'Acesso negado'
        });
      }

      const employee = await db.Employee.findByPk(value.employeeId);
      if (!employee) {
        return res.status(404).json({
          error: 'Funcionário não encontrado'
        });
      }

      // Calcular tempo de trabalho
      const admissionDate = moment(employee.admission_date);
      const now = moment();
      const monthsWorked = now.diff(admissionDate, 'months');
      
      // 30 dias de férias por ano (2.5 dias por mês)
      const earnedDays = Math.floor(monthsWorked * 2.5);
      
      // Dias já usados (aprovados)
      const usedRequests = await db.LeaveRequest.findAll({
        where: {
          employee_id: value.employeeId,
          status: 'approved',
          type: 'vacation'
        }
      });
      
      const usedDays = usedRequests.reduce((total, request) => total + request.total_days, 0);
      
      // Dias pendentes
      const pendingRequests = await db.LeaveRequest.findAll({
        where: {
          employee_id: value.employeeId,
          status: 'pending',
          type: 'vacation'
        }
      });
      
      const pendingDays = pendingRequests.reduce((total, request) => total + request.total_days, 0);

      res.json({
        success: true,
        data: {
          employee: {
            id: employee.id,
            name: `${employee.first_name} ${employee.last_name}`,
            admission_date: employee.admission_date
          },
          balance: {
            earned_days: earnedDays,
            used_days: usedDays,
            pending_days: pendingDays,
            available_days: earnedDays - usedDays - pendingDays,
            months_worked: monthsWorked
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }

}

module.exports = new LeaveRequestController();