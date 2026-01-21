const db = require('../models');
const Joi = require('joi');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

// Configuração do multer para upload de arquivos
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), 'uploads', 'medical-certificates');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo não suportado. Use JPEG, PNG ou PDF.'));
    }
  }
}).single('document');

class MedicalCertificateController {

  /**
   * GET /api/medical-certificates
   * Lista atestados médicos
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
        start_date: Joi.date().iso().optional(),
        end_date: Joi.date().iso().optional()
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
        employee_id, status, start_date, end_date
      } = value;

      const offset = (page - 1) * limit;
      
      // Construir filtros
      const where = {};
      
      // Se não for HR/Admin, mostrar apenas próprios atestados
      if (!['hr', 'admin'].includes(req.userRole)) {
        where.employee_id = req.employee?.id;
      } else if (employee_id) {
        where.employee_id = employee_id;
      }
      
      if (status) where.status = status;
      
      if (start_date) {
        where.start_date = { [Op.gte]: start_date };
      }
      
      if (end_date) {
        where.end_date = { [Op.lte]: end_date };
      }

      const { count, rows: certificates } = await db.MedicalCertificate.findAndCountAll({
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
          certificates,
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
   * GET /api/medical-certificates/:id
   * Busca atestado por ID
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

      const certificate = await db.MedicalCertificate.findByPk(value.id, {
        include: [
          {
            model: db.Employee,
            as: 'employee',
            attributes: ['id', 'first_name', 'last_name', 'department', 'position']
          }
        ]
      });

      if (!certificate) {
        return res.status(404).json({
          error: 'Atestado não encontrado'
        });
      }

      // Verificar permissão
      if (!['hr', 'admin'].includes(req.userRole) && certificate.employee_id !== req.employee?.id) {
        return res.status(403).json({
          error: 'Acesso negado'
        });
      }

      res.json({
        success: true,
        data: { certificate }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/medical-certificates
   * Cria novo atestado médico
   */
  async create(req, res, next) {
    upload(req, res, async (uploadError) => {
      if (uploadError) {
        return res.status(400).json({
          error: 'Erro no upload do arquivo',
          message: uploadError.message
        });
      }

      try {
        const schema = Joi.object({
          start_date: Joi.date().iso().required(),
          end_date: Joi.date().iso().min(Joi.ref('start_date')).required(),
          doctor_name: Joi.string().required(),
          doctor_crm: Joi.string().required(),
          diagnosis: Joi.string().optional(),
          observations: Joi.string().optional()
        });

        const { error, value } = schema.validate(req.body);
        if (error) {
          // Remover arquivo se validação falhar
          if (req.file) {
            await fs.unlink(req.file.path).catch(console.error);
          }
          return res.status(400).json({
            error: 'Dados inválidos',
            details: error.details.map(detail => ({
              field: detail.path.join('.'),
              message: detail.message
            }))
          });
        }

        const certificateData = {
          ...value,
          employee_id: req.employee.id,
          status: 'pending'
        };

        if (req.file) {
          certificateData.document_path = req.file.filename;
          certificateData.document_type = req.file.mimetype;
          certificateData.document_size = req.file.size;
        }

        const certificate = await db.MedicalCertificate.create(certificateData);
        
        res.status(201).json({
          success: true,
          message: 'Atestado médico enviado com sucesso',
          data: { certificate }
        });

      } catch (error) {
        // Remover arquivo se erro
        if (req.file) {
          await fs.unlink(req.file.path).catch(console.error);
        }
        next(error);
      }
    });
  }

  /**
   * PUT /api/medical-certificates/:id/status
   * Atualiza status do atestado (apenas HR/Admin)
   */
  async updateStatus(req, res, next) {
    try {
      // Verificar permissão
      if (!['hr', 'admin'].includes(req.userRole)) {
        return res.status(403).json({
          error: 'Acesso negado. Apenas RH pode aprovar/rejeitar atestados.'
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
        hr_observations: Joi.string().optional()
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

      const certificate = await db.MedicalCertificate.findByPk(params.id);
      
      if (!certificate) {
        return res.status(404).json({
          error: 'Atestado não encontrado'
        });
      }

      if (certificate.status !== 'pending') {
        return res.status(400).json({
          error: 'Atestado já foi processado'
        });
      }

      await certificate.update({
        ...updateData,
        reviewed_by: req.userId,
        reviewed_at: new Date()
      });
      
      res.json({
        success: true,
        message: `Atestado ${updateData.status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso`,
        data: { certificate }
      });

    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/medical-certificates/:id/download
   * Download do documento do atestado
   */
  async downloadDocument(req, res, next) {
    try {
      const schema = Joi.object({
        id: Joi.string().uuid().required()
      });

      const { error, value } = schema.validate(req.params);
      if (error) {
        return res.status(400).json({ error: 'ID inválido' });
      }

      const certificate = await db.MedicalCertificate.findByPk(value.id);

      if (!certificate) {
        return res.status(404).json({
          error: 'Atestado não encontrado'
        });
      }

      // Verificar permissão
      if (!['hr', 'admin'].includes(req.userRole) && certificate.employee_id !== req.employee?.id) {
        return res.status(403).json({
          error: 'Acesso negado'
        });
      }

      if (!certificate.document_path) {
        return res.status(404).json({
          error: 'Documento não encontrado'
        });
      }

      const filePath = path.join(process.cwd(), 'uploads', 'medical-certificates', certificate.document_path);
      
      try {
        await fs.access(filePath);
        res.download(filePath, certificate.document_path);
      } catch (fileError) {
        return res.status(404).json({
          error: 'Arquivo não encontrado no servidor'
        });
      }

    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/medical-certificates/:id
   * Remove atestado (apenas próprio ou HR/Admin)
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

      const certificate = await db.MedicalCertificate.findByPk(value.id);
      
      if (!certificate) {
        return res.status(404).json({
          error: 'Atestado não encontrado'
        });
      }

      // Verificar permissão
      if (!['hr', 'admin'].includes(req.userRole) && certificate.employee_id !== req.employee?.id) {
        return res.status(403).json({
          error: 'Acesso negado'
        });
      }

      // Não permitir deletar se já aprovado
      if (certificate.status === 'approved') {
        return res.status(400).json({
          error: 'Não é possível excluir atestado já aprovado'
        });
      }

      // Remover arquivo físico se existir
      if (certificate.document_path) {
        const filePath = path.join(process.cwd(), 'uploads', 'medical-certificates', certificate.document_path);
        await fs.unlink(filePath).catch(console.error);
      }

      await certificate.destroy();
      
      res.json({
        success: true,
        message: 'Atestado removido com sucesso'
      });

    } catch (error) {
      next(error);
    }
  }

}

module.exports = new MedicalCertificateController();