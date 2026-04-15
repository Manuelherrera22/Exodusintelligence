import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Eye, EyeOff, Mail, Lock, Globe, ArrowLeft, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/LanguageSwitcher';

const LoginPage = () => {
  const { t } = useTranslation('auth');
  
  const loginSchema = z.object({
    email: z.string().email({ message: t('zod_email_invalid', { ns: 'auth' }) }),
    password: z.string().min(1, { message: "La contraseña no puede estar vacía" }),
  });

  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signInWithGoogle, isProfileComplete } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleLogin = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      toast({ variant: 'destructive', title: 'Error', description: error.message });
    }
  };

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const { error, data: signInData } = await signIn(data.email, data.password);
      if (error || !signInData.user) {
        toast({ variant: 'destructive', title: 'Error', description: error?.message || 'Error al iniciar sesión' });
        return; 
      }
      
      const profileComplete = await isProfileComplete(signInData.user.id);

      toast({
        title: t('login_success_toast_title'),
        description: t('login_success_toast_desc'),
      });

      if (profileComplete) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/basic-info', { replace: true });
      }

    } catch (error) {
      toast({
        variant: "destructive",
        title: t('login_error_toast_title'),
        description: error.message || t('login_error_toast_desc'),
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: 'var(--hero-bg)', transition: 'background-color 0.4s ease' }}>
      {/* Subtle background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-600/[0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-600/[0.04] rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 relative z-10">
        <motion.button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 group"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        >
          <Globe className="w-4 h-4 text-purple-400/50" />
          <span className="text-sm font-semibold tracking-tight" style={{ color: 'var(--text-muted)' }}>Exodus</span>
        </motion.button>
        <LanguageSwitcher />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.25)]"
            >
              <Sparkles className="w-7 h-7 text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {t('login_title')}
            </h1>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {t('login_subtitle')}
            </p>
          </div>

          {/* Google — FIRST (zero friction) */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border transition-all duration-300 text-sm font-medium mb-5 hover:shadow-[0_0_20px_rgba(139,92,246,0.08)]"
            style={{ backgroundColor: 'var(--surface-alpha)', borderColor: 'var(--chat-border)', color: 'var(--text-primary)' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar con Google
          </motion.button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--chat-border)' }} />
            <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>o con email</span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--chat-border)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  placeholder={t('login_email_placeholder')}
                  {...register('email')}
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-sm border outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30 transition-all duration-200"
                  style={{ backgroundColor: 'var(--surface-alpha)', borderColor: 'var(--chat-border)', color: 'var(--text-primary)' }}
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1.5 pl-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('login_password_placeholder')}
                  {...register('password')}
                  className="w-full pl-11 pr-12 py-3.5 rounded-2xl text-sm border outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/30 transition-all duration-200"
                  style={{ backgroundColor: 'var(--surface-alpha)', borderColor: 'var(--chat-border)', color: 'var(--text-primary)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1.5 pl-1">{errors.password.message}</p>}
            </div>
            
            <div className="text-right">
              <Link to="#" onClick={(e) => { e.preventDefault(); toast({ title: t('common:coming_soon'), description: t('common:coming_soon_desc') })}} className="text-xs text-purple-400/70 hover:text-purple-400 transition-colors">
                {t('login_forgot_password')}
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold text-sm shadow-[0_0_25px_rgba(139,92,246,0.2)] hover:shadow-[0_0_35px_rgba(139,92,246,0.35)] active:scale-[0.99] transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? t('login_cta_loading') : t('login_cta')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
            {t('login_no_account')}{' '}
            <Link to="/register" className="font-semibold text-purple-400 hover:text-purple-300 transition-colors">
              {t('login_register_link')}
            </Link>
          </p>

          {/* Back to landing */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-1.5 mx-auto mt-6 text-[11px] transition-colors"
            style={{ color: 'var(--text-muted)' }}
          >
            <ArrowLeft className="w-3 h-3" /> Volver al inicio
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;