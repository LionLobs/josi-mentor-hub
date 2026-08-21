-- Adiciona o usuário na tabela de autenticação (sem ON CONFLICT no email se não houver unique index explícito visível, mas auth.users.email costuma ser unique)
-- Como o erro anterior foi sobre restrição de ON CONFLICT, vamos tentar uma abordagem mais direta.

DO $$
DECLARE
    new_user_id uuid := gen_random_uuid();
    existing_user_id uuid;
BEGIN
    -- Verifica se já existe
    SELECT id INTO existing_user_id FROM auth.users WHERE email = 'silvascuderoagatha@gmail.com';
    
    IF existing_user_id IS NULL THEN
        INSERT INTO auth.users (id, email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role)
        VALUES (
            new_user_id, 
            'silvascuderoagatha@gmail.com', 
            now(), 
            '{"provider":"email","providers":["email"]}', 
            '{"full_name":"Agatha Silva Scudero"}', 
            'authenticated', 
            'authenticated'
        );
        existing_user_id := new_user_id;
    END IF;

    -- Garante que o usuário tenha o papel de administrador
    -- Remove qualquer papel anterior para garantir que seja admin
    DELETE FROM public.user_roles WHERE user_id = existing_user_id;
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (existing_user_id, 'admin');

    -- Também cria o perfil se não existir
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (existing_user_id, 'Agatha Silva Scudero', 'silvascuderoagatha@gmail.com')
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, email = EXCLUDED.email;
END $$;