import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event, context) => {
    // Solo permitir POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { userId, planId, billing } = JSON.parse(event.body);

        if (!userId || !planId) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Faltan parámetros requeridos' }) };
        }

        // Obtener la URL base dinámicamente
        const origin = event.headers.origin || event.headers.referer || 'http://localhost:3000';
        
        // En producción usar el Price ID real configurado en Netlify Env Vars
        // Para desarrollo o si no hay var, usar un Price ID estático o simulador
        const priceMap = {
            pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_1Pqxyz_mock_monthly',
            pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_1Pqxyz_mock_yearly',
            premium_monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || 'price_1Pqxyz_mock_premium_m',
        };
        
        const priceId = priceMap[`${planId}_${billing}`] || priceMap.pro_monthly;

        // Si estamos probando sin llaves reales de Stripe, esto fallará, 
        // pero es el código de Grado de Producción exacto.
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${origin}/dashboard?success=true`,
            cancel_url: `${origin}/dashboard?canceled=true`,
            client_reference_id: userId, // CRÍTICO: Esto vincula el pago al UUID del usuario en Supabase
            metadata: {
                userId: userId,
                planId: planId
            }
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ url: session.url })
        };
    } catch (error) {
        console.error('Stripe error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
