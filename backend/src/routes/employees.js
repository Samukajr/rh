const express = require('express');
const EmployeeController = require('../controllers/EmployeeController');
const { authorizeRoles } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Lista funcionários
 *     tags: [Funcionários]
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
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *       - in: query
 *         name: position
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de funcionários
 *       401:
 *         description: Não autorizado
 */
router.get('/', EmployeeController.list);

/**
 * @swagger
 * /api/employees/departments:
 *   get:
 *     summary: Lista departamentos
 *     tags: [Funcionários]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de departamentos
 */
router.get('/departments', EmployeeController.getDepartments);

/**
 * @swagger
 * /api/employees/positions:
 *   get:
 *     summary: Lista cargos
 *     tags: [Funcionários]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cargos
 */
router.get('/positions', EmployeeController.getPositions);

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Busca funcionário por ID
 *     tags: [Funcionários]
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
 *         description: Dados do funcionário
 *       404:
 *         description: Funcionário não encontrado
 */
router.get('/:id', EmployeeController.getById);

/**
 * @swagger
 * /api/employees:
 *   post:
 *     summary: Cria novo funcionário
 *     tags: [Funcionários]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - first_name
 *               - last_name
 *               - cpf
 *               - admission_date
 *               - position
 *               - department
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               cpf:
 *                 type: string
 *                 pattern: '^\\d{11}$'
 *               admission_date:
 *                 type: string
 *                 format: date
 *               position:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       201:
 *         description: Funcionário criado com sucesso
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Acesso negado
 */
router.post('/', authorizeRoles('hr', 'admin'), EmployeeController.create);

/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     summary: Atualiza funcionário
 *     tags: [Funcionários]
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
 *         description: Funcionário atualizado
 *       404:
 *         description: Funcionário não encontrado
 *       403:
 *         description: Acesso negado
 */
router.put('/:id', authorizeRoles('hr', 'admin'), EmployeeController.update);

/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: Remove funcionário
 *     tags: [Funcionários]
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
 *         description: Funcionário removido
 *       404:
 *         description: Funcionário não encontrado
 *       403:
 *         description: Acesso negado
 */
router.delete('/:id', authorizeRoles('hr', 'admin'), EmployeeController.delete);

module.exports = router;