const db = require('../models');
const Joi = require('joi');
const { Op } = require('sequelize');
const moment = require('moment');

class PayslipController {

  /**
   * GET /api/payslips
   * Lista holerites
   */
  async list(req, res, next) {
    try {
      const schema = Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(10),
        sortBy: Joi.string().valid(
          'reference_month', 'reference_year', 'created_at'
        ).default('reference_year'),
        sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC'),
        employee_id: Joi.string().uuid().optional(),
        reference_month: Joi.number().integer().min(1).max(12).optional(),
        reference_year: Joi.number().integer().min(2020).max(2030).optional()
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
        employee_id, reference_month, reference_year
      } = value;

      const offset = (page - 1) * limit;
      
      // Construir filtros
      const where = {};
      
      // Se não for HR/Admin/Finance, mostrar apenas próprios holerites
      if (!['hr', 'admin', 'finance'].includes(req.userRole)) {
        where.employee_id = req.employee?.id;
      } else if (employee_id) {
        where.employee_id = employee_id;
      }
      
      if (reference_month) where.reference_month = reference_month;
      if (reference_year) where.reference_year = reference_year;

      const { count, rows: payslips } = await db.Payslip.findAndCountAll({
        where,
        include: [
          {
            model: db.Employee,
            as: 'employee',
            attributes: ['id', 'first_name', 'last_name', 'department', 'position']
          }
        ],
        order: [[sortBy, sortOrder], ['reference_month', 'DESC']],
        limit,
        offset
      });

      const totalPages = Math.ceil(count / limit);

      res.json({
        success: true,
        data: {
          payslips,
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
   * GET /api/payslips/:id
   * Busca holerite por ID
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

      const payslip = await db.Payslip.findByPk(value.id, {
        include: [
          {
            model: db.Employee,
            as: 'employee',
            attributes: ['id', 'first_name', 'last_name', 'department', 'position', 'salary']
          }
        ]
      });

      if (!payslip) {
        return res.status(404).json({
          error: 'Holerite não encontrado'
        });
      }

      // Verificar permissão
      const canAccess = ['hr', 'admin', 'finance'].includes(req.userRole) ||
                       payslip.employee_id === req.employee?.id;
      
      if (!canAccess) {
        return res.status(403).json({
          error: 'Acesso negado'
        });
      }

      res.json({
        success: true,
        data: { payslip }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/payslips
   * Cria novo holerite (apenas HR/Finance/Admin)
   */
  async create(req, res, next) {
    try {
      // Verificar permissão
      if (!['hr', 'admin', 'finance'].includes(req.userRole)) {
        return res.status(403).json({
          error: 'Acesso negado. Apenas RH e Financeiro podem gerar holerites.'
        });
      }

      const schema = Joi.object({
        employee_id: Joi.string().uuid().required(),
        reference_month: Joi.number().integer().min(1).max(12).required(),
        reference_year: Joi.number().integer().min(2020).max(2030).required(),
        base_salary: Joi.number().positive().required(),
        worked_hours: Joi.number().min(0).optional(),
        overtime_hours: Joi.number().min(0).default(0),
        
        // Proventos
        salary_amount: Joi.number().min(0).required(),
        overtime_amount: Joi.number().min(0).default(0),
        bonus_amount: Joi.number().min(0).default(0),
        commission_amount: Joi.number().min(0).default(0),
        vacation_allowance: Joi.number().min(0).default(0),
        thirteenth_salary: Joi.number().min(0).default(0),
        other_earnings: Joi.number().min(0).default(0),
        
        // Deduções
        inss_deduction: Joi.number().min(0).default(0),
        irrf_deduction: Joi.number().min(0).default(0),
        fgts_deduction: Joi.number().min(0).default(0),
        health_insurance: Joi.number().min(0).default(0),
        dental_insurance: Joi.number().min(0).default(0),
        life_insurance: Joi.number().min(0).default(0),
        union_fee: Joi.number().min(0).default(0),
        meal_voucher_discount: Joi.number().min(0).default(0),
        transport_voucher_discount: Joi.number().min(0).default(0),
        other_deductions: Joi.number().min(0).default(0),
        
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

      // Verificar se funcionário existe
      const employee = await db.Employee.findByPk(value.employee_id);
      if (!employee) {
        return res.status(404).json({
          error: 'Funcionário não encontrado'
        });
      }

      // Verificar se já existe holerite para este mês/ano
      const existingPayslip = await db.Payslip.findOne({
        where: {
          employee_id: value.employee_id,
          reference_month: value.reference_month,
          reference_year: value.reference_year
        }
      });

      if (existingPayslip) {
        return res.status(409).json({
          error: `Holerite já existe para ${value.reference_month}/${value.reference_year}`
        });
      }

      // Calcular totais
      const totalEarnings = (
        value.salary_amount +
        value.overtime_amount +
        value.bonus_amount +
        value.commission_amount +
        value.vacation_allowance +
        value.thirteenth_salary +
        value.other_earnings
      );

      const totalDeductions = (
        value.inss_deduction +
        value.irrf_deduction +
        value.fgts_deduction +
        value.health_insurance +
        value.dental_insurance +
        value.life_insurance +
        value.union_fee +
        value.meal_voucher_discount +
        value.transport_voucher_discount +
        value.other_deductions
      );

      const netSalary = totalEarnings - totalDeductions;

      const payslipData = {
        ...value,
        total_earnings: totalEarnings,
        total_deductions: totalDeductions,
        net_salary: netSalary,
        generated_by: req.userId
      };

      const payslip = await db.Payslip.create(payslipData);
        
      res.status(201).json({
        success: true,
        message: 'Holerite gerado com sucesso',
        data: { payslip }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/payslips/:id
   * Atualiza holerite (apenas HR/Finance/Admin)
   */
  async update(req, res, next) {
    try {
      // Verificar permissão
      if (!['hr', 'admin', 'finance'].includes(req.userRole)) {
        return res.status(403).json({
          error: 'Acesso negado. Apenas RH e Financeiro podem editar holerites.'
        });
      }

      const paramsSchema = Joi.object({
        id: Joi.string().uuid().required()
      });

      const bodySchema = Joi.object({
        worked_hours: Joi.number().min(0).optional(),
        overtime_hours: Joi.number().min(0).optional(),
        
        // Proventos
        salary_amount: Joi.number().min(0).optional(),
        overtime_amount: Joi.number().min(0).optional(),
        bonus_amount: Joi.number().min(0).optional(),
        commission_amount: Joi.number().min(0).optional(),
        vacation_allowance: Joi.number().min(0).optional(),
        thirteenth_salary: Joi.number().min(0).optional(),
        other_earnings: Joi.number().min(0).optional(),
        
        // Deduções
        inss_deduction: Joi.number().min(0).optional(),
        irrf_deduction: Joi.number().min(0).optional(),
        fgts_deduction: Joi.number().min(0).optional(),
        health_insurance: Joi.number().min(0).optional(),
        dental_insurance: Joi.number().min(0).optional(),
        life_insurance: Joi.number().min(0).optional(),
        union_fee: Joi.number().min(0).optional(),
        meal_voucher_discount: Joi.number().min(0).optional(),
        transport_voucher_discount: Joi.number().min(0).optional(),
        other_deductions: Joi.number().min(0).optional(),
        
        observations: Joi.string().optional()
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

      const payslip = await db.Payslip.findByPk(params.id);
      
      if (!payslip) {
        return res.status(404).json({
          error: 'Holerite não encontrado'
        });
      }

      // Recalcular totais se necessário
      const updatedPayslip = { ...payslip.toJSON(), ...updateData };
      
      const totalEarnings = (
        updatedPayslip.salary_amount +
        updatedPayslip.overtime_amount +
        updatedPayslip.bonus_amount +
        updatedPayslip.commission_amount +
        updatedPayslip.vacation_allowance +
        updatedPayslip.thirteenth_salary +
        updatedPayslip.other_earnings
      );

      const totalDeductions = (
        updatedPayslip.inss_deduction +
        updatedPayslip.irrf_deduction +
        updatedPayslip.fgts_deduction +
        updatedPayslip.health_insurance +
        updatedPayslip.dental_insurance +
        updatedPayslip.life_insurance +
        updatedPayslip.union_fee +
        updatedPayslip.meal_voucher_discount +
        updatedPayslip.transport_voucher_discount +
        updatedPayslip.other_deductions
      );

      const netSalary = totalEarnings - totalDeductions;

      updateData.total_earnings = totalEarnings;
      updateData.total_deductions = totalDeductions;
      updateData.net_salary = netSalary;

      await payslip.update(updateData);
      
      res.json({
        success: true,
        message: 'Holerite atualizado com sucesso',
        data: { payslip }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/payslips/:id
   * Remove holerite (apenas HR/Finance/Admin)
   */
  async delete(req, res, next) {
    try {
      // Verificar permissão
      if (!['hr', 'admin', 'finance'].includes(req.userRole)) {
        return res.status(403).json({
          error: 'Acesso negado. Apenas RH e Financeiro podem excluir holerites.'
        });
      }

      const schema = Joi.object({
        id: Joi.string().uuid().required()
      });

      const { error, value } = schema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const payslip = await db.Payslip.findByPk(value.id);
      
      if (!payslip) {
        return res.status(404).json({
          error: 'Holerite não encontrado'
        });
      }

      await payslip.destroy();
      
      res.json({
        success: true,
        message: 'Holerite removido com sucesso'
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/payslips/employee/:employeeId/current
   * Busca holerite atual do funcionário
   */
  async getCurrent(req, res, next) {
    try {
      const schema = Joi.object({
        employeeId: Joi.string().uuid().required()
      });

      const { error, value } = schema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      // Verificar permissão
      const canAccess = ['hr', 'admin', 'finance'].includes(req.userRole) ||
                       value.employeeId === req.employee?.id;
      
      if (!canAccess) {
        return res.status(403).json({
          error: 'Acesso negado'
        });
      }

      const currentDate = moment();
      const currentMonth = currentDate.month() + 1;
      const currentYear = currentDate.year();

      const payslip = await db.Payslip.findOne({
        where: {
          employee_id: value.employeeId,
          reference_month: currentMonth,
          reference_year: currentYear
        },
        include: [
          {
            model: db.Employee,
            as: 'employee',
            attributes: ['id', 'first_name', 'last_name', 'department', 'position']
          }
        ]
      });

      res.json({
        success: true,
        data: { 
          payslip,
          period: {
            month: currentMonth,
            year: currentYear
          }
        }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/payslips/generate-batch
   * Gera holerites em lote (apenas HR/Finance/Admin)
   */
  async generateBatch(req, res, next) {
    try {
      // Verificar permissão
      if (!['hr', 'admin', 'finance'].includes(req.userRole)) {
        return res.status(403).json({
          error: 'Acesso negado. Apenas RH e Financeiro podem gerar holerites.'
        });
      }

      const schema = Joi.object({
        reference_month: Joi.number().integer().min(1).max(12).required(),
        reference_year: Joi.number().integer().min(2020).max(2030).required(),
        employee_ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
        base_overtime_rate: Joi.number().min(1).default(1.5),
        include_benefits: Joi.boolean().default(true)
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

      const { reference_month, reference_year, employee_ids, base_overtime_rate } = value;
      
      const results = {
        success: [],
        errors: [],
        skipped: []
      };

      for (const employeeId of employee_ids) {
        try {
          // Verificar se funcionário existe
          const employee = await db.Employee.findByPk(employeeId);
          if (!employee) {
            results.errors.push({
              employee_id: employeeId,
              error: 'Funcionário não encontrado'
            });
            continue;
          }

          // Verificar se já existe holerite
          const existingPayslip = await db.Payslip.findOne({
            where: {
              employee_id: employeeId,
              reference_month,
              reference_year
            }
          });

          if (existingPayslip) {
            results.skipped.push({
              employee_id: employeeId,
              name: `${employee.first_name} ${employee.last_name}`,
              reason: 'Holerite já existe'
            });
            continue;
          }

          // Calcular horas trabalhadas no mês
          const startOfMonth = new Date(reference_year, reference_month - 1, 1);
          const endOfMonth = new Date(reference_year, reference_month, 0);

          const timeEntries = await db.TimeEntry.findAll({
            where: {
              employee_id: employeeId,
              entry_date: {
                [Op.between]: [startOfMonth, endOfMonth]
              }
            }
          });

          const totalHours = timeEntries.reduce((sum, entry) => sum + (entry.total_hours || 0), 0);
          const regularHours = Math.min(totalHours, 176); // 22 dias * 8h
          const overtimeHours = Math.max(0, totalHours - 176);

          // Cálculos básicos (simplificados)
          const hourlyRate = employee.salary / 176;
          const salaryAmount = (regularHours / 176) * employee.salary;
          const overtimeAmount = overtimeHours * hourlyRate * base_overtime_rate;

          // Deduções aproximadas
          const grossSalary = salaryAmount + overtimeAmount;
          const inssDeduction = Math.min(grossSalary * 0.11, 750.07); // Aproximado
          const irrfDeduction = grossSalary > 1903.98 ? (grossSalary - 1903.98) * 0.075 : 0; // Aproximado

          const payslipData = {
            employee_id: employeeId,
            reference_month,
            reference_year,
            base_salary: employee.salary,
            worked_hours: totalHours,
            overtime_hours: overtimeHours,
            salary_amount: salaryAmount,
            overtime_amount: overtimeAmount,
            bonus_amount: 0,
            commission_amount: 0,
            vacation_allowance: 0,
            thirteenth_salary: 0,
            other_earnings: 0,
            inss_deduction: inssDeduction,
            irrf_deduction: irrfDeduction,
            fgts_deduction: 0,
            health_insurance: 0,
            dental_insurance: 0,
            life_insurance: 0,
            union_fee: 0,
            meal_voucher_discount: 0,
            transport_voucher_discount: 0,
            other_deductions: 0,
            total_earnings: grossSalary,
            total_deductions: inssDeduction + irrfDeduction,
            net_salary: grossSalary - (inssDeduction + irrfDeduction),
            generated_by: req.userId
          };

          const payslip = await db.Payslip.create(payslipData);
          
          results.success.push({
            employee_id: employeeId,
            name: `${employee.first_name} ${employee.last_name}`,
            payslip_id: payslip.id
          });

        } catch (error) {
          results.errors.push({
            employee_id: employeeId,
            error: error.message
          });
        }
      }

      res.status(201).json({
        success: true,
        message: `Processamento concluído: ${results.success.length} gerados, ${results.errors.length} erros, ${results.skipped.length} ignorados`,
        data: results
      });

    } catch (error) {
      next(error);
    }
  }

}

module.exports = new PayslipController();