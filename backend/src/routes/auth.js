const express = require('express');
const AuthController = require('../controllers/AuthController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra novo usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               role:
 *                 type: string
 *                 enum: [employee, manager, hr, finance, admin]
 *               employeeData:
 *                 type: object
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já em uso
 */
router.post('/register', AuthController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza login
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', AuthController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Renova token de acesso
 *     tags: [Autenticação]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Token renovado com sucesso
 *       401:
 *         description: Token inválido ou expirado
 */
router.post('/refresh', authenticateToken, AuthController.refreshToken);

/**
 * @swagger
 * /api/auth/request-password-reset:
 *   post:
 *     summary: Solicita reset de senha
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Instruções enviadas
 */
router.post('/request-password-reset', AuthController.requestPasswordReset);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Redefine senha
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *       400:
 *         description: Token inválido ou expirado
 */
router.post('/reset-password', AuthController.resetPassword);

/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Altera senha do usuário logado
 *     tags: [Autenticação]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Senha atual incorreta
 */
router.post('/change-password', authenticateToken, AuthController.changePassword);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Informações do usuário logado
 *     tags: [Autenticação]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Informações do usuário
 *       401:
 *         description: Não autenticado
 */
router.get('/me', authenticateToken, AuthController.me);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Realiza logout
 *     tags: [Autenticação]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 */
router.post('/logout', authenticateToken, AuthController.logout);

module.exports = router;