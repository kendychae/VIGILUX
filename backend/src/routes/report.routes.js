const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const {
  upload,
  validateFileSignatures,
  handleMulterError,
  enrichFileMetadata
} = require('../middleware/upload.middleware');
const {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport
} = require('../controllers/report.controller');

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/reports
 * @desc    Create a new incident report with optional media files
 * @access  Private (authenticated users)
 */
router.post(
  '/',
  upload.array('media', 5), // Allow up to 5 files with field name 'media'
  handleMulterError,
  validateFileSignatures,
  enrichFileMetadata,
  createReport
);

/**
 * @route   GET /api/v1/reports
 * @desc    Get list of reports with filtering and pagination
 * @access  Private (authenticated users)
 */
router.get('/', getReports);

/**
 * @route   GET /api/v1/reports/:id
 * @desc    Get a single report by ID with full details
 * @access  Private (authenticated users)
 */
router.get('/:id', getReportById);

/**
 * @route   PATCH /api/v1/reports/:id
 * @desc    Update a report (only by creator or admin)
 * @access  Private (authenticated users, owner or admin)
 */
router.patch('/:id', updateReport);

/**
 * @route   DELETE /api/v1/reports/:id
 * @desc    Delete a report (soft delete by setting status to 'closed')
 * @access  Private (authenticated users, owner or admin)
 */
router.delete('/:id', deleteReport);

module.exports = router;
