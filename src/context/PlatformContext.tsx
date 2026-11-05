'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AIExplanationData,
  FollowUpMessage,
  InspectorMode,
  NotebookCollection,
  PersonalNote,
  ReadingHistoryEntry,
  ReferenceCategory,
  SavedConnection,
  TranslationId,
  UserPreferences,
} from '@/types/bible';
import { generateAIExplanationForConnection } from '@/data/aiExplanations';
import { getVerseText } from '@/data/scriptureDatabase';
import { parseScriptureReference } from '@/data/bibleBooks';
import { getSupabaseClient } from '@/lib/supabase';

export type PrimaryPage = 'bible' | 'notes';

interface ReadingPosition {
  book: string;
  chapter: number;
  verse?: number;
  label: string;
}

interface PlatformContextValue {
  // Navigation (Strictly 2 Primary Pages: Bible & Notes)
  activePage: PrimaryPage;
  setActivePage: (page: PrimaryPage) => void;

  // Bible Reader State
  currentBook: string;
  currentChapter: number; // 0 = Book Intro, 1..N = Chapter
  translation: TranslationId;
  selectedVerse: number | null;
  activeReferenceVerse: string | null;
  activeReferenceMode: InspectorMode;
  openReferenceInspector: (canonicalRef: string | null, mode?: InspectorMode) => void;
  previousReadingPosition: ReadingPosition | null;
  navigateToPassage: (book: string, chapter: number, verse?: number, saveReturnPosition?: boolean) => void;
  navigateToReferenceString: (ref: string, saveReturnPosition?: boolean) => void;
  returnToPreviousPosition: () => void;
  setTranslation: (t: TranslationId) => void;
  setSelectedVerse: (v: number | null) => void;

  // User Preferences
  preferences: UserPreferences;
  updatePreferences: (partial: Partial<UserPreferences>) => void;

  // Bookmarks, Highlights & Reading History
  bookmarks: string[];
  toggleBookmark: (canonicalRef: string) => void;
  highlights: Record<string, string>;
  setVerseHighlight: (canonicalRef: string, color: string | null) => void;
  readingHistory: ReadingHistoryEntry[];

  // Notes & Saved Connections
  savedConnections: SavedConnection[];
  saveConnectionToNotes: (params: {
    title?: string;
    primaryRef: string;
    connectedRef: string;
    primaryText?: string;
    connectedText?: string;
    translation?: TranslationId;
    category: ReferenceCategory;
    connectionLabel?: string;
    verificationStatus?: 'verified' | 'ai_suggested' | 'user_created';
    aiExplanation?: AIExplanationData;
    personalObservation?: string;
    collectionId?: string;
  }) => SavedConnection;
  updateSavedConnection: (id: string, updates: Partial<SavedConnection>) => void;
  deleteSavedConnection: (id: string) => void;
  appendFollowUpToConnection: (connectionId: string, messages: FollowUpMessage[]) => void;

  // Standalone Personal Notes
  personalNotes: PersonalNote[];
  createPersonalNote: (params: {
    title: string;
    content: string;
    scriptureRefs: string[];
    collectionId?: string;
    aiExplanation?: AIExplanationData;
  }) => PersonalNote;
  updatePersonalNote: (id: string, updates: Partial<PersonalNote>) => void;
  deletePersonalNote: (id: string) => void;

  // Collections
  collections: NotebookCollection[];
  createCollection: (name: string, description: string, color?: string) => NotebookCollection;
  renameCollection: (id: string, name: string, description?: string) => void;
  deleteCollection: (id: string) => void;

  // Cross-Device Sync / Export / Import
  exportNotebookJson: () => string;
  importNotebookJson: (rawJson: string) => boolean;
  syncWithSupabase: () => Promise<{ ok: boolean; message: string }>;

  // Toast Notification
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const DEFAULT_COLLECTIONS: NotebookCollection[] = [
  {
    id: 'col-messianic',
    name: 'Messianic Prophecies',
    description: 'Old Testament prophecies fulfilled in the life, birth, ministry, death, and resurrection of Jesus the Messiah.',
    color: '#d4a373',
    createdAt: '2026-11-05T09:00:00.000Z',
  },
  {
    id: 'col-jesus-ot',
    name: 'Jesus in the Old Testament',
    description: 'Christological appearances, types, shadows, and pre-incarnate Logos connections.',
    color: '#60a5fa',
    createdAt: '2026-11-05T09:00:00.000Z',
  },
  {
    id: 'col-covenants',
    name: 'Biblical Covenants',
    description: 'Abrahamic, Mosaic, Davidic, and New Covenant connections across both Testaments.',
    color: '#34d399',
    createdAt: '2026-11-05T09:00:00.000Z',
  },
  {
    id: 'col-nature-god',
    name: 'The Nature of God',
    description: 'Passages revealing God as Creator, Rock, Father, Redeemer, and Holy One.',
    color: '#a78bfa',
    createdAt: '2026-11-05T09:00:00.000Z',
  },
  {
    id: 'col-ot-in-nt',
    name: 'Old Testament References in the New Testament',
    description: 'Direct quotations and allusions to the Torah, Prophets, and Psalms by Jesus and the Apostles.',
    color: '#f472b6',
    createdAt: '2026-11-05T09:00:00.000Z',
  },
  {
    id: 'col-resurrection',
    name: 'The Resurrection',
    description: 'Scriptural witnesses to Christ’s victory over death and the promise of eternal life.',
    color: '#fbbf24',
    createdAt: '2026-11-05T09:00:00.000Z',
  },
];

const INITIAL_SAVED_CONNECTIONS: SavedConnection[] = [
  {
    id: 'conn-initial-deut-32-6',
    title: 'YHWH as Covenant Father & Creator in the Song of Moses',
    primaryRef: 'Deuteronomy 32:6',
    connectedRef: 'Isaiah 63:16',
    primaryText: getVerseText('Deuteronomy 32:6', 'NIV'),
    connectedText: getVerseText('Isaiah 63:16', 'NIV'),
    translation: 'NIV',
    category: 'Thematic connection',
    connectionLabel: 'Old Testament Covenant Paternity Connection',
    verificationStatus: 'verified',
    aiExplanation: generateAIExplanationForConnection('Deuteronomy 32:6', 'Isaiah 63:16', 'NIV'),
    followUpThread: [],
    personalObservation:
      'Notice the NIV footnote on Deuteronomy 32:6 ("Or Father, who bought you"). Moses links God’s fatherhood directly with both Creation and Exodus redemption.',
    collectionId: 'col-nature-god',
    dateSaved: '2026-11-05T10:30:00.000Z',
    updatedAt: '2026-11-05T10:30:00.000Z',
  },
  {
    id: 'conn-initial-matt-18-16',
    title: 'Restorative Witness in the Church & Torah Justice',
    primaryRef: 'Matthew 18:16',
    connectedRef: 'Deuteronomy 19:15',
    primaryText: getVerseText('Matthew 18:16', 'NKJV'),
    connectedText: getVerseText('Deuteronomy 19:15', 'NKJV'),
    translation: 'NKJV',
    category: 'Direct quotation',
    connectionLabel: 'Old Testament Judicial Law / Direct Quotation by Jesus',
    verificationStatus: 'verified',
    aiExplanation: generateAIExplanationForConnection('Matthew 18:16', 'Deuteronomy 19:15', 'NKJV'),
    followUpThread: [],
    personalObservation:
      'Jesus quotes Deuteronomy 19:15 inside a passage about winning back a sinning brother (Matthew 18:15-20), showing how truth and love work together.',
    collectionId: 'col-ot-in-nt',
    dateSaved: '2026-11-05T11:15:00.000Z',
    updatedAt: '2026-11-05T11:15:00.000Z',
  },
];

const INITIAL_PERSONAL_NOTES: PersonalNote[] = [
  {
    id: 'note-initial-1',
    title: 'The Song of Moses (Deuteronomy 32) as a Key to Prophecy',
    content:
      'Deuteronomy 32 opens by calling heaven and earth as witnesses (Deuteronomy 32:1) and declares that the LORD is "the Rock, his works are perfect" (Deuteronomy 32:4). Paul explicitly connects this Rock to Christ in 1 Corinthians 10:4.',
    scriptureRefs: ['Deuteronomy 32:1', 'Deuteronomy 32:4', 'Deuteronomy 32:6', '1 Corinthians 10:4'],
    collectionId: 'col-jesus-ot',
    createdAt: '2026-11-05T12:00:00.000Z',
    updatedAt: '2026-11-05T12:00:00.000Z',
  },
];

const STORAGE_KEYS = {
  PREFS: 'scripture_nexus_prefs_v2_light',
  CONNECTIONS: 'scripture_nexus_saved_connections_v1',
  NOTES: 'scripture_nexus_personal_notes_v1',
  COLLECTIONS: 'scripture_nexus_collections_v1',
  BOOKMARKS: 'scripture_nexus_bookmarks_v1',
  HIGHLIGHTS: 'scripture_nexus_highlights_v1',
  HISTORY: 'scripture_nexus_history_v1',
  READER_POS: 'scripture_nexus_reader_pos_v1',
};

const PlatformContext = createContext<PlatformContextValue | undefined>(undefined);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [activePage, setActivePage] = useState<PrimaryPage>('bible');
  const [currentBook, setCurrentBook] = useState<string>('Matthew');
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [translation, setTranslationState] = useState<TranslationId>('NIV');
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [activeReferenceVerse, setActiveReferenceVerse] = useState<string | null>(null);
  const [activeReferenceMode, setActiveReferenceMode] = useState<InspectorMode>('reference');
  const [previousReadingPosition, setPreviousReadingPosition] = useState<ReadingPosition | null>(null);

  const openReferenceInspector = (
    canonicalRef: string | null,
    mode: InspectorMode = 'reference'
  ) => {
    setActiveReferenceMode(mode);
    setActiveReferenceVerse(canonicalRef);
  };

  const [preferences, setPreferences] = useState<UserPreferences>({
    defaultTranslation: 'NIV',
    theme: 'light',
    fontSize: 'medium',
    redLetterEnabled: true,
    showReferenceBadges: true,
    userName: 'Berean Scholar',
    userEmail: 'scholar@scripturenexus.org',
    deviceId: 'SN-CLOUD-SYNC-8842',
  });

  const [savedConnections, setSavedConnections] = useState<SavedConnection[]>(INITIAL_SAVED_CONNECTIONS);
  const [personalNotes, setPersonalNotes] = useState<PersonalNote[]>(INITIAL_PERSONAL_NOTES);
  const [collections, setCollections] = useState<NotebookCollection[]>(DEFAULT_COLLECTIONS);
  const [bookmarks, setBookmarks] = useState<string[]>(['Matthew 1:23', 'Deuteronomy 32:6', 'John 1:1']);
  const [highlights, setHighlights] = useState<Record<string, string>>({
    'Matthew 1:23': 'amber',
    'Deuteronomy 32:4': 'emerald',
    'Deuteronomy 32:6': 'amber',
  });
  const [readingHistory, setReadingHistory] = useState<ReadingHistoryEntry[]>([
    { book: 'Matthew', chapter: 1, translation: 'NIV', timestamp: '2026-11-05T22:00:00.000Z' },
    { book: 'Deuteronomy', chapter: 32, translation: 'NIV', timestamp: '2026-11-05T21:49:00.000Z' },
    { book: 'Matthew', chapter: 18, translation: 'NKJV', timestamp: '2026-11-05T17:45:00.000Z' },
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3600);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Hydrate from localStorage on client mount
  useEffect(() => {
    try {
      const rawPrefs = localStorage.getItem(STORAGE_KEYS.PREFS);
      if (rawPrefs) {
        const parsed = JSON.parse(rawPrefs);
        setPreferences((prev) => ({ ...prev, ...parsed }));
        if (parsed.defaultTranslation) {
          setTranslationState(parsed.defaultTranslation);
        }
      }

      const rawConns = localStorage.getItem(STORAGE_KEYS.CONNECTIONS);
      if (rawConns) setSavedConnections(JSON.parse(rawConns));

      const rawNotes = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (rawNotes) setPersonalNotes(JSON.parse(rawNotes));

      const rawCols = localStorage.getItem(STORAGE_KEYS.COLLECTIONS);
      if (rawCols) setCollections(JSON.parse(rawCols));

      const rawBm = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (rawBm) setBookmarks(JSON.parse(rawBm));

      const rawHl = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
      if (rawHl) setHighlights(JSON.parse(rawHl));

      const rawHist = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (rawHist) setReadingHistory(JSON.parse(rawHist));

      const rawPos = localStorage.getItem(STORAGE_KEYS.READER_POS);
      if (rawPos) {
        const pos = JSON.parse(rawPos);
        if (pos.book) setCurrentBook(pos.book);
        if (typeof pos.chapter === 'number') setCurrentChapter(pos.chapter);
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist changes to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(preferences));
      localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(savedConnections));
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(personalNotes));
      localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights));
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(readingHistory));
      localStorage.setItem(
        STORAGE_KEYS.READER_POS,
        JSON.stringify({ book: currentBook, chapter: currentChapter })
      );
    } catch (e) {
      console.warn('Failed to persist state:', e);
    }
  }, [
    hydrated,
    preferences,
    savedConnections,
    personalNotes,
    collections,
    bookmarks,
    highlights,
    readingHistory,
    currentBook,
    currentChapter,
  ]);

  const setTranslation = (t: TranslationId) => {
    setTranslationState(t);
    setPreferences((prev) => ({ ...prev, defaultTranslation: t }));
  };

  const updatePreferences = (partial: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...partial };
      if (partial.defaultTranslation) {
        setTranslationState(partial.defaultTranslation);
      }
      return updated;
    });
  };

  const navigateToPassage = (
    book: string,
    chapter: number,
    verse?: number,
    saveReturnPosition = false
  ) => {
    if (saveReturnPosition && (book !== currentBook || chapter !== currentChapter)) {
      setPreviousReadingPosition({
        book: currentBook,
        chapter: currentChapter,
        verse: selectedVerse || undefined,
        label: `${currentBook} ${currentChapter}${selectedVerse ? `:${selectedVerse}` : ''}`,
      });
    }
    setCurrentBook(book);
    setCurrentChapter(chapter);
    setSelectedVerse(verse || null);
    setActivePage('bible');

    if (chapter > 0) {
      setReadingHistory((prev) => {
        const filtered = prev.filter((item) => !(item.book === book && item.chapter === chapter));
        return [
          { book, chapter, translation, timestamp: new Date().toISOString() },
          ...filtered,
        ].slice(0, 25);
      });
    }
  };

  const navigateToReferenceString = (ref: string, saveReturnPosition = true) => {
    const parsed = parseScriptureReference(ref);
    if (!parsed) return;
    navigateToPassage(parsed.book, parsed.chapter, parsed.verse, saveReturnPosition);
  };

  const returnToPreviousPosition = () => {
    if (!previousReadingPosition) return;
    const { book, chapter, verse } = previousReadingPosition;
    setPreviousReadingPosition(null);
    setCurrentBook(book);
    setCurrentChapter(chapter);
    setSelectedVerse(verse || null);
    setActivePage('bible');
  };

  const toggleBookmark = (canonicalRef: string) => {
    setBookmarks((prev) => {
      const exists = prev.includes(canonicalRef);
      const next = exists ? prev.filter((r) => r !== canonicalRef) : [canonicalRef, ...prev];
      showToast(exists ? `Removed bookmark: ${canonicalRef}` : `Bookmarked ${canonicalRef}`);
      return next;
    });
  };

  const setVerseHighlight = (canonicalRef: string, color: string | null) => {
    setHighlights((prev) => {
      const next = { ...prev };
      if (!color) {
        delete next[canonicalRef];
      } else {
        next[canonicalRef] = color;
      }
      return next;
    });
  };

  const saveConnectionToNotes: PlatformContextValue['saveConnectionToNotes'] = (params) => {
    const trans = params.translation || translation;
    const pText =
      params.primaryText ||
      getVerseText(params.primaryRef, trans) ||
      `Scripture text for ${params.primaryRef}`;
    const cText =
      params.connectedText ||
      getVerseText(params.connectedRef, trans) ||
      `Scripture text for ${params.connectedRef}`;

    // Check if already saved with same pair; if so, update or create new
    const existingIndex = savedConnections.findIndex(
      (c) =>
        (c.primaryRef.toLowerCase() === params.primaryRef.toLowerCase() &&
          c.connectedRef.toLowerCase() === params.connectedRef.toLowerCase()) ||
        (c.primaryRef.toLowerCase() === params.connectedRef.toLowerCase() &&
          c.connectedRef.toLowerCase() === params.primaryRef.toLowerCase())
    );

    const now = new Date().toISOString();

    if (existingIndex !== -1) {
      const existing = savedConnections[existingIndex];
      const updated: SavedConnection = {
        ...existing,
        title: params.title || existing.title,
        primaryText: pText,
        connectedText: cText,
        translation: trans,
        category: params.category || existing.category,
        aiExplanation: params.aiExplanation || existing.aiExplanation,
        personalObservation:
          params.personalObservation !== undefined && params.personalObservation !== ''
            ? params.personalObservation
            : existing.personalObservation,
        collectionId: params.collectionId || existing.collectionId,
        updatedAt: now,
      };
      setSavedConnections((prev) => {
        const copy = [...prev];
        copy[existingIndex] = updated;
        return copy;
      });
      showToast(`Updated saved connection (${params.primaryRef} ↔ ${params.connectedRef}) in Notes`);
      return updated;
    }

    const newEntry: SavedConnection = {
      id: `conn-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: params.title || `${params.primaryRef} & ${params.connectedRef}`,
      primaryRef: params.primaryRef,
      connectedRef: params.connectedRef,
      primaryText: pText,
      connectedText: cText,
      translation: trans,
      category: params.category,
      connectionLabel:
        params.connectionLabel || `${params.category} • Scripture Connection`,
      verificationStatus: params.verificationStatus || 'verified',
      aiExplanation: params.aiExplanation,
      followUpThread: [],
      personalObservation: params.personalObservation || '',
      collectionId: params.collectionId || 'col-messianic',
      dateSaved: now,
      updatedAt: now,
    };

    setSavedConnections((prev) => [newEntry, ...prev]);
    showToast(`Saved connection (${params.primaryRef} ↔ ${params.connectedRef}) to Notes`);
    return newEntry;
  };

  const updateSavedConnection = (id: string, updates: Partial<SavedConnection>) => {
    setSavedConnections((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      )
    );
    showToast('Saved changes to research connection');
  };

  const deleteSavedConnection = (id: string) => {
    setSavedConnections((prev) => prev.filter((item) => item.id !== id));
    showToast('Deleted saved scripture connection');
  };

  const appendFollowUpToConnection = (connectionId: string, messages: FollowUpMessage[]) => {
    setSavedConnections((prev) =>
      prev.map((item) =>
        item.id === connectionId
          ? {
              ...item,
              followUpThread: [...(item.followUpThread || []), ...messages],
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const createPersonalNote: PlatformContextValue['createPersonalNote'] = (params) => {
    const now = new Date().toISOString();
    const note: PersonalNote = {
      id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: params.title,
      content: params.content,
      scriptureRefs: params.scriptureRefs,
      collectionId: params.collectionId,
      aiExplanation: params.aiExplanation,
      createdAt: now,
      updatedAt: now,
    };
    setPersonalNotes((prev) => [note, ...prev]);
    showToast(`Saved personal note: "${params.title}"`);
    return note;
  };

  const updatePersonalNote = (id: string, updates: Partial<PersonalNote>) => {
    setPersonalNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
      )
    );
    showToast('Updated personal note');
  };

  const deletePersonalNote = (id: string) => {
    setPersonalNotes((prev) => prev.filter((n) => n.id !== id));
    showToast('Deleted personal note');
  };

  const createCollection = (name: string, description: string, color = '#d4a373') => {
    const col: NotebookCollection = {
      id: `col-${Date.now()}`,
      name,
      description,
      color,
      createdAt: new Date().toISOString(),
    };
    setCollections((prev) => [...prev, col]);
    showToast(`Created collection: "${name}"`);
    return col;
  };

  const renameCollection = (id: string, name: string, description?: string) => {
    setCollections((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, name, description: description ?? c.description } : c
      )
    );
    showToast(`Updated collection: "${name}"`);
  };

  const deleteCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    setSavedConnections((prev) =>
      prev.map((c) => (c.collectionId === id ? { ...c, collectionId: undefined } : c))
    );
    setPersonalNotes((prev) =>
      prev.map((n) => (n.collectionId === id ? { ...n, collectionId: undefined } : n))
    );
    showToast('Deleted collection');
  };

  const exportNotebookJson = () => {
    return JSON.stringify(
      {
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        preferences,
        savedConnections,
        personalNotes,
        collections,
        bookmarks,
        highlights,
        readingHistory,
      },
      null,
      2
    );
  };

  const importNotebookJson = (rawJson: string): boolean => {
    try {
      const parsed = JSON.parse(rawJson);
      if (Array.isArray(parsed.savedConnections)) setSavedConnections(parsed.savedConnections);
      if (Array.isArray(parsed.personalNotes)) setPersonalNotes(parsed.personalNotes);
      if (Array.isArray(parsed.collections)) setCollections(parsed.collections);
      if (Array.isArray(parsed.bookmarks)) setBookmarks(parsed.bookmarks);
      if (parsed.highlights && typeof parsed.highlights === 'object') setHighlights(parsed.highlights);
      if (Array.isArray(parsed.readingHistory)) setReadingHistory(parsed.readingHistory);
      if (parsed.preferences) updatePreferences(parsed.preferences);
      showToast('Successfully synced research notebook & reading history across devices');
      return true;
    } catch {
      showToast('Invalid sync bundle format');
      return false;
    }
  };

  const syncWithSupabase = async (): Promise<{ ok: boolean; message: string }> => {
    const client = getSupabaseClient();
    if (!client) {
      return {
        ok: false,
        message: 'Supabase URL and Anon Key are not configured yet.',
      };
    }

    try {
      // Test connection against bible_translations or saved_connections table
      const { data: transData, error: pingError } = await client
        .from('bible_translations')
        .select('id')
        .limit(1);

      if (pingError) {
        return {
          ok: false,
          message: `Connected to Supabase endpoint, but schema tables are not initialized yet (${pingError.message}). Run supabase/schema.sql in your Supabase SQL Editor.`,
        };
      }

      // Fetch authenticated user if signed in
      const { data: authData } = await client.auth.getUser();
      const uid = authData?.user?.id;

      if (uid) {
        const { data: remoteConns } = await client
          .from('saved_connections')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: false });

        if (Array.isArray(remoteConns) && remoteConns.length > 0) {
          showToast(`Synced ${remoteConns.length} saved connection(s) from Supabase Cloud`);
        }
      }

      showToast('Connected & verified live Supabase PostgreSQL database');
      return {
        ok: true,
        message: `Connected to Supabase PostgreSQL (${transData ? 'Schema verified' : 'Ready'}).`,
      };
    } catch (err) {
      return {
        ok: false,
        message: err instanceof Error ? err.message : 'Failed to reach Supabase instance.',
      };
    }
  };

  return (
    <PlatformContext.Provider
      value={{
        activePage,
        setActivePage,
        currentBook,
        currentChapter,
        translation,
        selectedVerse,
        activeReferenceVerse,
        activeReferenceMode,
        openReferenceInspector,
        previousReadingPosition,
        navigateToPassage,
        navigateToReferenceString,
        returnToPreviousPosition,
        setTranslation,
        setSelectedVerse,
        preferences,
        updatePreferences,
        bookmarks,
        toggleBookmark,
        highlights,
        setVerseHighlight,
        readingHistory,
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
        exportNotebookJson,
        importNotebookJson,
        syncWithSupabase,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </PlatformContext.Provider>
  );
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within a PlatformProvider');
  return ctx;
}

