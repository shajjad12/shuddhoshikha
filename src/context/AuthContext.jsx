/**
 * AuthContext — Shuddhoshikha
 * Provides global auth state: user, profile metadata (sh_class, sh_group, etc.)
 * WordPress REST API + JWT Auth plugin assumed.
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

/* ── WordPress REST base ─────────────────────────────────── */
const WP_BASE = process.env.REACT_APP_WP_BASE_URL || 'https://your-wp-site.com/wp-json';

/* ── Cache key ───────────────────────────────────────────── */
const CACHE_KEY = 'sh_profile_cache';

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);   // raw WP user object
  const [profile, setProfile] = useState(null);   // sh_* meta fields
  const [token, setToken]     = useState(() => localStorage.getItem('sh_jwt') || null);
  const [loading, setLoading] = useState(true);

  /* ── Fetch user + meta ─────────────────────────────────── */
  const fetchUser = useCallback(async (jwt) => {
    if (!jwt) { setLoading(false); return; }
    try {
      const res = await fetch(`${WP_BASE}/wp/v2/users/me?context=edit`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (!res.ok) throw new Error('Token invalid');
      const data = await res.json();

      setUser(data);
      const meta = data.meta || {};
      const prof = {
        sh_class:    meta.sh_class    || null,
        sh_group:    meta.sh_group    || null,
        sh_batch:    meta.sh_batch    || null,
        sh_optional: meta.sh_optional || null,
        displayName: data.name        || 'শিক্ষার্থী',
        avatar:      data.avatar_urls?.['96'] || null,
        email:       data.email       || '',
      };
      setProfile(prof);
      localStorage.setItem(CACHE_KEY, JSON.stringify(prof));
    } catch {
      // Token expired / invalid — clear
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── On mount: restore session ─────────────────────────── */
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached && token) {
      try { setProfile(JSON.parse(cached)); } catch { /* ignore */ }
    }
    fetchUser(token);
  }, [token, fetchUser]);

  /* ── Login ─────────────────────────────────────────────── */
  const login = async (username, password) => {
    const res = await fetch(`${WP_BASE}/jwt-auth/v1/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'লগইন ব্যর্থ হয়েছে');
    localStorage.setItem('sh_jwt', data.token);
    setToken(data.token);
    await fetchUser(data.token);
    return data;
  };

  /* ── Logout ────────────────────────────────────────────── */
  const logout = () => {
    localStorage.removeItem('sh_jwt');
    localStorage.removeItem(CACHE_KEY);
    setToken(null);
    setUser(null);
    setProfile(null);
  };

  /* ── Update profile meta ───────────────────────────────── */
  const updateProfile = async (metaPayload) => {
    if (!token) throw new Error('Not authenticated');
    const res = await fetch(`${WP_BASE}/wp/v2/users/me`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ meta: metaPayload }),
    });
    if (!res.ok) throw new Error('প্রোফাইল আপডেট ব্যর্থ হয়েছে');
    const updated = await res.json();
    const meta = updated.meta || {};
    const newProf = {
      ...profile,
      sh_class:    meta.sh_class    || profile?.sh_class,
      sh_group:    meta.sh_group    || profile?.sh_group,
      sh_batch:    meta.sh_batch    || profile?.sh_batch,
      sh_optional: meta.sh_optional || profile?.sh_optional,
    };
    setProfile(newProf);
    // ── Cache bust on save ──
    localStorage.removeItem(CACHE_KEY);
    localStorage.setItem(CACHE_KEY, JSON.stringify(newProf));
    return newProf;
  };

  const isAuthenticated = !!token && !!user;
  const needsOnboarding = isAuthenticated && !profile?.sh_class;

  return (
    <AuthContext.Provider value={{
      user, profile, token, loading,
      isAuthenticated, needsOnboarding,
      login, logout, updateProfile, refetchUser: () => fetchUser(token),
    }}>
      {children}
    </AuthContext.Provider>
  );
};
