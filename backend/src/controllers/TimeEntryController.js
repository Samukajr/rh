const db = require('../models');
const Joi = require('joi');
const { Op } = require('sequelize');
const moment = require('moment');

class TimeEntryController {

  /**
   * GET /api/time-entries
   * Lista registros de ponto
   */
  async list(req, res, next) {
    try {
      const schema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        sortBy: Joi.string().valid(
          'entry_date', 'entry_time', 'exit_time', 'created_at'
        ).default('entry_date'),
        sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC'),
        employee_id: Joi.string().uuid().optional(),
        start_date: Joi.date().iso().optional(),
        end_date: Joi.date().iso().optional(),
        month: Joi.number().integer().min(1).max(12).optional(),
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
        employee_id, start_date, end_date, month, year
      } = value;

      const offset = (page - 1) * limit;
      
      // Construir filtros
      const where = {};
      
      // Se não for HR/Admin/Manager, mostrar apenas próprios registros
      if (!['hr', 'admin', 'manager'].includes(req.userRole)) {
        where.employee_id = req.employee?.id;
      } else if (employee_id) {
        where.employee_id = employee_id;
      }
      
      // Filtro por período
      if (start_date && end_date) {
        where.entry_date = {
          [Op.between]: [start_date, end_date]
        };
      } else if (month && year) {
        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0);
        where.entry_date = {
          [Op.between]: [startOfMonth, endOfMonth]
        };
      } else if (year) {
        where.entry_date = {
          [Op.gte]: new Date(`${year}-01-01`),
          [Op.lt]: new Date(`${year + 1}-01-01`)
        };
      }

      const { count, rows: timeEntries } = await db.TimeEntry.findAndCountAll({
        where,
        include: [
          {
            model: db.Employee,
            as: 'employee',
            attributes: ['id', 'first_name', 'last_name', 'department', 'position']
          }
        ],
        order: [[sortBy, sortOrder], ['entry_time', 'ASC']],
        limit,
        offset
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: {
          timeEntries,
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
   * GET /api/time-entries/:id
   * Busca registro por ID
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

      const timeEntry = await db.TimeEntry.findByPk(value.id, {
        include: [
          {
            model: db.Employee,
            as: 'employee',
            attributes: ['id', 'first_name', 'last_name', 'department', 'position']
          }
        ]
      });

      if (!timeEntry) {
        return res.status(404).json({
          error: 'Registro não encontrado'
        });
      }

      // Verificar permissão
      const canAccess = ['hr', 'admin'].includes(req.userRole) ||
                       (req.userRole === 'manager' && timeEntry.employee.manager_id === req.employee?.id) ||
                       timeEntry.employee_id === req.employee?.id;
      
      if (!canAccess) {
        return res.status(403).json({
          error: 'Acesso negado'
        });
      }

      res.json({
        success: true,
        data: { timeEntry }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/time-entries/clock-in
   * Registra entrada
   */
  async clockIn(req, res, next) {
    try {
      const schema = Joi.object({
        entry_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
        location: Joi.string().optional(),
        ip_address: Joi.string().ip().optional(),
        observations: Joi.string().optional()
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

      const today = moment().format('YYYY-MM-DD');
      const currentTime = value.entry_time || moment().format('HH:mm');

      // Verificar se já existe registro para hoje
      const existingEntry = await db.TimeEntry.findOne({
        where: {
          employee_id: req.employee.id,
          entry_date: today
        }
      });

      if (existingEntry) {
        return res.status(409).json({
          error: 'Já existe registro de entrada para hoje',
          existing: existingEntry
        });
      }

      const timeEntry = await db.TimeEntry.create({
        employee_id: req.employee.id,
        entry_date: today,
        entry_time: currentTime,
        location: value.location,
        ip_address: value.ip_address || req.ip,
        observations: value.observations
      });

      res.status(201).json({
        success: true,
        message: 'Entrada registrada com sucesso',
        data: { timeEntry }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/time-entries/clock-out
   * Registra saída
   */
  async clockOut(req, res, next) {
    try {
      const schema = Joi.object({
        exit_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
        observations: Joi.string().optional()
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

      const today = moment().format('YYYY-MM-DD');
      const currentTime = value.exit_time || moment().format('HH:mm');

      // Buscar registro de entrada para hoje
      const timeEntry = await db.TimeEntry.findOne({
        where: {
          employee_id: req.employee.id,
          entry_date: today,
          exit_time: null
        }
      });

      if (!timeEntry) {
        return res.status(404).json({
          error: 'Nenhum registro de entrada encontrado para hoje ou saída já registrada'
        });
      }

      // Calcular horas trabalhadas
      const entryMoment = moment(`${today} ${timeEntry.entry_time}`);
      const exitMoment = moment(`${today} ${currentTime}`);
      
      if (exitMoment.isBefore(entryMoment)) {
        return res.status(400).json({
          error: 'Horário de saída não pode ser anterior ao de entrada'
        });
      }

      const workedHours = exitMoment.diff(entryMoment, 'minutes') / 60;

      await timeEntry.update({
        exit_time: currentTime,
        total_hours: workedHours,
        observations: value.observations || timeEntry.observations
      });

      res.json({
        success: true,
        message: 'Saída registrada com sucesso',
        data: { timeEntry }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/time-entries/:id
   * Atualiza registro de ponto (apenas HR/Admin)
   */
  async update(req, res, next) {
    try {
      // Verificar permissão
      if (!['hr', 'admin'].includes(req.userRole)) {
        return res.status(403).json({
          error: 'Acesso negado. Apenas RH pode editar registros de ponto.'
        });
      }

      const paramsSchema = Joi.object({
        id: Joi.string().uuid().required()
      });

      const bodySchema = Joi.object({
        entry_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
        exit_time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).allow(null).optional(),
        observations: Joi.string().optional(),
        adjustment_reason: Joi.string().when('entry_time', {
          is: Joi.exist(),
          then: Joi.required(),
          otherwise: Joi.optional()
        })
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

      const timeEntry = await db.TimeEntry.findByPk(params.id);
      
      if (!timeEntry) {
        return res.status(404).json({
          error: 'Registro não encontrado'
        });
      }

      // Recalcular horas trabalhadas se necessário
      if (updateData.entry_time || updateData.exit_time) {
        const entryTime = updateData.entry_time || timeEntry.entry_time;
        const exitTime = updateData.exit_time || timeEntry.exit_time;
        
        if (entryTime && exitTime) {
          const entryMoment = moment(`${timeEntry.entry_date} ${entryTime}`);
          const exitMoment = moment(`${timeEntry.entry_date} ${exitTime}`);
          
          if (exitMoment.isBefore(entryMoment)) {
            return res.status(400).json({
              error: 'Horário de saída não pode ser anterior ao de entrada'
            });
          }
          
          updateData.total_hours = exitMoment.diff(entryMoment, 'minutes') / 60;
        }
      }

      // Registrar ajuste
      updateData.adjusted_by = req.userId;
      updateData.adjusted_at = new Date();

      await timeEntry.update(updateData);
      
      res.json({
        success: true,
        message: 'Registro atualizado com sucesso',
        data: { timeEntry }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/time-entries/today
   * Busca registro de hoje do usuário logado
   */
  async getToday(req, res, next) {
    try {
      const today = moment().format('YYYY-MM-DD');

      const timeEntry = await db.TimeEntry.findOne({
        where: {
          employee_id: req.employee.id,
          entry_date: today
        }
      });

      res.json({
        success: true,
        data: { 
          timeEntry,
          hasEntry: !!timeEntry,
          hasExit: timeEntry?.exit_time ? true : false
        }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/time-entries/summary/:employeeId
   * Sumário de horas trabalhadas
   */
  async getSummary(req, res, next) {
    try {
      const paramsSchema = Joi.object({
        employeeId: Joi.string().uuid().required()
      });

      const querySchema = Joi.object({
        month: Joi.number().integer().min(1).max(12).optional(),
        year: Joi.number().integer().min(2020).max(2030).optional()
      });

      const { error: paramsError, value: params } = paramsSchema.validate(req.params);
      if (paramsError) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const { error: queryError, value: query } = querySchema.validate(req.query);
      if (queryError) {
        return res.status(400).json({ error: 'Parâmetros inválidos' });
      }

      // Verificar permissão
      const canAccess = ['hr', 'admin'].includes(req.userRole) ||
                       params.employeeId === req.employee?.id;
      
      if (!canAccess) {
        return res.status(403).json({
          error: 'Acesso negado'
        });
      }

      const { month, year } = query;
      const currentDate = moment();
      const targetMonth = month || currentDate.month() + 1;
      const targetYear = year || currentDate.year();

      const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
      const endOfMonth = new Date(targetYear, targetMonth, 0);

      const timeEntries = await db.TimeEntry.findAll({
        where: {
          employee_id: params.employeeId,
          entry_date: {
            [Op.between]: [startOfMonth, endOfMonth]
          }
        },
        order: [['entry_date', 'ASC']]
      });

      const totalHours = timeEntries.reduce((sum, entry) => sum + (entry.total_hours || 0), 0);
      const totalDays = timeEntries.length;
      const averageHours = totalDays > 0 ? totalHours / totalDays : 0;
      
      // Dias úteis no mês (aproximado - 22 dias)
      const workDays = 22;
      const expectedHours = workDays * 8; // 8h por dia
      const overtime = Math.max(0, totalHours - expectedHours);
      const deficit = Math.max(0, expectedHours - totalHours);

      res.json({
        success: true,
        data: {
          period: {
            month: targetMonth,
            year: targetYear,
            start_date: startOfMonth,
            end_date: endOfMonth
          },
          summary: {
            total_hours: Math.round(totalHours * 100) / 100,
            total_days: totalDays,
            average_hours: Math.round(averageHours * 100) / 100,
            expected_hours: expectedHours,
            overtime_hours: Math.round(overtime * 100) / 100,
            deficit_hours: Math.round(deficit * 100) / 100
          },
          entries: timeEntries
        }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/time-entries/:id
   * Remove registro (apenas HR/Admin)
   */
  async delete(req, res, next) {
    try {
      // Verificar permissão
      if (!['hr', 'admin'].includes(req.userRole)) {
        return res.status(403).json({
          error: 'Acesso negado. Apenas RH pode excluir registros de ponto.'
        });
      }

      const schema = Joi.object({
        id: Joi.string().uuid().required()
      });

      const { error, value } = schema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const timeEntry = await db.TimeEntry.findByPk(value.id);
      
      if (!timeEntry) {
        return res.status(404).json({
          error: 'Registro não encontrado'
        });
      }

      await timeEntry.destroy();
      
      res.json({
        success: true,
        message: 'Registro removido com sucesso'
      });

    } catch (error) {
      next(error);
    }
  }

}

module.exports = new TimeEntryController();