import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseScriptureReference, findBookByName } from '@/data/bibleBooks';
import { CANONICAL_CROSS_REFERENCES, getCrossReferencesForVerse } from '@/data/crossReferences';
import { ReferenceCategory, ResolvedCrossReference } from '@/types/bible';
import chapterFileIndexData from '@/data/chapterFileIndex.json';

const chapterFileIndex: Record<string, number[]> = chapterFileIndexData as Record<string, number[]>;

const CODE_TO_BOOK: Record<string, string> = {
  GEN: 'Genesis',
  EXO: 'Exodus',
  LEV: 'Leviticus',
  NUM: 'Numbers',
  DEU: 'Deuteronomy',
  JOS: 'Joshua',
  JDG: 'Judges',
  RUT: 'Ruth',
  '1SA': '1 Samuel',
  '2SA': '2 Samuel',
  '1KI': '1 Kings',
  '2KI': '2 Kings',
  '1CH': '1 Chronicles',
  '2CH': '2 Chronicles',
  EZR: 'Ezra',
  NEH: 'Nehemiah',
  EST: 'Esther',
  JOB: 'Job',
  PSA: 'Psalms',
  PRO: 'Proverbs',
  ECC: 'Ecclesiastes',
  SOS: 'Song of Solomon',
  ISA: 'Isaiah',
  JER: 'Jeremiah',
  LAM: 'Lamentations',
  EZE: 'Ezekiel',
  DAN: 'Daniel',
  HOS: 'Hosea',
  JOE: 'Joel',
  AMO: 'Amos',
  OBA: 'Obadiah',
  JON: 'Jonah',
  MIC: 'Micah',
  NAH: 'Nahum',
  HAB: 'Habakkuk',
  ZEP: 'Zephaniah',
  HAG: 'Haggai',
  ZEC: 'Zechariah',
  MAL: 'Malachi',
  MAT: 'Matthew',
  MAR: 'Mark',
  LUK: 'Luke',
  JOH: 'John',
  ACT: 'Acts',
  ROM: 'Romans',
  '1CO': '1 Corinthians',
  '2CO': '2 Corinthians',
  GAL: 'Galatians',
  EPH: 'Ephesians',
  PHP: 'Philippians',
  COL: 'Colossians',
  '1TH': '1 Thessalonians',
  '2TH': '2 Thessalonians',
  '1TI': '1 Timothy',
  '2TI': '2 Timothy',
  TIT: 'Titus',
  PHM: 'Philemon',
  HEB: 'Hebrews',
  JAM: 'James',
  '1PE': '1 Peter',
  '2PE': '2 Peter',
  '1JO': '1 John',
  '2JO': '2 John',
  '3JO': '3 John',
  JDE: 'Jude',
  REV: 'Revelation',
};

const BOOK_TO_CODE: Record<string, string> = Object.entries(CODE_TO_BOOK).reduce(
  (acc, [code, book]) => {
    acc[book.toLowerCase()] = code;
    return acc;
  },
  {} as Record<string, string>
);
// Special alias for Psalms
BOOK_TO_CODE['psalm'] = 'PSA';
BOOK_TO_CODE['song of songs'] = 'SOS';

function parseRawVerseCode(raw: string): { book: string; chapter: number; verse: number; canonicalRef: string } | null {
  const parts = raw.trim().split(/\s+/);
  if (parts.length < 3) return null;
  const bookCode = parts[0];
  const chapter = parseInt(parts[1], 10);
  const verse = parseInt(parts[2], 10);
  const bookName = CODE_TO_BOOK[bookCode];
  if (!bookName || isNaN(chapter) || isNaN(verse)) return null;
  return {
    book: bookName,
    chapter,
    verse,
    canonicalRef: `${bookName} ${chapter}:${verse}`,
  };
}

function determineCategory(primaryRef: string, connectedRef: string): ReferenceCategory {
  const p = parseScriptureReference(primaryRef);
  const c = parseScriptureReference(connectedRef);
  if (!p || !c) return 'Thematic connection';

  const bookP = findBookByName(p.book);
  const bookC = findBookByName(c.book);

  const isOT_P = bookP?.testament === 'OT';
  const isOT_C = bookC?.testament === 'OT';

  // Demonstrable OT to NT or NT to OT connection
  if ((isOT_P && !isOT_C) || (!isOT_P && isOT_C)) {
    const otBook = isOT_P ? p.book : c.book;
    const propheticBooks = [
      'Isaiah',
      'Jeremiah',
      'Ezekiel',
      'Daniel',
      'Hosea',
      'Joel',
      'Amos',
      'Micah',
      'Habakkuk',
      'Zechariah',
      'Malachi',
    ];
    if (propheticBooks.includes(otBook)) {
      return !isOT_P ? 'Prophecy fulfilment' : 'Prophecy';
    }
    const lawBooks = ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'];
    if (lawBooks.includes(otBook)) {
      return 'Direct quotation';
    }
    if (otBook === 'Psalms') {
      return 'Messianic reference';
    }
    return 'Allusion';
  }

  // Synoptic Gospels Parallel Passages
  const gospels = ['Matthew', 'Mark', 'Luke', 'John'];
  if (gospels.includes(p.book) && gospels.includes(c.book) && p.book !== c.book) {
    return 'Parallel passage';
  }

  return 'Thematic connection';
}

const memoryFileCache = new Map<number, Record<string, { v: string; r?: Record<string, string> }>>();

function loadFile(fileNum: number): Record<string, { v: string; r?: Record<string, string> }> | null {
  if (memoryFileCache.has(fileNum)) {
    return memoryFileCache.get(fileNum)!;
  }
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'cross-references', `${fileNum}.json`);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      memoryFileCache.set(fileNum, data);
      return data;
    }
  } catch (err) {
    console.error('Error loading cross reference file', fileNum, err);
  }
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookParam = searchParams.get('book');
  const chapterParam = searchParams.get('chapter');
  const refParam = searchParams.get('ref');

  let book = bookParam;
  let chapter = chapterParam ? parseInt(chapterParam, 10) : undefined;
  let verse: number | undefined;

  if (refParam) {
    const parsed = parseScriptureReference(refParam);
    if (parsed) {
      book = parsed.book;
      chapter = parsed.chapter;
      verse = parsed.verse;
    }
  }

  if (!book || !chapter) {
    return NextResponse.json({ error: 'Book and Chapter or Ref required' }, { status: 400 });
  }

  const code = BOOK_TO_CODE[book.toLowerCase()];
  if (!code) {
    return NextResponse.json({ error: 'Unknown Bible book' }, { status: 400 });
  }

  const key = `${code}_${chapter}`;
  const fileNumbers = chapterFileIndex[key] || [];

  const chapterResults: Record<string, ResolvedCrossReference[]> = {};

  for (const fNum of fileNumbers) {
    const fileData = loadFile(fNum);
    if (!fileData) continue;

    for (const [verseId, item] of Object.entries(fileData)) {
      if (!item.v) continue;
      const parsedPrimary = parseRawVerseCode(item.v);
      if (!parsedPrimary) continue;
      if (parsedPrimary.book.toLowerCase() !== book.toLowerCase() || parsedPrimary.chapter !== chapter) {
        continue;
      }
      if (verse !== undefined && parsedPrimary.verse !== verse) {
        continue;
      }

      const primaryRef = parsedPrimary.canonicalRef;
      if (!chapterResults[primaryRef]) {
        chapterResults[primaryRef] = [];
      }

      // Include verified canonical cross references that genuinely correspond and work together
      const curated = getCrossReferencesForVerse(primaryRef);
      for (const c of curated) {
        if (!chapterResults[primaryRef].some((x) => x.connectedRef.toLowerCase() === c.connectedRef.toLowerCase())) {
          chapterResults[primaryRef].push({
            ...c,
            supportingRefs: (c.supportingRefs || []).slice(0, 2),
          });
        }
      }

      // If references do not genuinely correspond or work together, skip them (do not force generic/synthetic links)
      // Enforce quality cap: maximum 1 to 4 references per verse
      if (chapterResults[primaryRef].length > 4) {
        chapterResults[primaryRef] = chapterResults[primaryRef].slice(0, 4);
      }
    }
  }

  // If a single verse was queried, return array directly
  if (verse !== undefined) {
    const singleRef = `${findBookByName(book)?.name || book} ${chapter}:${verse}`;
    return NextResponse.json({
      ref: singleRef,
      crossReferences: chapterResults[singleRef] || [],
    });
  }

  return NextResponse.json({
    book,
    chapter,
    crossReferencesByVerse: chapterResults,
  });
}
