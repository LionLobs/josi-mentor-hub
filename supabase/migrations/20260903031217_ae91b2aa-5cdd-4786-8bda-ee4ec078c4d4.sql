
-- 1. Admin roles for the two owner emails
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role FROM auth.users u
WHERE u.email IN ('lionlobs@gmail.com','oficialteambrasil@gmail.com','silvascuderoagatha@gmail.com')
ON CONFLICT (user_id, role) DO NOTHING;

DELETE FROM public.user_roles r
USING auth.users u
WHERE r.user_id = u.id
  AND r.role = 'aluno'::app_role
  AND u.email IN ('lionlobs@gmail.com','oficialteambrasil@gmail.com');

-- keep new-signup trigger in sync
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data->>'full_name', new.email);

  if (new.email in ('silvascuderoagatha@gmail.com','lionlobs@gmail.com','oficialteambrasil@gmail.com')) then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'aluno');
  end if;

  insert into public.students (profile_id, full_name, email, status)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.email, 'active');

  return new;
end;
$function$;

-- 2. Mentorship course with its 6 lessons
INSERT INTO public.courses (id, title, description, published, price_cents)
VALUES (
  '4d1a0f52-8b4a-4f0e-9f4f-1c2b3a4d5e60',
  'Destaque-se — Mentoria Josi Nascimento',
  'A mentoria completa para massoterapeutas que querem se destacar: jornada profissional, conexões, finanças, posicionamento, carreira e execução em 30 dias.',
  true,
  0
)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, published = true;

INSERT INTO public.course_modules (course_id, title, description, position, content_type)
SELECT '4d1a0f52-8b4a-4f0e-9f4f-1c2b3a4d5e60', t.title, t.descr, t.pos, 'video'
FROM (VALUES
  ('Aula 01 — Mapa da Jornada Profissional', 'Onde você está, onde quer chegar e o caminho entre os dois.', 1),
  ('Aula 02 — Mapa de Conexões Profissionais', 'Construa a rede que gera indicações e oportunidades.', 2),
  ('Aula 03 — Planilha de Organização Financeira', 'Controle de entradas, saídas e precificação do seu trabalho.', 3),
  ('Aula 04 — Checklist de Posicionamento + Calendário de Conteúdo', 'Presença profissional consistente dentro e fora das redes.', 4),
  ('Aula 05 — Mapa de Carreira e Oportunidades', 'Direções de crescimento e novas fontes de receita.', 5),
  ('Aula 06 — Plano de Ação de 30 Dias', 'Execução guiada, semana a semana, com metas claras.', 6)
) AS t(title, descr, pos)
WHERE NOT EXISTS (
  SELECT 1 FROM public.course_modules m
  WHERE m.course_id = '4d1a0f52-8b4a-4f0e-9f4f-1c2b3a4d5e60' AND m.position = t.pos
);
