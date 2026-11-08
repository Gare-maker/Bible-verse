'use client';

import React, { useState } from 'react';
import {
  Bookmark,
  BookOpen,
  CheckCircle2,
  Cloud,
  Compass,
  Database,
  Download,
  Moon,
  NotebookPen,
  RefreshCw,
  Sun,
  Upload,
  User,
  Users,
  X,
} from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import {
  configureRuntimeSupabase,
  getSupabaseConfigStatus,
} from '@/lib/supabase';

const SIDEBAR_PASSAGES = [
  { label: 'Matthew 1:23', subtitle: 'Virgin Birth • Isa 7:14', book: 'Matthew', chapter: 1, verse: 23 },
  { label: 'Deuteronomy 32:6', subtitle: 'Song of Moses • Father', book: 'Deuteronomy', chapter: 32, verse: 6 },
  { label: 'Matthew 18:15', subtitle: 'Restoring a Brother', book: 'Matthew', chapter: 18, verse: 15 },
  { label: 'Isaiah 7:14', subtitle: 'Sign of Immanuel', book: 'Isaiah', chapter: 7, verse: 14 },
  { label: 'John 1:1', subtitle: 'The Eternal Word', book: 'John', chapter: 1, verse: 1 },
  { label: 'Genesis 1:1', subtitle: 'Creation Prologue', book: 'Genesis', chapter: 1, verse: 1 },
];

export default function NavigationShell({ children }: { children: React.ReactNode }) {
  const {
    activePage,
    setActivePage,
    currentBook,
    currentChapter,
    navigateToPassage,
    navigateToReferenceString,
    openReferenceInspector,
    preferences,
    updatePreferences,
    savedConnections,
    savedContexts,
    savedVerses,
    communityConnections,
    communityContexts,
    communityVerses,
    personalNotes,
    exportNotebookJson,
    importNotebookJson,
    syncWithSupabase,
    toastMessage,
  } = usePlatform();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [importDraft, setImportDraft] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);

  const sbStatus = getSupabaseConfigStatus();
  const [sbUrlInput, setSbUrlInput] = useState(sbStatus.url);
  const [sbKeyInput, setSbKeyInput] = useState('');
  const [sbSyncMessage, setSbSyncMessage] = useState<string | null>(null);
  const [isSyncingSb, setIsSyncingSb] = useState(false);

  const isLight = preferences.theme === 'light';
  const totalSavedCount =
    (savedConnections?.length || 0) +
    (savedContexts?.length || 0) +
    (savedVerses?.length || 0) +
    (personalNotes?.length || 0);

  const totalCommunityCount =
    (communityConnections?.length || 0) +
    (communityContexts?.length || 0) +
    (communityVerses?.length || 0);

  const handleExportDownload = () => {
    const json = exportNotebookJson();
    if (typeof window !== 'undefined') {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bible-verse-sync-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleConnectSupabase = async () => {
    setIsSyncingSb(true);
    if (sbUrlInput.trim() && sbKeyInput.trim()) {
      configureRuntimeSupabase(sbUrlInput.trim(), sbKeyInput.trim());
    }
    const res = await syncWithSupabase();
    setSbSyncMessage(res.message);
    setIsSyncingSb(false);
  };

  return (
    <div
      className={`min-h-screen flex flex-col lg:flex-row transition-colors ${
        isLight
          ? 'bg-[#FBF9F5] text-stone-900'
          : 'dark bg-[#0F0F0F] text-zinc-100'
      }`}
    >
      {/* =====================================================================
          DESKTOP LEFT SIDEBAR (lg and up) — Real Native App Layout
          ===================================================================== */}
      <aside
        className={`hidden lg:flex lg:w-64 xl:w-68 shrink-0 flex-col justify-between select-none sticky top-0 h-screen ${
          isLight
            ? 'bg-[#F4F1EA] text-stone-800'
            : 'bg-[#141414] text-zinc-200'
        }`}
      >
        <div className="p-4 space-y-6 overflow-y-auto no-scrollbar">
          {/* App Brand & Top Theme Switch */}
          <div className="flex items-center justify-between gap-2 px-2 py-1">
            <button
              onClick={() => setActivePage('bible')}
              className="flex items-center gap-3 text-left min-w-0 flex-1 group"
            >
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center shadow-sm transition shrink-0 ${
                  isLight
                    ? 'bg-amber-700 text-white'
                    : 'bg-amber-500 text-zinc-950'
                }`}
              >
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <span
                  className={`font-serif text-base font-bold tracking-tight block leading-none truncate ${
                    isLight ? 'text-stone-900' : 'text-white'
                  }`}
                >
                  Bible Verse
                </span>
                <span
                  className={`text-[11px] font-medium block mt-1 truncate ${
                    isLight ? 'text-stone-500' : 'text-zinc-400'
                  }`}
                >
                  Scripture & Context Research
                </span>
              </div>
            </button>

            <button
              onClick={() =>
                updatePreferences({
                  theme: preferences.theme === 'light' ? 'dark' : 'light',
                })
              }
              className={`rounded-lg p-2 border transition shrink-0 ${
                isLight
                  ? 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                  : 'bg-zinc-800 border-zinc-700 text-amber-400 hover:bg-zinc-700'
              }`}
              title={`Switch to ${preferences.theme === 'light' ? 'Dark' : 'Light'} Mode`}
              aria-label="Toggle Theme"
            >
              {preferences.theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Primary Navigation — 3 Main Destinations: Bible, Saved, Community */}
          <div className="space-y-1">
            <div
              className={`px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider ${
                isLight ? 'text-stone-400' : 'text-zinc-500'
              }`}
            >
              Workspace
            </div>
            <nav aria-label="Desktop Primary Navigation" className="space-y-1">
              <button
                onClick={() => setActivePage('bible')}
                className={`w-full rounded-xl px-3 py-2.5 text-sm font-semibold flex items-center justify-between transition ${
                  activePage === 'bible'
                    ? isLight
                      ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80'
                      : 'bg-zinc-800 text-white shadow-sm'
                    : isLight
                    ? 'text-stone-600 hover:bg-stone-200/60 hover:text-stone-900'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <BookOpen
                    className={`h-4 w-4 ${
                      activePage === 'bible'
                        ? isLight
                          ? 'text-amber-700'
                          : 'text-amber-400'
                        : ' opacity-70'
                    }`}
                  />
                  <span>Bible Reader</span>
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    isLight ? 'text-stone-400' : 'text-zinc-500'
                  }`}
                >
                  {currentBook.slice(0, 4)} {currentChapter === 0 ? 'Intro' : currentChapter}
                </span>
              </button>

              <button
                onClick={() => setActivePage('saved')}
                className={`w-full rounded-xl px-3 py-2.5 text-sm font-semibold flex items-center justify-between transition ${
                  activePage === 'saved' || activePage === 'notes'
                    ? isLight
                      ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80'
                      : 'bg-zinc-800 text-white shadow-sm'
                    : isLight
                    ? 'text-stone-600 hover:bg-stone-200/60 hover:text-stone-900'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Bookmark
                    className={`h-4 w-4 ${
                      activePage === 'saved' || activePage === 'notes'
                        ? isLight
                          ? 'text-amber-700'
                          : 'text-amber-400'
                        : 'opacity-70'
                    }`}
                  />
                  <span>Saved</span>
                </span>
              </button>

              <button
                onClick={() => setActivePage('community')}
                className={`w-full rounded-xl px-3 py-2.5 text-sm font-semibold flex items-center justify-between transition ${
                  activePage === 'community'
                    ? isLight
                      ? 'bg-white text-stone-900 shadow-sm border border-stone-200/80'
                      : 'bg-zinc-800 text-white shadow-sm'
                    : isLight
                    ? 'text-stone-600 hover:bg-stone-200/60 hover:text-stone-900'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Users
                    className={`h-4 w-4 ${
                      activePage === 'community'
                        ? isLight
                          ? 'text-amber-700'
                          : 'text-amber-400'
                        : 'opacity-70'
                    }`}
                  />
                  <span>Community</span>
                </span>
              </button>
            </nav>
          </div>

          {/* Key Connected Passages (Clean Sidebar List instead of Cluttered Top Pills) */}
          <div className="space-y-1.5">
            <div
              className={`px-2.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                isLight ? 'text-stone-400' : 'text-zinc-500'
              }`}
            >
              <Compass className="h-3 w-3" />
              <span>Key Study Passages</span>
            </div>
            <div className="space-y-0.5">
              {SIDEBAR_PASSAGES.map((item) => {
                const isActive =
                  activePage === 'bible' &&
                  currentBook === item.book &&
                  currentChapter === item.chapter;
                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      navigateToPassage(item.book, item.chapter, item.verse);
                      openReferenceInspector(item.label, 'reference');
                    }}
                    className={`w-full rounded-lg px-2.5 py-1.5 text-left transition flex items-center justify-between ${
                      isActive
                        ? isLight
                          ? 'bg-amber-700/10 text-amber-900 font-semibold'
                          : 'bg-amber-500/15 text-amber-300 font-semibold'
                        : isLight
                        ? 'text-stone-600 hover:bg-stone-200/50 hover:text-stone-900'
                        : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                    }`}
                  >
                    <span className="text-xs truncate">{item.label}</span>
                    <span
                      className={`text-[10px] truncate ml-2 ${
                        isLight ? 'text-stone-400' : 'text-zinc-500'
                      }`}
                    >
                      {item.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Connected Notebook Bridge: Recent Saved References */}
          <div className="space-y-1.5">
            <div className="px-2.5 flex items-center justify-between">
              <span
                className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                  isLight ? 'text-stone-400' : 'text-zinc-500'
                }`}
              >
                <Bookmark className="h-3 w-3" />
                <span>Saved Connections</span>
              </span>
              <button
                onClick={() => setActivePage('saved')}
                className={`text-[11px] font-semibold hover:underline ${
                  isLight ? 'text-amber-700' : 'text-amber-400'
                }`}
              >
                View all
              </button>
            </div>
            <div className="space-y-1">
              {savedConnections.slice(0, 3).map((conn) => (
                <button
                  key={conn.id}
                  onClick={() => {
                    navigateToReferenceString(conn.primaryRef);
                    openReferenceInspector(conn.primaryRef, 'reference');
                  }}
                  className={`w-full rounded-lg px-2.5 py-2 text-left transition border ${
                    isLight
                      ? 'bg-white/70 hover:bg-white border-stone-200/70 text-stone-700'
                      : 'bg-zinc-900/60 hover:bg-zinc-800 border-zinc-800/80 text-zinc-300'
                  }`}
                >
                  <div className="text-[11px] font-bold flex items-center justify-between">
                    <span className={isLight ? 'text-amber-800' : 'text-amber-400'}>
                      {conn.primaryRef} ↔ {conn.connectedRef}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] truncate mt-0.5 ${
                      isLight ? 'text-stone-500' : 'text-zinc-400'
                    }`}
                  >
                    {conn.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Sidebar Account Bar */}
        <div
          className={`p-3 flex items-center justify-between gap-2 ${
            isLight ? 'bg-[#EFECE4]/60' : 'bg-[#111111]'
          }`}
        >
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2.5 text-left min-w-0 flex-1 rounded-lg p-1.5 hover:bg-black/5 transition"
          >
            <div
              className={`h-7 w-7 rounded-full font-bold flex items-center justify-center text-xs shrink-0 ${
                isLight ? 'bg-amber-700 text-white' : 'bg-amber-500 text-zinc-950'
              }`}
            >
              {preferences.userName.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate">{preferences.userName}</p>
              <p
                className={`text-[10px] truncate flex items-center gap-1 ${
                  isLight ? 'text-stone-500' : 'text-zinc-400'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block" />
                {sbStatus.isConnected ? 'Supabase Synced' : 'Local Workspace'}
              </p>
            </div>
          </button>
        </div>
      </aside>

      {/* =====================================================================
          MOBILE & TABLET TOP HEADER (< lg)
          ===================================================================== */}
      <header
        className={`lg:hidden sticky top-0 z-30 h-12 px-4 flex items-center justify-between shadow-xs ${
          isLight
            ? 'bg-[#FBF9F5] text-stone-900'
            : 'bg-[#0F0F0F] text-zinc-100'
        }`}
      >
        <button
          onClick={() => setActivePage('bible')}
          className="flex items-center gap-2 text-left py-2"
        >
          <div
            className={`h-7 w-7 rounded-lg flex items-center justify-center ${
              isLight ? 'bg-amber-700 text-white' : 'bg-amber-500 text-zinc-950'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
          </div>
          <span className="font-serif text-sm font-bold tracking-tight">
            Bible Verse
          </span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() =>
              updatePreferences({
                theme: preferences.theme === 'light' ? 'dark' : 'light',
              })
            }
            className={`rounded-full p-2 ${
              isLight ? 'text-stone-700 hover:bg-stone-200/60' : 'text-zinc-300 hover:bg-zinc-800'
            }`}
            aria-label="Toggle Theme"
          >
            {preferences.theme === 'light' ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4 text-amber-400" />
            )}
          </button>

          <button
            onClick={() => setIsProfileOpen(true)}
            className={`rounded-full p-1.5 border ${
              isLight
                ? 'bg-stone-100 border-stone-200 text-stone-800'
                : 'bg-zinc-800 border-zinc-700 text-zinc-200'
            }`}
            aria-label="Profile and Sync Settings"
          >
            <User className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* =====================================================================
          MAIN WORKSPACE AREA
          ===================================================================== */}
      <div className="flex-1 min-w-0 flex flex-col">{children}</div>

      {/* =====================================================================
          MOBILE BOTTOM NAVBAR (< lg) — Strictly Pinned to Bottom with 3 Items
          (No Numerical Indicators & Single-Line Labels)
          ===================================================================== */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className={`lg:hidden fixed bottom-0 inset-x-0 z-40 h-16 grid grid-cols-3 px-3 backdrop-blur-lg shadow-[0_-4px_24px_rgba(0,0,0,0.06)] ${
          isLight
            ? 'bg-white/95 text-stone-900'
            : 'bg-[#141414]/95 text-zinc-100'
        }`}
      >
        <button
          onClick={() => setActivePage('bible')}
          className="flex flex-col items-center justify-center gap-1 group"
        >
          <div
            className={`rounded-full px-4 py-1 flex items-center justify-center transition ${
              activePage === 'bible'
                ? isLight
                  ? 'bg-amber-700/15 text-amber-800'
                  : 'bg-amber-500/20 text-amber-400'
                : isLight
                ? 'text-stone-500 group-hover:text-stone-800'
                : 'text-zinc-400 group-hover:text-zinc-200'
            }`}
          >
            <BookOpen className="h-4 w-4" />
          </div>
          <span
            className={`text-[11px] font-bold tracking-tight whitespace-nowrap ${
              activePage === 'bible'
                ? isLight
                  ? 'text-amber-800'
                  : 'text-amber-400'
                : isLight
                ? 'text-stone-500'
                : 'text-zinc-400'
            }`}
          >
            Bible
          </span>
        </button>

        <button
          onClick={() => setActivePage('saved')}
          className="flex flex-col items-center justify-center gap-1 group"
        >
          <div
            className={`rounded-full px-4 py-1 flex items-center justify-center transition ${
              activePage === 'saved' || activePage === 'notes'
                ? isLight
                  ? 'bg-amber-700/15 text-amber-800'
                  : 'bg-amber-500/20 text-amber-400'
                : isLight
                ? 'text-stone-500 group-hover:text-stone-800'
                : 'text-zinc-400 group-hover:text-zinc-200'
            }`}
          >
            <Bookmark className="h-4 w-4" />
          </div>
          <span
            className={`text-[11px] font-bold tracking-tight whitespace-nowrap ${
              activePage === 'saved' || activePage === 'notes'
                ? isLight
                  ? 'text-amber-800'
                  : 'text-amber-400'
                : isLight
                ? 'text-stone-500'
                : 'text-zinc-400'
            }`}
          >
            Saved
          </span>
        </button>

        <button
          onClick={() => setActivePage('community')}
          className="flex flex-col items-center justify-center gap-1 group"
        >
          <div
            className={`rounded-full px-4 py-1 flex items-center justify-center transition ${
              activePage === 'community'
                ? isLight
                  ? 'bg-amber-700/15 text-amber-800'
                  : 'bg-amber-500/20 text-amber-400'
                : isLight
                ? 'text-stone-500 group-hover:text-stone-800'
                : 'text-zinc-400 group-hover:text-zinc-200'
            }`}
          >
            <Users className="h-4 w-4" />
          </div>
          <span
            className={`text-[11px] font-bold tracking-tight whitespace-nowrap ${
              activePage === 'community'
                ? isLight
                  ? 'text-amber-800'
                  : 'text-amber-400'
                : isLight
                ? 'text-stone-500'
                : 'text-zinc-400'
            }`}
          >
            Community
          </span>
        </button>
      </nav>

      {/* Global Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-20 lg:bottom-6 right-4 z-50 rounded-xl border px-4 py-2.5 text-xs font-semibold shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 ${
            isLight
              ? 'bg-stone-900 border-stone-800 text-white'
              : 'bg-zinc-900 border-amber-500/40 text-zinc-100'
          }`}
        >
          <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =====================================================================
          PROFILE, SUPABASE CONNECTION & CLOUD SYNC MODAL (Light/Dark Aware)
          ===================================================================== */}
      {isProfileOpen && (
        <div
          onClick={() => setIsProfileOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-md max-h-[88vh] overflow-y-auto rounded-2xl border p-5 sm:p-6 shadow-2xl space-y-5 my-auto ${
              isLight
                ? 'bg-white border-stone-200 text-stone-900'
                : 'bg-[#181818] border-zinc-800 text-zinc-100'
            }`}
          >
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2.5">
                <User className={`h-5 w-5 ${isLight ? 'text-amber-700' : 'text-amber-400'}`} />
                <h2 className="text-base font-bold">
                  Workspace Settings & Supabase Sync
                </h2>
              </div>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="rounded-lg p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Profile Name (Appearance removed per specification — only one top theme switch) */}
            <div className="text-xs">
              <label className="text-stone-500 dark:text-zinc-400 font-medium block mb-1">
                Scholar Name
              </label>
              <input
                type="text"
                value={preferences.userName}
                onChange={(e) => updatePreferences({ userName: e.target.value })}
                className={`w-full rounded-xl border px-3 py-2 ${
                  isLight
                    ? 'bg-stone-50 border-stone-300 text-stone-900'
                    : 'bg-zinc-900 border-zinc-700 text-white'
                }`}
              />
            </div>

            {/* Live Supabase Connection Box */}
            <div
              className={`rounded-xl border p-4 space-y-3 ${
                isLight
                  ? 'bg-stone-50 border-stone-200/90'
                  : 'bg-zinc-900/70 border-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <Database className={`h-4 w-4 ${isLight ? 'text-amber-700' : 'text-amber-400'}`} />
                  Supabase Cloud Database
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    sbStatus.isConnected
                      ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-800 border border-amber-500/30'
                  }`}
                >
                  {sbStatus.isConnected ? 'Connected' : 'Local Persistence Active'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <input
                  type="url"
                  value={sbUrlInput}
                  onChange={(e) => setSbUrlInput(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className={`w-full rounded-lg border px-3 py-1.5 text-xs ${
                    isLight
                      ? 'bg-white border-stone-300 text-stone-900'
                      : 'bg-zinc-950 border-zinc-700 text-white'
                  }`}
                />
                <input
                  type="password"
                  value={sbKeyInput}
                  onChange={(e) => setSbKeyInput(e.target.value)}
                  placeholder="Supabase Anon Public Key (eyJ...)"
                  className={`w-full rounded-lg border px-3 py-1.5 text-xs ${
                    isLight
                      ? 'bg-white border-stone-300 text-stone-900'
                      : 'bg-zinc-950 border-zinc-700 text-white'
                  }`}
                />
                <button
                  onClick={handleConnectSupabase}
                  disabled={isSyncingSb}
                  className={`w-full rounded-lg py-2 text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                    isLight
                      ? 'bg-amber-700 hover:bg-amber-800 text-white'
                      : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
                  }`}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSyncingSb ? 'animate-spin' : ''}`} />
                  <span>{isSyncingSb ? 'Testing Connection...' : 'Connect & Sync Supabase'}</span>
                </button>
                {sbSyncMessage && (
                  <p className="text-[11px] text-stone-500 leading-relaxed pt-1">
                    {sbSyncMessage}
                  </p>
                )}
              </div>
            </div>

            {/* Cross-Device Backup & Restore */}
            <div
              className={`rounded-xl border p-4 space-y-2.5 ${
                isLight
                  ? 'bg-stone-50 border-stone-200/90'
                  : 'bg-zinc-900/70 border-zinc-800'
              }`}
            >
              <span className="text-xs font-bold flex items-center gap-1.5">
                <Cloud className={`h-4 w-4 ${isLight ? 'text-amber-700' : 'text-amber-400'}`} />
                Cross-Device Research Backup
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleExportDownload}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 border ${
                    isLight
                      ? 'bg-white border-stone-300 text-stone-800 hover:bg-stone-100'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                  }`}
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={() => setShowImportBox((prev) => !prev)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 border ${
                    isLight
                      ? 'bg-white border-stone-300 text-stone-800 hover:bg-stone-100'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-200'
                  }`}
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Import JSON</span>
                </button>
              </div>
              {showImportBox && (
                <div className="space-y-2 pt-1">
                  <textarea
                    rows={2}
                    value={importDraft}
                    onChange={(e) => setImportDraft(e.target.value)}
                    placeholder="Paste exported JSON sync bundle..."
                    className={`w-full rounded-lg border p-2 text-xs font-mono ${
                      isLight
                        ? 'bg-white border-stone-300 text-stone-900'
                        : 'bg-zinc-950 border-zinc-700 text-white'
                    }`}
                  />
                  <button
                    onClick={() => {
                      if (importNotebookJson(importDraft)) {
                        setImportDraft('');
                        setShowImportBox(false);
                      }
                    }}
                    className="rounded-lg bg-emerald-600 text-white font-bold px-3 py-1.5 text-xs"
                  >
                    Restore State
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
