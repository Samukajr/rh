const express = require('express');
const { Op } = require('sequelize');
const db = require('../models');

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', async (req, res, next) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const [employees, todayTimeEntries, pendingLeaveRequests, pendingMedicalCertificates] = await Promise.all([
      db.Employee.count(),
      db.TimeEntry.count({
        where: {
          created_at: {
            [Op.gte]: startOfDay,
            [Op.lt]: endOfDay
          }
        }
      }).catch(() => 0),
      db.LeaveRequest.count({ where: { status: 'pending' } }).catch(() => 0),
      db.MedicalCertificate.count({ where: { status: 'pending' } }).catch(() => 0)
    ]);

    res.json({
      employees,
      todayTimeEntries,
      pendingLeaveRequests,
      pendingMedicalCertificates
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
