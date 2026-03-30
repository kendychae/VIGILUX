-- W6 Migration: Support provider-aware push tokens for Expo + FCM delivery

ALTER TABLE fcm_tokens
ADD COLUMN IF NOT EXISTS provider VARCHAR(20);

UPDATE fcm_tokens
SET provider = 'fcm'
WHERE provider IS NULL;

ALTER TABLE fcm_tokens
ALTER COLUMN provider SET DEFAULT 'fcm';

ALTER TABLE fcm_tokens
DROP CONSTRAINT IF EXISTS fcm_tokens_provider_check;

ALTER TABLE fcm_tokens
ADD CONSTRAINT fcm_tokens_provider_check
CHECK (provider IN ('expo', 'fcm'));

CREATE INDEX IF NOT EXISTS idx_fcm_tokens_provider ON fcm_tokens(provider);