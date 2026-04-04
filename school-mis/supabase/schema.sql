-- School MIS — Daily Reporting Database Schema
-- Run this in Supabase SQL Editor after creating your project
-- https://supabase.com → SQL Editor → New Query → Paste & Run

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Daily Reports (header — one row per calendar date) ──────────────────────
CREATE TABLE IF NOT EXISTS daily_reports (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_date   DATE NOT NULL UNIQUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW(),
  status        TEXT DEFAULT 'draft',
  notes         TEXT
);

-- ──�� Book Stock (Librarian — one row per standard per day) ───────────────────
CREATE TABLE IF NOT EXISTS dr_book_stock (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id       UUID REFERENCES daily_reports(id) ON DELETE CASCADE,
  standard_class  TEXT NOT NULL,
  opening_stock   INTEGER NOT NULL DEFAULT 0,
  purchased       INTEGER NOT NULL DEFAULT 0,
  sold            INTEGER NOT NULL DEFAULT 0,
  closing_stock   INTEGER GENERATED ALWAYS AS (opening_stock + purchased - sold) STORED,
  entered_by      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(report_id, standard_class)
);

-- ─── Admissions (Admin — class-wise daily counts) ────────────────────────────
CREATE TABLE IF NOT EXISTS dr_admissions (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id        UUID REFERENCES daily_reports(id) ON DELETE CASCADE,
  standard_class   TEXT NOT NULL,
  new_admissions   INTEGER NOT NULL DEFAULT 0,
  finance_count    INTEGER NOT NULL DEFAULT 0,
  one_time_count   INTEGER NOT NULL DEFAULT 0,
  amount_collected NUMERIC(10,2) NOT NULL DEFAULT 0,
  entered_by       TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(report_id, standard_class)
);

-- ─── Enquiries (Admin — individual enquiry entries) ──────────────────────────
CREATE TABLE IF NOT EXISTS dr_enquiries (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id        UUID REFERENCES daily_reports(id) ON DELETE CASCADE,
  enquiry_for_class TEXT NOT NULL,
  parent_name      TEXT,
  contact_number   TEXT,
  converted        BOOLEAN DEFAULT FALSE,
  notes            TEXT,
  entered_by       TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Bus Forms (Admin/Accounting — bus-wise daily entries) ───────────────────
CREATE TABLE IF NOT EXISTS dr_bus_forms (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id           UUID REFERENCES daily_reports(id) ON DELETE CASCADE,
  bus_number          TEXT NOT NULL,
  forms_filled        INTEGER NOT NULL DEFAULT 0,
  bus_fees_collected  NUMERIC(10,2) DEFAULT 0,
  entered_by          TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(report_id, bus_number)
);

-- ─── Fee Collection (Accounting — one row per standard per fee type per day) ─
CREATE TABLE IF NOT EXISTS dr_fee_collection (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id       UUID REFERENCES daily_reports(id) ON DELETE CASCADE,
  standard_class  TEXT NOT NULL,
  fee_type        TEXT NOT NULL,     -- 'SF' | 'TF' | 'BSR' | 'CF' | 'OF'
  amount          NUMERIC(10,2) NOT NULL DEFAULT 0,
  payment_method  TEXT,              -- 'Cash' | 'UPI' | 'Cheque' | 'Bank Transfer'
  entered_by      TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(report_id, standard_class, fee_type)
);

-- ─── Staff Attendance (Admin — one row per day) ──────────────────────────────
CREATE TABLE IF NOT EXISTS dr_staff_attendance (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_id   UUID REFERENCES daily_reports(id) ON DELETE CASCADE UNIQUE,
  total_staff INTEGER NOT NULL DEFAULT 0,
  present     INTEGER NOT NULL DEFAULT 0,
  on_leave    INTEGER NOT NULL DEFAULT 0,
  absent      INTEGER GENERATED ALWAYS AS (total_staff - present - on_leave) STORED,
  entered_by  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Vehicles Master ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vehicles (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  bus_number    TEXT NOT NULL UNIQUE,
  route         TEXT,
  capacity      INTEGER DEFAULT 40,
  is_active     BOOLEAN DEFAULT TRUE
);

-- ─── Views for Progressive / Cumulative Tracking ─────────────────────────────

CREATE OR REPLACE VIEW v_bus_cumulative AS
SELECT
  bf.bus_number,
  SUM(bf.forms_filled) AS total_forms_filled,
  SUM(bf.bus_fees_collected) AS total_fees_collected,
  COUNT(DISTINCT dr.report_date) AS days_reported
FROM dr_bus_forms bf
JOIN daily_reports dr ON dr.id = bf.report_id
GROUP BY bf.bus_number
ORDER BY bf.bus_number;

CREATE OR REPLACE VIEW v_admissions_cumulative AS
SELECT
  a.standard_class,
  SUM(a.new_admissions) AS total_admissions,
  SUM(a.finance_count) AS total_finance,
  SUM(a.one_time_count) AS total_one_time,
  SUM(a.amount_collected) AS total_amount
FROM dr_admissions a
JOIN daily_reports dr ON dr.id = a.report_id
GROUP BY a.standard_class;

CREATE OR REPLACE VIEW v_enquiry_monthly AS
SELECT
  TO_CHAR(dr.report_date, 'YYYY-MM') AS month,
  COUNT(*) AS total_enquiries,
  SUM(CASE WHEN e.converted THEN 1 ELSE 0 END) AS converted,
  SUM(CASE WHEN NOT e.converted THEN 1 ELSE 0 END) AS not_converted
FROM dr_enquiries e
JOIN daily_reports dr ON dr.id = e.report_id
GROUP BY TO_CHAR(dr.report_date, 'YYYY-MM')
ORDER BY month;

-- ─── Row Level Security ──────────────────────────────────────────────────────
ALTER TABLE daily_reports       ENABLE ROW LEVEL SECURITY;
ALTER TABLE dr_book_stock       ENABLE ROW LEVEL SECURITY;
ALTER TABLE dr_admissions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE dr_enquiries        ENABLE ROW LEVEL SECURITY;
ALTER TABLE dr_bus_forms        ENABLE ROW LEVEL SECURITY;
ALTER TABLE dr_fee_collection   ENABLE ROW LEVEL SECURITY;
ALTER TABLE dr_staff_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles            ENABLE ROW LEVEL SECURITY;

-- Allow anon full access (app uses client-side password auth)
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'daily_reports', 'dr_book_stock', 'dr_admissions', 'dr_enquiries',
    'dr_bus_forms', 'dr_fee_collection', 'dr_staff_attendance', 'vehicles'
  ]) LOOP
    EXECUTE format('CREATE POLICY "anon_insert_%s" ON %I FOR INSERT TO anon WITH CHECK (TRUE)', tbl, tbl);
    EXECUTE format('CREATE POLICY "anon_select_%s" ON %I FOR SELECT TO anon USING (TRUE)', tbl, tbl);
    EXECUTE format('CREATE POLICY "anon_update_%s" ON %I FOR UPDATE TO anon USING (TRUE)', tbl, tbl);
    EXECUTE format('CREATE POLICY "anon_delete_%s" ON %I FOR DELETE TO anon USING (TRUE)', tbl, tbl);
  END LOOP;
END $$;

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_daily_reports_date       ON daily_reports(report_date DESC);
CREATE INDEX IF NOT EXISTS idx_dr_book_stock_report     ON dr_book_stock(report_id);
CREATE INDEX IF NOT EXISTS idx_dr_admissions_report     ON dr_admissions(report_id);
CREATE INDEX IF NOT EXISTS idx_dr_enquiries_report      ON dr_enquiries(report_id);
CREATE INDEX IF NOT EXISTS idx_dr_bus_forms_report      ON dr_bus_forms(report_id);
CREATE INDEX IF NOT EXISTS idx_dr_fee_collection_report ON dr_fee_collection(report_id);
CREATE INDEX IF NOT EXISTS idx_dr_staff_attendance_report ON dr_staff_attendance(report_id);
