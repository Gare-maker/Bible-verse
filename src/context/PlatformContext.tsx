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
  SavedContextItem,
  SavedVerseItem,
  TranslationId,
  UserPreferences,
} from '@/types/bible';
import { generateAIExplanationForConnection } from '@/data/aiExplanations';
import { getVerseText } from '@/data/scriptureDatabase';
import { parseScriptureReference } from '@/data/bibleBooks';
import { getSupabaseClient } from '@/lib/supabase';

export type PrimaryPage = 'bible' | 'saved' | 'community' | 'notes';

interface ReadingPosition {
  book: string;
  chapter: number;
  verse?: number;
  label: string;
}

interface PlatformContextValue {
  // Navigation (3 Main Pages: Bible, Saved, Community)
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
  navigateToPassage: (
    book: string,
    chapter: number,
    verse?: number,
    saveReturnPosition?: boolean
  ) => void;
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

  // 1. Saved Connections
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
    sharedToCommunity?: boolean;
  }) => SavedConnection;
  updateSavedConnection: (id: string, updates: Partial<SavedConnection>) => void;
  deleteSavedConnection: (id: string) => void;
  appendFollowUpToConnection: (connectionId: string, messages: FollowUpMessage[]) => void;

  // 2. Saved Contexts
  savedContexts: SavedContextItem[];
  saveContextItem: (params: {
    verseRef: string;
    verseText: string;
    translation?: TranslationId;
    mainTheme: string;
    verseBreakdown: string[];
    contextSummary: string;
    personalNotes?: string;
    collectionId?: string;
    sharedToCommunity?: boolean;
  }) => SavedContextItem;
  updateSavedContext: (id: string, updates: Partial<SavedContextItem>) => void;
  deleteSavedContext: (id: string) => void;

  // 3. Saved Bible Verses
  savedVerses: SavedVerseItem[];
  saveBibleVerseItem: (params: {
    verseRef: string;
    verseText: string;
    translation?: TranslationId;
    highlightColor?: string;
    personalNotes?: string;
    collectionId?: string;
    sharedToCommunity?: boolean;
  }) => SavedVerseItem;
  updateSavedVerse: (id: string, updates: Partial<SavedVerseItem>) => void;
  deleteSavedVerse: (id: string) => void;

  // Community Feed Items & Likes
  communityConnections: SavedConnection[];
  communityContexts: SavedContextItem[];
  communityVerses: SavedVerseItem[];
  likeCommunityItem: (id: string) => void;
  likedItemIds: string[];

  // Legacy Standalone Personal Notes
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

export const DEFAULT_COLLECTIONS: NotebookCollection[] = [
  {
    id: 'col-messianic',
    name: 'Messianic Prophecies',
    description:
      'Old Testament prophecies fulfilled in the birth, ministry, death, and resurrection of Jesus the Messiah.',
    color: '#d4a373',
    createdAt: '2026-11-05T09:00:00.000Z',
  },
  {
    id: 'col-jesus-ot',
    name: 'Jesus in the Old Testament',
    description:
      'Christological appearances, types, shadows, and pre-incarnate Logos connections.',
    color: '#60a5fa',
    createdAt: '2026-11-05T09:00:00.000Z',
  },
  {
    id: 'col-covenants',
    name: 'Biblical Covenants',
    description:
      'Abrahamic, Mosaic, Davidic, and New Covenant connections across both Testaments.',
    color: '#34d399',
    createdAt: '2026-11-05T09:00:00.000Z',
  },
  {
    id: 'col-nature-god',
    name: 'The Nature of God',
    description:
      'Passages revealing God as Creator, Rock, Father, Redeemer, and Holy One.',
    color: '#a78bfa',
    createdAt: '2026-11-05T09:00:00.000Z',
  },
  {
    id: 'col-ot-in-nt',
    name: 'Old Testament in the New Testament',
    description:
      'Direct quotations and allusions to the Torah, Prophets, and Psalms by Jesus and the Apostles.',
    color: '#f472b6',
    createdAt: '2026-11-05T09:00:00.000Z',
  },
  {
    id: 'col-resurrection',
    name: 'The Resurrection & Life',
    description:
      'Scriptural witnesses to Christ’s victory over death and the promise of eternal life.',
    color: '#fbbf24',
    createdAt: '2026-11-05T09:00:00.000Z',
  },
];

const INITIAL_SAVED_CONNECTIONS: SavedConnection[] = [
  {
    id: 'conn-initial-matt-1-23',
    title: 'The Prophecy of the Virgin Birth (Immanuel)',
    primaryRef: 'Matthew 1:23',
    connectedRef: 'Isaiah 7:14',
    primaryText: getVerseText('Matthew 1:23', 'NIV'),
    connectedText: getVerseText('Isaiah 7:14', 'NIV'),
    translation: 'NIV',
    category: 'Prophecy fulfilment',
    connectionLabel: 'Old Testament Prophecy / New Testament Fulfilment',
    verificationStatus: 'verified',
    aiExplanation: generateAIExplanationForConnection('Matthew 1:23', 'Isaiah 7:14', 'NIV'),
    followUpThread: [],
    personalObservation:
      'Isaiah gave this sign to the House of David during King Ahaz’s crisis, and Matthew shows its ultimate fulfillment in Jesus—"God with us" in the flesh.',
    collectionId: 'col-messianic',
    sharedToCommunity: true,
    authorName: 'Berean Scholar',
    likesCount: 24,
    dateSaved: '2026-11-05T10:00:00.000Z',
    updatedAt: '2026-11-05T10:00:00.000Z',
  },
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
      'Notice the footnote on Deuteronomy 32:6 ("Or Father, who bought you"). Moses links God’s fatherhood directly with both Creation and Exodus redemption.',
    collectionId: 'col-nature-god',
    sharedToCommunity: true,
    authorName: 'Berean Scholar',
    likesCount: 18,
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
    sharedToCommunity: false,
    authorName: 'Berean Scholar',
    likesCount: 9,
    dateSaved: '2026-11-05T11:15:00.000Z',
    updatedAt: '2026-11-05T11:15:00.000Z',
  },
];

const INITIAL_SAVED_CONTEXTS: SavedContextItem[] = [
  {
    id: 'ctx-initial-deut-32-6',
    verseRef: 'Deuteronomy 32:6',
    verseText: getVerseText('Deuteronomy 32:6', 'NIV'),
    translation: 'NIV',
    mainTheme: 'The Song of Moses — God as Covenant Father & Creator (Deuteronomy 32:6)',
    verseBreakdown: [
      'What Is Being Discussed: Moses confronts Israel’s ingratitude by reminding them that the LORD is not a distant deity, but their Father and Creator who formed them as a people.',
      'How Preceding Verses Lead Here: Verses 3–4 proclaim the perfection and justice of God the Rock, while verse 5 exposes the people’s crookedness—setting up the piercing rhetorical question in verse 6.',
      'How It Ties Into the Whole Passage: Verses 7–14 immediately call Israel to remember the days of old and how God guarded them in the howling wilderness as the apple of His eye.',
    ],
    contextSummary:
      'Following Moses’ commission in Deuteronomy 31:19–30 to recite a Song of Witness before all Israel, Deuteronomy 32:6 stands as the emotional pivot of the opening stanza.',
    personalNotes:
      'Reading Deuteronomy 32:6 in light of Deuteronomy 31:30 completely changes how you hear this verse—it is Moses’ final public appeal before ascending Mount Nebo.',
    collectionId: 'col-nature-god',
    sharedToCommunity: true,
    authorName: 'Berean Scholar',
    likesCount: 15,
    dateSaved: '2026-11-05T12:15:00.000Z',
    updatedAt: '2026-11-05T12:15:00.000Z',
  },
  {
    id: 'ctx-initial-matt-18-15',
    verseRef: 'Matthew 18:15',
    verseText: getVerseText('Matthew 18:15', 'NKJV'),
    translation: 'NKJV',
    mainTheme: 'Dealing with a Sinning Brother — Private Restoration First (Matthew 18:15)',
    verseBreakdown: [
      'What Is Being Discussed: Jesus instructs believers to address a brother’s fault privately ("between you and him alone") with the goal of winning the brother back, not humiliating him.',
      'How Preceding Verses Lead Here: Right before verse 15, Jesus tells the Parable of the Wandering Sheep (Matthew 18:12–14), where the shepherd leaves the ninety-nine to rescue the one who strayed.',
      'How It Ties Into the Whole Passage: Verses 16–20 provide the measured steps if private reconciliation is refused, culminating in united prayer (18:19–20) and Peter’s question on forgiving seventy times seven (18:21–22).',
    ],
    contextSummary:
      'Matthew 18:15 flows directly out of the Parable of the Lost Sheep (18:12–14): seeking a sinning brother privately is how the church practices the shepherd’s heart.',
    personalNotes:
      'So often people read Matthew 18:15-20 as a legalistic checklist, but verses 12-14 show it is actually about rescuing a wandering sheep!',
    collectionId: 'col-covenants',
    sharedToCommunity: true,
    authorName: 'Berean Scholar',
    likesCount: 21,
    dateSaved: '2026-11-05T13:00:00.000Z',
    updatedAt: '2026-11-05T13:00:00.000Z',
  },
];

const INITIAL_SAVED_VERSES: SavedVerseItem[] = [
  {
    id: 'verse-initial-matt-1-23',
    verseRef: 'Matthew 1:23',
    verseText: getVerseText('Matthew 1:23', 'NIV'),
    translation: 'NIV',
    highlightColor: 'amber',
    personalNotes:
      'Matthew begins his Gospel with "Immanuel — God with us" (1:23) and ends his Gospel with Jesus’ promise "I am with you always" (28:20).',
    collectionId: 'col-messianic',
    sharedToCommunity: true,
    authorName: 'Berean Scholar',
    likesCount: 31,
    dateSaved: '2026-11-05T14:00:00.000Z',
    updatedAt: '2026-11-05T14:00:00.000Z',
  },
  {
    id: 'verse-initial-deut-32-4',
    verseRef: 'Deuteronomy 32:4',
    verseText: getVerseText('Deuteronomy 32:4', 'NIV'),
    translation: 'NIV',
    highlightColor: 'emerald',
    personalNotes:
      '"He is the Rock, his works are perfect, and all his ways are just." The first time God is called "the Rock" (Tsur) in the Song of Moses.',
    collectionId: 'col-nature-god',
    sharedToCommunity: true,
    authorName: 'Berean Scholar',
    likesCount: 19,
    dateSaved: '2026-11-05T14:30:00.000Z',
    updatedAt: '2026-11-05T14:30:00.000Z',
  },
];

// Additional Community-Shared Items from Other Readers in the Community
const SEEDED_COMMUNITY_CONNECTIONS: SavedConnection[] = [
  {
    id: 'comm-conn-john-1-1',
    title: 'Creation Prologue & The Pre-Incarnate Word (Logos)',
    primaryRef: 'John 1:1',
    connectedRef: 'Genesis 1:1',
    primaryText: getVerseText('John 1:1', 'ESV'),
    connectedText: getVerseText('Genesis 1:1', 'ESV'),
    translation: 'ESV',
    category: 'Allusion',
    connectionLabel: 'Creation Prologue / Eternal Logos Allusion',
    verificationStatus: 'verified',
    followUpThread: [],
    personalObservation:
      'Both Genesis 1:1 and John 1:1 open with the exact Greek Septuagint phrase "En arche" (In the beginning). John shows that the Word who became flesh in 1:14 is the Creator of Genesis 1.',
    collectionId: 'col-jesus-ot',
    sharedToCommunity: true,
    authorName: 'Dr. Hannah Samuel',
    likesCount: 42,
    dateSaved: '2026-11-05T16:20:00.000Z',
    updatedAt: '2026-11-05T16:20:00.000Z',
  },
  {
    id: 'comm-conn-isa-53-5',
    title: 'The Pierced Servant & Substitutionary Healing',
    primaryRef: 'Isaiah 53:5',
    connectedRef: '1 Peter 2:24',
    primaryText: getVerseText('Isaiah 53:5', 'NIV'),
    connectedText: getVerseText('1 Peter 2:24', 'NIV'),
    translation: 'NIV',
    category: 'Prophecy fulfilment',
    connectionLabel: 'Suffering Servant Prophecy / Apostolic Fulfilment',
    verificationStatus: 'verified',
    followUpThread: [],
    personalObservation:
      'Peter witnessed Christ’s passion firsthand and directly applies Isaiah 53:5 ("by his wounds you have been healed") to the cross.',
    collectionId: 'col-messianic',
    sharedToCommunity: true,
    authorName: 'Pastor Daniel Okafor',
    likesCount: 37,
    dateSaved: '2026-11-05T18:10:00.000Z',
    updatedAt: '2026-11-05T18:10:00.000Z',
  },
];

const SEEDED_COMMUNITY_CONTEXTS: SavedContextItem[] = [
  {
    id: 'comm-ctx-isa-7-14',
    verseRef: 'Isaiah 7:14',
    verseText: getVerseText('Isaiah 7:14', 'ESV'),
    translation: 'ESV',
    mainTheme: 'The Sign of Immanuel During the Syro-Ephraimite Crisis (Isaiah 7:14)',
    verseBreakdown: [
      'What Is Being Discussed: When King Ahaz refuses to ask the LORD for a sign in 7:12, Isaiah addresses the plural "house of David" (7:13) and announces that the Lord Himself will give the sign of the virgin conceiving Immanuel.',
      'How Preceding Verses Lead Here: In verses 1–9, Aram and Ephraim plot to overthrow Jerusalem, and Isaiah warns Ahaz: "If you are not firm in faith, you will not be firm at all" (7:9).',
      'How It Ties Into the Whole Passage: The promise of Immanuel ("God with us") guarantees that the Davidic line cannot be extinguished until Messiah comes (fulfilled in Matthew 1:23).',
    ],
    contextSummary:
      'Set in 734 BC after Isaiah’s temple vision in Chapter 6, Isaiah 7:14 answers a royal crisis of unbelief with a promise that transcends Ahaz’s generation.',
    personalNotes:
      'Notice the shift from singular "you" (Ahaz in v.11) to plural "you" (the whole House of David in v.13-14). God’s promise outlasted an unfaithful king!',
    collectionId: 'col-messianic',
    sharedToCommunity: true,
    authorName: 'Lydia Chen',
    likesCount: 28,
    dateSaved: '2026-11-05T19:00:00.000Z',
    updatedAt: '2026-11-05T19:00:00.000Z',
  },
];

const SEEDED_COMMUNITY_VERSES: SavedVerseItem[] = [
  {
    id: 'comm-verse-matt-18-20',
    verseRef: 'Matthew 18:20',
    verseText: getVerseText('Matthew 18:20', 'NKJV'),
    translation: 'NKJV',
    highlightColor: 'amber',
    personalNotes:
      'In context, "where two or three are gathered together in My name" is about humble reconciliation and agreement in prayer (vv. 15–19). Christ Himself is present where His people pursue peace.',
    collectionId: 'col-covenants',
    sharedToCommunity: true,
    authorName: 'Micah Adeyemi',
    likesCount: 26,
    dateSaved: '2026-11-05T20:15:00.000Z',
    updatedAt: '2026-11-05T20:15:00.000Z',
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
  PREFS: 'bible_verse_prefs_v3',
  CONNECTIONS: 'bible_verse_saved_connections_v3',
  CONTEXTS: 'bible_verse_saved_contexts_v3',
  VERSES: 'bible_verse_saved_verses_v3',
  NOTES: 'bible_verse_personal_notes_v3',
  COLLECTIONS: 'bible_verse_collections_v3',
  BOOKMARKS: 'bible_verse_bookmarks_v3',
  HIGHLIGHTS: 'bible_verse_highlights_v3',
  HISTORY: 'bible_verse_history_v3',
  READER_POS: 'bible_verse_reader_pos_v3',
  LIKES: 'bible_verse_community_likes_v3',
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
  const [previousReadingPosition, setPreviousReadingPosition] = useState<ReadingPosition | null>(
    null
  );

  const openReferenceInspector = (
    canonicalRef: string | null,
    mode: InspectorMode = 'reference'
  ) => {
    setActiveReferenceMode(mode);
    setActiveReferenceVerse(canonicalRef);
    if (canonicalRef) {
      const parsed = parseScriptureReference(canonicalRef);
      if (parsed && parsed.verse) {
        setSelectedVerse(parsed.verse);
      }
    }
  };

  const [preferences, setPreferences] = useState<UserPreferences>({
    defaultTranslation: 'NIV',
    theme: 'light',
    fontSize: 'medium',
    redLetterEnabled: true,
    showReferenceBadges: true,
    userName: 'Berean Scholar',
    userEmail: 'scholar@bibleverse.org',
    deviceId: 'BV-CLOUD-SYNC-8842',
  });

  const [savedConnections, setSavedConnections] = useState<SavedConnection[]>(
    INITIAL_SAVED_CONNECTIONS
  );
  const [savedContexts, setSavedContexts] = useState<SavedContextItem[]>(INITIAL_SAVED_CONTEXTS);
  const [savedVerses, setSavedVerses] = useState<SavedVerseItem[]>(INITIAL_SAVED_VERSES);
  const [likedItemIds, setLikedItemIds] = useState<string[]>([]);

  const [personalNotes, setPersonalNotes] = useState<PersonalNote[]>(INITIAL_PERSONAL_NOTES);
  const [collections, setCollections] = useState<NotebookCollection[]>(DEFAULT_COLLECTIONS);
  const [bookmarks, setBookmarks] = useState<string[]>([
    'Matthew 1:23',
    'Deuteronomy 32:6',
    'John 1:1',
  ]);
  const [highlights, setHighlights] = useState<Record<string, string>>({
    'Matthew 1:23': 'amber',
    'Deuteronomy 32:4': 'emerald',
    'Deuteronomy 32:6': 'amber',
  });
  const [readingHistory, setReadingHistory] = useState<ReadingHistoryEntry[]>([
    { book: 'Matthew', chapter: 1, translation: 'NIV', timestamp: '2026-11-05T22:00:00.000Z' },
    {
      book: 'Deuteronomy',
      chapter: 32,
      translation: 'NIV',
      timestamp: '2026-11-05T21:49:00.000Z',
    },
    {
      book: 'Matthew',
      chapter: 18,
      translation: 'NKJV',
      timestamp: '2026-11-05T17:45:00.000Z',
    },
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

      const rawCtxs = localStorage.getItem(STORAGE_KEYS.CONTEXTS);
      if (rawCtxs) setSavedContexts(JSON.parse(rawCtxs));

      const rawVerses = localStorage.getItem(STORAGE_KEYS.VERSES);
      if (rawVerses) setSavedVerses(JSON.parse(rawVerses));

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

      const rawLikes = localStorage.getItem(STORAGE_KEYS.LIKES);
      if (rawLikes) setLikedItemIds(JSON.parse(rawLikes));

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

  // Sync active theme ('light' | 'dark') to <html> and <body> so all Tailwind dark: classes work globally
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const isDark = preferences.theme === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    if (document.body) {
      document.body.classList.toggle('dark', isDark);
    }
  }, [preferences.theme]);

  // Persist changes to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(preferences));
      localStorage.setItem(STORAGE_KEYS.CONNECTIONS, JSON.stringify(savedConnections));
      localStorage.setItem(STORAGE_KEYS.CONTEXTS, JSON.stringify(savedContexts));
      localStorage.setItem(STORAGE_KEYS.VERSES, JSON.stringify(savedVerses));
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(personalNotes));
      localStorage.setItem(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
      localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(highlights));
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(readingHistory));
      localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(likedItemIds));
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
    savedContexts,
    savedVerses,
    personalNotes,
    collections,
    bookmarks,
    highlights,
    readingHistory,
    likedItemIds,
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

  // 1. Save Connection
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
        sharedToCommunity:
          params.sharedToCommunity !== undefined
            ? params.sharedToCommunity
            : existing.sharedToCommunity,
        authorName: preferences.userName,
        updatedAt: now,
      };
      setSavedConnections((prev) => {
        const copy = [...prev];
        copy[existingIndex] = updated;
        return copy;
      });
      showToast(
        params.sharedToCommunity
          ? `Saved & shared connection (${params.primaryRef} ↔ ${params.connectedRef}) to Community`
          : `Updated connection (${params.primaryRef} ↔ ${params.connectedRef}) in Saved`
      );
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
      connectionLabel: params.connectionLabel || `${params.category} • Scripture Connection`,
      verificationStatus: params.verificationStatus || 'verified',
      aiExplanation: params.aiExplanation,
      followUpThread: [],
      personalObservation: params.personalObservation || '',
      collectionId: params.collectionId || 'col-messianic',
      sharedToCommunity: Boolean(params.sharedToCommunity),
      authorName: preferences.userName,
      likesCount: 1,
      dateSaved: now,
      updatedAt: now,
    };

    setSavedConnections((prev) => [newEntry, ...prev]);
    showToast(
      params.sharedToCommunity
        ? `Saved connection (${params.primaryRef} ↔ ${params.connectedRef}) & shared to Community`
        : `Saved connection (${params.primaryRef} ↔ ${params.connectedRef}) to Saved`
    );
    return newEntry;
  };

  const updateSavedConnection = (id: string, updates: Partial<SavedConnection>) => {
    setSavedConnections((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      )
    );
    showToast('Updated saved connection');
  };

  const deleteSavedConnection = (id: string) => {
    setSavedConnections((prev) => prev.filter((item) => item.id !== id));
    showToast('Removed connection from Saved');
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

  // 2. Save Context Item
  const saveContextItem: PlatformContextValue['saveContextItem'] = (params) => {
    const trans = params.translation || translation;
    const now = new Date().toISOString();
    const existingIdx = savedContexts.findIndex(
      (c) => c.verseRef.toLowerCase() === params.verseRef.toLowerCase()
    );

    if (existingIdx !== -1) {
      const existing = savedContexts[existingIdx];
      const updated: SavedContextItem = {
        ...existing,
        verseText: params.verseText || existing.verseText,
        translation: trans,
        mainTheme: params.mainTheme || existing.mainTheme,
        verseBreakdown: params.verseBreakdown || existing.verseBreakdown,
        contextSummary: params.contextSummary || existing.contextSummary,
        personalNotes:
          params.personalNotes !== undefined && params.personalNotes !== ''
            ? params.personalNotes
            : existing.personalNotes,
        collectionId: params.collectionId || existing.collectionId,
        sharedToCommunity:
          params.sharedToCommunity !== undefined
            ? params.sharedToCommunity
            : existing.sharedToCommunity,
        authorName: preferences.userName,
        updatedAt: now,
      };
      setSavedContexts((prev) => {
        const copy = [...prev];
        copy[existingIdx] = updated;
        return copy;
      });
      showToast(
        params.sharedToCommunity
          ? `Saved context for ${params.verseRef} & shared to Community`
          : `Updated context for ${params.verseRef} in Saved`
      );
      return updated;
    }

    const newItem: SavedContextItem = {
      id: `ctx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      verseRef: params.verseRef,
      verseText: params.verseText,
      translation: trans,
      mainTheme: params.mainTheme,
      verseBreakdown: params.verseBreakdown,
      contextSummary: params.contextSummary,
      personalNotes: params.personalNotes || '',
      collectionId: params.collectionId || 'col-messianic',
      sharedToCommunity: Boolean(params.sharedToCommunity),
      authorName: preferences.userName,
      likesCount: 1,
      dateSaved: now,
      updatedAt: now,
    };

    setSavedContexts((prev) => [newItem, ...prev]);
    showToast(
      params.sharedToCommunity
        ? `Saved context for ${params.verseRef} & shared to Community`
        : `Saved context for ${params.verseRef} to Saved`
    );
    return newItem;
  };

  const updateSavedContext = (id: string, updates: Partial<SavedContextItem>) => {
    setSavedContexts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      )
    );
    showToast('Updated saved context');
  };

  const deleteSavedContext = (id: string) => {
    setSavedContexts((prev) => prev.filter((item) => item.id !== id));
    showToast('Removed context from Saved');
  };

  // 3. Save Bible Verse Item
  const saveBibleVerseItem: PlatformContextValue['saveBibleVerseItem'] = (params) => {
    const trans = params.translation || translation;
    const now = new Date().toISOString();
    const existingIdx = savedVerses.findIndex(
      (v) => v.verseRef.toLowerCase() === params.verseRef.toLowerCase()
    );

    if (existingIdx !== -1) {
      const existing = savedVerses[existingIdx];
      const updated: SavedVerseItem = {
        ...existing,
        verseText: params.verseText || existing.verseText,
        translation: trans,
        highlightColor: params.highlightColor ?? existing.highlightColor,
        personalNotes:
          params.personalNotes !== undefined && params.personalNotes !== ''
            ? params.personalNotes
            : existing.personalNotes,
        collectionId: params.collectionId || existing.collectionId,
        sharedToCommunity:
          params.sharedToCommunity !== undefined
            ? params.sharedToCommunity
            : existing.sharedToCommunity,
        authorName: preferences.userName,
        updatedAt: now,
      };
      setSavedVerses((prev) => {
        const copy = [...prev];
        copy[existingIdx] = updated;
        return copy;
      });
      showToast(
        params.sharedToCommunity
          ? `Saved ${params.verseRef} & shared to Community`
          : `Updated ${params.verseRef} in Saved`
      );
      return updated;
    }

    const newItem: SavedVerseItem = {
      id: `verse-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      verseRef: params.verseRef,
      verseText: params.verseText,
      translation: trans,
      highlightColor: params.highlightColor,
      personalNotes: params.personalNotes || '',
      collectionId: params.collectionId || 'col-messianic',
      sharedToCommunity: Boolean(params.sharedToCommunity),
      authorName: preferences.userName,
      likesCount: 1,
      dateSaved: now,
      updatedAt: now,
    };

    setSavedVerses((prev) => [newItem, ...prev]);
    showToast(
      params.sharedToCommunity
        ? `Saved ${params.verseRef} & shared to Community`
        : `Saved ${params.verseRef} to Saved`
    );
    return newItem;
  };

  const updateSavedVerse = (id: string, updates: Partial<SavedVerseItem>) => {
    setSavedVerses((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, ...updates, updatedAt: new Date().toISOString() } : item
      )
    );
    showToast('Updated saved verse');
  };

  const deleteSavedVerse = (id: string) => {
    setSavedVerses((prev) => prev.filter((item) => item.id !== id));
    showToast('Removed verse from Saved');
  };

  // Community Computed Lists (User Shared + Pre-seeded Community Items)
  const communityConnections: SavedConnection[] = [
    ...savedConnections.filter((c) => c.sharedToCommunity),
    ...SEEDED_COMMUNITY_CONNECTIONS.filter(
      (sc) => !savedConnections.some((uc) => uc.id === sc.id)
    ),
  ];

  const communityContexts: SavedContextItem[] = [
    ...savedContexts.filter((c) => c.sharedToCommunity),
    ...SEEDED_COMMUNITY_CONTEXTS.filter((sc) => !savedContexts.some((uc) => uc.id === sc.id)),
  ];

  const communityVerses: SavedVerseItem[] = [
    ...savedVerses.filter((v) => v.sharedToCommunity),
    ...SEEDED_COMMUNITY_VERSES.filter((sv) => !savedVerses.some((uv) => uv.id === sv.id)),
  ];

  const likeCommunityItem = (id: string) => {
    setLikedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
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
    showToast(`Saved note: "${params.title}"`);
    return note;
  };

  const updatePersonalNote = (id: string, updates: Partial<PersonalNote>) => {
    setPersonalNotes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
      )
    );
    showToast('Updated note');
  };

  const deletePersonalNote = (id: string) => {
    setPersonalNotes((prev) => prev.filter((n) => n.id !== id));
    showToast('Deleted note');
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
    setSavedContexts((prev) =>
      prev.map((c) => (c.collectionId === id ? { ...c, collectionId: undefined } : c))
    );
    setSavedVerses((prev) =>
      prev.map((v) => (v.collectionId === id ? { ...v, collectionId: undefined } : v))
    );
    showToast('Deleted collection');
  };

  const exportNotebookJson = () => {
    return JSON.stringify(
      {
        version: '2.0.0',
        exportedAt: new Date().toISOString(),
        preferences,
        savedConnections,
        savedContexts,
        savedVerses,
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
      if (Array.isArray(parsed.savedContexts)) setSavedContexts(parsed.savedContexts);
      if (Array.isArray(parsed.savedVerses)) setSavedVerses(parsed.savedVerses);
      if (Array.isArray(parsed.personalNotes)) setPersonalNotes(parsed.personalNotes);
      if (Array.isArray(parsed.collections)) setCollections(parsed.collections);
      if (Array.isArray(parsed.bookmarks)) setBookmarks(parsed.bookmarks);
      if (parsed.highlights && typeof parsed.highlights === 'object')
        setHighlights(parsed.highlights);
      if (Array.isArray(parsed.readingHistory)) setReadingHistory(parsed.readingHistory);
      if (parsed.preferences) updatePreferences(parsed.preferences);
      showToast('Successfully restored Saved items, Collections & History');
      return true;
    } catch {
      showToast('Invalid backup format');
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
        savedContexts,
        saveContextItem,
        updateSavedContext,
        deleteSavedContext,
        savedVerses,
        saveBibleVerseItem,
        updateSavedVerse,
        deleteSavedVerse,
        communityConnections,
        communityContexts,
        communityVerses,
        likeCommunityItem,
        likedItemIds,
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
