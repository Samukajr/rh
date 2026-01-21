const AuthService = require('../services/AuthService');
const Joi = require('joi');

class AuthController {

  /**
   * POST /api/auth/register
   * Registro de novo usuário
   */
  async register(req, res, next) {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string()
          .min(8)
          .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
          .required()
          .messages({
            'string.pattern.base': 'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'
          }),
        role: Joi.string().valid('employee', 'manager', 'hr', 'finance', 'admin').default('employee'),
        employeeData: Joi.object({
          first_name: Joi.string().required(),
          last_name: Joi.string().required(),
          cpf: Joi.string().pattern(/^\d{11}$/).required(),
          rg: Joi.string().optional(),
          birth_date: Joi.date().iso().required(),
          admission_date: Joi.date().iso().required(),
          position: Joi.string().required(),
          department: Joi.string().required(),
          contract_type: Joi.string().valid('clt', 'pj', 'intern', 'temporary').default('clt'),
          salary: Joi.number().positive().optional(),
          phone: Joi.string().pattern(/^\d{10,11}$/).optional(),
          address: Joi.string().optional(),
          emergency_contact: Joi.string().optional(),
          emergency_phone: Joi.string().pattern(/^\d{10,11}$/).optional()
        }).optional()
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

      const result = await AuthService.register(value);
      
      res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: result
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   * Login do usuário
   */
  async login(req, res, next) {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
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

      const result = await AuthService.login(value);
      
      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: result
      });

    } catch (error) {
      if (error.message === 'Credenciais inválidas') {
        return res.status(401).json({
          error: 'Credenciais inválidas'
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/refresh
   * Refresh do token
   */
  async refreshToken(req, res, next) {
    try {
      const result = await AuthService.refreshToken(req.userId);
      
      res.json({
        success: true,
        message: 'Token renovado com sucesso',
        data: result
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/request-password-reset
   * Solicita reset de senha
   */
  async requestPasswordReset(req, res, next) {
    try {
      const schema = Joi.object({
        email: Joi.string().email().required()
      });

      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: 'Email inválido'
        });
      }

      const result = await AuthService.requestPasswordReset(value.email);
      
      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/reset-password
   * Reset de senha
   */
  async resetPassword(req, res, next) {
    try {
      const schema = Joi.object({
        token: Joi.string().required(),
        password: Joi.string()
          .min(8)
          .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
          .required()
          .messages({
            'string.pattern.base': 'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'
          })
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

      const result = await AuthService.resetPassword(value.token, value.password);
      
      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      if (error.message.includes('Token')) {
        return res.status(400).json({
          error: error.message
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/change-password
   * Alteração de senha (usuário autenticado)
   */
  async changePassword(req, res, next) {
    try {
      const schema = Joi.object({
        currentPassword: Joi.string().required(),
        newPassword: Joi.string()
          .min(8)
          .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
          .required()
          .messages({
            'string.pattern.base': 'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'
          })
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

      const result = await AuthService.changePassword(
        req.userId,
        value.currentPassword,
        value.newPassword
      );
      
      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      if (error.message === 'Senha atual incorreta') {
        return res.status(400).json({
          error: error.message
        });
      }
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Informações do usuário logado
   */
  async me(req, res, next) {
    try {
      res.json({
        success: true,
        data: {
          user: req.user,
          employee: req.employee
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Logout (invalidar token)
   */
  async logout(req, res, next) {
    try {
      // TODO: Implementar blacklist de tokens se necessário
      res.json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error) {
      next(error);
    }
  }

}

module.exports = new AuthController();