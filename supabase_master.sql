-- ═══════════════════════════════════════════════════════════════════════════════
-- EXODUS INTELLIGENCE — SQL MAESTRO DE PRODUCCIÓN
-- Ejecutar TODO esto en Supabase SQL Editor (en un solo bloque)
-- Seguro de ejecutar múltiples veces (usa IF NOT EXISTS y DROP IF EXISTS)
-- ═══════════════════════════════════════════════════════════════════════════════

-- ═══ EXTENSIONES ═══
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLA 1: profiles (Perfil principal del usuario)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    email text,
    full_name text,
    plan text DEFAULT 'free',
    onboarding_completed boolean DEFAULT false,
    migratory_score numeric,
    updated_at timestamptz DEFAULT now(),
    age integer,
    country_of_origin text,
    languages text[],
    education_level text,
    profession text,
    work_experience_years integer,
    estimated_income text,
    main_interest text,
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

-- Constraint UNIQUE para user_id (necesario para el trigger de auto-creación)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_user_id_unique') THEN
        ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_unique UNIQUE (user_id);
    END IF;
END $$;

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLA 2: user_basic_info
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.user_basic_info (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    data jsonb DEFAULT '{}'::jsonb
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLA 3: migration_profiles (Perfiles migratorios del motor de IA)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS migration_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    country_code TEXT,
    country_name TEXT,
    age INTEGER,
    education TEXT,
    field TEXT,
    english_level TEXT,
    french_level TEXT,
    work_years INTEGER,
    target_country TEXT,
    challenges TEXT[] DEFAULT '{}',
    overall_score INTEGER DEFAULT 0,
    crs_total INTEGER DEFAULT 0,
    raw_profile JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLA 4: migration_tasks (Plan de tareas generado por IA)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS migration_tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES migration_profiles(id) ON DELETE CASCADE,
    task_key TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    priority TEXT DEFAULT 'medium',
    duration TEXT,
    points INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- TABLA 5: kai_memory (Memoria persistente del agente KAI por usuario)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS kai_memory (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    messages JSONB DEFAULT '[]',
    extracted_data JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- RLS (Row Level Security) — Habilitar en todas las tablas
-- ═══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_basic_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE kai_memory ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════════════════════
-- POLÍTICAS RLS — profiles
-- ═══════════════════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles 
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles 
;
CREATE POLICY "Users can update own profile" ON public.profiles 
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ELIMINAR la política abierta insegura (si existe)
DROP POLICY IF EXISTS "Servicerole can do all Profile" ON public.profiles;

-- ═══════════════════════════════════════════════════════════════════════════════
-- POLÍTICAS RLS — user_basic_info
-- ═══════════════════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "Users can view own basic info" ON public.user_basic_info;
CREATE POLICY "Users can view own basic info" ON public.user_basic_info
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own basic info" ON public.user_basic_info;
CREATE POLICY "Users can insert own basic info" ON public.user_basic_info
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own basic info" ON public.user_basic_info;
CREATE POLICY "Users can update own basic info" ON public.user_basic_info
    FOR UPDATE USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- POLÍTICAS RLS — migration_profiles
-- ═══════════════════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "Users can read own profiles" ON migration_profiles;
CREATE POLICY "Users can read own profiles" ON migration_profiles 
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profiles" ON migration_profiles;
CREATE POLICY "Users can insert own profiles" ON migration_profiles 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profiles" ON migration_profiles;
CREATE POLICY "Users can update own profiles" ON migration_profiles 
    FOR UPDATE USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- POLÍTICAS RLS — migration_tasks
-- ═══════════════════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "Users can read own tasks" ON migration_tasks;
CREATE POLICY "Users can read own tasks" ON migration_tasks 
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own tasks" ON migration_tasks;
CREATE POLICY "Users can insert own tasks" ON migration_tasks 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own tasks" ON migration_tasks;
CREATE POLICY "Users can update own tasks" ON migration_tasks 
    FOR UPDATE USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- POLÍTICAS RLS — kai_memory
-- ═══════════════════════════════════════════════════════════════════════════════
DROP POLICY IF EXISTS "Users can manage own memory" ON kai_memory;
CREATE POLICY "Users can manage own memory" ON kai_memory 
    FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ÍNDICES DE RENDIMIENTO
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_profiles_user ON migration_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON migration_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_profile ON migration_tasks(profile_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- FUNCIÓN RPC: assign-default-route (stub)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public."assign-default-route"(pais_destino text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Stub function — real logic to be implemented
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════════════
-- TRIGGER: Auto-crear perfil cuando un usuario se registra
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, full_name, plan, onboarding_completed)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
        'free',
        false
    )
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ═══════════════════════════════════════════════════════════════════════════════
-- TRIGGER: Proteger columna 'plan' contra manipulación del cliente
-- (Solo el Stripe Webhook con SERVICE_ROLE puede cambiar el plan)
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE OR REPLACE FUNCTION protect_billing_plan()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.plan IS DISTINCT FROM OLD.plan THEN
        IF current_user = 'anon' OR current_user = 'authenticated' THEN
             RAISE EXCEPTION 'Access Denied: Billing plan changes are handled exclusively by Stripe Webhooks.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_billing_security ON profiles;
CREATE TRIGGER enforce_billing_security
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION protect_billing_plan();

-- ═══════════════════════════════════════════════════════════════════════════════
-- ✅ LISTO — Todo el esquema de Exodus Intelligence está configurado
-- ═══════════════════════════════════════════════════════════════════════════════
