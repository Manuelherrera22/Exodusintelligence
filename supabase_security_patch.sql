-- ═══════════════════════════════════════════════════════════════════════════════
-- SECURITY PATCH: Prevent users from self-upgrading their billing plan (tier/plan)
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════════════════════════════════════

-- PROBLEMA ACTUAL: Las reglas RLS permiten que un usuario ejecute un UPDATE en su propia fila.
-- Si la columna que indica el pago (ej. `plan` en `profiles`) está en la misma fila, el usuario 
-- puede inyectar: supabase.from('profiles').update({ plan: 'pro' }).
-- Supabase no tiene Seguridad a Nivel de Columna (CLS) de manera nativa sin complicar la estructura.

-- SOLUCIÓN ROBUSTA DE PRODUCCIÓN: Usar un TRIGGER de PostgreSQL que rechace cualquier cambio 
-- a la columna `plan` a menos que la consulta provenga del Rol de Servicio (Service Role),
-- que será usado exclusivamente por nuestro Webhook de Stripe.

CREATE OR REPLACE FUNCTION protect_billing_plan()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar si el valor del plan está cambiando
    IF NEW.plan IS DISTINCT FROM OLD.plan THEN
        -- Permitir el cambio solo si se está ejecutando bajo la llave SERVICE_ROLE
        -- o si se hace por defecto al momento del registro (cuando OLD.plan es null)
        IF current_user = 'anon' OR current_user = 'authenticated' THEN
             RAISE EXCEPTION 'Access Denied: You cannot manually change your billing plan. This is handled by Stripe Webhooks.';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Eliminar el trigger si existe previamente para poder reiniciar
DROP TRIGGER IF EXISTS enforce_billing_security ON profiles;

-- Aplicar el trigger de seguridad antes de permitir el UPDATE
CREATE TRIGGER enforce_billing_security
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION protect_billing_plan();

-- NOTA A AÑADIR A LA MIGRACIÓN PRINCIPAL:
-- Esto aplica solo si tu columna se llama `plan` y está en la tabla `profiles`.
