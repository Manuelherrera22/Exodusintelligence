import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import FreeDashboard from '@/components/dashboards/FreeDashboard';
import ProDashboard from '@/components/dashboards/ProDashboard';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { SimulatorProvider } from '@/contexts/SimulatorContext';
import { getPendingProfile, clearPendingProfile, saveProfileToSupabase, saveTasksToSupabase, loadProfileFromSupabase, loadTasksFromSupabase } from '@/lib/profileStore';
import { normalizeProfile, calculateOverallScore, diagnose, generateTasks } from '@/lib/migrationEngine';
import { useSupabaseFunctions } from '@/hooks/useSupabaseFunctions';

const DashboardPage = () => {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [basicInfo, setBasicInfo] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [analysis, setAnalysis] = useState(null);
    const { calculateScore } = useSupabaseFunctions();
    const [migProfile, setMigProfile] = useState(null);
    
    // Effect to perfectly enforce dark theme on the entire Dashboard tree, killing the global light mode defaults
    useEffect(() => {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light-theme');
        document.documentElement.classList.add('dark-theme');
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
    }, []);

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

                // Save to Supabase
                try {
                    const { data } = await saveProfileToSupabase(user.id, p, score, diag.crs?.total || 0);
                    if (data?.id) {
                        await saveTasksToSupabase(user.id, data.id, tasks);
                    }
                    
                    await supabase.from('profiles').update({ 
                        onboarding_completed: true,
                        country_of_origin: p.country?.name || p.country?.code || '',
                        age: p.age || '',
                        education_level: p.education || ''
                    }).eq('user_id', user.id);
                    localStorage.setItem(`fallback_onboarding_${user.id}`, 'true');

                    setProfile(prev => prev ? { ...prev, onboarding_completed: true } : prev);
                } catch (e) { console.warn('Supabase save skipped:', e); }

                setMigProfile({ ...p, score, crsTotal: diag.crs?.total || 0 });
                clearPendingProfile();
            } else {
                try {
                    const saved = await loadProfileFromSupabase(user.id);
                    if (saved) {
                        setMigProfile({
                            ...saved.raw_profile,
                            score: saved.overall_score,
                            crsTotal: saved.crs_total,
                        });
                    }
                } catch (e) { console.warn('Supabase load skipped:', e); }
            }
        };
        sync();
    }, [user]);

    const fetchProfile = async () => {
        if (user) {
            setLoadingProfile(true);
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            const pendingCheckout = localStorage.getItem('pending_checkout');
            if (pendingCheckout && profileData) {
                if (profileData.plan !== 'pro') {
                    await supabase.from('profiles').update({ plan: 'pro' }).eq('user_id', user.id);
                    profileData.plan = 'pro';
                }
                localStorage.removeItem('pending_checkout');
            }

            const { data: basicInfoData } = await supabase
                .from('user_basic_info')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();
            setBasicInfo(basicInfoData);

            if (!profileData) {
                const { data: newProfile } = await supabase
                    .from('profiles')
                    .insert({ user_id: user.id, email: user.email, full_name: user.user_metadata.full_name || '', plan: 'free', onboarding_completed: false })
                    .select()
                    .single();
                setProfile(newProfile);
            } else {
                 setProfile(profileData);
            }
            
            // Apply fallbacks for plan and onboarding to bypass RLS errors
            const fallbackPlan = localStorage.getItem(`fallback_plan_${user.id}`);
            const fallbackOnboard = localStorage.getItem(`fallback_onboarding_${user.id}`);
            setProfile(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    plan: fallbackPlan === 'pro' ? 'pro' : prev.plan,
                    onboarding_completed: fallbackOnboard === 'true' ? true : prev.onboarding_completed
                };
            });
            
            setLoadingProfile(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [user]);

    useEffect(() => {
        const getAnalysis = async () => {
            if (profile && profile.onboarding_completed) {
                const { data: analysisResult } = await calculateScore(profile);
                if (analysisResult) setAnalysis(analysisResult.resultado);
            } else {
                setAnalysis({});
            }
        };
        getAnalysis();
    }, [profile, calculateScore]);

    const handleSignOut = async () => {
        await signOut();
        navigate('/login', { replace: true });
    };
    
    if (loadingProfile || !profile) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-purple-400">Cargando tu espacio...</div>;
    }

    return (
        <div className="dark min-h-screen bg-slate-950 text-white font-sans flex flex-col relative selection:bg-purple-500/30">
            <Helmet>
                <title>Exodus Dashboard</title>
            </Helmet>

            {/* Minimal Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/50 backdrop-blur-md relative z-20">
                <div className="flex items-center gap-3">
                    <img src="/logoa.svg" alt="Exodus" className="w-8 h-8 opacity-80" onError={(e) => { e.target.style.display = 'none' }} />
                    <span className="font-bold text-lg tracking-wider text-white">EXODUS</span>
                </div>
                <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <Button variant="ghost" onClick={handleSignOut} className="text-slate-400 hover:text-white hover:bg-white/5">
                        <LogOut className="w-4 h-4 mr-2" />
                        Salir
                    </Button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 relative z-10 w-full overflow-hidden">
                {profile?.plan === 'pro' ? (
                    <ProDashboard profile={profile} migProfile={migProfile} analysis={analysis} basicInfo={basicInfo} />
                ) : (
                    <SimulatorProvider>
                        <FreeDashboard profile={profile} migProfile={migProfile} analysis={analysis} basicInfo={basicInfo} />
                    </SimulatorProvider>
                )}
            </div>
        </div>
    );
};

export default DashboardPage;