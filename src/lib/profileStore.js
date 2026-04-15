// src/lib/profileStore.js — Save/Load migration profiles
import { supabase } from '@/lib/customSupabaseClient';

const STORAGE_KEY = 'exodus_pending_profile';

// ── Save profile to localStorage (before auth) ─────────────────────────────
export function savePendingProfile(profile, score, tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ profile, score, tasks, savedAt: Date.now() }));
  } catch (e) {
    console.warn('Could not save pending profile:', e);
  }
}

export function getPendingProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    // Expire after 24 hours
    if (Date.now() - data.savedAt > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch (e) {
    return null;
  }
}

export function clearPendingProfile() {
  localStorage.removeItem(STORAGE_KEY);
}

// ── Save profile to Supabase (after auth) ───────────────────────────────────
export async function saveProfileToSupabase(userId, profile, score, crsTotal) {
  const { data, error } = await supabase
    .from('migration_profiles')
    .upsert({
      user_id: userId,
      country_code: profile.country?.code || null,
      country_name: profile.country?.name || null,
      age: profile.age,
      education: profile.education,
      field: profile.field,
      english_level: profile.englishLevel,
      french_level: profile.frenchLevel,
      work_years: profile.workYears,
      target_country: profile.targetCountry,
      challenges: profile.challenges || [],
      overall_score: score,
      crs_total: crsTotal,
      raw_profile: profile,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) {
    console.error('Save profile error, falling back to local storage:', error);
    localStorage.setItem(`fallback_profile_${userId}`, JSON.stringify({ profile, score, crsTotal, timestamp: Date.now() }));
  }
  return { data, error };
}

// ── Save tasks to Supabase ──────────────────────────────────────────────────
export async function saveTasksToSupabase(userId, profileId, tasks) {
  // Delete old tasks first
  await supabase.from('migration_tasks').delete().eq('user_id', userId);

  const rows = tasks.map(t => ({
    user_id: userId,
    profile_id: profileId,
    task_key: t.id,
    title: t.title,
    description: t.description,
    category: t.category,
    priority: t.priority,
    duration: t.duration,
    points: t.points,
    completed: false,
  }));

  const { error } = await supabase.from('migration_tasks').insert(rows);
  if (error) console.error('Save tasks error:', error);
  return { error };
}

// ── Load profile from Supabase ──────────────────────────────────────────────
export async function loadProfileFromSupabase(userId) {
  const { data, error } = await supabase
    .from('migration_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
      console.error('Load profile error:', error);
  }
  
  if (!data) {
      // Try local storage fallback
      const fallback = localStorage.getItem(`fallback_profile_${userId}`);
      if (fallback) {
          try {
              const parsed = JSON.parse(fallback);
              return {
                  raw_profile: parsed.profile,
                  overall_score: parsed.score,
                  crs_total: parsed.crsTotal
              };
          } catch(e) {}
      }
  }
  return data;
}

// ── Load tasks from Supabase ────────────────────────────────────────────────
export async function loadTasksFromSupabase(userId) {
  const { data, error } = await supabase
    .from('migration_tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at');

  if (error) console.error('Load tasks error:', error);
  return data || [];
}

// ── Toggle task completion ──────────────────────────────────────────────────
export async function toggleTaskComplete(taskId, completed) {
  const { error } = await supabase
    .from('migration_tasks')
    .update({
      completed,
      completed_at: completed ? new Date().toISOString() : null,
    })
    .eq('id', taskId);

  if (error) console.error('Toggle task error:', error);
  return { error };
}
