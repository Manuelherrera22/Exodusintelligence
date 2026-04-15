import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle, ArrowLeft, CreditCard, Lock, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Dialog, DialogContent, DialogOverlay, DialogPortal, DialogTitle, DialogDescription, DialogHeader, DialogClose } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const plans = {
  essential: {
    nameKey: 'plans_essential_name',
    price: 14.99,
    priceKey: '$14.99/mes',
    whyKey: 'plans_essential_desc',
    features: ['plans_feature_ai_recommendations', 'plans_feature_premium_maps']
  },
  pro: {
    nameKey: 'plans_pro_name',
    price: 29.99,
    priceKey: '$29.99/mes',
    whyKey: 'plans_pro_desc',
    features: ['plans_feature_ai_recommendations', 'plans_feature_verified_docs', 'plans_feature_lawyer_contact', 'plans_feature_ai_assistant', 'plans_feature_pdf_report']
  }
};

const PaymentPage = () => {
  const { planId } = useParams();
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isAnnual, setIsAnnual] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const plan = plans[planId];

  const handlePayment = async () => {
    setIsProcessing(true);
    // TODO: Implement Stripe payment logic here

    // Simulate successful payment & DB update
    setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ plan: planId })
          .eq('user_id', user.id);

        if (error) throw error;
        
        toast({
          title: t('payment_success_title', { planName: t(plan.nameKey) }),
          description: t('payment_success_desc'),
          variant: "default",
          className: "bg-green-600/20 border-green-500 text-white"
        });
        navigate('/dashboard');

      } catch (error) {
        console.error("Payment processing error:", error);
        toast({
          title: t('payment_error_title'),
          description: t('payment_error_desc'),
          variant: "destructive"
        });
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };
  
  if (!plan) {
    return (
       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-4">
        <h1 className="text-3xl font-bold text-red-500 mb-4">{t('payment_plan_unknown')}</h1>
        <Button onClick={() => navigate('/compare-plans')}>
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('back_to_dashboard')}
        </Button>
      </div>
    );
  }

  const price = isAnnual ? (plan.price * 12 * 0.8).toFixed(2) : plan.price.toFixed(2);
  const pricePeriod = isAnnual ? t('payment_annual_period', '/año') : t('payment_monthly_period', '/mes');

  return (
    <Dialog open={true} onOpenChange={() => navigate(-1)}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="bg-slate-900/90 backdrop-blur-lg border-purple-500/30 text-white sm:max-w-3xl p-0">
           <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.3 }}>
            <DialogHeader className="p-6 text-center border-b border-slate-800">
              <DialogTitle className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                {t('payment_title')}
              </DialogTitle>
              <DialogDescription className="text-slate-400">{t('payment_subtitle')}</DialogDescription>
            </DialogHeader>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Plan Summary */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-cyan-400">{t('payment_summary_title')}</h3>
                <Card className="bg-slate-800/50 border-slate-700 p-4">
                  <p className="text-lg font-bold">{t(plan.nameKey)}</p>
                  <p className="text-slate-300">{t(plan.whyKey)}</p>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">{t('payment_benefits_title')}</h4>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {plan.features.map(featureKey => (
                        <li key={featureKey} className="flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                          {t(featureKey)}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </div>

              {/* Payment Form */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-cyan-400">{t('payment_form_title')}</h3>
                <Card className="bg-slate-800/50 border-slate-700 p-4">
                  <div className="flex items-center justify-center space-x-2 mb-4 bg-slate-700/50 p-3 rounded-lg">
                    <Label htmlFor="annual-payment">{t('payment_monthly', 'Mensual')}</Label>
                    <Switch id="annual-payment" checked={isAnnual} onCheckedChange={setIsAnnual} />
                    <Label htmlFor="annual-payment">{t('payment_annual', 'Anual')}</Label>
                  </div>
                  {isAnnual && (
                      <p className="text-center text-sm text-green-400 mb-4 bg-green-500/10 p-2 rounded-md">
                        {t('plans_annual_discount')}
                      </p>
                  )}
                  <div className="text-center my-4">
                    <p className="text-4xl font-bold">${price}</p>
                    <p className="text-slate-400">{pricePeriod}</p>
                  </div>
                   <div className="p-4 border-2 border-dashed border-slate-600 rounded-lg">
                       <p className="text-center text-gray-400">El formulario de pago de Stripe aparecerá aquí.</p>
                   </div>
                   <p className="text-xs text-center text-slate-500 mt-2">{t('payment_cancel_anytime', 'Tendrás acceso inmediato y podrás cancelar en cualquier momento.')}</p>
                </Card>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800">
              <Button 
                onClick={handlePayment} 
                disabled={isProcessing}
                className="w-full text-lg py-6 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold"
              >
                <Lock className="mr-2 h-5 w-5" />
                {isProcessing ? t('payment_processing', 'Procesando...') : t('payment_cta')}
              </Button>
            </div>
           </motion.div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default PaymentPage;