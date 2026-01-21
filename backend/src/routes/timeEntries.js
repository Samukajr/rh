const express = require('express');
const TimeEntryController = require('../controllers/TimeEntryController');
const { authorizeRoles } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/time-entries:
 *   get:
 *     summary: Lista registros de ponto
 *     tags: [Ponto Eletrônico]
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
 *         name: month
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 12
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de registros
 */
router.get('/', TimeEntryController.list);

/**
 * @swagger
 * /api/time-entries/today:
 *   get:
 *     summary: Registro de hoje
 *     tags: [Ponto Eletrônico]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Registro do dia atual
 */
router.get('/today', TimeEntryController.getToday);

/**
 * @swagger
 * /api/time-entries/clock-in:
 *   post:
 *     summary: Registra entrada
 *     tags: [Ponto Eletrônico]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               entry_time:
 *                 type: string
 *                 pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
 *                 example: '08:00'
 *               location:
 *                 type: string
 *               observations:
 *                 type: string
 *     responses:
 *       201:
 *         description: Entrada registrada
 *       409:
 *         description: Já existe registro para hoje
 */
router.post('/clock-in', TimeEntryController.clockIn);

/**
 * @swagger
 * /api/time-entries/clock-out:
 *   post:
 *     summary: Registra saída
 *     tags: [Ponto Eletrônico]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               exit_time:
 *                 type: string
 *                 pattern: '^([01]\\d|2[0-3]):([0-5]\\d)$'
 *                 example: '17:00'
 *               observations:
 *                 type: string
 *     responses:
 *       200:
 *         description: Saída registrada
 *       404:
 *         description: Nenhuma entrada encontrada
 */
router.post('/clock-out', TimeEntryController.clockOut);

/**
 * @swagger
 * /api/time-entries/summary/{employeeId}:
 *   get:
 *     summary: Sumário de horas trabalhadas
 *     tags: [Ponto Eletrônico]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: employeeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: month
 *         schema:
 *           type: integer
 *       - in: query
 *         name: year
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sumário de horas
 */
router.get('/summary/:employeeId', TimeEntryController.getSummary);

/**
 * @swagger
 * /api/time-entries/{id}:
 *   get:
 *     summary: Busca registro por ID
 *     tags: [Ponto Eletrônico]
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
 *         description: Dados do registro
 */
router.get('/:id', TimeEntryController.getById);

/**
 * @swagger
 * /api/time-entries/{id}:
 *   put:
 *     summary: Atualiza registro (apenas HR)
 *     tags: [Ponto Eletrônico]
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
 *         description: Registro atualizado
 *       403:
 *         description: Acesso negado
 */
router.put('/:id', authorizeRoles('hr', 'admin'), TimeEntryController.update);

/**
 * @swagger
 * /api/time-entries/{id}:
 *   delete:
 *     summary: Remove registro (apenas HR)
 *     tags: [Ponto Eletrônico]
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
 *         description: Registro removido
 *       403:
 *         description: Acesso negado
 */
router.delete('/:id', authorizeRoles('hr', 'admin'), TimeEntryController.delete);

module.exports = router;