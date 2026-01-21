const jwt = require('jsonwebtoken');
const db = require('../models');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Token de acesso requerido'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Buscar usuário no banco
    const user = await db.User.findByPk(decoded.userId, {
      include: {
        model: db.Employee,
        as: 'employee'
      }
    });

    if (!user || !user.is_active) {
      return res.status(401).json({
        error: 'Usuário não encontrado ou inativo'
      });
    }

    // Adicionar informações do usuário à request
    req.user = user;
    req.userId = user.id;
    req.userRole = user.role;
    req.employee = user.employee;

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token inválido'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expirado'
      });
    }

    console.error('Erro na autenticação:', error);
    return res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({
        error: 'Usuário não autenticado'
      });
    }

    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        error: 'Acesso negado. Permissão insuficiente.',
        required_roles: roles,
        user_role: req.userRole
      });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles
};