const db = require('../config/database');

// Priority order for queue sorting (highest urgency first)
const PRIORITY_ORDER = { urgent: 1, high: 2, medium: 3, low: 4 };

/**
 * GET /api/v1/officer/reports
 * Paginated list of all reports visible to officers.
 * Supports: ?status=, ?priority=, ?assignedTo=me, ?page=, ?limit=
 * Access: officer, admin
 */
const getOfficerReports = async (req, res) => {
  try {
    const {
      status,
      priority,
      assignedTo,
      page = 1,
      limit = 20,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];
    const params = [];
    let paramIdx = 1;

    if (status) {
      const allowed = ['submitted', 'under_review', 'investigating', 'resolved', 'closed'];
      if (!allowed.includes(status)) {
        return res.status(400).json({ success: false, message: `Invalid status. Allowed: ${allowed.join(', ')}` });
      }
      conditions.push(`r.status = $${paramIdx++}`);
      params.push(status);
    }

    if (priority) {
      const allowed = ['low', 'medium', 'high', 'urgent'];
      if (!allowed.includes(priority)) {
        return res.status(400).json({ success: false, message: `Invalid priority. Allowed: ${allowed.join(', ')}` });
      }
      conditions.push(`r.priority = $${paramIdx++}`);
      params.push(priority);
    }

    if (assignedTo === 'me') {
      conditions.push(`r.assigned_to = $${paramIdx++}`);
      params.push(req.user.userId);
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await db.query(
      `SELECT COUNT(*) FROM reports r ${whereClause}`,
      params
    );
    const totalItems = parseInt(countResult.rows[0].count, 10);

    const dataResult = await db.query(
      `SELECT
         r.id, r.title, r.description, r.incident_type, r.status, r.priority,
         r.latitude, r.longitude, r.address, r.incident_date,
         r.created_at, r.updated_at,
         r.assigned_to, r.assigned_at,
         u.first_name AS reporter_first_name,
         u.last_name  AS reporter_last_name,
         au.first_name AS assignee_first_name,
         au.last_name  AS assignee_last_name
       FROM reports r
       JOIN users u  ON u.id = r.user_id
       LEFT JOIN users au ON au.id = r.assigned_to
       ${whereClause}
       ORDER BY
         CASE r.priority
           WHEN 'urgent' THEN 1
           WHEN 'high'   THEN 2
           WHEN 'medium' THEN 3
           WHEN 'low'    THEN 4
           ELSE 5
         END,
         r.created_at DESC
       LIMIT $${paramIdx++} OFFSET $${paramIdx++}`,
      [...params, limitNum, offset]
    );

    return res.status(200).json({
      success: true,
      data: dataResult.rows,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total_items: totalItems,
        total_pages: Math.ceil(totalItems / limitNum),
      },
    });
  } catch (err) {
    console.error('getOfficerReports error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * GET /api/v1/officer/reports/queue
 * Returns unassigned reports sorted by priority then created_at (oldest first per tier).
 * Access: officer, admin
 */
const getOfficerQueue = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT
         r.id, r.title, r.description, r.incident_type, r.status, r.priority,
         r.latitude, r.longitude, r.address, r.incident_date, r.created_at,
         u.first_name AS reporter_first_name,
         u.last_name  AS reporter_last_name
       FROM reports r
       JOIN users u ON u.id = r.user_id
       WHERE r.assigned_to IS NULL
         AND r.status NOT IN ('resolved', 'closed')
       ORDER BY
         CASE r.priority
           WHEN 'urgent' THEN 1
           WHEN 'high'   THEN 2
           WHEN 'medium' THEN 3
           WHEN 'low'    THEN 4
           ELSE 5
         END,
         r.created_at ASC`
    );

    return res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error('getOfficerQueue error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * PATCH /api/v1/officer/reports/:id/assign
 * Claim/assign a report to the requesting officer (or admin can specify ?userId=).
 * Access: officer, admin
 */
const assignReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { userType, userId } = req.user;

    // UUID format guard
    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UUID_RE.test(id)) {
      return res.status(400).json({ success: false, message: 'Invalid report ID format' });
    }

    // Admins may assign to a specific target user; officers always assign to themselves
    let targetUserId = userId;
    if (userType === 'admin' && req.body.assignTo) {
      if (!UUID_RE.test(req.body.assignTo)) {
        return res.status(400).json({ success: false, message: 'Invalid assignTo user ID format' });
      }
      // Verify the target user is an officer or admin
      const targetCheck = await db.query(
        `SELECT id FROM users WHERE id = $1 AND user_type IN ('officer', 'admin') AND is_active = true`,
        [req.body.assignTo]
      );
      if (targetCheck.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Target user not found or is not an officer/admin' });
      }
      targetUserId = req.body.assignTo;
    }

    const result = await db.query(
      `UPDATE reports
       SET assigned_to = $1, assigned_at = NOW()
       WHERE id = $2
       RETURNING id, title, status, priority, assigned_to, assigned_at`,
      [targetUserId, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('assignReport error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * PATCH /api/v1/officer/reports/:id/unassign
 * Release assignment from a report.
 * Officers may only unassign reports they own; admins may unassign any.
 * Access: officer, admin
 */
const unassignReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { userType, userId } = req.user;

    const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UUID_RE.test(id)) {
      return res.status(400).json({ success: false, message: 'Invalid report ID format' });
    }

    // Officers may only release their own assignment
    let whereExtra = '';
    const params = [id];
    if (userType === 'officer') {
      whereExtra = ' AND assigned_to = $2';
      params.push(userId);
    }

    const result = await db.query(
      `UPDATE reports
       SET assigned_to = NULL, assigned_at = NULL
       WHERE id = $1${whereExtra}
       RETURNING id, title, status, priority, assigned_to, assigned_at`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found or you are not the assigned officer',
      });
    }

    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('unassignReport error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { getOfficerReports, getOfficerQueue, assignReport, unassignReport };
