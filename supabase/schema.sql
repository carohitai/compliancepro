-- Kolte & Associates LLP — CompliancePro Database Schema
-- Run this in Supabase SQL Editor after creating your project
-- https://supabase.com → SQL Editor → New Query → Paste & Run

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Client Submissions ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS client_submissions (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at       TIMESTAMPTZ DEFAULT NOW(),

  -- Portal type
  portal_type      TEXT NOT NULL DEFAULT 'client', -- 'client' | 'professional'
  report_type      TEXT,                            -- 'compliance' | 'requirement'

  -- Basic info (Client Portal)
  name             TEXT,
  email            TEXT,
  mobile           TEXT,
  bac_code         TEXT,
  bac_label        TEXT,
  sector_group     TEXT,
  nature_of_business TEXT,
  nature_label     TEXT,

  -- Professional tool extra fields
  trade_name       TEXT,
  constitution     TEXT,
  address          TEXT,
  financial_year   TEXT,
  registrations    JSONB DEFAULT '{}'::jsonb,

  -- Report config
  assessment_year  TEXT,
  purpose          TEXT,   -- for requirement report
  loan_type        TEXT,   -- if loan application
  selected_assignments TEXT[], -- for professional tool

  -- Consent
  consent_given    BOOLEAN DEFAULT FALSE,
  consent_at       TIMESTAMPTZ,
  consent_version  TEXT DEFAULT '1.0',

  -- Metadata
  ip_address       TEXT,
  user_agent       TEXT
);

-- ─── Client Files ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS client_files (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at      TIMESTAMPTZ DEFAULT NOW(),

  submission_id   UUID REFERENCES client_submissions(id) ON DELETE CASCADE,

  file_name       TEXT NOT NULL,
  file_type       TEXT,         -- pdf | xlsx | docx | etc.
  file_size       BIGINT,       -- bytes
  storage_path    TEXT NOT NULL, -- path in Supabase storage bucket

  -- AI Assessment (from Claude via Edge Function)
  ai_assessment   JSONB,        -- structured extraction from Claude
  assessed_at     TIMESTAMPTZ,
  assessment_error TEXT         -- error if assessment failed
);

-- ─── Storage Bucket ───────────────────────────────────────────────────────────
-- Run separately in Supabase Dashboard → Storage → Create Bucket
-- Bucket name: client-files
-- Public: false (private, authenticated access only)

-- ─── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE client_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_files       ENABLE ROW LEVEL SECURITY;

-- Allow public insert (clients submitting data with consent)
CREATE POLICY "Allow public insert on client_submissions"
  ON client_submissions FOR INSERT
  TO anon
  WITH CHECK (consent_given = TRUE);

CREATE POLICY "Allow public insert on client_files"
  ON client_files FOR INSERT
  TO anon
  WITH CHECK (TRUE);

-- Only authenticated K&A users can read all data
CREATE POLICY "Allow authenticated read on client_submissions"
  ON client_submissions FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Allow authenticated read on client_files"
  ON client_files FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Allow authenticated update on client_files"
  ON client_files FOR UPDATE
  TO authenticated
  USING (TRUE);

-- ─── Helpful Views ────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW v_dashboard_summary AS
SELECT
  cs.id,
  cs.created_at,
  cs.portal_type,
  cs.report_type,
  cs.name,
  cs.email,
  cs.mobile,
  cs.nature_label,
  cs.sector_group,
  cs.financial_year,
  cs.assessment_year,
  cs.purpose,
  cs.loan_type,
  cs.constitution,
  COUNT(cf.id) AS file_count,
  BOOL_OR(cf.ai_assessment IS NOT NULL) AS has_ai_assessment
FROM client_submissions cs
LEFT JOIN client_files cf ON cf.submission_id = cs.id
GROUP BY cs.id
ORDER BY cs.created_at DESC;

-- ─── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON client_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_email      ON client_submissions(email);
CREATE INDEX IF NOT EXISTS idx_files_submission_id    ON client_files(submission_id);
