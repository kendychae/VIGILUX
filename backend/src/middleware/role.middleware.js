/**
 * Role-Based Access Control (RBAC) Middleware
 * Issue #45 — W5: Role-Based Permission System for Report Status Updates
 *
 * RBAC matrix for PATCH /api/v1/reports/:id/status:
 *   citizen  → 403 (view-only; cannot transition any status)
 *   officer  → may transition: submitted↔under_review, under_review↔investigating,
 *              investigating→resolved. Cannot set 'closed'.
 *   admin    → may set any valid status (full override, including 'closed')
 */

/**
 * Allowed status transitions per role.
 * An entry of "from" → [array of allowed "to"] values defines what each role
 * can do. Admins use the wildcard '*' meaning any state machine transition is
 * permitted.
 */
const OFFICER_ALLOWED_TRANSITIONS = {
  submitted:     ['under_review'],
  under_review:  ['investigating', 'submitted'],
  investigating: ['resolved', 'under_review'],
  resolved:      ['submitted'],
};

/**
 * Middleware: verify the requesting user is permitted to make the requested
 * status transition according to the RBAC matrix.
 *
 * Must run AFTER authenticate() so req.user is available.
 * Does NOT check the state-machine (that remains in the controller).
 */
exports.checkStatusUpdatePermission = (req, res, next) => {
  const { userType } = req.user || {};
  const { status: newStatus } = req.body;

  // Citizens cannot update report status at all
  if (userType === 'citizen') {
    return res.status(403).json({
      success: false,
      message: 'Citizens may only view report status and cannot change it',
    });
  }

  // Admins can set any status — no further role check needed here
  if (userType === 'admin') {
    return next();
  }

  // Officers: validate the target status is within their allowed set
  if (userType === 'officer') {
    // Derive allowed "to" values across all officer transitions
    const officerAllowedTargets = new Set(
      Object.values(OFFICER_ALLOWED_TRANSITIONS).flat()
    );

    if (!officerAllowedTargets.has(newStatus)) {
      return res.status(403).json({
        success: false,
        message: `Officers cannot set status to '${newStatus}'. Allowed targets: ${[...officerAllowedTargets].join(', ')}`,
      });
    }

    return next();
  }

  // Unknown role — deny
  return res.status(403).json({
    success: false,
    message: 'Insufficient permissions',
  });
};
