'use client';

import React, { useState } from 'react';
import {
  Bookmark,
  BookOpen,
  CheckCircle2,
  Compass,
  Moon,
  Sparkles,
  Sun,
  User,
  X,
} from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';

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
    toastMessage,
    showToast,
  } = usePlatform();

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isLight = preferences.theme === 'light';
  const isChildren = preferences.experienceMode === 'children';

  return (
    <div
      className={`min-h-screen flex flex-col lg:flex-row transition-colors ${
        isChildren
          ? isLight
            ? 'bg-[#FFFDF4] text-slate-900'
            : 'dark bg-[#111629] text-slate-100'
          : isLight
          ? 'bg-[#FBF9F5] text-stone-900'
          : 'dark bg-[#0F0F0F] text-zinc-100'
      }`}
    >
      {/* =====================================================================
          DESKTOP LEFT SIDEBAR (lg and up)
          ===================================================================== */}
      <aside
        className={`hidden lg:flex lg:w-64 xl:w-68 shrink-0 flex-col justify-between select-none sticky top-0 h-screen ${
          isChildren
            ? isLight
              ? 'bg-gradient-to-b from-amber-100/80 via-sky-50/70 to-emerald-50/60 border-r-2 border-amber-200 text-slate-800'
              : 'bg-gradient-to-b from-[#182039] to-[#13192E] border-r border-indigo-800/60 text-slate-100'
            : isLight
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
                  isChildren
                    ? isLight
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                      : 'bg-gradient-to-br from-amber-400 to-pink-500 text-slate-950'
                    : isLight
                    ? 'bg-amber-700 text-white'
                    : 'bg-amber-500 text-zinc-950'
                }`}
              >
                {isChildren ? (
                  <Sparkles className="h-4 w-4" />
                ) : (
                  <BookOpen className="h-4 w-4" />
                )}
              </div>
              <div className="min-w-0">
                <span
                  className={`text-base font-bold tracking-tight block leading-none truncate ${
                    isChildren ? 'font-sans' : 'font-serif'
                  } ${isLight ? 'text-stone-900' : 'text-white'}`}
                >
                  {isChildren ? 'Bible Kids' : 'Bible Verse'}
                </span>
                <span
                  className={`text-[11px] font-medium block mt-1 truncate ${
                    isChildren
                      ? isLight
                        ? 'text-orange-700'
                        : 'text-amber-300'
                      : isLight
                      ? 'text-stone-500'
                      : 'text-zinc-400'
                  }`}
                >
                  {isChildren ? 'Fun Stories & Pictures!' : 'Scripture & Context Research'}
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
                isChildren
                  ? isLight
                    ? 'bg-white border-amber-300 text-amber-600 hover:bg-amber-50'
                    : 'bg-indigo-900/80 border-indigo-700 text-amber-300 hover:bg-indigo-800'
                  : isLight
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

          {/* Primary Navigation — 3 Main Destinations: Bible, Saved (no icon in front), Community (no icon in front) */}
          <div className="space-y-1">
            <div
              className={`px-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider ${
                isLight ? 'text-stone-400' : 'text-zinc-500'
              }`}
            >
              {isChildren ? 'Explore' : 'Workspace'}
            </div>
            <nav aria-label="Desktop Primary Navigation" className="space-y-1">
              <button
                onClick={() => setActivePage('bible')}
                className={`w-full rounded-xl px-3 py-2.5 text-sm font-semibold flex items-center justify-between transition ${
                  activePage === 'bible'
                    ? isChildren
                      ? isLight
                        ? 'bg-amber-400 text-slate-950 shadow-sm font-extrabold'
                        : 'bg-indigo-600 text-white shadow-sm font-extrabold'
                      : isLight
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
                        ? isChildren
                          ? isLight
                            ? 'text-slate-950'
                            : 'text-amber-300'
                          : isLight
                          ? 'text-amber-700'
                          : 'text-amber-400'
                        : 'opacity-70'
                    }`}
                  />
                  <span>{isChildren ? 'Bible Stories' : 'Bible Reader'}</span>
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    activePage === 'bible' && isChildren
                      ? isLight
                        ? 'text-slate-800'
                        : 'text-indigo-200'
                      : isLight
                      ? 'text-stone-400'
                      : 'text-zinc-500'
                  }`}
                >
                  {currentBook.slice(0, 4)} {currentChapter === 0 ? 'Intro' : currentChapter}
                </span>
              </button>

              {/* Saved (with Bookmark icon) */}
              <button
                onClick={() => setActivePage('saved')}
                className={`w-full rounded-xl px-3 py-2.5 text-sm font-semibold flex items-center justify-between transition ${
                  activePage === 'saved' || activePage === 'notes'
                    ? isChildren
                      ? isLight
                        ? 'bg-amber-400 text-slate-950 shadow-sm font-extrabold'
                        : 'bg-indigo-600 text-white shadow-sm font-extrabold'
                      : isLight
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
                        ? isChildren
                          ? isLight
                            ? 'text-slate-950'
                            : 'text-amber-300'
                          : isLight
                          ? 'text-amber-700'
                          : 'text-amber-400'
                        : 'opacity-70'
                    }`}
                  />
                  <span>Saved</span>
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    (activePage === 'saved' || activePage === 'notes') && isChildren
                      ? isLight
                        ? 'text-slate-800'
                        : 'text-indigo-200'
                      : isLight
                      ? 'text-stone-400'
                      : 'text-zinc-500'
                  }`}
                >
                  {savedConnections.length}
                </span>
              </button>
            </nav>
          </div>

          {/* Key Study Passages */}
          <div className="space-y-1.5">
            <div
              className={`px-2.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                isLight ? 'text-stone-400' : 'text-zinc-500'
              }`}
            >
              <Compass className="h-3 w-3" />
              <span>{isChildren ? 'Favorite Bible Stories' : 'Key Study Passages'}</span>
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
                      navigateToPassage(item.book, item.chapter, item.verse, false);
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

          {/* Recent Saved References */}
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
                    navigateToReferenceString(conn.primaryRef, false);
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
            isChildren
              ? isLight
                ? 'bg-amber-100/70'
                : 'bg-[#12172B]'
              : isLight
              ? 'bg-[#EFECE4]/60'
              : 'bg-[#111111]'
          }`}
        >
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2.5 text-left min-w-0 flex-1 rounded-lg p-1.5 hover:bg-black/5 transition"
          >
            <div
              className={`h-7 w-7 rounded-full font-bold flex items-center justify-center text-xs shrink-0 ${
                isChildren
                  ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                  : isLight
                  ? 'bg-amber-700 text-white'
                  : 'bg-amber-500 text-zinc-950'
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
                <span
                  className={`h-1.5 w-1.5 rounded-full inline-block ${
                    isChildren ? 'bg-amber-400' : 'bg-emerald-500'
                  }`}
                />
                {isChildren ? "Children's Mode" : 'Adult Mode'}
              </p>
            </div>
          </button>
        </div>
      </aside>

      {/* =====================================================================
          MOBILE & TABLET TOP HEADER (< lg) — Header 1: Logo, Bible info, Profile
          ===================================================================== */}
      <header
        className={`lg:hidden sticky top-0 z-30 h-12 px-4 flex items-center justify-between shadow-xs ${
          isChildren
            ? isLight
              ? 'bg-[#FFF9E6] border-b border-amber-200 text-slate-900'
              : 'bg-[#161D35] border-b border-indigo-800/60 text-slate-100'
            : isLight
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
              isChildren
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white'
                : isLight
                ? 'bg-amber-700 text-white'
                : 'bg-amber-500 text-zinc-950'
            }`}
          >
            {isChildren ? (
              <Sparkles className="h-3.5 w-3.5" />
            ) : (
              <BookOpen className="h-3.5 w-3.5" />
            )}
          </div>
          <span
            className={`text-sm font-bold tracking-tight ${
              isChildren ? 'font-sans' : 'font-serif'
            }`}
          >
            {isChildren ? 'Bible Kids' : 'Bible Verse'}
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
              isChildren
                ? isLight
                  ? 'bg-amber-100 border-amber-300 text-amber-900'
                  : 'bg-indigo-900 border-indigo-700 text-amber-300'
                : isLight
                ? 'bg-stone-100 border-stone-200 text-stone-800'
                : 'bg-zinc-800 border-zinc-700 text-zinc-200'
            }`}
            aria-label="Profile Settings"
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
          MOBILE BOTTOM NAVBAR (< lg) — 2 Sections: Bible & Saved
          ===================================================================== */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className={`lg:hidden fixed bottom-0 inset-x-0 z-40 h-16 grid grid-cols-2 px-6 backdrop-blur-lg shadow-[0_-4px_24px_rgba(0,0,0,0.06)] ${
          isChildren
            ? isLight
              ? 'bg-[#FFF9E6]/95 border-t border-amber-200 text-slate-900'
              : 'bg-[#161D35]/95 border-t border-indigo-800/60 text-slate-100'
            : isLight
            ? 'bg-white/95 text-stone-900 border-t border-stone-200/80'
            : 'bg-[#141414]/95 text-zinc-100 border-t border-zinc-800/80'
        }`}
      >
        <button
          onClick={() => setActivePage('bible')}
          className="flex flex-col items-center justify-center gap-1 group"
        >
          <div
            className={`rounded-full px-5 py-1 flex items-center justify-center transition ${
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
            className={`rounded-full px-5 py-1 flex items-center justify-center transition ${
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
          PROFILE MODAL (Requirement 7: Supabase Cloud Data & Cross-device sync removed;
          Adult Mode vs Children's Mode switcher added)
          ===================================================================== */}
      {isProfileOpen && (
        <div
          onClick={() => setIsProfileOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-md rounded-2xl border p-5 sm:p-6 shadow-2xl space-y-5 my-auto ${
              isChildren
                ? isLight
                  ? 'bg-[#FFFDF5] border-2 border-amber-300 text-slate-900'
                  : 'bg-[#182039] border-2 border-indigo-700 text-slate-100'
                : isLight
                ? 'bg-white border-stone-200 text-stone-900'
                : 'bg-[#181818] border-zinc-800 text-zinc-100'
            }`}
          >
            <div className="flex items-center justify-between pb-2">
              <div className="flex items-center gap-2.5">
                <User className={`h-5 w-5 ${isLight ? 'text-amber-700' : 'text-amber-400'}`} />
                <h2 className="text-base font-bold">Profile Settings</h2>
              </div>
              <button
                onClick={() => setIsProfileOpen(false)}
                className="rounded-lg p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Profile Name */}
            <div className="text-xs">
              <label className="text-stone-500 dark:text-zinc-400 font-medium block mb-1">
                Reader Name
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

            {/* Experience Mode Switcher: Adult Mode vs Children's Mode */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold block text-stone-600 dark:text-zinc-300">
                Reading Experience Mode
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    updatePreferences({ experienceMode: 'adult' });
                    showToast('Switched to Adult Mode');
                  }}
                  className={`rounded-2xl border p-3.5 text-left transition space-y-1 ${
                    !isChildren
                      ? isLight
                        ? 'bg-amber-50 border-2 border-amber-700 text-stone-900 shadow-xs'
                        : 'bg-amber-500/15 border-2 border-amber-400 text-white shadow-xs'
                      : isLight
                      ? 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                      : 'bg-zinc-900/70 hover:bg-zinc-800 border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <BookOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                    {!isChildren && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-bold pt-1">Adult Mode</p>
                  <p className="text-[11px] text-stone-500 dark:text-zinc-400 leading-snug">
                    Classical study interface & detailed engraved illustrations.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    updatePreferences({ experienceMode: 'children' });
                    showToast("Switched to Children's Mode");
                  }}
                  className={`rounded-2xl border p-3.5 text-left transition space-y-1 ${
                    isChildren
                      ? isLight
                        ? 'bg-gradient-to-br from-amber-100 via-sky-50 to-emerald-50 border-2 border-amber-500 text-slate-900 shadow-sm'
                        : 'bg-gradient-to-br from-indigo-900/90 to-purple-900/70 border-2 border-amber-400 text-white shadow-sm'
                      : isLight
                      ? 'bg-white hover:bg-amber-50/40 border-stone-200 text-stone-700'
                      : 'bg-zinc-900/70 hover:bg-zinc-800 border-zinc-700 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    {isChildren && (
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-300">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-bold pt-1">Children&apos;s Mode</p>
                  <p className="text-[11px] text-stone-500 dark:text-zinc-400 leading-snug">
                    Playful, colourful story view with cartoon illustrations.
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
