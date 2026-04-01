-- Migration: 004_officer_assignment.sql
-- W6 Ticket #58 — Law Enforcement Dashboard: Report Assignment
-- Adds assignment tracking columns to the reports table
ALTER TABLE reports
ADD COLUMN IF NOT EXISTS assigned_to UUID REFERENCES users(id) ON DELETE
SET NULL,
    ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMP;
-- Index for fast "My Cases" queries (officer looking up reports assigned to them)
CREATE INDEX IF NOT EXISTS idx_reports_assigned_to ON reports(assigned_to);
-- Index for priority queue ordering (unassigned reports sorted by priority)
-- Priority order: urgent > high > medium > low (mapped to integers for ordering)
CREATE INDEX IF NOT EXISTS idx_reports_priority_created ON reports(created_at DESC)
WHERE assigned_to IS NULL;