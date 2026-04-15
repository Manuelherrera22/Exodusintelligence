import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { BarChart, CheckSquare, FileText, Globe2, MessageSquare, Settings, User, LogOut, LayoutDashboard, Compass, Map, DollarSign, Bell, HelpCircle, Lock, UploadCloud, ArrowRight, Info, CheckCircle, ArrowUpCircle, X as CloseIcon, Gem, Briefcase, Target, TrendingUp, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import PlansComparisonModal from '@/components/PlansComparisonModal';
import FreeDashboard from '@/components/dashboards/FreeDashboard';
import ProDashboard from '@/components/dashboards/ProDashboard';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLocation } from 'react-router-dom';
import { SimulatorProvider } from '@/contexts/SimulatorContext';
import { useSupabaseFunctions } from '@/hooks/useSupabaseFunctions';
import { getPendingProfile, clearPendingProfile, saveProfileToSupabase, saveTasksToSupabase, loadProfileFromSupabase, loadTasksFromSupabase, toggleTaskComplete } from '@/lib/profileStore';
import { normalizeProfile, calculateOverallScore, diagnose, generateTasks } from '@/lib/migrationEngine';

const DashboardPage = () => {
    const { t } = useTranslation('dashboard');
    const { toast } = useToast();
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [profile, setProfile] = useState(null);
    const [basicInfo, setBasicInfo] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);
    const [welcomeMessage, setWelcomeMessage] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const { calculateScore, loadingCalculateScore } = useSupabaseFunctions();
    const [migProfile, setMigProfile] = useState(null);
    const [migTasks, setMigTasks] = useState([]);

    // Sync pending profile from chat → Supabase
    useEffect(() => {
        if (!user) return;
        const sync = async () => {
            const pending = getPendingProfile();
            if (pending) {
                const p = normalizeProfile(pending.profile);
                const score = pending.score || calculateOverallScore(p);
                const diag = diagnose(p);
                const tasks = pending.tasks || generateTasks(p, diag);

                // Save to Supabase (will silently fail if tables don't exist yet)
                try {
                    const { data } = await saveProfileToSupabase(user.id, p, score, diag.crs?.total || 0);
                    if (data?.id) {
                        await saveTasksToSupabase(user.id, data.id, tasks);
                    }
                } catch (e) { console.warn('Supabase save skipped:', e); }

                setMigProfile({ ...p, score, crsTotal: diag.crs?.total || 0 });
                setMigTasks(tasks.map(t => ({ ...t, completed: false })));
                clearPendingProfile();
            } else {
                // Try loading from Supabase
                try {
                    const saved = await loadProfileFromSupabase(user.id);
                    if (saved) {
                        setMigProfile({
                            ...saved.raw_profile,
                            score: saved.overall_score,
                            crsTotal: saved.crs_total,
                        });
                        const tasks = await loadTasksFromSupabase(user.id);
                        setMigTasks(tasks);
                    }
                } catch (e) { console.warn('Supabase load skipped:', e); }
            }
        };
        sync();
    }, [user]);

    const handleToggleTask = async (taskId, index) => {
        const updated = [...migTasks];
        updated[index] = { ...updated[index], completed: !updated[index].completed };
        setMigTasks(updated);
        try { await toggleTaskComplete(taskId, updated[index].completed); } catch(e) {}
    };

    const fetchProfile = async () => {
        if (user) {
            setLoadingProfile(true);
            
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (profileError) {
                console.error('Error fetching profile:', profileError);
                toast({ variant: "destructive", title: "Error", description: "No se pudo cargar tu perfil." });
            }

            const { data: basicInfoData, error: basicInfoError } = await supabase
                .from('user_basic_info')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();
            
            if (basicInfoError) {
                console.error('Error fetching basic info:', basicInfoError);
            }
            setBasicInfo(basicInfoData);

            if (!profileData) {
                const { data: newProfile, error: insertError } = await supabase
                    .from('profiles')
                    .insert({ user_id: user.id, email: user.email, full_name: user.user_metadata.full_name || '', plan: 'free', onboarding_completed: false })
                    .select()
                    .single();
                
                if(insertError) {
                    console.error('Error creating profile:', insertError);
                    toast({ variant: "destructive", title: "Error", description: "No se pudo inicializar tu perfil." });
                    setLoadingProfile(false);
                    return;
                }
                setProfile(newProfile);
            } else {
                 setProfile(profileData);
            }

            setLoadingProfile(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user]);

    useEffect(() => {
        const getAnalysis = async () => {
            if (profile && profile.onboarding_completed) {
                const { data: analysisResult, error } = await calculateScore(profile);
                if (error) {
                    console.error("Error calculating analysis:", error);
                } else if (analysisResult) {
                    setAnalysis(analysisResult.resultado);
                }
            } else {
                setAnalysis({}); // Set to empty object if onboarding is not complete
            }
        };

        getAnalysis();
    }, [profile, calculateScore]);

    useEffect(() => {
        if (location.state?.welcomeMessage) {
            setWelcomeMessage({
                title: location.state.welcomeMessage,
                subtitle: location.state.welcomeSubMessage,
                cta: location.state.welcomeCta,
            });
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state]);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login', { replace: true });
    };

    const handleAction = (feature) => {
        if (feature === 'Compare Plans' || feature === 'Comparar Planes') {
            navigate('/compare-plans');
        } else if (feature === 'Mi Ruta Migratoria' || feature === 'My Migration Path') {
            navigate('/my-migration-route');
        } else {
            toast({
                title: t('dashboard_toast_wip', { feature }),
                description: t('dashboard_toast_wip_desc'),
            });
        }
    };
    
    if (loadingProfile || !profile || (profile.onboarding_completed && !analysis)) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">{t('loading', { ns: 'common' })}</div>;
    }

    const renderDashboardByPlan = () => {
        const welcomeProps = welcomeMessage ? { ...welcomeMessage, onDismiss: () => setWelcomeMessage(null) } : {};

        switch (profile?.plan) {
            case 'pro':
                return <ProDashboard profile={profile} analysis={analysis} basicInfo={basicInfo} onAction={handleAction} />;
            case 'free':
            default:
                return <SimulatorProvider><FreeDashboard profile={profile} analysis={analysis} basicInfo={basicInfo} handleAction={handleAction} {...welcomeProps} /></SimulatorProvider>;
        }
    };

  return (
    <>
      <Helmet>
        <title>{t('dashboard_page_title')}</title>
        <meta name="description" content={t('dashboard_page_description')} />
      </Helmet>
      <PlansComparisonModal isOpen={isPlansModalOpen} onOpenChange={setIsPlansModalOpen} />
      <div className="flex min-h-screen bg-slate-900/50">
        <motion.aside
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-64 bg-slate-900 p-6 flex-col justify-between border-r border-slate-800 hidden lg:flex"
        >
            <div>
                <div className="flex items-center gap-3 mb-10">
                    <Globe2 className="w-8 h-8 text-purple-400" />
                    <span className="text-xl font-bold">{t('sidebar_brand')}</span>
                </div>
                <nav className="space-y-2">
                    {[
                        { icon: profile.plan === 'pro' ? Gem : LayoutDashboard, label: t('sidebar_nav_dashboard'), action: () => navigate('/dashboard') },
                        { icon: User, label: t('sidebar_nav_profile'), action: () => navigate('/update-profile') },
                        { icon: Compass, label: t('sidebar_nav_my_path'), plan: ['pro'], action: () => navigate('/my-migration-route') },
                        { icon: Briefcase, label: t('sidebar_nav_life_planner'), plan: ['pro'], action: () => navigate('/pro/life-planner') },
                        { icon: FileText, label: t('sidebar_nav_documents'), plan: ['pro'], action: () => navigate('/pro/document-verification') },
                        { icon: Map, label: t('sidebar_nav_explore'), plan: ['pro'], action: () => navigate('/options-map') },
                        { icon: DollarSign, label: t('sidebar_nav_plans'), action: () => navigate('/compare-plans') },
                        { icon: HelpCircle, label: t('sidebar_nav_support'), action: () => navigate('/support') },
                    ].map(item => (
                        <Button 
                          key={item.label} 
                          variant="ghost" 
                          className={`w-full justify-start text-gray-300 hover:bg-slate-800 hover:text-white ${profile.plan === 'pro' && item.label === t('sidebar_nav_dashboard') ? 'text-amber-400 hover:text-amber-300' : ''}`}
                          onClick={item.action || (() => handleAction(item.label))}
                          disabled={item.plan && !item.plan.includes(profile.plan)}
                        >
                            <item.icon className={`w-5 h-5 mr-3 ${profile.plan === 'pro' && item.label === t('sidebar_nav_dashboard') ? 'text-amber-500' : ''}`} />
                            {item.label}
                        </Button>
                    ))}
                </nav>
            </div>
            <div>
                 {profile.plan === 'pro' && (
                    <div className="text-xs text-center text-gray-400 p-2 bg-slate-800/50 rounded-lg mb-4">
                        {t('dashboard_pro.sidebar_plan_active_until', { date: '2025-07-09' })}
                    </div>
                )}
                <div className="my-4 border-t border-slate-800"></div>
                <div className="px-2 mb-4">
                    <LanguageSwitcher />
                </div>
                <Button variant="ghost" className="w-full justify-start text-gray-400 hover:bg-slate-800 hover:text-white" onClick={() => handleAction(t('sidebar_nav_settings'))}>
                    <Settings className="w-5 h-5 mr-3" />
                    {t('sidebar_nav_settings')}
                </Button>
                <Button variant="ghost" className="w-full justify-start text-gray-400 hover:bg-slate-800 hover:text-red-400" onClick={handleSignOut}>
                    <LogOut className="w-5 h-5 mr-3" />
                    {t('sidebar_nav_logout')}
                </Button>
            </div>
        </motion.aside>

        <div className="flex-1 flex flex-col">
          <header className="flex justify-between items-center p-4 border-b border-slate-800 lg:hidden">
            <div className="flex items-center gap-3">
              <Globe2 className="w-8 h-8 text-purple-400" />
              <span className="text-xl font-bold">{t('sidebar_brand')}</span>
            </div>
            <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <Button variant="ghost" size="icon" onClick={() => handleAction(t("header_notifications"))}>
                    <Bell className="w-6 h-6" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                    <LogOut className="w-6 h-6 text-red-400" />
                </Button>
            </div>
          </header>
          {renderDashboardByPlan()}
          {/* Migration Profile Card — shows when profile exists from KAI chat */}
          {migProfile && (
            <div className="p-6 space-y-4">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Target className="w-5 h-5 text-purple-400" /> Mi Score Migratorio
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">Basado en tu evaluación con KAI</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">{migProfile.score}</div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider">de 100</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-slate-800/60 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-500">CRS Canadá</p>
                    <p className="text-lg font-bold text-white">{migProfile.crsTotal || '—'}</p>
                  </div>
                  <div className="bg-slate-800/60 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-500">País</p>
                    <p className="text-lg font-bold text-white">{migProfile.country?.name?.slice(0,8) || '—'}</p>
                  </div>
                  <div className="bg-slate-800/60 rounded-xl p-3 text-center">
                    <p className="text-xs text-slate-500">Inglés</p>
                    <p className="text-lg font-bold text-white">{(migProfile.englishLevel || '—').toUpperCase()}</p>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: migProfile.score + '%' }}
                    transition={{ duration: 1.5, delay: 0.3 }}
                  />
                </div>
              </motion.div>

              {/* Tasks */}
              {migTasks.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="bg-slate-800/50 rounded-2xl border border-slate-700/30 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" /> Plan de Acción
                    </h3>
                    <span className="text-xs text-slate-500">
                      {migTasks.filter(t => t.completed).length}/{migTasks.length} completadas
                    </span>
                  </div>
                  <div className="space-y-2">
                    {migTasks.slice(0, 8).map((task, i) => (
                      <div key={task.id || task.task_key || i}
                        onClick={() => handleToggleTask(task.id, i)}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                          task.completed ? 'bg-emerald-500/[0.06] border border-emerald-500/10' : 'bg-slate-700/20 border border-slate-700/10 hover:bg-slate-700/30'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
                          task.completed ? 'border-emerald-400 bg-emerald-500/20' : 'border-slate-600'
                        }`}>
                          {task.completed && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium ${task.completed ? 'text-slate-500 line-through' : 'text-white'}`}>{task.title}</p>
                          <p className="text-[11px] text-slate-500 truncate">{task.description}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            task.priority === 'critical' ? 'bg-red-500/10 text-red-400' :
                            task.priority === 'high' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-slate-600/20 text-slate-400'
                          }`}>{task.priority}</span>
                          <p className="text-[10px] text-slate-600 mt-0.5">+{task.points} pts</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage;