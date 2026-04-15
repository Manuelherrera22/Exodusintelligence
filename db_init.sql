-- Habilitar extensión para UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Crear tabla de perfiles (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    email text,
    full_name text,
    plan text DEFAULT 'free',
    onboarding_completed boolean DEFAULT false,
    migratory_score numeric,
    updated_at timestamptz DEFAULT now(),

    -- Basic Onboarding
    age integer,
    country_of_origin text,
    languages text[],
    education_level text,
    profession text,
    work_experience_years integer,
    estimated_income text,
    main_interest text,

    -- Advanced Profile
    nationality text,
    marital_status text,
    gender text,
    salud text,
    field_of_study text,
    is_title_validated boolean,
    is_institution_recognized boolean,
    occupation text,
    has_international_experience boolean,
    is_remote_worker boolean,
    nivel_tecnologico text,
    perfil_emprendedor boolean,
    english_level text,
    has_language_certification boolean,
    english_certification_score text,
    estimated_savings text,
    has_work_offer boolean,
    has_support_network boolean,
    pais_familia text,
    family_migration_plan text,
    children_count integer,
    children_ages text,
    partner_works boolean,
    target_country text,
    alternative_countries text[],
    willing_to_consider_other_countries boolean,
    residency_type_interest text,
    disponibilidad_para_viajar text,
    has_valid_passport boolean,
    has_active_visa boolean,
    has_legal_antecedents boolean,
    housing_plan text,
    transport_plan boolean,
    preferred_zone text,
    interested_in_post_migration_services boolean
);

-- 2. Crear tabla secundaria vista en Dashboard (user_basic_info)
CREATE TABLE IF NOT EXISTS public.user_basic_info (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    data jsonb DEFAULT '{}'::jsonb
);

-- 3. Crear función RPC requerida por frontend
CREATE OR REPLACE FUNCTION public."assign-default-route"(pais_destino text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Función stub para evitar errores del SDK en frontend. 
    -- La lógica real de asignar rutas va aquí posteriormente.
END;
$$;

-- 4. Seguridad básica (RLS) para MVP: permitir todo para simplificar o restringir a usuarios autorizados.
-- Como el frontend depende de transacciones del lado del cliente extensas sugerimos apagar por ahora o configurar RLS basico:
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_basic_info ENABLE ROW LEVEL SECURITY;

-- Politicas basicas permitiendo que el usuario se vea y edite a si mismo, 
-- y que roles de servicio (Edge functions) puedan hacer de todo.
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Servicerole can do all Profile" ON public.profiles;
CREATE POLICY "Servicerole can do all Profile" ON public.profiles USING (true) WITH CHECK (true);
