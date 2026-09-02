CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  duration_min integer NOT NULL DEFAULT 60,
  price_cents integer NOT NULL DEFAULT 0,
  package_label text,
  package_price_cents integer,
  discount_note text,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services_public_read" ON public.services FOR SELECT TO anon, authenticated USING (active);
CREATE POLICY "services_admin_all" ON public.services FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.availability_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weekday smallint NOT NULL CHECK (weekday BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  slot_min integer NOT NULL DEFAULT 60,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.availability_rules TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.availability_rules TO authenticated;
GRANT ALL ON public.availability_rules TO service_role;
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "availability_public_read" ON public.availability_rules FOR SELECT TO anon, authenticated USING (active);
CREATE POLICY "availability_admin_all" ON public.availability_rules FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  starts_at timestamptz NOT NULL,
  duration_min integer NOT NULL DEFAULT 60,
  status text NOT NULL DEFAULT 'agendado',
  notes text,
  google_event_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX bookings_starts_at_idx ON public.bookings (starts_at);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookings_own_read" ON public.bookings FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "bookings_own_insert" ON public.bookings FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "bookings_own_update" ON public.bookings FOR UPDATE TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')) WITH CHECK (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "bookings_admin_delete" ON public.bookings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.available_slots(_day date, _duration_min integer DEFAULT 60)
RETURNS TABLE (slot timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH rules AS (
    SELECT start_time, end_time, slot_min
    FROM public.availability_rules
    WHERE active AND weekday = EXTRACT(DOW FROM _day)::smallint
  ),
  candidates AS (
    SELECT gs AS slot
    FROM rules r,
    LATERAL generate_series(
      (_day + r.start_time) AT TIME ZONE 'America/Sao_Paulo',
      ((_day + r.end_time) AT TIME ZONE 'America/Sao_Paulo') - make_interval(mins => _duration_min),
      make_interval(mins => r.slot_min)
    ) AS gs
  )
  SELECT c.slot
  FROM candidates c
  WHERE c.slot > now()
    AND NOT EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.status <> 'cancelado'
        AND tstzrange(b.starts_at, b.starts_at + make_interval(mins => b.duration_min), '[)')
            && tstzrange(c.slot, c.slot + make_interval(mins => _duration_min), '[)')
    )
  ORDER BY 1;
$$;
REVOKE EXECUTE ON FUNCTION public.available_slots(date, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.available_slots(date, integer) TO authenticated, service_role;

INSERT INTO public.services (name, duration_min, price_cents, package_label, package_price_cents, discount_note, sort_order) VALUES
('Avaliação Postural', 60, 28000, '5 sessões', 75000, '10% Off no pix ou dinheiro', 1),
('Drenagem Linfática - Manual pós Operatório', 60, 28000, '5 sessões', 75000, '10% Off no pix ou dinheiro', 2),
('Drenagem Linfática - Método Leduc Eliminação de Toxinas', 60, 28000, '5 sessões', 75000, '10% Off no pix ou dinheiro', 3),
('Drenagem Linfática - Método Leduc em Gestantes', 60, 28000, '5 sessões', 75000, '10% Off no pix ou dinheiro', 4),
('Liberação de Miofascial', 60, 28000, '5 sessões', 75000, '10% Off no pix ou dinheiro', 5),
('Massagem Desportiva (Atletas)', 60, 28000, '5 sessões', 75000, '10% Off no pix ou dinheiro', 6),
('Massagem Kids', 60, 28000, '5 sessões', 75000, '10% Off no pix ou dinheiro', 7),
('Massagem Modeladora + Queima de calorias', 60, 28000, '5 sessões', 75000, '10% Off no pix ou dinheiro', 8),
('Massagem Preventiva Personalizada', 60, 28000, '5 sessões', 75000, '10% Off no pix ou dinheiro', 9),
('Massagem Relaxante', 60, 28000, '5 sessões', 75000, '10% Off no pix ou dinheiro', 10),
('Massagem Terapêutica + Alongamento', 60, 28000, '5 sessões', 75000, '10% Off no pix ou dinheiro', 11),
('Quick Massage em Eventos', 60, 28000, '5 sessões', 75000, '10% Off no pix ou dinheiro', 12),
('Reflexologia', 60, 28000, '5 sessões', 75000, '10% Off no pix ou dinheiro', 13),
('Shantala', 60, 28000, '5 sessões', 75000, '10% Off no pix ou dinheiro', 14),
('Ventosaterapia', 60, 28000, '5 sessões', 75000, '10% Off no pix ou dinheiro', 15);

INSERT INTO public.availability_rules (weekday, start_time, end_time, slot_min) VALUES
(1, '09:00', '18:00', 60),
(2, '09:00', '18:00', 60),
(3, '09:00', '18:00', 60),
(4, '09:00', '18:00', 60),
(5, '09:00', '18:00', 60),
(6, '09:00', '13:00', 60);