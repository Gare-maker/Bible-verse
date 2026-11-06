import { NextRequest, NextResponse } from 'next/server';
import { findBookByName } from '@/data/bibleBooks';
import { TranslationId } from '@/types/bible';

const VALID_TRANSLATIONS: TranslationId[] = ['NIV', 'KJV', 'ESV', 'NKJV', 'NLT', 'ASV'];

function stripHtmlTags(raw: string): string {
  return raw
    .replace(/<S>.*?<\/S>/gi, '') // Strip Strong's inline tags if present
    .replace(/<sup>.*?<\/sup>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isInvalidCopyrightNotice(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    lower.includes('biblica, inc.') ||
    lower.includes('prohibited me from using') ||
    lower.includes('bolls.life is developed')
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookParam = searchParams.get('book') || 'Matthew';
  const chapterParam = parseInt(searchParams.get('chapter') || '1', 10);
  const translationParam = (
    searchParams.get('translation') || 'NIV'
  ).toUpperCase() as TranslationId;

  const bookObj = findBookByName(bookParam);
  if (!bookObj || chapterParam < 1 || chapterParam > bookObj.chapters) {
    return NextResponse.json(
      { error: 'Invalid canonical book or chapter number.' },
      { status: 400 }
    );
  }

  const translation: TranslationId = VALID_TRANSLATIONS.includes(translationParam)
    ? translationParam
    : 'NIV';

  // 1. Canonical NIV Source: aruljohn/Bible-niv (since bolls.life replaced NIV with a notice)
  if (translation === 'NIV') {
    const candidateNames = [
      bookObj.name,
      bookObj.name === 'Song of Solomon' ? 'Song of Songs' : bookObj.name,
      bookObj.name === 'Psalms' ? 'Psalm' : bookObj.name,
    ];

    for (const candidate of Array.from(new Set(candidateNames))) {
      try {
        const nivUrl = `https://raw.githubusercontent.com/aruljohn/Bible-niv/master/${encodeURIComponent(
          candidate
        )}.json`;
        const res = await fetch(nivUrl, {
          headers: { Accept: 'application/json' },
          next: { revalidate: 86400 },
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.chapters)) {
            const chObj = data.chapters.find(
              (c: { chapter: string | number }) => Number(c.chapter) === chapterParam
            );
            if (chObj && Array.isArray(chObj.verses) && chObj.verses.length > 0) {
              const verses = chObj.verses.map(
                (v: { verse: string | number; text: string }) => ({
                  verse: Number(v.verse),
                  text: String(v.text).replace(/\s+/g, ' ').trim(),
                })
              );
              return NextResponse.json({
                book: bookObj.name,
                chapter: chapterParam,
                translation: 'NIV',
                source: 'canonical-niv',
                verses,
              });
            }
          }
        }
      } catch {
        // Continue to next candidate
      }
    }
  }

  // 2. Canonical Multi-Translation Source: bolls.life API (supports exact KJV, ESV, NKJV, NLT, ASV)
  try {
    const bollsTranslation = translation === 'NIV' ? 'ESV' : translation;
    const bollsUrl = `https://bolls.life/get-text/${bollsTranslation}/${bookObj.id}/${chapterParam}/`;
    const res = await fetch(bollsUrl, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 86400 },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const verses = data
          .map((item: { verse: number; text: string }) => ({
            verse: Number(item.verse),
            text: stripHtmlTags(item.text),
          }))
          .filter((v) => v.text && !isInvalidCopyrightNotice(v.text));

        if (verses.length > 0) {
          return NextResponse.json({
            book: bookObj.name,
            chapter: chapterParam,
            translation,
            source: 'bolls.life',
            verses,
          });
        }
      }
    }
  } catch {
    // Fall through to secondary canonical API
  }

  // 3. Secondary Canonical Source: bible-api.com (supports KJV, ASV, WEB)
  try {
    const apiTrans =
      translation === 'KJV' ? 'kjv' : translation === 'ASV' ? 'asv' : 'web';
    const query = encodeURIComponent(`${bookObj.name} ${chapterParam}`);
    const res = await fetch(`https://bible-api.com/${query}?translation=${apiTrans}`, {
      next: { revalidate: 86400 },
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.verses) && data.verses.length > 0) {
        const verses = data.verses.map((v: { verse: number; text: string }) => ({
          verse: Number(v.verse),
          text: v.text.replace(/\s+/g, ' ').trim(),
        }));
        return NextResponse.json({
          book: bookObj.name,
          chapter: chapterParam,
          translation,
          source: 'bible-api.com',
          verses,
        });
      }
    }
  } catch {
    // Both online sources unreachable
  }

  return NextResponse.json(
    {
      error: 'Unable to reach online canonical Bible server for this chapter.',
      verses: [],
    },
    { status: 503 }
  );
}
