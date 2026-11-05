import { createClient, SupabaseClient } from '@supabase/supabase-js';

const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const RUNTIME_URL_KEY = 'scripture_nexus_supabase_url';
const RUNTIME_ANON_KEY = 'scripture_nexus_supabase_anon_key';

let dynamicClient: SupabaseClient | null =
  envUrl && envKey ? createClient(envUrl, envKey) : null;

export function getSupabaseClient(): SupabaseClient | null {
  if (dynamicClient) return dynamicClient;
  if (typeof window !== 'undefined') {
    const savedUrl = localStorage.getItem(RUNTIME_URL_KEY) || envUrl;
    const savedKey = localStorage.getItem(RUNTIME_ANON_KEY) || envKey;
    if (savedUrl && savedKey) {
      try {
        dynamicClient = createClient(savedUrl, savedKey);
        return dynamicClient;
      } catch {
        return null;
      }
    }
  }
  return null;
}

export function configureRuntimeSupabase(url: string, anonKey: string): SupabaseClient | null {
  const cleanUrl = url.trim();
  const cleanKey = anonKey.trim();
  if (typeof window !== 'undefined') {
    if (cleanUrl && cleanKey) {
      localStorage.setItem(RUNTIME_URL_KEY, cleanUrl);
      localStorage.setItem(RUNTIME_ANON_KEY, cleanKey);
    } else {
      localStorage.removeItem(RUNTIME_URL_KEY);
      localStorage.removeItem(RUNTIME_ANON_KEY);
    }
  }
  if (!cleanUrl || !cleanKey) {
    dynamicClient = envUrl && envKey ? createClient(envUrl, envKey) : null;
    return dynamicClient;
  }
  dynamicClient = createClient(cleanUrl, cleanKey);
  return dynamicClient;
}

export function getSupabaseConfigStatus(): {
  isConnected: boolean;
  url: string;
  source: 'env' | 'runtime' | 'none';
} {
  if (envUrl && envKey) {
    return { isConnected: true, url: envUrl, source: 'env' };
  }
  if (typeof window !== 'undefined') {
    const savedUrl = localStorage.getItem(RUNTIME_URL_KEY) || '';
    const savedKey = localStorage.getItem(RUNTIME_ANON_KEY) || '';
    if (savedUrl && savedKey) {
      return { isConnected: true, url: savedUrl, source: 'runtime' };
    }
  }
  return { isConnected: false, url: '', source: 'none' };
}

export const isSupabaseConfigured = Boolean(envUrl && envKey);
export const supabase = dynamicClient;
