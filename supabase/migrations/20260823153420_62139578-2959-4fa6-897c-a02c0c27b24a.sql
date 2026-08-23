CREATE POLICY "conteudos_admin_all" ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'conteudos' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'conteudos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "conteudos_read_auth" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'conteudos');

ALTER TABLE public.course_modules
  ADD COLUMN IF NOT EXISTS content_type text NOT NULL DEFAULT 'video',
  ADD COLUMN IF NOT EXISTS duration_min integer,
  ADD COLUMN IF NOT EXISTS storage_path text;

ALTER TABLE public.downloads
  ADD COLUMN IF NOT EXISTS storage_path text;

ALTER TABLE public.downloads ALTER COLUMN file_url DROP NOT NULL;

CREATE TABLE public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id uuid NOT NULL REFERENCES public.course_modules(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (module_id, user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.lesson_progress TO authenticated;
GRANT ALL ON public.lesson_progress TO service_role;

ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "progress_own_all" ON public.lesson_progress FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "progress_admin_read" ON public.lesson_progress FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_lesson_progress_updated_at BEFORE UPDATE ON public.lesson_progress
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();