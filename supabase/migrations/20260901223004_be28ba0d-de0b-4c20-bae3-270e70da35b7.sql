-- unique constraint so webhook can upsert enrollments idempotently
CREATE UNIQUE INDEX IF NOT EXISTS enrollments_student_mentorship_uidx
  ON public.enrollments (student_id, mentorship_id);

-- idempotency + audit log for Kiwify webhooks
CREATE TABLE IF NOT EXISTS public.kiwify_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text,
  event_type text,
  order_status text,
  customer_email text,
  product_external_id text,
  amount_cents integer NOT NULL DEFAULT 0,
  processed boolean NOT NULL DEFAULT false,
  message text,
  payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS kiwify_events_order_status_uidx
  ON public.kiwify_events (order_id, order_status) WHERE order_id IS NOT NULL;

GRANT SELECT ON public.kiwify_events TO authenticated;
GRANT ALL ON public.kiwify_events TO service_role;

ALTER TABLE public.kiwify_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS kiwify_events_admin_read ON public.kiwify_events;
CREATE POLICY kiwify_events_admin_read ON public.kiwify_events
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));