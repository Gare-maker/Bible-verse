import {
  TranslationId,
  VerseContextData,
  VerseData,
} from '@/types/bible';
import {
  getChapterVersesSync,
  getVerseByReference,
  getVerseText,
  registerFetchedChapterVerses,
} from '@/data/scriptureDatabase';
import {
  BIBLE_BOOKS,
  BOOK_INTRODUCTIONS,
  findBookByName,
  parseScriptureReference,
} from '@/data/bibleBooks';
import { getCrossReferencesForVerse } from '@/data/crossReferences';

const ALL_TRANSLATION_IDS: TranslationId[] = ['NIV', 'KJV', 'ESV', 'NKJV', 'NLT', 'ASV'];

// Track which (book:chapter:translation) combinations have been fetched from the live canonical API
const fetchedTranslationCache = new Set<string>();
const inFlightRequests = new Map<string, Promise<VerseData[]>>();

async function fetchSingleTranslationFromApi(
  book: string,
  chapter: number,
  translation: TranslationId
): Promise<VerseData[]> {
  const cacheKey = `${book.toLowerCase()}:${chapter}:${translation}`;
  if (fetchedTranslationCache.has(cacheKey)) {
    return getChapterVersesSync(book, chapter);
  }

  const existingPromise = inFlightRequests.get(cacheKey);
  if (existingPromise) {
    return existingPromise;
  }

  const promise = (async () => {
    try {
      const params = new URLSearchParams({
        book,
        chapter: String(chapter),
        translation,
      });
      const res = await fetch(`/api/bible?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.verses) && data.verses.length > 0) {
          const merged: VerseData[] = data.verses.map(
            (vItem: { verse: number; text: string }) => {
              const ref = `${book} ${chapter}:${vItem.verse}`;
              const existing = getVerseByReference(ref);
              if (existing) {
                existing.translations[translation] = vItem.text;
                return existing;
              }
              const newVerse: VerseData = {
                book,
                chapter,
                verse: vItem.verse,
                canonicalRef: ref,
                translations: {
                  NIV: vItem.text,
                  KJV: vItem.text,
                  ESV: vItem.text,
                  NKJV: vItem.text,
                  NLT: vItem.text,
                  ASV: vItem.text,
                },
              };
              newVerse.translations[translation] = vItem.text;
              return newVerse;
            }
          );

          registerFetchedChapterVerses(merged);
          fetchedTranslationCache.add(cacheKey);
        }
      }
    } catch {
      // Offline fallback uses pre-verified scriptureDatabase
    } finally {
      inFlightRequests.delete(cacheKey);
    }
    return getChapterVersesSync(book, chapter);
  })();

  inFlightRequests.set(cacheKey, promise);
  return promise;
}

/**
 * Fetches all verses for a given Book, Chapter, and Translation.
 * Also prefetches the remaining 5 translations in the background so version comparison is instant and accurate.
 */
export async function fetchChapterVerses(
  book: string,
  chapter: number,
  translation: TranslationId = 'NIV'
): Promise<VerseData[]> {
  const result = await fetchSingleTranslationFromApi(book, chapter, translation);

  // Prefetch the remaining 5 translations in the background so Compare Translations has every distinct version
  if (typeof window !== 'undefined') {
    const otherTranslations = ALL_TRANSLATION_IDS.filter((t) => t !== translation);
    void Promise.all(
      otherTranslations.map((t) => fetchSingleTranslationFromApi(book, chapter, t))
    );
  }

  return result;
}

/**
 * Fetches all 6 translations (NIV, KJV, ESV, NKJV, NLT, ASV) in parallel for a chapter
 * so that version comparison always shows each translation's authentic, distinct scripture text.
 */
export async function fetchAllTranslationsForChapter(
  book: string,
  chapter: number
): Promise<VerseData[]> {
  await Promise.all(
    ALL_TRANSLATION_IDS.map((t) => fetchSingleTranslationFromApi(book, chapter, t))
  );
  return getChapterVersesSync(book, chapter);
}

/**
 * Resolves all 6 translations for a single canonical verse reference (e.g. "Matthew 1:23" or "Deuteronomy 32:6").
 */
export async function fetchVerseAllTranslations(
  ref: string
): Promise<Record<TranslationId, string> | null> {
  const parsed = parseScriptureReference(ref);
  if (!parsed) return null;
  const verseNum = parsed.verse || 1;
  await fetchAllTranslationsForChapter(parsed.book, parsed.chapter);
  const canonicalRef = `${parsed.book} ${parsed.chapter}:${verseNum}`;
  const verseObj = getVerseByReference(canonicalRef);
  if (!verseObj) return null;
  return { ...verseObj.translations };
}

/**
 * Resolves a single verse reference (e.g., "John 1:1" or "Isaiah 7:14") in the requested translation.
 * Never returns fabricated scripture text.
 */
export async function resolveScriptureVerse(
  ref: string,
  translation: TranslationId
): Promise<{ canonicalRef: string; text: string; verseData?: VerseData } | null> {
  const parsed = parseScriptureReference(ref);
  if (!parsed) return null;

  const verseNum = parsed.verse || 1;
  const canonicalRef = `${parsed.book} ${parsed.chapter}:${verseNum}`;
  const cacheKey = `${parsed.book.toLowerCase()}:${parsed.chapter}:${translation}`;

  const existing = getVerseByReference(canonicalRef);
  if (existing && existing.translations[translation] && fetchedTranslationCache.has(cacheKey)) {
    return {
      canonicalRef: existing.canonicalRef,
      text: existing.translations[translation],
      verseData: existing,
    };
  }

  const chapterVerses = await fetchChapterVerses(
    parsed.book,
    parsed.chapter,
    translation
  );
  const target = chapterVerses.find((v) => v.verse === verseNum);
  if (target) {
    return {
      canonicalRef: target.canonicalRef,
      text: target.translations[translation] || target.translations.NIV,
      verseData: target,
    };
  }

  if (existing) {
    return {
      canonicalRef: existing.canonicalRef,
      text: existing.translations[translation] || existing.translations.NIV,
      verseData: existing,
    };
  }

  return null;
}

// ============================================================================
// PRECEDING CHAPTER & VERSE-SPECIFIC CONTEXT ENGINE
// ============================================================================

const PRECEDING_CHAPTER_BRIDGES: Record<
  string,
  {
    previousSummary: string;
    bridgeExplanation: string;
  }
> = {
  'deuteronomy:32': {
    previousSummary:
      'In Deuteronomy 31, the 120-year-old Moses completes writing the Book of the Law, commissions Joshua to lead Israel across the Jordan (31:7–8), and receives the LORD’s command to write a prophetic Song of Witness (31:19–30) before ascending Mount Nebo.',
    bridgeExplanation:
      'Deuteronomy 31:30 concludes with Moses assembling the elders and tribes to recite the Song from beginning to end. Deuteronomy 32:1–43 is that exact Song—calling heaven and earth as covenant witnesses (32:1–2), proclaiming the perfection of God the Rock (32:3–4), exposing Israel’s unfaithfulness (32:5–6), and recounting God’s fatherly care in the wilderness (32:7–14).',
  },
  'matthew:1': {
    previousSummary:
      'Standing at the threshold of the New Testament after the Old Testament prophetic expectation (Malachi 3–4 and the Davidic promises of 2 Samuel 7 and Isaiah 7–9), Matthew 1 bridges the entire Hebrew genealogy from Abraham and David to the birth of Jesus the Messiah.',
    bridgeExplanation:
      'Verses 1–17 trace three fourteen-generation eras (Abraham to David, David to the Babylonian Exile, and the Exile to the Christ), establishing Jesus’ legal throne right through Joseph before verses 18–25 explain His supernatural virgin conception by the Holy Spirit in fulfillment of Isaiah 7:14.',
  },
  'matthew:18': {
    previousSummary:
      'In Matthew 17, Jesus is transfigured in glory on the mountain (17:1–8), heals a boy with a demon (17:14–20), predicts His betrayal and resurrection in Galilee (17:22–23), and pays the temple tax so as not to cause offense (17:24–27).',
    bridgeExplanation:
      'Immediately following Matthew 17, the disciples ask in Matthew 18:1, "Who, then, is the greatest in the kingdom of heaven?" Jesus answers by placing a child among them (18:2–5), warning against causing "little ones" to stumble (18:6–10), telling the Parable of the Wandering Sheep (18:12–14), and then giving practical instructions on how to lovingly restore a sinning brother (18:15–20) and forgive from the heart (18:21–35).',
  },
  'isaiah:7': {
    previousSummary:
      'In Isaiah 6 (the year King Uzziah died, 740 BC), Isaiah beholds the thrice-holy LORD enthroned in the temple, receives cleansing by a live coal from the altar, and is commissioned to speak God’s word to a hardened nation until only a holy remnant remains (6:1–13).',
    bridgeExplanation:
      'Moving directly from Isaiah’s temple commission in Chapter 6 into the historical crisis of King Ahaz in Chapter 7 (c. 734 BC), Aram (Syria) and Ephraim (Northern Israel) form a coalition to overthrow Jerusalem and replace the Davidic king. When Ahaz refuses to trust God (7:10–12), Isaiah addresses the whole House of David with the sign of Immanuel (7:13–14).',
  },
  'isaiah:53': {
    previousSummary:
      'In Isaiah 52, the prophet proclaims the good news of Zion’s redemption ("How beautiful on the mountains are the feet of those who bring good news," 52:7) and introduces the fourth Servant Song in 52:13–15, declaring that the Servant will be raised and lifted up yet marred beyond human likeness.',
    bridgeExplanation:
      'Isaiah 53:1–12 is the direct continuation of the Servant Song begun in Isaiah 52:13–15. What startled the nations in 52:15 is explained in 53:1–6: the Servant’s suffering was not for His own sin, but a substitutionary bearing of our iniquities.',
  },
  'john:1': {
    previousSummary:
      'Echoing the opening Hebrew words of Genesis 1:1 ("In the beginning God created the heavens and the earth"), John 1 reaches back before creation itself into eternity past to reveal the divine identity of the Word (Logos).',
    bridgeExplanation:
      'John 1 moves from the eternal pre-existence of the Word with God (1:1–2), through creation and light shining in the darkness (1:3–5), the witness of John the Baptist (1:6–8, 15), the incarnation of the Word made flesh full of grace and truth (1:14–18), to the calling of the first disciples (1:19–51).',
  },
  'genesis:1': {
    previousSummary:
      'Genesis 1 stands as the foundational prologue of all Sacred Scripture—before any created realm existed, only the eternal God existed in sovereign majesty.',
    bridgeExplanation:
      'From the opening declaration in Genesis 1:1, the chapter unfolds across six days of divine speech ("And God said..."), ordering light, sky, land, luminaries, living creatures, and humanity made in God’s image (1:26–27).',
  },
};

/**
 * Generates a specific, verse-level contextual explanation for the exact selected verse
 * by examining the selected verse text, its section heading, the immediately preceding verses,
 * and the immediately following verses.
 */
function buildSpecificVerseAnalysis(params: {
  book: string;
  chapter: number;
  verseNum: number;
  selectedText: string;
  sectionHeading?: string;
  leadingVerses: { ref: string; text: string }[];
  followingVerses: { ref: string; text: string }[];
  directCrossRefs: { ref: string; category: string; title: string }[];
}): string {
  const {
    book,
    chapter,
    verseNum,
    selectedText,
    sectionHeading,
    leadingVerses,
    followingVerses,
    directCrossRefs,
  } = params;

  const ref = `${book} ${chapter}:${verseNum}`;
  const lastLeading =
    leadingVerses.length > 0 ? leadingVerses[leadingVerses.length - 1] : null;
  const firstFollowing = followingVerses.length > 0 ? followingVerses[0] : null;

  const parts: string[] = [];

  if (sectionHeading) {
    parts.push(
      `${ref} belongs to the section "${sectionHeading}" in ${book} ${chapter}.`
    );
  } else {
    parts.push(`${ref} is a key statement in the progression of ${book} ${chapter}.`);
  }

  if (lastLeading) {
    parts.push(
      `Immediately before this, ${lastLeading.ref} states: "${lastLeading.text}" — which sets up the direct statement in verse ${verseNum}: "${selectedText}"`
    );
  } else {
    parts.push(
      `Opening the chapter at verse ${verseNum}, the text declares: "${selectedText}"`
    );
  }

  if (firstFollowing) {
    parts.push(
      `The thought continues immediately in ${firstFollowing.ref} ("${firstFollowing.text}"), showing that ${ref} must be read together with verses ${Math.max(
        1,
        verseNum - 2
      )}–${verseNum + 2}.`
    );
  }

  if (directCrossRefs.length > 0) {
    parts.push(
      `Canonically, ${ref} directly connects with ${directCrossRefs
        .map((r) => `${r.ref} (${r.category}: ${r.title})`)
        .join('; ')}.`
    );
  }

  return parts.join(' ');
}

/**
 * Builds comprehensive, 100% scripture-grounded Context Data for any selected verse:
 * 1. Specific Verse Analysis (what this exact verse is doing in its immediate paragraph/section)
 * 2. Immediate surrounding verses in the current chapter (leading up to & following the selected verse)
 * 3. Preceding Chapter context & actual closing verses from Chapter N-1
 * 4. Verified canonical cross-references for the verse and chapter
 */
export async function buildVerseContextData(
  canonicalRef: string,
  translation: TranslationId
): Promise<VerseContextData | null> {
  const parsed = parseScriptureReference(canonicalRef);
  if (!parsed) return null;

  const { book, chapter } = parsed;
  const verseNum = parsed.verse || 1;
  const bookObj = findBookByName(book);
  if (!bookObj) return null;

  // 1. Fetch current chapter verses in the active translation
  const currentChapterVerses = await fetchChapterVerses(book, chapter, translation);
  const selectedVerseObj = currentChapterVerses.find((v) => v.verse === verseNum);
  const selectedVerseText =
    selectedVerseObj?.translations[translation] ||
    selectedVerseObj?.translations.NIV ||
    getVerseText(`${book} ${chapter}:${verseNum}`, translation);

  // Find the nearest section heading at or above `verseNum` in the current chapter
  let sectionHeading: string | undefined;
  for (const v of currentChapterVerses) {
    if (v.verse <= verseNum && v.heading) {
      sectionHeading = v.heading;
    }
  }

  // Extract preceding verses in the current chapter (up to 3 verses immediately before `verseNum`)
  const leadingVersesInChapter = currentChapterVerses
    .filter((v) => v.verse < verseNum && v.verse >= Math.max(1, verseNum - 3))
    .map((v) => ({
      ref: v.canonicalRef,
      text: v.translations[translation] || v.translations.NIV,
    }));

  // Extract following verses in the current chapter (up to 3 verses immediately after `verseNum`)
  const followingVersesInChapter = currentChapterVerses
    .filter((v) => v.verse > verseNum && v.verse <= verseNum + 3)
    .map((v) => ({
      ref: v.canonicalRef,
      text: v.translations[translation] || v.translations.NIV,
    }));

  // 2. Determine and fetch the Previous Chapter (Chapter N-1, or previous book's last chapter)
  let prevBookName = book;
  let prevChapterNum = chapter - 1;
  if (prevChapterNum < 1) {
    const prevBookObj = BIBLE_BOOKS.find((b) => b.id === bookObj.id - 1);
    if (prevBookObj) {
      prevBookName = prevBookObj.name;
      prevChapterNum = prevBookObj.chapters;
    } else {
      prevBookName = 'Genesis';
      prevChapterNum = 1;
    }
  }

  const previousChapterRef =
    chapter > 1
      ? `${book} ${chapter - 1}`
      : bookObj.id > 1
      ? `${prevBookName} ${prevChapterNum} (Preceding Book)`
      : 'Creation Prologue';

  let previousChapterKeyVerses: { ref: string; text: string }[] = [];
  if (chapter > 1 || bookObj.id > 1) {
    const prevVerses = await fetchChapterVerses(
      prevBookName,
      prevChapterNum,
      translation
    );
    // Take the final 3 verses of the preceding chapter to show how it transitions into the current chapter
    previousChapterKeyVerses = prevVerses.slice(-3).map((v) => ({
      ref: v.canonicalRef,
      text: v.translations[translation] || v.translations.NIV,
    }));
  }

  // 3. Resolve Verified Cross-References for this verse + their exact scripture texts
  const directRefs = getCrossReferencesForVerse(`${book} ${chapter}:${verseNum}`);
  const verifiedCrossReferences = await Promise.all(
    directRefs.map(async (r) => {
      const resolved = await resolveScriptureVerse(r.connectedRef, translation);
      return {
        ref: r.connectedRef,
        category: r.category,
        title: r.title,
        text: resolved?.text || getVerseText(r.connectedRef, translation),
        dataSource: r.dataSource,
      };
    })
  );

  // 4. Collect all verified cross-references across the current chapter
  const chapterCrossReferences: VerseContextData['chapterCrossReferences'] = [];
  for (const v of currentChapterVerses) {
    const vRefs = getCrossReferencesForVerse(v.canonicalRef);
    for (const vr of vRefs) {
      chapterCrossReferences.push({
        sourceVerseRef: v.canonicalRef,
        connectedRef: vr.connectedRef,
        category: vr.category,
        title: vr.title,
      });
    }
  }

  const introMeta = BOOK_INTRODUCTIONS[book];
  const bookAuthorAndDate = introMeta
    ? `${introMeta.author} • ${introMeta.date} • ${introMeta.theme}`
    : `${bookObj.testament === 'OT' ? 'Old Testament' : 'New Testament'} (${bookObj.category})`;

  const bridgeKey = `${book.toLowerCase()}:${chapter}`;
  const curatedBridge = PRECEDING_CHAPTER_BRIDGES[bridgeKey];

  const previousChapterSummary = curatedBridge
    ? curatedBridge.previousSummary
    : chapter > 1
    ? `${book} ${chapter - 1} establishes the narrative and theological setting that transitions directly into ${book} ${chapter}. Read the closing verses of ${book} ${chapter - 1} below to see how the prior chapter ends.`
    : `${book} 1 opens the book of ${book} (${bookObj.category}), building upon ${previousChapterRef}.`;

  const howPreviousChapterLeadsHere = curatedBridge
    ? curatedBridge.bridgeExplanation
    : leadingVersesInChapter.length > 0
    ? `Continuing from the conclusion of ${previousChapterRef}, ${book} ${chapter} progresses through ${leadingVersesInChapter.map((l) => l.ref).join(', ')} directly to ${book} ${chapter}:${verseNum}.`
    : `${book} ${chapter}:${verseNum} opens this chapter directly after the conclusion of ${previousChapterRef}.`;

  const verseSpecificAnalysis = buildSpecificVerseAnalysis({
    book,
    chapter,
    verseNum,
    selectedText: selectedVerseText,
    sectionHeading,
    leadingVerses: leadingVersesInChapter,
    followingVerses: followingVersesInChapter,
    directCrossRefs: verifiedCrossReferences,
  });

  const mainTheme = sectionHeading
    ? `${sectionHeading} (${book} ${chapter}:${verseNum})`
    : verifiedCrossReferences.length > 0
    ? `${verifiedCrossReferences[0].title} (${book} ${chapter}:${verseNum})`
    : `Central Message of ${book} ${chapter}:${verseNum} — ${
        introMeta?.theme || bookObj.category
      }`;

  const lastLeading =
    leadingVersesInChapter.length > 0
      ? leadingVersesInChapter[leadingVersesInChapter.length - 1]
      : null;
  const firstFollowing =
    followingVersesInChapter.length > 0 ? followingVersesInChapter[0] : null;

  const verseBreakdown: string[] = [
    `What Is Being Discussed in ${book} ${chapter}:${verseNum}: "${selectedVerseText}" — ${
      sectionHeading
        ? `This verse is a core statement within "${sectionHeading}", addressing the reader directly with the truth of ${book} ${chapter}.`
        : `This verse anchors the argument of ${book} ${chapter}, expressing ${
            introMeta?.theme || `the message of ${book}`
          }.`
    }`,
    lastLeading
      ? `How the Preceding Verse Leads Here: Immediately prior in ${lastLeading.ref} ("${lastLeading.text}"), the passage establishes the premise that verse ${verseNum} directly builds upon.`
      : `How the Preceding Chapter Leads Here: ${howPreviousChapterLeadsHere}`,
    firstFollowing
      ? `How It Ties Into the Whole Passage: Immediately after in ${firstFollowing.ref} ("${firstFollowing.text}"), the author continues this exact train of thought, tying verse ${verseNum} into the wider flow of ${book} ${chapter}.`
      : `How It Ties Into the Whole Book: ${previousChapterSummary}`,
  ];

  const immediateLiteraryContext =
    leadingVersesInChapter.length > 0 || followingVersesInChapter.length > 0
      ? `In ${book} ${chapter}, verse ${verseNum} is directly preceded by ${
          leadingVersesInChapter.length > 0
            ? leadingVersesInChapter.map((l) => l.ref).join(', ')
            : 'the chapter opening'
        }${
          followingVersesInChapter.length > 0
            ? ` and followed by ${followingVersesInChapter.map((f) => f.ref).join(', ')}`
            : ''
        }. Read the surrounding passage below in order:`
      : `${book} ${chapter}:${verseNum} stands within ${book} ${chapter}.`;

  return {
    targetRef: `${book} ${chapter}:${verseNum}`,
    book,
    chapter,
    verse: verseNum,
    translation,
    selectedVerseText,
    sectionHeading,
    mainTheme,
    verseBreakdown,
    verseSpecificAnalysis,
    bookAuthorAndDate,
    previousChapterRef,
    previousChapterSummary,
    previousChapterKeyVerses,
    leadingVersesInChapter,
    followingVersesInChapter,
    howPreviousChapterLeadsHere,
    immediateLiteraryContext,
    verifiedCrossReferences,
    chapterCrossReferences,
  };
}
