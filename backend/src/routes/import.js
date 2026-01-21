const express = require('express');
const router = express.Router();
const ImportController = require('../controllers/ImportController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/import/employees:
 *   post:
 *     summary: Importa funcionários de arquivo Excel/CSV
 *     tags: [Import]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo Excel (.xlsx, .xls) ou CSV
 *     responses:
 *       200:
 *         description: Importação realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 total:
 *                   type: number
 *                 importados:
 *                   type: number
 *                 atualizados:
 *                   type: number
 *                 erros:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Erro de validação ou arquivo inválido
 *       401:
 *         description: Token de acesso inválido
 */
router.post('/employees', authenticateToken, ImportController.upload, ImportController.importEmployees);

/**
 * @swagger
 * /api/import/template:
 *   get:
 *     summary: Baixa template de importação de funcionários
 *     tags: [Import]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Template Excel para importação
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Token de acesso inválido
 */
router.get('/template', authenticateToken, ImportController.downloadTemplate);

module.exports = router;