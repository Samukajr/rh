const Joi = require('joi');

const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const data = req[source];
    
    const { error, value } = schema.validate(data, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      return next(error);
    }

    // Substituir os dados validados e sanitizados
    req[source] = value;
    next();
  };
};

const validateBody = (schema) => validate(schema, 'body');
const validateQuery = (schema) => validate(schema, 'query');
const validateParams = (schema) => validate(schema, 'params');

// Esquemas comuns de validação
const commonSchemas = {
  // UUID válido
  uuid: Joi.string().uuid().required(),
  
  // Paginação
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().default('created_at'),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC')
  }),

  // Email
  email: Joi.string().email().required(),

  // CPF (apenas números)
  cpf: Joi.string().pattern(/^\d{11}$/).required(),

  // Telefone brasileiro
  phone: Joi.string().pattern(/^\d{10,11}$/).optional(),

  // Data no formato YYYY-MM-DD
  date: Joi.date().iso().required(),

  // Senha segura
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.pattern.base': 'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial'
    })
};

module.exports = {
  validate,
  validateBody,
  validateQuery,
  validateParams,
  commonSchemas
};