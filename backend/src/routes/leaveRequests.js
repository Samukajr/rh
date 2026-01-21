const express = require('express');
const LeaveRequestController = require('../controllers/LeaveRequestController');
const { authorizeRoles } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/leave-requests:
 *   get:
 *     summary: Lista solicitações de férias
 *     tags: [Solicitações de Férias]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de solicitações
 */
router.get('/', LeaveRequestController.list);

/**
 * @swagger
 * /api/leave-requests/{id}:
 *   get:
 *     summary: Busca solicitação por ID
 *     tags: [Solicitações de Férias]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Dados da solicitação
 *       404:
 *         description: Solicitação não encontrada
 */
router.get('/:id', LeaveRequestController.getById);

/**
 * @swagger
 * /api/leave-requests:
 *   post:
 *     summary: Cria nova solicitação de férias
 *     tags: [Solicitações de Férias]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - start_date
 *               - end_date
 *               - type
 *             properties:
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               type:
 *                 type: string
 *                 enum: [vacation, paid_leave, unpaid_leave]
 *               reason:
 *                 type: string
 *               emergency_contact:
 *                 type: string
 *               emergency_phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Solicitação criada com sucesso
 */
router.post('/', LeaveRequestController.create);

/**
 * @swagger
 * /api/leave-requests/{id}/status:
 *   put:
 *     summary: Atualiza status da solicitação
 *     tags: [Solicitações de Férias]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *               rejection_reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status atualizado
 *       403:
 *         description: Acesso negado
 */
router.put('/:id/status', authorizeRoles('hr', 'admin', 'manager'), LeaveRequestController.updateStatus);

/**
 * @swagger
 * /api/leave-requests/{id}:
 *   put:
 *     summary: Atualiza solicitação
 *     tags: [Solicitações de Férias]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Solicitação atualizada
 */
router.put('/:id', LeaveRequestController.update);

/**
 * @swagger
 * /api/leave-requests/{id}:
 *   delete:
 *     summary: Remove solicitação
 *     tags: [Solicitações de Férias]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Solicitação removida
 */
router.delete('/:id', LeaveRequestController.delete);

/**
 * @swagger
 * /api/leave-requests/balance/{employeeId}:
 *   get:
 *     summary: Consulta saldo de férias
 *     tags: [Solicitações de Férias]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Saldo de férias
 */
router.get('/balance/:employeeId', LeaveRequestController.getBalance);

module.exports = router;