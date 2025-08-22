-- Enable pgcrypto for gen_random_uuid if not already enabled
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Replies table to track activity (optional but recommended for hot/active)
CREATE TABLE IF NOT EXISTS public.replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  author_username TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index to speed up aggregations by note
CREATE INDEX IF NOT EXISTS idx_replies_note_id ON public.replies(note_id);
CREATE INDEX IF NOT EXISTS idx_replies_created_at ON public.replies(created_at DESC);

-- Simple activity metrics: reply_count and last_activity_at
-- View combines notes with activity and computes a basic hot_score
-- Hot score formula (example):
-- hot = ln(1 + reply_count) + (extract(epoch from last_activity_at) / 45000.0)
-- This favors recent and active posts. Tweak divisor to adjust time decay.

CREATE OR REPLACE VIEW public.notes_with_activity AS
WITH reply_stats AS (
  SELECT
    r.note_id,
    COUNT(*)::int AS reply_count,
    MAX(r.created_at) AS last_reply_at
  FROM public.replies r
  GROUP BY r.note_id
)
SELECT
  n.id,
  n.title,
  n.body,
  n.author_username,
  n.tags,
  n.created_at,
  n.updated_at,
  COALESCE(rs.last_reply_at, n.updated_at, n.created_at) AS last_activity_at,
  COALESCE(rs.reply_count, 0) AS reply_count,
  -- Basic hot formula: logarithmic reply factor + time component (seconds since epoch / decay)
  (CASE
     WHEN COALESCE(rs.reply_count, 0) > 0 THEN ln(1 + COALESCE(rs.reply_count, 0))
     ELSE 0
   END
   + extract(epoch from COALESCE(rs.last_reply_at, n.updated_at, n.created_at)) / 45000.0
  ) AS hot_score
FROM public.notes n
LEFT JOIN reply_stats rs ON rs.note_id = n.id;

-- RLS policies for replies (mirror notes for simplicity)
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'replies' AND policyname = 'Allow public read access'
  ) THEN
    CREATE POLICY "Allow public read access" ON public.replies FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'replies' AND policyname = 'Allow public insert access'
  ) THEN
    CREATE POLICY "Allow public insert access" ON public.replies FOR INSERT WITH CHECK (true);
  END IF;
END $$;