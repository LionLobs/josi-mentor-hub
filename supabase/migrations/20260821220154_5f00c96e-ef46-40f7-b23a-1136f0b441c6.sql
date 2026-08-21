ALTER TABLE public.mentorships ADD COLUMN IF NOT EXISTS external_id TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS external_id TEXT;

-- Grant permissions (if needed, though these are existing tables)
GRANT ALL ON public.mentorships TO service_role;
GRANT ALL ON public.courses TO service_role;
GRANT SELECT ON public.mentorships TO authenticated;
GRANT SELECT ON public.courses TO authenticated;
