export type TranslationId = 'NIV' | 'KJV' | 'ESV' | 'NKJV' | 'NLT' | 'ASV';

export type InspectorMode = 'reference' | 'context' | 'ai' | 'compare';

export interface BibleTranslation {
  id: TranslationId;
  name: string;
  abbreviation: TranslationId;
  year: string;
  description: string;
  licenseInfo: string;
}

export type Testament = 'OT' | 'NT';

export interface BibleBook {
  id: number;
  slug: string;
  name: string;
  abbreviation: string;
  testament: Testament;
  category: string;
  chapters: number;
}

export type ReferenceCategory =
  | 'Direct quotation'
  | 'Prophecy'
  | 'Prophecy fulfilment'
  | 'Allusion'
  | 'Thematic connection'
  | 'Parallel passage'
  | 'Historical connection';

export interface VerseData {
  book: string;
  chapter: number;
  verse: number;
  canonicalRef: string; // e.g., "Matthew 1:23"
  translations: Record<TranslationId, string>;
  heading?: string;
  isRedLetter?: boolean;
  footnote?: string;
  isPoetry?: boolean;
}

export interface CrossReferenceRecord {
  id: string;
  sourceRef: string;
  targetRef: string;
  sourceToTargetCategory: ReferenceCategory;
  targetToSourceCategory: ReferenceCategory;
  title: string;
  connectionSummary: string;
  dataSource: string;
  verificationStatus: 'verified' | 'ai_suggested' | 'user_created';
}

export interface ResolvedCrossReference {
  id: string;
  primaryRef: string;
  connectedRef: string;
  category: ReferenceCategory;
  connectionLabel: string;
  directionLabel: string;
  title: string;
  dataSource: string;
  verificationStatus: 'verified' | 'ai_suggested' | 'user_created';
}

export interface VerseContextData {
  targetRef: string;
  book: string;
  chapter: number;
  verse: number;
  translation: TranslationId;
  bookAuthorAndDate: string;
  previousChapterRef: string;
  previousChapterSummary: string;
  previousChapterKeyVerses: { ref: string; text: string }[];
  leadingVersesInChapter: { ref: string; text: string }[];
  followingVersesInChapter: { ref: string; text: string }[];
  howPreviousChapterLeadsHere: string;
  immediateLiteraryContext: string;
  verifiedCrossReferences: {
    ref: string;
    category: ReferenceCategory;
    title: string;
    text: string;
    dataSource: string;
  }[];
  chapterCrossReferences: {
    sourceVerseRef: string;
    connectedRef: string;
    category: ReferenceCategory;
    title: string;
  }[];
}

export interface AIExplanationData {
  id: string;
  primaryRef: string;
  connectedRef?: string;
  translation: TranslationId;
  title: string;
  summary: string;
  originalContextFirst: string;
  historicalCircumstances: string;
  contextSecond?: string;
  whyReferenced?: string;
  similaritiesAndDifferences?: string;
  theologicalSignificance: string;
  lexicalStudy?: {
    term: string;
    transliteration: string;
    language: 'Hebrew' | 'Greek';
    strongs: string;
    meaning: string;
  }[];
  disputedInterpretations?: string;
  relatedReferences: string[];
  generatedAt: string;
  isAiSuggestedOnly?: boolean;
}

export interface FollowUpMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citedReferences?: string[];
  timestamp: string;
}

export interface SavedConnection {
  id: string;
  title: string;
  primaryRef: string;
  connectedRef: string;
  primaryText: string;
  connectedText: string;
  translation: TranslationId;
  category: ReferenceCategory;
  connectionLabel: string;
  verificationStatus: 'verified' | 'ai_suggested' | 'user_created';
  aiExplanation?: AIExplanationData;
  followUpThread: FollowUpMessage[];
  personalObservation: string;
  collectionId?: string;
  dateSaved: string;
  updatedAt: string;
}

export interface PersonalNote {
  id: string;
  title: string;
  content: string;
  scriptureRefs: string[];
  aiExplanation?: AIExplanationData;
  collectionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotebookCollection {
  id: string;
  name: string;
  description: string;
  color: string;
  iconName?: string;
  createdAt: string;
}

export interface UserPreferences {
  defaultTranslation: TranslationId;
  theme: 'dark' | 'light';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  redLetterEnabled: boolean;
  showReferenceBadges: boolean;
  userName: string;
  userEmail: string;
  deviceId: string;
  preferredVoiceName?: string;
}

export interface ReadingHistoryEntry {
  book: string;
  chapter: number;
  translation: TranslationId;
  timestamp: string;
}
