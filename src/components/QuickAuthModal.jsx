import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Mail, Lock, Sparkles, X, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickAuthModal = ({ isOpen, onClose, isEn = false, mode = 'login' }) => {
  const { signIn, signUp, signInWithGoogle, isProfileComplete } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isLoginMode, setIsLoginMode] = useState(mode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Translations
  const t = {
    title: isLoginMode 
      ? (isEn ? 'Welcome back' : 'Bienvenido de nuevo') 
      : (isEn ? 'Save your progress' : 'Guarda tu progreso'),
    subtitle: isLoginMode
      ? (isEn ? 'Log in to continue' : 'Inicia sesión para continuar')
      : (isEn ? 'Create a secure account to save your migration profile' : 'Crea una cuenta segura para guardar tu perfil migratorio'),
    googleBtn: isEn ? 'Continue with Google' : 'Continuar con Google',
    or: isEn ? 'or use email' : 'o usa tu email',
    emailPlaceholder: isEn ? 'name@example.com' : 'nombre@ejemplo.com',
    passwordPlaceholder: isEn ? 'Password' : 'Contraseña',
    cta: loading 
      ? (isEn ? 'Processing...' : 'Procesando...') 
      : (isLoginMode 
          ? (isEn ? 'Log In' : 'Iniciar Sesión') 
          : (isEn ? 'Create Account' : 'Crear Cuenta')),
    switchModeText: isLoginMode
      ? (isEn ? "Don't have an account?" : "¿No tienes cuenta?")
      : (isEn ? "Already have an account?" : "¿Ya tienes cuenta?"),
    switchModeLink: isLoginMode
      ? (isEn ? 'Create one now' : 'Crea una ahora')
      : (isEn ? 'Log In' : 'Inicia sesión'),
  };

  const handleGoogleAuth = async () => {
    const { error } = await signInWithGoogle();
    if (error) toast({ variant: 'destructive', title: 'Error', description: error.message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLoginMode) {
        const { error, data } = await signIn(email, password);
        if (error || !data.user) {
          toast({ variant: 'destructive', title: 'Error', description: error?.message || 'Invalid credentials' });
          setLoading(false);
          return;
        }
        toast({ title: isEn ? 'Login successful' : 'Sesión iniciada' });
        
        // Import getPendingProfile at top of file
        const complete = await isProfileComplete(data.user.id);
        const pending = localStorage.getItem('exodus_pending_profile');
        navigate(pending || complete ? '/dashboard' : '/basic-info', { replace: true });

      } else {
        const { error, data } = await signUp(email, password);
        if (error) {
          toast({ variant: 'destructive', title: 'Error', description: error.message });
          setLoading(false);
          return;
        }
        toast({ 
          title: isEn ? 'Account created' : 'Cuenta creada', 
          description: isEn ? 'Check your email to confirm.' : 'Revisa tu correo para confirmar.' 
        });
        
        // Once registered, jump to basic info to continue flow natively, unless pending profile exists
        if (data?.user) {
           const pending = localStorage.getItem('exodus_pending_profile');
           navigate(pending ? '/dashboard' : '/basic-info', { replace: true });
        }
      }
    } catch (err) {
       toast({ variant: 'destructive', title: 'Error', description: err.message });
    }
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[101] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="w-full max-w-md pointer-events-auto"
            >
            <div className="rounded-2xl p-6 sm:p-8 backdrop-blur-xl border flex flex-col relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)] glass-card"
                 style={{ backgroundColor: 'var(--surface-alpha)', borderColor: 'var(--chat-border)' }}>
                 
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 pointer-events-none" />
              
              <button 
                onClick={onClose} 
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors z-10"
                style={{ color: 'var(--text-secondary)' }}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center mb-6 relative z-10">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.25)]">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{t.title}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.subtitle}</p>
              </div>

              <div className="relative z-10">
                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border transition-all duration-300 text-sm font-medium hover:bg-white/5"
                  style={{ backgroundColor: 'var(--surface-alpha)', borderColor: 'var(--chat-border)', color: 'var(--text-primary)' }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {t.googleBtn}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px" style={{ backgroundColor: 'var(--chat-border)' }} />
                  <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>{t.or}</span>
                  <div className="flex-1 h-px" style={{ backgroundColor: 'var(--chat-border)' }} />
                </div>

                {/* Email/Password form */}
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      required
                      placeholder={t.emailPlaceholder}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border outline-none focus:border-purple-500/50 transition-colors"
                      style={{ backgroundColor: 'var(--surface-alpha)', borderColor: 'var(--chat-border)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="password"
                      required
                      placeholder={t.passwordPlaceholder}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm border outline-none focus:border-purple-500/50 transition-colors"
                      style={{ backgroundColor: 'var(--surface-alpha)', borderColor: 'var(--chat-border)', color: 'var(--text-primary)' }}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-3 border border-purple-500/20 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold text-sm hover:opacity-90 active:scale-[0.99] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {t.cta}
                  </button>
                </form>

                <p className="text-center text-xs mt-6" style={{ color: 'var(--text-secondary)' }}>
                  {t.switchModeText}{' '}
                  <button 
                    type="button"
                    onClick={() => setIsLoginMode(!isLoginMode)}
                    className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {t.switchModeLink}
                  </button>
                </p>

              </div>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QuickAuthModal;
