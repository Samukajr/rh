const errorHandler = (error, req, res, next) => {
  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Erro de validação do Sequelize
  if (error.name === 'SequelizeValidationError') {
    const errors = error.errors.map(err => ({
      field: err.path,
      message: err.message,
      value: err.value
    }));
    
    return res.status(400).json({
      error: 'Erro de validação',
      details: errors
    });
  }

  // Erro de chave única do Sequelize
  if (error.name === 'SequelizeUniqueConstraintError') {
    const field = error.errors[0].path;
    return res.status(409).json({
      error: 'Registro já existe',
      field: field,
      message: `${field} já está em uso`
    });
  }

  // Erro de chave estrangeira do Sequelize
  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      error: 'Referência inválida',
      message: 'O registro referenciado não existe'
    });
  }

  // Erro de conexão com banco de dados
  if (error.name === 'SequelizeConnectionError') {
    return res.status(503).json({
      error: 'Erro de conexão com banco de dados',
      message: 'Serviço temporariamente indisponível'
    });
  }

  // Erro do Joi (validação)
  if (error.isJoi) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context.value
    }));

    return res.status(400).json({
      error: 'Dados inválidos',
      details: errors
    });
  }

  // Erro de sintaxe JSON
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      error: 'JSON inválido',
      message: 'Verifique a sintaxe do JSON enviado'
    });
  }

  // Erro de arquivo muito grande
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      error: 'Arquivo muito grande',
      message: 'O arquivo excede o tamanho máximo permitido'
    });
  }

  // Erro personalizado com status
  if (error.status || error.statusCode) {
    return res.status(error.status || error.statusCode).json({
      error: error.message || 'Erro conhecido',
      ...(error.details && { details: error.details })
    });
  }

  // Erro não tratado - erro interno
  return res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'Algo deu errado. Tente novamente mais tarde.',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: error.stack 
    })
  });
};

module.exports = errorHandler;