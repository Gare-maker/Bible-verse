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
  | 'Messianic reference'
  | 'Allusion'
  | 'Theological connection'
  | 'Thematic connection'
  | 'Parallel passage'
  | 'Historical connection';

export type BiblicalSpeakerCategory =
  | 'Words spoken by Jesus'
  | 'Words spoken by prophets'
  | 'Words spoken by apostles'
  | 'Historical narration'
  | 'Words spoken by other biblical characters';

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
  explanation?: string;
  biblicalContext?: string;
  sourceSpeaker?: BiblicalSpeakerCategory;
  targetSpeaker?: BiblicalSpeakerCategory;
  supportingRefs?: string[];
  disputedNote?: string;
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
  explanation?: string;
  biblicalContext?: string;
  primarySpeaker?: BiblicalSpeakerCategory;
  connectedSpeaker?: BiblicalSpeakerCategory;
  supportingRefs?: string[];
  disputedNote?: string;
  dataSource: string;
  verificationStatus: 'verified' | 'ai_suggested' | 'user_created';
}

export interface BiblicalTypeShadow {
  id: string;
  title: string;
  otTypeRef: string;
  ntAntitypeRef: string;
  typeName: string;
  fulfilmentName: string;
  explanation: string;
  biblicalContext?: string;
  typologyBasis?:
    | 'Explicitly Identified by Jesus'
    | 'Explicitly Established by Scripture'
    | 'Strongly Supported Scriptural Typology';
  otSpeaker?: BiblicalSpeakerCategory;
  ntSpeaker?: BiblicalSpeakerCategory;
  supportingRefs?: string[];
  disputedNote?: string;
  historicalSource: string;
}

export interface BiblicalInference {
  id: string;
  verseRef: string;
  title: string;
  explicitStatement: string;
  inferredConclusion: string;
  reasoningExplanation: string;
  biblicalContext?: string;
  inferenceStrength?: 'Strong Scriptural Inference' | 'Possible Interpretation';
  speakerAttribution?: BiblicalSpeakerCategory;
  disputedNote?: string;
  supportingRefs: string[];
}

export interface VerseContextData {
  targetRef: string;
  book: string;
  chapter: number;
  verse: number;
  translation: TranslationId;
  selectedVerseText: string;
  sectionHeading?: string;
  mainTheme: string;
  verseBreakdown: string[];
  verseSpecificAnalysis: string;
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
  sharedToCommunity?: boolean;
  authorName?: string;
  likesCount?: number;
  dateSaved: string;
  updatedAt: string;
}

export interface SavedContextItem {
  id: string;
  verseRef: string;
  verseText: string;
  translation: TranslationId;
  mainTheme: string;
  verseBreakdown: string[];
  contextSummary: string;
  personalNotes: string;
  collectionId?: string;
  sharedToCommunity?: boolean;
  authorName?: string;
  likesCount?: number;
  dateSaved: string;
  updatedAt: string;
}

export interface SavedVerseItem {
  id: string;
  verseRef: string;
  verseText: string;
  translation: TranslationId;
  highlightColor?: string;
  personalNotes: string;
  collectionId?: string;
  sharedToCommunity?: boolean;
  authorName?: string;
  likesCount?: number;
  dateSaved: string;
  updatedAt: string;
}

export interface SavedTypeShadowItem {
  id: string;
  title: string;
  selectedVerseRef: string;
  otTypeRef: string;
  ntAntitypeRef: string;
  otTypeText: string;
  ntAntitypeText: string;
  translation: TranslationId;
  typeName: string;
  fulfilmentName: string;
  explanation: string;
  biblicalContext?: string;
  typologyBasis?:
    | 'Explicitly Identified by Jesus'
    | 'Explicitly Established by Scripture'
    | 'Strongly Supported Scriptural Typology';
  personalNotes: string;
  collectionId?: string;
  sharedToCommunity?: boolean;
  authorName?: string;
  likesCount?: number;
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
  sharedToCommunity?: boolean;
  authorName?: string;
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
  experienceMode?: 'adult' | 'children';
  fontSize: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
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

// ============================================================================
// LEXICON & WORD STUDY TYPES (Section 4 & 4.2)
// ============================================================================
export type OriginalLanguage = 'Hebrew' | 'Greek' | 'Aramaic';

export interface LexiconWordUsageExample {
  ref: string;
  passageSnippet: string;
  translationNote: string;
}

export interface LexiconEntry {
  id: string; // e.g. "G3341-metanoia"
  englishWord: string; // e.g. "Repentance"
  originalSpelling: string; // e.g. "μετάνοια"
  language: OriginalLanguage; // 'Greek' | 'Hebrew' | 'Aramaic'
  transliteration: string; // e.g. "Metanoia"
  pronunciation?: string; // e.g. "meh-TAH-noy-ah"
  strongsNumber?: string; // e.g. "G3341"
  partOfSpeech: string; // e.g. "Noun, Feminine"
  rootWordAndRelatedForms: string; // e.g. "From μετά (meta, denoting change) and νοέω (noeō, to exercise the mind)"
  lexicalDefinition: string; // e.g. "A change of mind, disposition, and purposeful orientation..."
  etymologyAndOrigin: string; // e.g. "Derived from the preposition meta (after/with) + nous (mind)..."
  contextualMeaning: string; // e.g. "In the New Testament, not merely remorse, but a transformative turn toward God..."
  biblicalOccurrences: number; // e.g. 22
  relevantReferences: string[]; // e.g. ["Acts 2:38", "Matthew 3:2", "2 Corinthians 7:10"]
  examplesOfUsage: LexiconWordUsageExample[];
  sourceAttribution: string; // e.g. "Thayer's Greek-English Lexicon & Strong's Exhaustive Concordance"
  relatedEnglishWords?: string[]; // e.g. ["Conversion", "Turning", "Shuv"]
  distinctionNote?: string; // e.g. distinction between agape, phileo, philia, eros
}

// ============================================================================
// INTERPRETATION LEARNING CENTRE TYPES (Sections 2, 3, 5, 6, 7, 8)
// ============================================================================
export interface InterpretationMethod {
  id: string;
  number: number;
  name: string; // e.g. "Literal Interpretation"
  slug: string;
  shortSummary: string;
  definition: string;
  detailedExplanation: string;
  howItWorks: string[];
  biblicalExamples: {
    title: string;
    passage: string;
    explanation: string;
  }[];
  relevantBibleReferences: string[];
  practicalApplication: string;
  relatedMethods: string[];
  sourceAttribution: string;
}

export interface EssentialConcept {
  id: string;
  name: string;
  greekOrHebrewOrigin?: string;
  definition: string;
  importance: string;
  howItWorks: string;
  practicalDemonstration?: {
    passage: string;
    stepByStep: string[];
  };
  keySubtopics?: {
    title: string;
    description: string;
    references: string[];
  }[];
  scriptureReferences: string[];
  sourceAttribution: string;
}

export interface InterpretationPrinciple {
  number: number;
  name: string;
  role: string;
  explanation: string;
  complementaryAspect: string;
}

// ============================================================================
// CONTEXTUAL SCRIPTURE INTERPRETATION TYPES (Section 9, 10, 11, 12)
// ============================================================================
export interface ScriptureInterpretationWord {
  englishWord: string;
  originalSpelling: string;
  language: OriginalLanguage;
  transliteration: string;
  strongsNumber?: string;
  partOfSpeech: string;
  meaning: string;
  contextualUsage: string;
  lexiconEntryId?: string;
}

export interface ScriptureCrossReferenceDetail {
  ref: string;
  relevanceExplanation: string;
  category: ReferenceCategory;
}

export interface ContextualInterpretationData {
  canonicalRef: string; // e.g. "John 3:5"
  chapterScope?: string; // e.g. "John 3:1-10"
  availableTags: (
    | 'Historical Context'
    | 'Contextual Explanation'
    | 'Theological Interpretation'
    | 'Original Words'
    | 'Cross References'
    | 'Literary and Cultural'
    | 'Typology and Symbolism'
  )[];
  historicalContext: {
    author: string;
    originalAudience: string;
    dateWritten: string;
    historicalCircumstances: string;
    politicalReligiousSocialConditions: string;
    historicalEventsExplanation: string;
    sourceAttribution: string;
  };
  contextualExplanation: {
    beforePassage: string;
    afterPassage: string;
    mainSubject: string;
    authorsIntendedMessage: string;
    chapterAndBookFit: string;
    sourceAttribution: string;
  };
  theologicalInterpretation: {
    coreTheologicalThemes: string[];
    explanation: string;
    traditionsAndPerspectives?: {
      tradition: string;
      perspective: string;
    }[];
    disputedInterpretationsNote?: string;
    sourceAttribution: string;
  };
  originalLanguageWords: ScriptureInterpretationWord[];
  crossReferences: ScriptureCrossReferenceDetail[];
  literaryAndCulturalContext?: {
    genre: string;
    figuresOfSpeechAndIdioms: string;
    jewishCustomsAndTraditions: string;
    socialStructures: string;
    sourceAttribution: string;
  };
  typologyAndSymbolism?: {
    typesAndShadowsIdentified: string;
    propheticConnections: string;
    supportingReferences: string[];
    sourceAttribution: string;
  };
}

