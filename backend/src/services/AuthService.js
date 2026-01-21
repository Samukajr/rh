const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const db = require('../models');

class AuthService {
  
  /**
   * Registra um novo usuário
   */
  async register({ email, password, role = 'employee', employeeData }) {
    const transaction = await db.sequelize.transaction();
    
    try {
      // Verificar se o email já existe
      const existingUser = await db.User.findOne({ 
        where: { email },
        transaction 
      });
      
      if (existingUser) {
        throw new Error('Email já está em uso');
      }

      // Hash da senha
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      let employee = null;
      
      // Se dados do funcionário foram fornecidos, criar funcionário
      if (employeeData) {
        employee = await db.Employee.create(employeeData, { transaction });
      }

      // Criar usuário
      const user = await db.User.create({
        email,
        password_hash: passwordHash,
        role,
        employee_id: employee?.id
      }, { transaction });

      await transaction.commit();

      // Retornar usuário sem a senha
      const { password_hash, ...userWithoutPassword } = user.toJSON();
      
      return {
        user: userWithoutPassword,
        employee
      };

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Autentica um usuário
   */
  async login({ email, password }) {
    // Buscar usuário com funcionário
    const user = await db.User.findOne({
      where: { 
        email,
        is_active: true 
      },
      include: {
        model: db.Employee,
        as: 'employee'
      }
    });

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas');
    }

    // Atualizar último login
    await user.update({ last_login: new Date() });

    // Gerar token JWT
    const token = this.generateToken(user);

    // Retornar dados sem senha
    const { password_hash, ...userWithoutPassword } = user.toJSON();

    return {
      user: userWithoutPassword,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    };
  }

  /**
   * Gera token JWT
   */
  generateToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employee_id
    };

    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        issuer: 'rhplus-api',
        subject: user.id
      }
    );
  }

  /**
   * Refresh do token
   */
  async refreshToken(userId) {
    const user = await db.User.findByPk(userId, {
      include: {
        model: db.Employee,
        as: 'employee'
      }
    });

    if (!user || !user.is_active) {
      throw new Error('Usuário não encontrado ou inativo');
    }

    const token = this.generateToken(user);
    const { password_hash, ...userWithoutPassword } = user.toJSON();

    return {
      user: userWithoutPassword,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    };
  }

  /**
   * Solicita reset de senha
   */
  async requestPasswordReset(email) {
    const user = await db.User.findOne({
      where: { 
        email,
        is_active: true 
      }
    });

    if (!user) {
      // Por segurança, não revelar se o email existe
      return { message: 'Se o email existir, você receberá instruções de reset' };
    }

    // Gerar token de reset (válido por 1 hora)
    const resetToken = jwt.sign(
      { userId: user.id, type: 'password_reset' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Salvar token no banco
    await user.update({
      password_reset_token: resetToken,
      password_reset_expires: new Date(Date.now() + 3600000) // 1 hora
    });

    // TODO: Implementar envio de email
    // await emailService.sendPasswordResetEmail(user.email, resetToken);

    return { 
      message: 'Se o email existir, você receberá instruções de reset',
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    };
  }

  /**
   * Reset da senha
   */
  async resetPassword(token, newPassword) {
    let decoded;
    
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token de reset inválido ou expirado');
    }

    if (decoded.type !== 'password_reset') {
      throw new Error('Token inválido');
    }

    const user = await db.User.findOne({
      where: {
        id: decoded.userId,
        password_reset_token: token,
        password_reset_expires: {
          [Op.gt]: new Date()
        },
        is_active: true
      }
    });

    if (!user) {
      throw new Error('Token de reset inválido ou expirado');
    }

    // Hash da nova senha
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Atualizar senha e limpar tokens de reset
    await user.update({
      password_hash: passwordHash,
      password_reset_token: null,
      password_reset_expires: null
    });

    return { message: 'Senha atualizada com sucesso' };
  }

  /**
   * Altera senha (usuário autenticado)
   */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await db.User.findByPk(userId);
    
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar senha atual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    
    if (!isCurrentPasswordValid) {
      throw new Error('Senha atual incorreta');
    }

    // Hash da nova senha
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Atualizar senha
    await user.update({ password_hash: passwordHash });

    return { message: 'Senha alterada com sucesso' };
  }

  /**
   * Valida token JWT
   */
  async validateToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      const user = await db.User.findByPk(decoded.userId, {
        include: {
          model: db.Employee,
          as: 'employee'
        }
      });

      if (!user || !user.is_active) {
        throw new Error('Token inválido');
      }

      return {
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          employee: user.employee
        }
      };

    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

}

module.exports = new AuthService();