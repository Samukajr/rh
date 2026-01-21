const express = require('express');
const MedicalCertificateController = require('../controllers/MedicalCertificateController');
const { authorizeRoles } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/medical-certificates:
 *   get:
 *     summary: Lista atestados médicos
 *     tags: [Atestados Médicos]
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
 *         name: employee_id
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Lista de atestados
 */
router.get('/', MedicalCertificateController.list);

/**
 * @swagger
 * /api/medical-certificates/{id}:
 *   get:
 *     summary: Busca atestado por ID
 *     tags: [Atestados Médicos]
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
 *         description: Dados do atestado
 *       404:
 *         description: Atestado não encontrado
 */
router.get('/:id', MedicalCertificateController.getById);

/**
 * @swagger
 * /api/medical-certificates:
 *   post:
 *     summary: Envia novo atestado médico
 *     tags: [Atestados Médicos]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - start_date
 *               - end_date
 *               - doctor_name
 *               - doctor_crm
 *             properties:
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               doctor_name:
 *                 type: string
 *               doctor_crm:
 *                 type: string
 *               diagnosis:
 *                 type: string
 *               document:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Atestado enviado com sucesso
 */
router.post('/', MedicalCertificateController.create);

/**
 * @swagger
 * /api/medical-certificates/{id}/status:
 *   put:
 *     summary: Atualiza status do atestado
 *     tags: [Atestados Médicos]
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
router.put('/:id/status', authorizeRoles('hr', 'admin'), MedicalCertificateController.updateStatus);

/**
 * @swagger
 * /api/medical-certificates/{id}/download:
 *   get:
 *     summary: Download do documento
 *     tags: [Atestados Médicos]
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
 *         description: Arquivo do atestado
 *       404:
 *         description: Arquivo não encontrado
 */
router.get('/:id/download', MedicalCertificateController.downloadDocument);

/**
 * @swagger
 * /api/medical-certificates/{id}:
 *   delete:
 *     summary: Remove atestado
 *     tags: [Atestados Médicos]
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
 *         description: Atestado removido
 *       403:
 *         description: Acesso negado
 */
router.delete('/:id', MedicalCertificateController.delete);

module.exports = router;