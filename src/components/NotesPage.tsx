'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeftRight,
  BookOpen,
  Calendar,
  Check,
  Edit3,
  Folder,
  FolderPlus,
  Link2,
  MessageSquarePlus,
  Plus,
  Search,
  Send,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import {
  AIExplanationData,
  FollowUpMessage,
  ReferenceCategory,
  SavedConnection,
  TranslationId,
} from '@/types/bible';
import { BIBLE_BOOKS, BIBLE_TRANSLATIONS } from '@/data/bibleBooks';
import { findConnectionBetween, REFERENCE_CATEGORIES } from '@/data/crossReferences';
import { resolveScriptureVerse } from '@/services/bibleService';
import { usePlatform } from '@/context/PlatformContext';

type NotesSectionTab = 'all' | 'references' | 'collections';

export default function NotesPage() {
  const {
    translation,
    preferences,
    savedConnections,
    saveConnectionToNotes,
    updateSavedConnection,
    deleteSavedConnection,
    appendFollowUpToConnection,
    personalNotes,
    createPersonalNote,
    updatePersonalNote,
    deletePersonalNote,
    collections,
    createCollection,
    renameCollection,
    deleteCollection,
    navigateToReferenceString,
    openReferenceInspector,
  } = usePlatform();

  const isLight = preferences.theme === 'light';

  const [activeTab, setActiveTab] = useState<NotesSectionTab>('references');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState<string>('ALL');

  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [expandedAiId, setExpandedAiId] = useState<string | null>(null);
  const [editingObservationId, setEditingObservationId] = useState<string | null>(null);
  const [observationDraft, setObservationDraft] = useState<string>('');
  const [editingConnectionId, setEditingConnectionId] = useState<string | null>(null);
  const [editTitleDraft, setEditTitleDraft] = useState<string>('');
  const [editCategoryDraft, setEditCategoryDraft] =
    useState<ReferenceCategory>('Prophecy fulfilment');
  const [editCollectionDraft, setEditCollectionDraft] = useState<string>('');

  const [followUpQuestionMap, setFollowUpQuestionMap] = useState<Record<string, string>>({});
  const [loadingAiForConnectionId, setLoadingAiForConnectionId] = useState<string | null>(null);

  // "+ New Reference" Modal State
  const [isNewReferenceModalOpen, setIsNewReferenceModalOpen] = useState(false);
  const [ref1Input, setRef1Input] = useState('John 1:1');
  const [book1, setBook1] = useState('John');
  const [chapter1, setChapter1] = useState(1);
  const [verse1, setVerse1] = useState(1);
  const [resolvedText1, setResolvedText1] = useState('');

  const [ref2Input, setRef2Input] = useState('Genesis 1:1');
  const [book2, setBook2] = useState('Genesis');
  const [chapter2, setChapter2] = useState(1);
  const [verse2, setVerse2] = useState(1);
  const [resolvedText2, setResolvedText2] = useState('');

  const [newRefTitle, setNewRefTitle] = useState(
    'In the Beginning: The Eternal Logos & Creation'
  );
  const [newRefCategory, setNewRefCategory] = useState<ReferenceCategory>('Allusion');
  const [newRefTranslation, setNewRefTranslation] = useState<TranslationId>(translation);
  const [newRefObservation, setNewRefObservation] = useState('');
  const [newRefCollectionId, setNewRefCollectionId] = useState('col-jesus-ot');
  const [newRefAiExplanation, setNewRefAiExplanation] = useState<
    AIExplanationData | undefined
  >(undefined);
  const [isGeneratingModalAi, setIsGeneratingModalAi] = useState(false);

  // "+ Personal Note" Modal State
  const [isNewNoteModalOpen, setIsNewNoteModalOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteRefsInput, setNoteRefsInput] = useState('');
  const [noteCollectionId, setNoteCollectionId] = useState('col-messianic');

  // Collection Management State
  const [isNewCollectionOpen, setIsNewCollectionOpen] = useState(false);
  const [newColName, setNewColName] = useState('');
  const [newColDesc, setNewColDesc] = useState('');
  const [renamingColId, setRenamingColId] = useState<string | null>(null);
  const [renameColDraft, setRenameColDraft] = useState('');

  useEffect(() => {
    if (!isNewReferenceModalOpen) return;
    let active = true;
    resolveScriptureVerse(ref1Input, newRefTranslation).then((res) => {
      if (active && res) setResolvedText1(res.text);
    });
    return () => {
      active = false;
    };
  }, [isNewReferenceModalOpen, ref1Input, newRefTranslation]);

  useEffect(() => {
    if (!isNewReferenceModalOpen) return;
    let active = true;
    resolveScriptureVerse(ref2Input, newRefTranslation).then((res) => {
      if (active && res) setResolvedText2(res.text);
    });
    return () => {
      active = false;
    };
  }, [isNewReferenceModalOpen, ref2Input, newRefTranslation]);

  useEffect(() => {
    const detected = findConnectionBetween(ref1Input, ref2Input);
    if (detected) {
      setNewRefCategory(detected.category);
      setNewRefTitle(detected.title);
    } else {
      setNewRefTitle(`${ref1Input} & ${ref2Input}`);
    }
  }, [ref1Input, ref2Input]);

  const filteredConnections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return savedConnections.filter((conn) => {
      if (
        selectedCollectionFilter !== 'ALL' &&
        conn.collectionId !== selectedCollectionFilter
      ) {
        return false;
      }
      if (!q) return true;
      const colName =
        collections.find((c) => c.id === conn.collectionId)?.name.toLowerCase() || '';
      return (
        conn.primaryRef.toLowerCase().includes(q) ||
        conn.connectedRef.toLowerCase().includes(q) ||
        conn.title.toLowerCase().includes(q) ||
        conn.primaryText.toLowerCase().includes(q) ||
        conn.connectedText.toLowerCase().includes(q) ||
        conn.personalObservation.toLowerCase().includes(q) ||
        conn.category.toLowerCase().includes(q) ||
        (conn.aiExplanation?.summary.toLowerCase().includes(q) ?? false) ||
        colName.includes(q)
      );
    });
  }, [savedConnections, searchQuery, selectedCollectionFilter, collections]);

  const filteredPersonalNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return personalNotes.filter((note) => {
      if (
        selectedCollectionFilter !== 'ALL' &&
        note.collectionId !== selectedCollectionFilter
      ) {
        return false;
      }
      if (!q) return true;
      const colName =
        collections.find((c) => c.id === note.collectionId)?.name.toLowerCase() || '';
      return (
        note.title.toLowerCase().includes(q) ||
        note.content.toLowerCase().includes(q) ||
        note.scriptureRefs.some((r) => r.toLowerCase().includes(q)) ||
        colName.includes(q)
      );
    });
  }, [personalNotes, searchQuery, selectedCollectionFilter, collections]);

  const handleGenerateAiInModal = async () => {
    setIsGeneratingModalAi(true);
    try {
      const res = await fetch('/api/ai-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'connection',
          primaryRef: ref1Input,
          connectedRef: ref2Input,
          translation: newRefTranslation,
        }),
      });
      const data = await res.json();
      if (data.explanation) {
        setNewRefAiExplanation(data.explanation);
      }
    } catch (e) {
      console.error('Error generating AI explanation in Notes modal:', e);
    } finally {
      setIsGeneratingModalAi(false);
    }
  };

  const handleSaveNewReferenceFromNotes = (e: React.FormEvent) => {
    e.preventDefault();
    saveConnectionToNotes({
      title: newRefTitle.trim() || `${ref1Input} & ${ref2Input}`,
      primaryRef: ref1Input.trim(),
      connectedRef: ref2Input.trim(),
      primaryText: resolvedText1,
      connectedText: resolvedText2,
      translation: newRefTranslation,
      category: newRefCategory,
      aiExplanation: newRefAiExplanation,
      personalObservation: newRefObservation.trim(),
      collectionId: newRefCollectionId,
    });
    setIsNewReferenceModalOpen(false);
    setNewRefObservation('');
    setNewRefAiExplanation(undefined);
  };

  const handleGenerateAiForSavedCard = async (conn: SavedConnection) => {
    if (conn.aiExplanation) {
      setExpandedAiId(expandedAiId === conn.id ? null : conn.id);
      return;
    }
    setLoadingAiForConnectionId(conn.id);
    try {
      const res = await fetch('/api/ai-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'connection',
          primaryRef: conn.primaryRef,
          connectedRef: conn.connectedRef,
          translation: conn.translation,
        }),
      });
      const data = await res.json();
      if (data.explanation) {
        updateSavedConnection(conn.id, { aiExplanation: data.explanation });
        setExpandedAiId(conn.id);
      }
    } finally {
      setLoadingAiForConnectionId(null);
    }
  };

  const handleFollowUpOnSavedCard = async (conn: SavedConnection) => {
    const qText = (followUpQuestionMap[conn.id] || '').trim();
    if (!qText) return;
    setFollowUpQuestionMap((prev) => ({ ...prev, [conn.id]: '' }));

    const userMsg: FollowUpMessage = {
      id: `fmsg-${Date.now()}`,
      role: 'user',
      content: qText,
      timestamp: new Date().toISOString(),
    };

    setLoadingAiForConnectionId(conn.id);
    try {
      const res = await fetch('/api/ai-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'followup',
          primaryRef: conn.primaryRef,
          connectedRef: conn.connectedRef,
          translation: conn.translation,
          question: qText,
        }),
      });
      const data = await res.json();
      if (data.result) {
        const assistantMsg: FollowUpMessage = {
          id: `fmsg-${Date.now() + 1}`,
          role: 'assistant',
          content: data.result.content,
          citedReferences: data.result.citedReferences,
          timestamp: new Date().toISOString(),
        };
        appendFollowUpToConnection(conn.id, [userMsg, assistantMsg]);
      }
    } finally {
      setLoadingAiForConnectionId(null);
    }
  };

  const handleSavePersonalNoteModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;
    const refs = noteRefsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingNoteId) {
      updatePersonalNote(editingNoteId, {
        title: noteTitle.trim(),
        content: noteContent.trim(),
        scriptureRefs: refs,
        collectionId: noteCollectionId,
      });
    } else {
      createPersonalNote({
        title: noteTitle.trim(),
        content: noteContent.trim(),
        scriptureRefs: refs,
        collectionId: noteCollectionId,
      });
    }
    setIsNewNoteModalOpen(false);
    setEditingNoteId(null);
    setNoteTitle('');
    setNoteContent('');
    setNoteRefsInput('');
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '5 Nov 2026';
    }
  };

  const handleOpenAndInspect = (ref: string) => {
    navigateToReferenceString(ref);
    openReferenceInspector(ref, 'reference');
  };

  return (
    <div className="flex-1 pb-24 lg:pb-12">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 pt-8 space-y-6">
        {/* Clean Header */}
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 ${
            isLight ? 'border-stone-200/90' : 'border-zinc-800/80'
          }`}
        >
          <div>
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                isLight ? 'text-amber-700' : 'text-amber-400'
              }`}
            >
              Personal Research Notebook
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold mt-0.5">
              Saved Connections & Notes
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setRef1Input('John 1:1');
                setBook1('John');
                setChapter1(1);
                setVerse1(1);
                setRef2Input('Genesis 1:1');
                setBook2('Genesis');
                setChapter2(1);
                setVerse2(1);
                setNewRefAiExplanation(undefined);
                setIsNewReferenceModalOpen(true);
              }}
              className={`rounded-xl font-bold px-4 py-2.5 text-xs sm:text-sm flex items-center gap-1.5 transition shadow-xs ${
                isLight
                  ? 'bg-amber-700 hover:bg-amber-800 text-white'
                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950'
              }`}
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>+ New Reference</span>
            </button>

            <button
              onClick={() => {
                setEditingNoteId(null);
                setNoteTitle('');
                setNoteContent('');
                setNoteRefsInput('Deuteronomy 32:6, Isaiah 63:16');
                setIsNewNoteModalOpen(true);
              }}
              className={`rounded-xl border px-3.5 py-2.5 text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition ${
                isLight
                  ? 'bg-white border-stone-200/90 text-stone-800 hover:bg-stone-100/80 shadow-2xs'
                  : 'bg-[#1a1a1a] border-zinc-800 text-zinc-100 hover:bg-[#242424]'
              }`}
            >
              <Edit3
                className={`h-4 w-4 ${isLight ? 'text-amber-700' : 'text-amber-400'}`}
              />
              <span>+ Note</span>
            </button>
          </div>
        </div>

        {/* Unified Tabs + Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div
            className={`inline-flex items-center gap-1 rounded-xl p-1 border self-start ${
              isLight
                ? 'bg-stone-200/60 border-stone-200/80'
                : 'bg-[#171717] border-zinc-800'
            }`}
          >
            {(
              [
                {
                  id: 'references',
                  label: `Saved References (${savedConnections.length})`,
                },
                {
                  id: 'all',
                  label: `All Notes (${savedConnections.length + personalNotes.length})`,
                },
                { id: 'collections', label: `Collections (${collections.length})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                  activeTab === tab.id
                    ? isLight
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'bg-zinc-800 text-white'
                    : isLight
                    ? 'text-stone-600 hover:text-stone-900'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search references (e.g. Isaiah 7:14), keywords, collections..."
              className={`w-full rounded-xl pl-10 pr-9 py-2 text-xs sm:text-sm border focus:outline-none ${
                isLight
                  ? 'bg-white border-stone-200/90 text-stone-900 placeholder-stone-400 focus:border-amber-700 shadow-2xs'
                  : 'bg-[#161616] border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-amber-500'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Clean Collection Filter Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedCollectionFilter('ALL')}
            className={`rounded-full px-3 py-1 text-xs font-semibold shrink-0 transition border ${
              selectedCollectionFilter === 'ALL'
                ? isLight
                  ? 'bg-stone-900 text-white border-stone-900'
                  : 'bg-zinc-100 text-zinc-900 border-zinc-100'
                : isLight
                ? 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                : 'bg-[#1a1a1a] text-zinc-400 border-zinc-800'
            }`}
          >
            All Collections
          </button>
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() =>
                setSelectedCollectionFilter(
                  selectedCollectionFilter === col.id ? 'ALL' : col.id
                )
              }
              className={`rounded-full px-3 py-1 text-xs font-semibold shrink-0 flex items-center gap-1.5 transition border ${
                selectedCollectionFilter === col.id
                  ? isLight
                    ? 'bg-amber-700 text-white border-amber-700'
                    : 'bg-amber-500 text-zinc-950 border-amber-500'
                  : isLight
                  ? 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                  : 'bg-[#1a1a1a] text-zinc-300 border-zinc-800'
              }`}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: col.color }}
              />
              <span>{col.name}</span>
            </button>
          ))}
        </div>

        {/* COLLECTIONS VIEW */}
        {activeTab === 'collections' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                Organised Research Collections ({collections.length})
              </h2>
              <button
                onClick={() => setIsNewCollectionOpen((prev) => !prev)}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 border transition ${
                  isLight
                    ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                }`}
              >
                <FolderPlus className="h-3.5 w-3.5" />
                <span>+ New Collection</span>
              </button>
            </div>

            {isNewCollectionOpen && (
              <div
                className={`rounded-2xl border p-4 space-y-3 ${
                  isLight
                    ? 'bg-white border-stone-200 shadow-sm'
                    : 'bg-[#181818] border-zinc-800'
                }`}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Create Custom Collection
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newColName}
                    onChange={(e) => setNewColName(e.target.value)}
                    placeholder="Collection Name"
                    className={`rounded-xl border px-3.5 py-2 text-xs ${
                      isLight
                        ? 'bg-stone-50 border-stone-300 text-stone-900'
                        : 'bg-[#111111] border-zinc-700 text-white'
                    }`}
                  />
                  <input
                    type="text"
                    value={newColDesc}
                    onChange={(e) => setNewColDesc(e.target.value)}
                    placeholder="Brief description..."
                    className={`rounded-xl border px-3.5 py-2 text-xs ${
                      isLight
                        ? 'bg-stone-50 border-stone-300 text-stone-900'
                        : 'bg-[#111111] border-zinc-700 text-white'
                    }`}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsNewCollectionOpen(false)}
                    className="rounded-lg px-3 py-1.5 text-xs text-stone-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!newColName.trim()) return;
                      createCollection(newColName.trim(), newColDesc.trim());
                      setNewColName('');
                      setNewColDesc('');
                      setIsNewCollectionOpen(false);
                    }}
                    className={`rounded-lg font-bold px-4 py-1.5 text-xs ${
                      isLight ? 'bg-amber-700 text-white' : 'bg-amber-500 text-zinc-950'
                    }`}
                  >
                    Create
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {collections.map((col) => {
                const connCount = savedConnections.filter(
                  (c) => c.collectionId === col.id
                ).length;
                const noteCount = personalNotes.filter(
                  (n) => n.collectionId === col.id
                ).length;

                return (
                  <div
                    key={col.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 transition ${
                      isLight
                        ? 'bg-white border-stone-200/90 hover:border-amber-700/40 shadow-2xs'
                        : 'bg-[#161616] border-zinc-800 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Folder
                            className="h-4 w-4 shrink-0"
                            style={{ color: col.color }}
                          />
                          {renamingColId === col.id ? (
                            <input
                              type="text"
                              value={renameColDraft}
                              onChange={(e) => setRenameColDraft(e.target.value)}
                              className={`rounded border px-2 py-0.5 text-xs ${
                                isLight
                                  ? 'bg-stone-50 border-amber-700 text-stone-900'
                                  : 'bg-zinc-900 border-amber-500 text-white'
                              }`}
                            />
                          ) : (
                            <h3 className="font-bold text-sm sm:text-base">{col.name}</h3>
                          )}
                        </div>

                        <div className="flex items-center gap-1">
                          {renamingColId === col.id ? (
                            <button
                              onClick={() => {
                                if (renameColDraft.trim()) {
                                  renameCollection(col.id, renameColDraft.trim());
                                }
                                setRenamingColId(null);
                              }}
                              className="p-1 text-emerald-600"
                              title="Save Name"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setRenamingColId(col.id);
                                setRenameColDraft(col.name);
                              }}
                              className="p-1 text-stone-400 hover:text-stone-700"
                              title="Rename Collection"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteCollection(col.id)}
                            className="p-1 text-stone-400 hover:text-red-500"
                            title="Delete Collection"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-stone-500 leading-relaxed">
                        {col.description}
                      </p>
                    </div>

                    <div
                      className={`flex items-center justify-between pt-3 border-t ${
                        isLight ? 'border-stone-100' : 'border-zinc-800/60'
                      }`}
                    >
                      <span className="text-xs text-stone-400">
                        {connCount} connections • {noteCount} notes
                      </span>
                      <button
                        onClick={() => {
                          setSelectedCollectionFilter(col.id);
                          setActiveTab('all');
                        }}
                        className={`text-xs font-bold hover:underline ${
                          isLight ? 'text-amber-800' : 'text-amber-400'
                        }`}
                      >
                        View Items →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SAVED REFERENCES VIEW */}
        {(activeTab === 'all' || activeTab === 'references') && (
          <div className="space-y-4">
            {filteredConnections.length === 0 ? (
              <div
                className={`rounded-2xl border p-8 text-center space-y-3 ${
                  isLight
                    ? 'bg-white border-stone-200 text-stone-600'
                    : 'bg-[#161616] border-zinc-800 text-zinc-400'
                }`}
              >
                <p className="text-sm">
                  No saved scripture connections match your current search.
                </p>
                <button
                  onClick={() => setIsNewReferenceModalOpen(true)}
                  className={`inline-flex items-center gap-1.5 rounded-xl font-bold px-4 py-2 text-xs ${
                    isLight ? 'bg-amber-700 text-white' : 'bg-amber-500 text-zinc-950'
                  }`}
                >
                  <Plus className="h-4 w-4" />
                  <span>+ New Reference</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredConnections.map((conn) => {
                  const col = collections.find((c) => c.id === conn.collectionId);
                  const isBothExpanded = expandedCardId === conn.id;
                  const isAiExpanded = expandedAiId === conn.id;
                  const isEditingObs = editingObservationId === conn.id;
                  const isEditingMeta = editingConnectionId === conn.id;

                  return (
                    <div
                      key={conn.id}
                      className={`rounded-2xl border p-5 sm:p-6 space-y-4 transition ${
                        isLight
                          ? 'bg-white border-stone-200/90 shadow-2xs hover:border-stone-300'
                          : 'bg-[#151515] border-zinc-800/90 hover:border-zinc-700'
                      }`}
                    >
                      {/* Card Header */}
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                                isLight
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                              }`}
                            >
                              {conn.category}
                            </span>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                isLight
                                  ? 'bg-stone-100 text-stone-600'
                                  : 'bg-zinc-800 text-zinc-300'
                              }`}
                            >
                              {conn.translation}
                            </span>
                            {col && (
                              <span
                                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium flex items-center gap-1.5 border ${
                                  isLight
                                    ? 'bg-stone-50 border-stone-200 text-stone-600'
                                    : 'bg-zinc-900 border-zinc-700 text-zinc-300'
                                }`}
                              >
                                <span
                                  className="h-2 w-2 rounded-full"
                                  style={{ backgroundColor: col.color }}
                                />
                                {col.name}
                              </span>
                            )}
                          </div>

                          {isEditingMeta ? (
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                              <input
                                type="text"
                                value={editTitleDraft}
                                onChange={(e) => setEditTitleDraft(e.target.value)}
                                className={`rounded-lg border px-3 py-1 text-sm font-bold ${
                                  isLight
                                    ? 'bg-stone-50 border-amber-700 text-stone-900'
                                    : 'bg-zinc-900 border-amber-500 text-white'
                                }`}
                              />
                              <select
                                value={editCategoryDraft}
                                onChange={(e) =>
                                  setEditCategoryDraft(
                                    e.target.value as ReferenceCategory
                                  )
                                }
                                className={`rounded-lg border px-2.5 py-1 text-xs ${
                                  isLight
                                    ? 'bg-stone-50 border-stone-300 text-stone-800'
                                    : 'bg-zinc-900 border-zinc-700 text-zinc-200'
                                }`}
                              >
                                {REFERENCE_CATEGORIES.map((cat) => (
                                  <option key={cat} value={cat}>
                                    {cat}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => {
                                  updateSavedConnection(conn.id, {
                                    title: editTitleDraft,
                                    category: editCategoryDraft,
                                    collectionId: editCollectionDraft,
                                  });
                                  setEditingConnectionId(null);
                                }}
                                className={`rounded-lg font-bold px-3 py-1 text-xs ${
                                  isLight
                                    ? 'bg-amber-700 text-white'
                                    : 'bg-amber-500 text-zinc-950'
                                }`}
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <h3 className="text-lg font-serif font-bold">
                              {conn.title}
                            </h3>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-stone-400">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{formatDate(conn.dateSaved)}</span>
                        </div>
                      </div>

                      {/* Side-by-Side Connected Scriptures */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div
                          className={`rounded-xl border p-3.5 space-y-1 ${
                            isLight
                              ? 'bg-[#FBF9F5] border-stone-200/80'
                              : 'bg-[#1d1d1d] border-zinc-800'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                              Primary Scripture
                            </span>
                            <button
                              onClick={() => handleOpenAndInspect(conn.primaryRef)}
                              className={`text-xs font-bold hover:underline flex items-center gap-1 ${
                                isLight ? 'text-amber-800' : 'text-amber-400'
                              }`}
                            >
                              <span>{conn.primaryRef}</span>
                              <BookOpen className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="font-serif text-sm leading-relaxed">
                            “{conn.primaryText}”
                          </p>
                        </div>

                        <div
                          className={`rounded-xl border p-3.5 space-y-1 ${
                            isLight
                              ? 'bg-amber-50/35 border-amber-200/80'
                              : 'bg-[#1d1d1d] border-amber-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider ${
                                isLight ? 'text-amber-800' : 'text-amber-400'
                              }`}
                            >
                              Connected Scripture
                            </span>
                            <button
                              onClick={() => handleOpenAndInspect(conn.connectedRef)}
                              className={`text-xs font-bold hover:underline flex items-center gap-1 ${
                                isLight ? 'text-amber-800' : 'text-amber-400'
                              }`}
                            >
                              <span>{conn.connectedRef}</span>
                              <BookOpen className="h-3 w-3" />
                            </button>
                          </div>
                          <p className="font-serif text-sm leading-relaxed">
                            “{conn.connectedText}”
                          </p>
                        </div>
                      </div>

                      {/* Personal Observation */}
                      <div
                        className={`rounded-xl border p-3.5 space-y-1.5 ${
                          isLight
                            ? 'bg-stone-50/70 border-stone-200/80'
                            : 'bg-[#1a1a1a] border-zinc-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                            Personal Observation
                          </span>
                          {!isEditingObs && (
                            <button
                              onClick={() => {
                                setEditingObservationId(conn.id);
                                setObservationDraft(conn.personalObservation || '');
                              }}
                              className={`text-xs font-semibold flex items-center gap-1 ${
                                isLight
                                  ? 'text-amber-800 hover:underline'
                                  : 'text-amber-400 hover:underline'
                              }`}
                            >
                              <Edit3 className="h-3 w-3" />
                              <span>
                                {conn.personalObservation ? 'Edit Note' : '+ Add Personal Note'}
                              </span>
                            </button>
                          )}
                        </div>

                        {isEditingObs ? (
                          <div className="space-y-2 pt-1">
                            <textarea
                              rows={3}
                              value={observationDraft}
                              onChange={(e) => setObservationDraft(e.target.value)}
                              placeholder="Write your personal observation..."
                              className={`w-full rounded-xl border p-3 text-xs sm:text-sm focus:outline-none ${
                                isLight
                                  ? 'bg-white border-amber-700 text-stone-900'
                                  : 'bg-[#111111] border-amber-500 text-white'
                              }`}
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingObservationId(null)}
                                className="rounded-lg px-3 py-1 text-xs text-stone-500"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  updateSavedConnection(conn.id, {
                                    personalObservation: observationDraft.trim(),
                                  });
                                  setEditingObservationId(null);
                                }}
                                className={`rounded-lg font-bold px-4 py-1 text-xs ${
                                  isLight
                                    ? 'bg-amber-700 text-white'
                                    : 'bg-amber-500 text-zinc-950'
                                }`}
                              >
                                Save Observation
                              </button>
                            </div>
                          </div>
                        ) : conn.personalObservation ? (
                          <p className="text-xs sm:text-sm text-stone-700 dark:text-zinc-200 leading-relaxed whitespace-pre-line">
                            {conn.personalObservation}
                          </p>
                        ) : (
                          <p className="text-xs italic text-stone-400">
                            No personal observation attached yet.
                          </p>
                        )}
                      </div>

                      {/* Card Actions Bar */}
                      <div
                        className={`flex flex-wrap items-center justify-between gap-2 pt-2 border-t ${
                          isLight ? 'border-stone-100' : 'border-zinc-800/70'
                        }`}
                      >
                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            onClick={() => handleOpenAndInspect(conn.primaryRef)}
                            className={`rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 border transition ${
                              isLight
                                ? 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-800'
                                : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-100'
                            }`}
                          >
                            <BookOpen
                              className={`h-3.5 w-3.5 ${
                                isLight ? 'text-amber-700' : 'text-amber-400'
                              }`}
                            />
                            <span>Open in Bible</span>
                          </button>

                          <button
                            onClick={() =>
                              setExpandedCardId(isBothExpanded ? null : conn.id)
                            }
                            className={`rounded-xl px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 border transition ${
                              isLight
                                ? 'bg-stone-100 hover:bg-stone-200/80 border-stone-200 text-stone-700'
                                : 'bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-zinc-200'
                            }`}
                          >
                            <ArrowLeftRight className="h-3.5 w-3.5" />
                            <span>
                              {isBothExpanded ? 'Hide Comparison' : 'View Both Scriptures'}
                            </span>
                          </button>

                          <button
                            onClick={() => handleGenerateAiForSavedCard(conn)}
                            disabled={loadingAiForConnectionId === conn.id}
                            className={`rounded-xl px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 border transition ${
                              isLight
                                ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                                : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                            }`}
                          >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>
                              {loadingAiForConnectionId === conn.id
                                ? 'Analyzing...'
                                : isAiExpanded
                                ? 'Hide AI Study'
                                : conn.aiExplanation
                                ? 'View AI Explanation'
                                : 'Explain Connection'}
                            </span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingConnectionId(isEditingMeta ? null : conn.id);
                              setEditTitleDraft(conn.title);
                              setEditCategoryDraft(conn.category);
                              setEditCollectionDraft(
                                conn.collectionId || 'col-messianic'
                              );
                            }}
                            className="rounded-lg p-1.5 text-stone-400 hover:text-stone-700 transition"
                            title="Edit Connection"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => deleteSavedConnection(conn.id)}
                            className="rounded-lg p-1.5 text-stone-400 hover:text-red-500 transition"
                            title="Delete Connection"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Comparison */}
                      {isBothExpanded && (
                        <div
                          className={`rounded-xl border p-4 space-y-2 ${
                            isLight
                              ? 'bg-stone-50 border-stone-200'
                              : 'bg-[#111111] border-zinc-800'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs text-stone-500">
                            <span>
                              Connection Type: <strong>{conn.connectionLabel}</strong>
                            </span>
                            <span>Translation: {conn.translation}</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            <div>
                              <h4
                                className={`text-xs font-bold mb-1 ${
                                  isLight ? 'text-amber-800' : 'text-amber-400'
                                }`}
                              >
                                {conn.primaryRef}
                              </h4>
                              <p className="font-serif text-sm leading-relaxed">
                                {conn.primaryText}
                              </p>
                            </div>
                            <div>
                              <h4
                                className={`text-xs font-bold mb-1 ${
                                  isLight ? 'text-amber-800' : 'text-amber-400'
                                }`}
                              >
                                {conn.connectedRef}
                              </h4>
                              <p className="font-serif text-sm leading-relaxed">
                                {conn.connectedText}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Expanded Saved AI Explanation */}
                      {isAiExpanded && conn.aiExplanation && (
                        <div
                          className={`rounded-2xl border p-4 sm:p-5 space-y-4 ${
                            isLight
                              ? 'bg-amber-50/40 border-amber-200/90'
                              : 'bg-[#1c1a15] border-amber-500/35'
                          }`}
                        >
                          <div className="flex items-center justify-between border-b border-amber-200/60 dark:border-zinc-800 pb-2">
                            <span
                              className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                isLight ? 'text-amber-900' : 'text-amber-400'
                              }`}
                            >
                              <Sparkles className="h-4 w-4" />
                              Saved AI Research Synthesis
                            </span>
                            <span className="text-[11px] text-stone-500">
                              Instant Retrieval
                            </span>
                          </div>

                          <p
                            className={`text-xs sm:text-sm rounded-xl p-3 border leading-relaxed ${
                              isLight
                                ? 'bg-white border-amber-200 text-stone-800'
                                : 'bg-amber-500/10 border-amber-500/20 text-amber-100'
                            }`}
                          >
                            {conn.aiExplanation.summary}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div
                              className={`rounded-xl p-3 border space-y-1 ${
                                isLight
                                  ? 'bg-white border-stone-200/80 text-stone-700'
                                  : 'bg-[#141414] border-zinc-800 text-zinc-300'
                              }`}
                            >
                              <strong
                                className={`block ${
                                  isLight ? 'text-amber-800' : 'text-amber-400'
                                }`}
                              >
                                Original Context ({conn.primaryRef}):
                              </strong>
                              <p className="leading-relaxed">
                                {conn.aiExplanation.originalContextFirst}
                              </p>
                            </div>
                            <div
                              className={`rounded-xl p-3 border space-y-1 ${
                                isLight
                                  ? 'bg-white border-stone-200/80 text-stone-700'
                                  : 'bg-[#141414] border-zinc-800 text-zinc-300'
                              }`}
                            >
                              <strong
                                className={`block ${
                                  isLight ? 'text-amber-800' : 'text-amber-400'
                                }`}
                              >
                                Historical Circumstances:
                              </strong>
                              <p className="leading-relaxed">
                                {conn.aiExplanation.historicalCircumstances}
                              </p>
                            </div>
                            {conn.aiExplanation.whyReferenced && (
                              <div
                                className={`rounded-xl p-3 border space-y-1 ${
                                  isLight
                                    ? 'bg-white border-stone-200/80 text-stone-700'
                                    : 'bg-[#141414] border-zinc-800 text-zinc-300'
                                }`}
                              >
                                <strong
                                  className={`block ${
                                    isLight ? 'text-amber-800' : 'text-amber-400'
                                  }`}
                                >
                                  Authorial Connection & Fulfilment:
                                </strong>
                                <p className="leading-relaxed">
                                  {conn.aiExplanation.whyReferenced}
                                </p>
                              </div>
                            )}
                            <div
                              className={`rounded-xl p-3 border space-y-1 ${
                                isLight
                                  ? 'bg-white border-stone-200/80 text-stone-700'
                                  : 'bg-[#141414] border-zinc-800 text-zinc-300'
                              }`}
                            >
                              <strong
                                className={`block ${
                                  isLight ? 'text-amber-800' : 'text-amber-400'
                                }`}
                              >
                                Theological Significance:
                              </strong>
                              <p className="leading-relaxed">
                                {conn.aiExplanation.theologicalSignificance}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-[11px] text-stone-500 mr-1">
                              Related References:
                            </span>
                            {conn.aiExplanation.relatedReferences.map((r) => (
                              <button
                                key={r}
                                onClick={() => handleOpenAndInspect(r)}
                                className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold transition ${
                                  isLight
                                    ? 'bg-white hover:bg-amber-50 border-stone-200 text-amber-800'
                                    : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                                }`}
                              >
                                {r} →
                              </button>
                            ))}
                          </div>

                          {/* Follow-up Research Inside Notes */}
                          <div className="pt-3 border-t border-amber-200/60 dark:border-zinc-800 space-y-2.5">
                            <span className="text-xs font-bold text-stone-500 flex items-center gap-1.5">
                              <MessageSquarePlus className="h-3.5 w-3.5" />
                              Ask Follow-Up Research Question
                            </span>

                            {conn.followUpThread &&
                              conn.followUpThread.map((m) => (
                                <div
                                  key={m.id}
                                  className={`rounded-xl p-3 text-xs leading-relaxed border ${
                                    m.role === 'user'
                                      ? isLight
                                        ? 'bg-stone-100 border-stone-200 text-stone-900 ml-6'
                                        : 'bg-zinc-800 border-zinc-700 text-white ml-6'
                                      : isLight
                                      ? 'bg-white border-amber-200 text-stone-800 mr-4'
                                      : 'bg-[#121212] border-amber-500/30 text-zinc-200 mr-4'
                                  }`}
                                >
                                  <p className="whitespace-pre-line">{m.content}</p>
                                </div>
                              ))}

                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={followUpQuestionMap[conn.id] || ''}
                                onChange={(e) =>
                                  setFollowUpQuestionMap((prev) => ({
                                    ...prev,
                                    [conn.id]: e.target.value,
                                  }))
                                }
                                placeholder="Ask a follow-up question..."
                                className={`flex-1 rounded-xl border px-3 py-2 text-xs focus:outline-none ${
                                  isLight
                                    ? 'bg-white border-stone-300 text-stone-900'
                                    : 'bg-[#111111] border-zinc-700 text-white'
                                }`}
                              />
                              <button
                                onClick={() => handleFollowUpOnSavedCard(conn)}
                                className={`rounded-xl font-bold px-3.5 py-2 text-xs flex items-center gap-1 ${
                                  isLight
                                    ? 'bg-amber-700 text-white'
                                    : 'bg-amber-500 text-zinc-950'
                                }`}
                              >
                                <Send className="h-3.5 w-3.5" />
                                <span>Ask</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* STANDALONE PERSONAL NOTES */}
        {activeTab === 'all' && (
          <div className="space-y-4 pt-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-400 flex items-center gap-2">
              <Edit3 className="h-4 w-4 text-emerald-600" />
              Standalone Personal Notes ({filteredPersonalNotes.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPersonalNotes.map((note) => {
                const col = collections.find((c) => c.id === note.collectionId);
                return (
                  <div
                    key={note.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between space-y-4 ${
                      isLight
                        ? 'bg-white border-stone-200/90 shadow-2xs'
                        : 'bg-[#151515] border-zinc-800/90'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          {col && (
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 ${
                                isLight ? 'text-amber-700' : 'text-amber-400'
                              }`}
                            >
                              {col.name}
                            </span>
                          )}
                          <h3 className="text-base font-serif font-bold">{note.title}</h3>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingNoteId(note.id);
                              setNoteTitle(note.title);
                              setNoteContent(note.content);
                              setNoteRefsInput(note.scriptureRefs.join(', '));
                              setNoteCollectionId(
                                note.collectionId || 'col-messianic'
                              );
                              setIsNewNoteModalOpen(true);
                            }}
                            className="p-1.5 text-stone-400 hover:text-stone-700"
                            title="Edit Note"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deletePersonalNote(note.id)}
                            className="p-1.5 text-stone-400 hover:text-red-500"
                            title="Delete Note"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-stone-600 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                        {note.content}
                      </p>
                    </div>

                    <div
                      className={`space-y-2 pt-2 border-t ${
                        isLight ? 'border-stone-100' : 'border-zinc-800/60'
                      }`}
                    >
                      {note.scriptureRefs.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {note.scriptureRefs.map((refStr) => (
                            <button
                              key={refStr}
                              onClick={() => handleOpenAndInspect(refStr)}
                              className={`rounded-md border px-2 py-0.5 text-[11px] font-semibold transition ${
                                isLight
                                  ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'
                                  : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                              }`}
                            >
                              {refStr}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className="text-[11px] text-stone-400 flex justify-between">
                        <span>Created: {formatDate(note.createdAt)}</span>
                        <span>Updated: {formatDate(note.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* =====================================================================
          MODAL 1: CREATE NEW REFERENCE FROM NOTES (Light/Dark Aware)
          ===================================================================== */}
      {isNewReferenceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto">
          <div
            className={`relative w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col ${
              isLight
                ? 'bg-white border-stone-200 text-stone-900'
                : 'bg-[#161616] border-zinc-800 text-zinc-100'
            }`}
          >
            <div
              className={`flex items-center justify-between px-6 py-4 border-b ${
                isLight ? 'bg-stone-50 border-stone-200' : 'bg-[#1b1b1b] border-zinc-800'
              }`}
            >
              <div>
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    isLight ? 'text-amber-700' : 'text-amber-400'
                  }`}
                >
                  Scripture Connection Builder
                </span>
                <h2 className="text-lg font-bold">Create New Reference Connection</h2>
              </div>
              <button
                onClick={() => setIsNewReferenceModalOpen(false)}
                className="rounded-lg p-1.5 text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSaveNewReferenceFromNotes}
              className="flex-1 overflow-y-auto p-6 space-y-5"
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs text-stone-400 mr-1">Quick Presets:</span>
                {[
                  { a: 'John 1:1', b: 'Genesis 1:1', label: 'John 1:1 ↔ Genesis 1:1' },
                  { a: 'Matthew 1:23', b: 'Isaiah 7:14', label: 'Matthew 1:23 ↔ Isaiah 7:14' },
                  {
                    a: 'Deuteronomy 32:6',
                    b: 'Isaiah 63:16',
                    label: 'Deut 32:6 ↔ Isaiah 63:16',
                  },
                ].map((pair) => (
                  <button
                    type="button"
                    key={pair.label}
                    onClick={() => {
                      setRef1Input(pair.a);
                      setRef2Input(pair.b);
                      setNewRefAiExplanation(undefined);
                    }}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      isLight
                        ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                        : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                    }`}
                  >
                    {pair.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Scripture 1 */}
                <div
                  className={`rounded-xl border p-4 space-y-3 ${
                    isLight
                      ? 'bg-stone-50/80 border-stone-200'
                      : 'bg-[#1f1f1f] border-zinc-800'
                  }`}
                >
                  <label
                    className={`text-xs font-bold uppercase tracking-wider block ${
                      isLight ? 'text-amber-800' : 'text-amber-400'
                    }`}
                  >
                    1. First Scripture
                  </label>
                  <input
                    type="text"
                    value={ref1Input}
                    onChange={(e) => setRef1Input(e.target.value)}
                    placeholder="e.g. John 1:1"
                    className={`w-full rounded-lg border px-3 py-2 text-sm font-semibold ${
                      isLight
                        ? 'bg-white border-stone-300 text-stone-900'
                        : 'bg-[#121212] border-zinc-700 text-white'
                    }`}
                  />
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    <select
                      value={book1}
                      onChange={(e) => {
                        const b = e.target.value;
                        setBook1(b);
                        setRef1Input(`${b} ${chapter1}:${verse1}`);
                      }}
                      className={`rounded border px-2 py-1.5 ${
                        isLight
                          ? 'bg-white border-stone-200 text-stone-800'
                          : 'bg-[#121212] border-zinc-800 text-zinc-200'
                      }`}
                    >
                      {BIBLE_BOOKS.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={chapter1}
                      onChange={(e) => {
                        const ch = parseInt(e.target.value, 10) || 1;
                        setChapter1(ch);
                        setRef1Input(`${book1} ${ch}:${verse1}`);
                      }}
                      className={`rounded border px-2 py-1.5 ${
                        isLight
                          ? 'bg-white border-stone-200 text-stone-800'
                          : 'bg-[#121212] border-zinc-800 text-zinc-200'
                      }`}
                    />
                    <input
                      type="number"
                      min={1}
                      value={verse1}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10) || 1;
                        setVerse1(v);
                        setRef1Input(`${book1} ${chapter1}:${v}`);
                      }}
                      className={`rounded border px-2 py-1.5 ${
                        isLight
                          ? 'bg-white border-stone-200 text-stone-800'
                          : 'bg-[#121212] border-zinc-800 text-zinc-200'
                      }`}
                    />
                  </div>
                  <div
                    className={`rounded-lg p-3 border ${
                      isLight
                        ? 'bg-white border-stone-200/90'
                        : 'bg-[#141414] border-zinc-800'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                      Retrieved Text ({newRefTranslation}):
                    </span>
                    <p className="font-serif text-xs sm:text-sm leading-relaxed">
                      “{resolvedText1 || 'Retrieving...'}”
                    </p>
                  </div>
                </div>

                {/* Scripture 2 */}
                <div
                  className={`rounded-xl border p-4 space-y-3 ${
                    isLight
                      ? 'bg-stone-50/80 border-stone-200'
                      : 'bg-[#1f1f1f] border-zinc-800'
                  }`}
                >
                  <label
                    className={`text-xs font-bold uppercase tracking-wider block ${
                      isLight ? 'text-amber-800' : 'text-amber-400'
                    }`}
                  >
                    2. Connected Scripture
                  </label>
                  <input
                    type="text"
                    value={ref2Input}
                    onChange={(e) => setRef2Input(e.target.value)}
                    placeholder="e.g. Genesis 1:1"
                    className={`w-full rounded-lg border px-3 py-2 text-sm font-semibold ${
                      isLight
                        ? 'bg-white border-stone-300 text-stone-900'
                        : 'bg-[#121212] border-zinc-700 text-white'
                    }`}
                  />
                  <div className="grid grid-cols-3 gap-1.5 text-xs">
                    <select
                      value={book2}
                      onChange={(e) => {
                        const b = e.target.value;
                        setBook2(b);
                        setRef2Input(`${b} ${chapter2}:${verse2}`);
                      }}
                      className={`rounded border px-2 py-1.5 ${
                        isLight
                          ? 'bg-white border-stone-200 text-stone-800'
                          : 'bg-[#121212] border-zinc-800 text-zinc-200'
                      }`}
                    >
                      {BIBLE_BOOKS.map((b) => (
                        <option key={b.id} value={b.name}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      value={chapter2}
                      onChange={(e) => {
                        const ch = parseInt(e.target.value, 10) || 1;
                        setChapter2(ch);
                        setRef2Input(`${book2} ${ch}:${verse2}`);
                      }}
                      className={`rounded border px-2 py-1.5 ${
                        isLight
                          ? 'bg-white border-stone-200 text-stone-800'
                          : 'bg-[#121212] border-zinc-800 text-zinc-200'
                      }`}
                    />
                    <input
                      type="number"
                      min={1}
                      value={verse2}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10) || 1;
                        setVerse2(v);
                        setRef2Input(`${book2} ${chapter2}:${v}`);
                      }}
                      className={`rounded border px-2 py-1.5 ${
                        isLight
                          ? 'bg-white border-stone-200 text-stone-800'
                          : 'bg-[#121212] border-zinc-800 text-zinc-200'
                      }`}
                    />
                  </div>
                  <div
                    className={`rounded-lg p-3 border ${
                      isLight
                        ? 'bg-white border-stone-200/90'
                        : 'bg-[#141414] border-zinc-800'
                    }`}
                  >
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">
                      Retrieved Text ({newRefTranslation}):
                    </span>
                    <p className="font-serif text-xs sm:text-sm leading-relaxed">
                      “{resolvedText2 || 'Retrieving...'}”
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Title</label>
                  <input
                    type="text"
                    value={newRefTitle}
                    onChange={(e) => setNewRefTitle(e.target.value)}
                    className={`w-full rounded-xl border px-3 py-2 text-xs ${
                      isLight
                        ? 'bg-stone-50 border-stone-300 text-stone-900'
                        : 'bg-[#121212] border-zinc-700 text-white'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">Category</label>
                  <select
                    value={newRefCategory}
                    onChange={(e) =>
                      setNewRefCategory(e.target.value as ReferenceCategory)
                    }
                    className={`w-full rounded-xl border px-3 py-2 text-xs ${
                      isLight
                        ? 'bg-stone-50 border-stone-300 text-stone-900'
                        : 'bg-[#121212] border-zinc-700 text-white'
                    }`}
                  >
                    {REFERENCE_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-stone-500 block mb-1">
                    Translation & Collection
                  </label>
                  <div className="flex gap-1.5">
                    <select
                      value={newRefTranslation}
                      onChange={(e) =>
                        setNewRefTranslation(e.target.value as TranslationId)
                      }
                      className={`rounded-xl border px-2 py-2 text-xs font-bold ${
                        isLight
                          ? 'bg-stone-50 border-stone-300 text-amber-800'
                          : 'bg-[#121212] border-zinc-700 text-amber-300'
                      }`}
                    >
                      {BIBLE_TRANSLATIONS.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.abbreviation}
                        </option>
                      ))}
                    </select>
                    <select
                      value={newRefCollectionId}
                      onChange={(e) => setNewRefCollectionId(e.target.value)}
                      className={`flex-1 rounded-xl border px-2 py-2 text-xs ${
                        isLight
                          ? 'bg-stone-50 border-stone-300 text-stone-900'
                          : 'bg-[#121212] border-zinc-700 text-white'
                      }`}
                    >
                      {collections.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* AI Explanation Box */}
              <div
                className={`rounded-xl border p-4 space-y-2.5 ${
                  isLight
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-[#1f1d18] border-amber-500/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold flex items-center gap-1.5 ${
                      isLight ? 'text-amber-900' : 'text-amber-400'
                    }`}
                  >
                    <Sparkles className="h-4 w-4" />
                    AI Relationship Analysis
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateAiInModal}
                    disabled={isGeneratingModalAi}
                    className={`rounded-lg font-bold px-3 py-1.5 text-xs transition ${
                      isLight
                        ? 'bg-amber-700 hover:bg-amber-800 text-white'
                        : 'bg-amber-500 text-zinc-950'
                    }`}
                  >
                    {isGeneratingModalAi
                      ? 'Generating...'
                      : newRefAiExplanation
                      ? 'Regenerate'
                      : 'Explain with AI'}
                  </button>
                </div>

                {newRefAiExplanation ? (
                  <div
                    className={`space-y-1.5 text-xs rounded-lg p-3 border ${
                      isLight
                        ? 'bg-white border-amber-200 text-stone-800'
                        : 'bg-[#141414] border-zinc-800 text-zinc-200'
                    }`}
                  >
                    <p className="font-bold">{newRefAiExplanation.title}</p>
                    <p className="leading-relaxed">{newRefAiExplanation.summary}</p>
                  </div>
                ) : (
                  <p className="text-xs text-stone-500">
                    Click “Explain with AI” to analyze how {ref1Input} and {ref2Input}{' '}
                    relate to each other and save the research with this entry.
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                  Personal Observation
                </label>
                <textarea
                  rows={2}
                  value={newRefObservation}
                  onChange={(e) => setNewRefObservation(e.target.value)}
                  placeholder="Write your observations..."
                  className={`w-full rounded-xl border p-3 text-xs sm:text-sm ${
                    isLight
                      ? 'bg-stone-50 border-stone-300 text-stone-900'
                      : 'bg-[#121212] border-zinc-700 text-white'
                  }`}
                />
              </div>

              <div
                className={`flex justify-end gap-3 pt-2 border-t ${
                  isLight ? 'border-stone-200' : 'border-zinc-800'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setIsNewReferenceModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`rounded-xl font-bold px-6 py-2.5 text-xs sm:text-sm transition ${
                    isLight
                      ? 'bg-amber-700 hover:bg-amber-800 text-white'
                      : 'bg-amber-500 text-zinc-950'
                  }`}
                >
                  Save Connection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL 2: CREATE / EDIT STANDALONE PERSONAL NOTE
          ===================================================================== */}
      {isNewNoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div
            className={`relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden ${
              isLight
                ? 'bg-white border-stone-200 text-stone-900'
                : 'bg-[#161616] border-zinc-800 text-zinc-100'
            }`}
          >
            <div
              className={`flex items-center justify-between px-6 py-4 border-b ${
                isLight ? 'bg-stone-50 border-stone-200' : 'border-zinc-800'
              }`}
            >
              <h2 className="text-base font-bold">
                {editingNoteId ? 'Edit Personal Note' : 'New Personal Note'}
              </h2>
              <button
                onClick={() => setIsNewNoteModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSavePersonalNoteModal} className="p-6 space-y-4">
              <div>
                <label className="text-xs text-stone-500 block mb-1">Note Title</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Study on the Song of Moses"
                  className={`w-full rounded-xl border px-3.5 py-2 text-sm ${
                    isLight
                      ? 'bg-stone-50 border-stone-300 text-stone-900'
                      : 'bg-[#111111] border-zinc-700 text-white'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs text-stone-500 block mb-1">
                  Scripture References (comma-separated)
                </label>
                <input
                  type="text"
                  value={noteRefsInput}
                  onChange={(e) => setNoteRefsInput(e.target.value)}
                  placeholder="e.g. Deuteronomy 32:6, Matthew 1:23"
                  className={`w-full rounded-xl border px-3.5 py-2 text-xs font-semibold ${
                    isLight
                      ? 'bg-stone-50 border-stone-300 text-amber-800'
                      : 'bg-[#111111] border-zinc-700 text-amber-300'
                  }`}
                />
              </div>

              <div>
                <label className="text-xs text-stone-500 block mb-1">Collection</label>
                <select
                  value={noteCollectionId}
                  onChange={(e) => setNoteCollectionId(e.target.value)}
                  className={`w-full rounded-xl border px-3.5 py-2 text-xs ${
                    isLight
                      ? 'bg-stone-50 border-stone-300 text-stone-900'
                      : 'bg-[#111111] border-zinc-700 text-white'
                  }`}
                >
                  {collections.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-stone-500 block mb-1">Content</label>
                <textarea
                  rows={4}
                  required
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write your study notes..."
                  className={`w-full rounded-xl border p-3 text-sm ${
                    isLight
                      ? 'bg-stone-50 border-stone-300 text-stone-900'
                      : 'bg-[#111111] border-zinc-700 text-white'
                  }`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewNoteModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs text-stone-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`rounded-xl font-bold px-5 py-2 text-xs ${
                    isLight
                      ? 'bg-amber-700 text-white hover:bg-amber-800'
                      : 'bg-amber-500 text-zinc-950'
                  }`}
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
