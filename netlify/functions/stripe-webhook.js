import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Inicializamos Supabase con la llave maestra (SERVICE ROLE) para saltar el RLS y editar perfiles con autoridad absoluta
const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY 
    // ^ Usando ANON como fallback evitará fallos si falta la ROLE_KEY en dev, pero en prod es vital usar SUPABASE_SERVICE_ROLE_KEY
);

export const handler = async (event, context) => {
    // Verificamos firma de Stripe para asegurar que no es un hacker HTTP
    const sig = event.headers['stripe-signature'];

    let stripeEvent;
    try {
        stripeEvent = stripe.webhooks.constructEvent(event.body, sig, endpointSecret);
    } catch (err) {
        console.error('Webhook Error:', err.message);
        return { statusCode: 400, body: `Webhook Error: ${err.message}` };
    }

    // Manejar el evento
    if (stripeEvent.type === 'checkout.session.completed') {
        const session = stripeEvent.data.object;
        
        const userId = session.client_reference_id;
        const planId = session.metadata?.planId || 'pro';

        if (userId) {
            console.log(`Payment confirmed for user ${userId}. Upgrading to ${planId}...`);
            
            // Actualizar a Pro en Supabase
            // Nota: Aquí se asume que existe la tabla `profiles` y la columna `plan` (o 'tier')
            const { error } = await supabase
                .from('profiles')
                .update({ 
                    plan: planId,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', userId);

            if (error) {
                console.error('Supabase update error:', error);
                return { statusCode: 500, body: 'Database Error' };
            }
            console.log("Successfully upgraded user.");
        }
    }

    // Retonar un 200 a Stripe rápido (Stripe exige < 3 segundos)
    return {
        statusCode: 200,
        body: JSON.stringify({ received: true })
    };
};
