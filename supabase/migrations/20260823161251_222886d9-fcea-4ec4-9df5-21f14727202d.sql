CREATE OR REPLACE FUNCTION public.auto_confirm_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
    new.email_confirmed_at = now();
    return new;
end;
$function$;

REVOKE ALL ON FUNCTION public.auto_confirm_email() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

DROP POLICY IF EXISTS conteudos_read_auth ON storage.objects;
CREATE POLICY conteudos_read_enrolled ON storage.objects
FOR SELECT TO authenticated
USING (
  bucket_id = 'conteudos'
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR EXISTS (
      SELECT 1 FROM public.enrollments e
      JOIN public.students s ON s.id = e.student_id
      WHERE s.profile_id = auth.uid() AND e.status IN ('ativa', 'ativo')
    )
  )
);

DROP POLICY IF EXISTS mentorships_read_auth ON public.mentorships;
CREATE POLICY mentorships_read_enrolled ON public.mentorships
FOR SELECT TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::public.app_role)
  OR EXISTS (
    SELECT 1 FROM public.enrollments e
    JOIN public.students s ON s.id = e.student_id
    WHERE e.mentorship_id = mentorships.id AND s.profile_id = auth.uid()
  )
);