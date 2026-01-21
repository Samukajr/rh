const express = require('express');
const PayslipController = require('../controllers/PayslipController');
const { authorizeRoles } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/payslips:
 *   get:
 *     summary: Lista holerites
 *     tags: [Holerites]
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
 *         name: reference_month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *       - in: query
 *         name: reference_year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de holerites
 */
router.get('/', PayslipController.list);

/**
 * @swagger
 * /api/payslips/employee/{employeeId}/current:
 *   get:
 *     summary: Holerite atual do funcionário
 *     tags: [Holerites]
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
 *         description: Holerite do mês atual
 */
router.get('/employee/:employeeId/current', PayslipController.getCurrent);

/**
 * @swagger
 * /api/payslips/{id}:
 *   get:
 *     summary: Busca holerite por ID
 *     tags: [Holerites]
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
 *         description: Dados do holerite
 *       404:
 *         description: Holerite não encontrado
 */
router.get('/:id', PayslipController.getById);

/**
 * @swagger
 * /api/payslips:
 *   post:
 *     summary: Gera novo holerite
 *     tags: [Holerites]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employee_id
 *               - reference_month
 *               - reference_year
 *               - base_salary
 *               - salary_amount
 *             properties:
 *               employee_id:
 *                 type: string
 *                 format: uuid
 *               reference_month:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *               reference_year:
 *                 type: integer
 *               base_salary:
 *                 type: number
 *               salary_amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Holerite gerado com sucesso
 *       403:
 *         description: Acesso negado
 */
router.post('/', authorizeRoles('hr', 'admin', 'finance'), PayslipController.create);

/**
 * @swagger
 * /api/payslips/generate-batch:
 *   post:
 *     summary: Gera holerites em lote
 *     tags: [Holerites]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reference_month
 *               - reference_year
 *               - employee_ids
 *             properties:
 *               reference_month:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *               reference_year:
 *                 type: integer
 *               employee_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       201:
 *         description: Lote processado
 *       403:
 *         description: Acesso negado
 */
router.post('/generate-batch', authorizeRoles('hr', 'admin', 'finance'), PayslipController.generateBatch);

/**
 * @swagger
 * /api/payslips/{id}:
 *   put:
 *     summary: Atualiza holerite
 *     tags: [Holerites]
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
 *         description: Holerite atualizado
 *       403:
 *         description: Acesso negado
 */
router.put('/:id', authorizeRoles('hr', 'admin', 'finance'), PayslipController.update);

/**
 * @swagger
 * /api/payslips/{id}:
 *   delete:
 *     summary: Remove holerite
 *     tags: [Holerites]
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
 *         description: Holerite removido
 *       403:
 *         description: Acesso negado
 */
router.delete('/:id', authorizeRoles('hr', 'admin', 'finance'), PayslipController.delete);

module.exports = router;