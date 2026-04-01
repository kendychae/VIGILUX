const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  getOfficerReports,
  getOfficerQueue,
  assignReport,
  unassignReport,
} = require('../controllers/officer.controller');

// All officer routes require authentication AND officer/admin role
router.use(authenticate);
router.use(authorize('officer', 'admin'));

/**
 * @route   GET /api/v1/officer/reports
 * @desc    Paginated list of all reports (filterable by status, priority, assignedTo)
 * @access  Private (officer, admin)
 */
router.get('/reports', getOfficerReports);

/**
 * @route   GET /api/v1/officer/reports/queue
 * @desc    Unassigned, non-resolved reports sorted by priority then age
 * @access  Private (officer, admin)
 */
router.get('/reports/queue', getOfficerQueue);

/**
 * @route   PATCH /api/v1/officer/reports/:id/assign
 * @desc    Claim/assign a report to the requesting officer (admins may specify assignTo)
 * @access  Private (officer, admin)
 */
router.patch('/reports/:id/assign', assignReport);

/**
 * @route   PATCH /api/v1/officer/reports/:id/unassign
 * @desc    Release assignment from a report
 * @access  Private (officer, admin)
 */
router.patch('/reports/:id/unassign', unassignReport);

module.exports = router;
