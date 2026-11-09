'use client';

import React from 'react';

export type SceneType =
  | 'joseph_angel_dream'
  | 'nativity_immanuel'
  | 'temple_presentation'
  | 'baptism_jordan'
  | 'wilderness_scroll'
  | 'calling_fishermen'
  | 'healing_multitudes'
  | 'jesus_teaching'
  | 'jesus_crowd_reconciliation'
  | 'triumphal_entry'
  | 'crucifixion_calvary'
  | 'empty_tomb_resurrection'
  | 'moses_song_witness'
  | 'moses_exodus_passover'
  | 'red_sea_parting'
  | 'bronze_serpent'
  | 'creation_light'
  | 'eden_garden_tree'
  | 'noah_ark_flood'
  | 'abraham_covenant_altar'
  | 'melchizedek_abraham'
  | 'isaiah_prophecy'
  | 'lamb_of_god'
  | 'nicodemus_night'
  | 'david_harp_psalm'
  | 'pentecost_spirit'
  | 'apostolic_scroll'
  | 'throne_new_jerusalem';

export interface BiblicalLineIllustration {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  sceneType: SceneType;
}

export const BIBLICAL_LINE_ILLUSTRATIONS: BiblicalLineIllustration[] = [
  // Matthew 1 — Joseph Accepts Jesus as His Son & The Birth of Jesus
  {
    id: 'ill-matt-1-20',
    book: 'Matthew',
    chapter: 1,
    verse: 20,
    sceneType: 'joseph_angel_dream',
  },
  {
    id: 'ill-matt-1-24',
    book: 'Matthew',
    chapter: 1,
    verse: 24,
    sceneType: 'nativity_immanuel',
  },
  // Matthew 3 — John the Baptist & The Baptism of Jesus
  {
    id: 'ill-matt-3-6',
    book: 'Matthew',
    chapter: 3,
    verse: 6,
    sceneType: 'baptism_jordan',
  },
  {
    id: 'ill-matt-3-16',
    book: 'Matthew',
    chapter: 3,
    verse: 16,
    sceneType: 'baptism_jordan',
  },
  // Matthew 4 — Temptation in the Wilderness, Calling Disciples, Healing the Sick
  {
    id: 'ill-matt-4-4',
    book: 'Matthew',
    chapter: 4,
    verse: 4,
    sceneType: 'wilderness_scroll',
  },
  {
    id: 'ill-matt-4-19',
    book: 'Matthew',
    chapter: 4,
    verse: 19,
    sceneType: 'calling_fishermen',
  },
  {
    id: 'ill-matt-4-23',
    book: 'Matthew',
    chapter: 4,
    verse: 23,
    sceneType: 'healing_multitudes',
  },
  // Matthew 5 — Sermon on the Mount
  {
    id: 'ill-matt-5-1',
    book: 'Matthew',
    chapter: 5,
    verse: 1,
    sceneType: 'jesus_teaching',
  },
  // Matthew 12 — Sign of Jonah / Teaching
  {
    id: 'ill-matt-12-40',
    book: 'Matthew',
    chapter: 12,
    verse: 40,
    sceneType: 'jesus_teaching',
  },
  // Matthew 18 — Restoring a Brother
  {
    id: 'ill-matt-18-2',
    book: 'Matthew',
    chapter: 18,
    verse: 2,
    sceneType: 'jesus_teaching',
  },
  {
    id: 'ill-matt-18-15',
    book: 'Matthew',
    chapter: 18,
    verse: 15,
    sceneType: 'jesus_crowd_reconciliation',
  },
  // Matthew 21 — Triumphal Entry & Temple
  {
    id: 'ill-matt-21-9',
    book: 'Matthew',
    chapter: 21,
    verse: 9,
    sceneType: 'triumphal_entry',
  },
  // Matthew 22 — Greatest Commandment
  {
    id: 'ill-matt-22-37',
    book: 'Matthew',
    chapter: 22,
    verse: 37,
    sceneType: 'jesus_teaching',
  },
  // Matthew 27 — Crucifixion
  {
    id: 'ill-matt-27-35',
    book: 'Matthew',
    chapter: 27,
    verse: 35,
    sceneType: 'crucifixion_calvary',
  },
  // Luke 2 — Birth & Presentation at the Temple
  {
    id: 'ill-luke-2-7',
    book: 'Luke',
    chapter: 2,
    verse: 7,
    sceneType: 'nativity_immanuel',
  },
  {
    id: 'ill-luke-2-22',
    book: 'Luke',
    chapter: 2,
    verse: 22,
    sceneType: 'temple_presentation',
  },
  // Deuteronomy 32 — Song of Moses
  {
    id: 'ill-deut-32-1',
    book: 'Deuteronomy',
    chapter: 32,
    verse: 1,
    sceneType: 'moses_song_witness',
  },
  // Exodus 12 — Passover & Exodus
  {
    id: 'ill-exod-12-13',
    book: 'Exodus',
    chapter: 12,
    verse: 13,
    sceneType: 'moses_exodus_passover',
  },
  // Numbers 21 — Bronze Serpent
  {
    id: 'ill-num-21-9',
    book: 'Numbers',
    chapter: 21,
    verse: 9,
    sceneType: 'bronze_serpent',
  },
  // Genesis 1, 2, 14, 22
  {
    id: 'ill-gen-1-1',
    book: 'Genesis',
    chapter: 1,
    verse: 1,
    sceneType: 'creation_light',
  },
  {
    id: 'ill-gen-14-18',
    book: 'Genesis',
    chapter: 14,
    verse: 18,
    sceneType: 'melchizedek_abraham',
  },
  // Isaiah 7 & 53
  {
    id: 'ill-isa-7-14',
    book: 'Isaiah',
    chapter: 7,
    verse: 14,
    sceneType: 'isaiah_prophecy',
  },
  {
    id: 'ill-isa-53-7',
    book: 'Isaiah',
    chapter: 53,
    verse: 7,
    sceneType: 'lamb_of_god',
  },
  // John 1 & 3
  {
    id: 'ill-john-1-1',
    book: 'John',
    chapter: 1,
    verse: 1,
    sceneType: 'creation_light',
  },
  {
    id: 'ill-john-1-29',
    book: 'John',
    chapter: 1,
    verse: 29,
    sceneType: 'lamb_of_god',
  },
  {
    id: 'ill-john-3-14',
    book: 'John',
    chapter: 3,
    verse: 14,
    sceneType: 'nicodemus_night',
  },
];

export function getIllustrationForVerse(
  book: string,
  chapter: number,
  verse: number
): BiblicalLineIllustration | undefined {
  return BIBLICAL_LINE_ILLUSTRATIONS.find(
    (item) =>
      item.book.toLowerCase() === book.toLowerCase() &&
      item.chapter === chapter &&
      item.verse === verse
  );
}

/**
 * Determines the primary visual storytelling scene for a chapter.
 * Returns null when a chapter is a direct continuation of the previous chapter's
 * ongoing event/discourse (e.g., Genesis 2 after Genesis 1 creation, Matthew 6–7
 * continuing the Sermon on the Mount begun in Matthew 5, etc.) or when consecutive
 * chapters would repeat the same scene.
 */
function resolveRawChapterScene(book: string, chapter: number): SceneType | null {
  if (chapter <= 0) return null;
  const b = book.trim().toLowerCase();

  // Explicit continuous-discourse chapters that should not repeat the preceding chapter's illustration
  if (
    (b === 'genesis' && (chapter === 2 || chapter === 5 || chapter === 10 || chapter === 36)) ||
    (b === 'matthew' && (chapter === 6 || chapter === 7 || chapter === 10 || chapter === 24 || chapter === 25)) ||
    (b === 'john' && (chapter === 15 || chapter === 16 || chapter === 17)) ||
    (b === 'exodus' && (chapter >= 26 && chapter <= 31)) ||
    (b === 'exodus' && (chapter >= 36 && chapter <= 39)) ||
    (b === 'leviticus' && chapter % 2 === 0) ||
    (b === 'numbers' && (chapter === 2 || chapter === 4 || chapter === 7 || chapter === 26 || chapter === 29)) ||
    (b === 'deuteronomy' && (chapter >= 13 && chapter <= 26 && chapter % 2 === 0)) ||
    (b === '1 chronicles' && chapter <= 9)
  ) {
    return null;
  }

  // Exact chapter matches from curated list
  const explicit = BIBLICAL_LINE_ILLUSTRATIONS.find(
    (item) => item.book.toLowerCase() === b && item.chapter === chapter
  );
  if (explicit) {
    return explicit.sceneType;
  }

  // Book-specific narrative arc mapping
  if (b === 'genesis') {
    if (chapter === 1) return 'creation_light';
    if (chapter === 3 || chapter === 4) return 'eden_garden_tree';
    if (chapter >= 6 && chapter <= 9) return chapter === 6 || chapter === 8 ? 'noah_ark_flood' : null;
    if (chapter === 12 || chapter === 15 || chapter === 17 || chapter === 22) return 'abraham_covenant_altar';
    if (chapter === 14) return 'melchizedek_abraham';
    if (chapter === 28 || chapter === 32) return 'joseph_angel_dream';
    return chapter % 2 === 1 ? 'abraham_covenant_altar' : null;
  }

  if (b === 'exodus') {
    if (chapter === 3 || chapter === 19 || chapter === 20 || chapter === 24 || chapter === 34) return 'moses_song_witness';
    if (chapter === 12) return 'moses_exodus_passover';
    if (chapter === 14 || chapter === 15) return chapter === 14 ? 'red_sea_parting' : null;
    if (chapter === 25 || chapter === 40) return 'temple_presentation';
    return chapter % 3 === 1 ? 'moses_exodus_passover' : null;
  }

  if (b === 'leviticus') {
    if (chapter === 1 || chapter === 16) return 'lamb_of_god';
    if (chapter === 8 || chapter === 9) return chapter === 8 ? 'temple_presentation' : null;
    if (chapter === 19 || chapter === 23) return 'moses_song_witness';
    return null;
  }

  if (b === 'numbers') {
    if (chapter === 21) return 'bronze_serpent';
    if (chapter === 6 || chapter === 11 || chapter === 20 || chapter === 24) return 'moses_song_witness';
    if (chapter === 9) return 'moses_exodus_passover';
    return chapter % 4 === 1 ? 'wilderness_scroll' : null;
  }

  if (b === 'deuteronomy') {
    if (chapter === 1 || chapter === 5 || chapter === 6 || chapter === 28 || chapter === 31 || chapter === 32)
      return 'moses_song_witness';
    if (chapter === 8) return 'wilderness_scroll';
    if (chapter === 16) return 'moses_exodus_passover';
    if (chapter === 18) return 'isaiah_prophecy';
    return null;
  }

  if (b === 'joshua' || b === 'judges' || b === 'ruth') {
    if (b === 'joshua' && (chapter === 1 || chapter === 24)) return 'moses_song_witness';
    if (b === 'joshua' && chapter === 3) return 'red_sea_parting';
    if (b === 'ruth' && chapter === 2) return 'jesus_crowd_reconciliation';
    return chapter % 3 === 1 ? 'abraham_covenant_altar' : null;
  }

  if (
    b === '1 samuel' ||
    b === '2 samuel' ||
    b === '1 kings' ||
    b === '2 kings' ||
    b === '1 chronicles' ||
    b === '2 chronicles' ||
    b === 'ezra' ||
    b === 'nehemiah' ||
    b === 'esther'
  ) {
    if ((b === '1 samuel' && chapter === 16) || (b === '2 samuel' && chapter === 7)) return 'david_harp_psalm';
    if (b === '1 kings' && (chapter === 6 || chapter === 8)) return chapter === 8 ? 'temple_presentation' : null;
    return chapter % 3 === 1 ? 'isaiah_prophecy' : null;
  }

  if (b === 'job' || b === 'psalms' || b === 'proverbs' || b === 'ecclesiastes' || b === 'song of solomon') {
    if (b === 'psalms') {
      if (chapter === 22) return 'crucifixion_calvary';
      if (chapter === 23) return 'lamb_of_god';
      if (chapter === 2 || chapter === 110) return 'david_harp_psalm';
      if (chapter === 119 || chapter === 19 || chapter === 1) return 'wilderness_scroll';
      return chapter % 3 === 1 ? 'david_harp_psalm' : null;
    }
    return chapter % 2 === 1 ? 'david_harp_psalm' : null;
  }

  // Major & Minor Prophets
  if (
    b === 'isaiah' ||
    b === 'jeremiah' ||
    b === 'lamentations' ||
    b === 'ezekiel' ||
    b === 'daniel' ||
    b === 'hosea' ||
    b === 'joel' ||
    b === 'amos' ||
    b === 'obadiah' ||
    b === 'jonah' ||
    b === 'micah' ||
    b === 'nahum' ||
    b === 'habakkuk' ||
    b === 'zephaniah' ||
    b === 'haggai' ||
    b === 'zechariah' ||
    b === 'malachi'
  ) {
    if (b === 'isaiah' && chapter === 6) return 'throne_new_jerusalem';
    if (b === 'isaiah' && (chapter === 7 || chapter === 9)) return 'nativity_immanuel';
    if (b === 'isaiah' && chapter === 53) return 'lamb_of_god';
    if (b === 'micah' && chapter === 5) return 'nativity_immanuel';
    if (b === 'joel' && chapter === 2) return 'pentecost_spirit';
    if (b === 'zechariah' && chapter === 9) return 'triumphal_entry';
    return chapter % 2 === 1 ? 'isaiah_prophecy' : null;
  }

  // Gospels
  if (b === 'matthew' || b === 'mark' || b === 'luke' || b === 'john') {
    if (b === 'matthew') {
      if (chapter === 1) return 'joseph_angel_dream';
      if (chapter === 2) return 'nativity_immanuel';
      if (chapter === 3) return 'baptism_jordan';
      if (chapter === 4) return 'wilderness_scroll';
      if (chapter === 5) return 'jesus_teaching';
      if (chapter === 8 || chapter === 9) return chapter === 8 ? 'healing_multitudes' : null;
      if (chapter === 13) return 'calling_fishermen';
      if (chapter === 14) return 'healing_multitudes';
      if (chapter === 18) return 'jesus_crowd_reconciliation';
      if (chapter === 21) return 'triumphal_entry';
      if (chapter === 22) return 'jesus_teaching';
      if (chapter === 26) return 'nicodemus_night';
      if (chapter === 27) return 'crucifixion_calvary';
      if (chapter === 28) return 'empty_tomb_resurrection';
      return chapter % 2 === 1 ? 'jesus_teaching' : null;
    }
    if (b === 'mark') {
      if (chapter === 1) return 'baptism_jordan';
      if (chapter === 2 || chapter === 5) return 'healing_multitudes';
      if (chapter === 4) return 'calling_fishermen';
      if (chapter === 11) return 'triumphal_entry';
      if (chapter === 15) return 'crucifixion_calvary';
      if (chapter === 16) return 'empty_tomb_resurrection';
      return chapter % 2 === 1 ? 'jesus_teaching' : null;
    }
    if (b === 'luke') {
      if (chapter === 1) return 'joseph_angel_dream';
      if (chapter === 2) return 'nativity_immanuel';
      if (chapter === 3) return 'baptism_jordan';
      if (chapter === 4) return 'wilderness_scroll';
      if (chapter === 5) return 'calling_fishermen';
      if (chapter === 15) return 'jesus_crowd_reconciliation';
      if (chapter === 19) return 'triumphal_entry';
      if (chapter === 23) return 'crucifixion_calvary';
      if (chapter === 24) return 'empty_tomb_resurrection';
      return chapter % 2 === 1 ? 'jesus_teaching' : null;
    }
    if (b === 'john') {
      if (chapter === 1) return 'creation_light';
      if (chapter === 2) return 'temple_presentation';
      if (chapter === 3) return 'nicodemus_night';
      if (chapter === 6 || chapter === 9 || chapter === 11) return 'healing_multitudes';
      if (chapter === 10) return 'lamb_of_god';
      if (chapter === 12) return 'triumphal_entry';
      if (chapter === 14) return 'jesus_teaching';
      if (chapter === 19) return 'crucifixion_calvary';
      if (chapter === 20) return 'empty_tomb_resurrection';
      if (chapter === 21) return 'calling_fishermen';
      return chapter % 2 === 1 ? 'jesus_teaching' : null;
    }
  }

  if (b === 'acts') {
    if (chapter === 1) return 'jesus_teaching';
    if (chapter === 2) return 'pentecost_spirit';
    if (chapter === 3) return 'healing_multitudes';
    if (chapter === 9) return 'joseph_angel_dream';
    return chapter % 2 === 1 ? 'apostolic_scroll' : null;
  }

  if (b === 'revelation') {
    if (chapter === 1 || chapter === 4 || chapter === 21 || chapter === 22)
      return chapter === 22 ? null : 'throne_new_jerusalem';
    if (chapter === 5) return 'lamb_of_god';
    if (chapter === 12) return 'nativity_immanuel';
    return chapter % 2 === 1 ? 'throne_new_jerusalem' : null;
  }

  // Epistles (Romans through Jude)
  if (b === 'romans') {
    if (chapter === 1 || chapter === 8) return 'apostolic_scroll';
    if (chapter === 3 || chapter === 5) return 'crucifixion_calvary';
    if (chapter === 4) return 'abraham_covenant_altar';
    if (chapter === 6) return 'empty_tomb_resurrection';
    if (chapter === 12) return 'jesus_crowd_reconciliation';
    return null;
  }
  if (b === '1 corinthians') {
    if (chapter === 1) return 'apostolic_scroll';
    if (chapter === 5 || chapter === 11) return 'moses_exodus_passover';
    if (chapter === 10) return 'moses_song_witness';
    if (chapter === 13) return 'jesus_crowd_reconciliation';
    if (chapter === 15) return 'empty_tomb_resurrection';
    return null;
  }
  if (b === 'hebrews') {
    if (chapter === 1) return 'creation_light';
    if (chapter === 3 || chapter === 4) return chapter === 3 ? 'moses_song_witness' : null;
    if (chapter === 7) return 'melchizedek_abraham';
    if (chapter === 8 || chapter === 9 || chapter === 10) return chapter === 9 ? 'temple_presentation' : null;
    if (chapter === 11) return 'abraham_covenant_altar';
    if (chapter === 12) return 'crucifixion_calvary';
    return null;
  }

  // Remaining epistles: show on opening chapter and non-consecutive key chapters
  if (chapter === 1) return 'apostolic_scroll';
  if (chapter === 3) return 'jesus_crowd_reconciliation';
  if (chapter === 5) return 'pentecost_spirit';
  return null;
}

export function getIllustrationForChapter(
  book: string,
  chapter: number
): BiblicalLineIllustration | null {
  const scene = resolveRawChapterScene(book, chapter);
  if (!scene) return null;

  // Never repeat the exact same illustration on two consecutive chapters
  if (chapter > 1) {
    const prevScene = resolveRawChapterScene(book, chapter - 1);
    if (prevScene && prevScene === scene) {
      return null;
    }
  }

  return {
    id: `ill-chap-${book.toLowerCase()}-${chapter}`,
    book,
    chapter,
    verse: 1,
    sceneType: scene,
  };
}

/**
 * Pure monochrome engraved line-art SVG illustration.
 * Displays ONLY the drawing itself without any card, heading, scripture reference, or caption.
 */
function EngravedSceneArtwork({
  sceneType,
}: {
  sceneType: BiblicalLineIllustration['sceneType'];
}) {
  const svgClass = 'w-full h-auto max-h-56 sm:max-h-64 block mx-auto';

  switch (sceneType) {
    case 'joseph_angel_dream':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Engraved celestial rays */}
          <path d="M135 16 L80 68 M135 16 L195 68 M135 16 L135 58" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.65" />
          <path d="M24 152 L376 152" strokeWidth="1.3" />
          {/* Angel of the Lord appearing with outstretched wings and hand */}
          <circle cx="135" cy="48" r="8" strokeWidth="1.35" />
          <path d="M123 58 C92 36, 68 58, 86 92 C98 82, 112 76, 122 72" strokeWidth="1.2" />
          <path d="M147 58 C178 36, 202 58, 184 92 C172 82, 158 76, 148 72" strokeWidth="1.2" />
          <path d="M122 58 Q114 102 110 148 L158 148 Q154 102 146 58 Z" strokeWidth="1.35" />
          <path d="M146 68 L186 54" strokeWidth="1.35" />
          <path d="M118 88 L148 110 M116 108 L146 130" strokeWidth="0.85" opacity="0.7" />
          {/* Joseph resting on low couch on right */}
          <path d="M214 132 L348 132 L354 152 L208 152 Z" strokeWidth="1.25" />
          <circle cx="244" cy="108" r="7.5" strokeWidth="1.3" />
          <path d="M254 114 Q292 108 334 124 L334 132 L248 132 Z" strokeWidth="1.3" />
          {/* Carpenter's square & scroll in background */}
          <path d="M52 152 L52 94 L82 94" strokeWidth="1.1" opacity="0.65" />
        </svg>
      );

    case 'temple_presentation':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Jerusalem Temple columns & lintel */}
          <path d="M24 152 L376 152" strokeWidth="1.3" />
          <path d="M58 24 L58 152 M82 24 L82 152 M318 24 L318 152 M342 24 L342 152" strokeWidth="1.2" opacity="0.75" />
          <path d="M44 24 L356 24" strokeWidth="1.3" opacity="0.8" />
          {/* Simeon holding the infant Christ in the Temple */}
          <circle cx="174" cy="54" r="7.8" strokeWidth="1.35" />
          <path d="M170 61 Q174 74 179 61" strokeWidth="1.1" />
          <path d="M160 64 Q152 108 148 152 L198 152 Q194 108 188 64 Z" strokeWidth="1.35" />
          {/* Infant in swaddling cloths */}
          <circle cx="196" cy="78" r="4.8" strokeWidth="1.2" />
          <circle cx="196" cy="78" r="9" strokeWidth="0.7" strokeDasharray="2 2" />
          <path d="M180 82 Q196 92 210 80" strokeWidth="1.35" />
          {/* Mary & Joseph with pair of turtledoves */}
          <circle cx="248" cy="60" r="7.2" strokeWidth="1.3" />
          <path d="M236 70 Q230 110 228 152 L268 152 Q264 110 258 70 Z" strokeWidth="1.3" />
          <circle cx="288" cy="56" r="7.2" strokeWidth="1.3" />
          <path d="M276 66 Q272 108 270 152 L306 152 Q304 108 298 66 Z" strokeWidth="1.3" />
        </svg>
      );

    case 'calling_fishermen':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Sea of Galilee shoreline & hills */}
          <path d="M16 106 Q110 78 210 98 T384 90" strokeWidth="0.95" opacity="0.6" />
          <path d="M18 134 Q90 128 160 134 T300 134 T384 134" strokeWidth="1.15" />
          <path d="M36 146 Q120 140 205 146 T368 146" strokeWidth="0.95" opacity="0.75" />
          {/* Jesus standing on the shore beckoning */}
          <circle cx="96" cy="50" r="14" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.7" />
          <circle cx="96" cy="50" r="7.5" strokeWidth="1.35" />
          <path d="M84 60 Q76 98 72 136 L116 136 Q112 98 106 60 Z" strokeWidth="1.35" />
          <path d="M106 68 L146 56" strokeWidth="1.4" />
          {/* Galilean fishing boat & nets with Simon Peter and Andrew */}
          <path d="M178 122 L336 122 L316 142 L198 142 Z" strokeWidth="1.4" />
          <path d="M254 44 L254 122 M254 48 L306 106 L254 106" strokeWidth="1.15" />
          {/* Net cross-hatching */}
          <path d="M168 122 Q182 146 214 144 M176 126 L204 142 M188 124 L212 138" strokeWidth="0.9" />
          <circle cx="222" cy="82" r="6.8" strokeWidth="1.3" />
          <path d="M212 90 L206 122 L236 122 L230 90 Z" strokeWidth="1.3" />
          <path d="M212 96 L182 84" strokeWidth="1.25" />
          <circle cx="282" cy="86" r="6.8" strokeWidth="1.3" />
          <path d="M272 94 L268 122 L296 122 L290 94 Z" strokeWidth="1.3" />
        </svg>
      );

    case 'healing_multitudes':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 150 L380 150" strokeWidth="1.3" />
          <path d="M36 150 L36 68 A44 38 0 0 1 124 68 L124 150" strokeWidth="0.9" opacity="0.5" />
          {/* Jesus extending hand in compassion to heal */}
          <circle cx="164" cy="48" r="14" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.7" />
          <circle cx="164" cy="48" r="7.5" strokeWidth="1.35" />
          <path d="M150 58 Q142 102 138 150 L186 150 Q182 102 176 58 Z" strokeWidth="1.35" />
          <path d="M176 68 L216 82" strokeWidth="1.4" />
          {/* Kneeling person being healed */}
          <circle cx="234" cy="86" r="7" strokeWidth="1.3" />
          <path d="M224 94 Q216 122 212 150 L256 150 Q250 122 244 94 Z" strokeWidth="1.3" />
          <path d="M224 102 L198 88" strokeWidth="1.25" />
          {/* Onlooking crowd */}
          <circle cx="292" cy="60" r="6.8" strokeWidth="1.25" />
          <path d="M282 68 L276 150 L308 150 L302 68 Z" strokeWidth="1.25" />
          <circle cx="332" cy="64" r="6.5" strokeWidth="1.2" />
          <path d="M322 72 L318 150 L346 150 L342 72 Z" strokeWidth="1.2" />
        </svg>
      );

    case 'triumphal_entry':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 150 L380 150" strokeWidth="1.3" />
          {/* Jerusalem city gate on right */}
          <path d="M308 150 L308 46 L372 46 L372 150" strokeWidth="1.25" />
          <path d="M324 150 L324 88 A16 16 0 0 1 356 88 L356 150" strokeWidth="1.15" />
          {/* Christ riding the colt toward Jerusalem */}
          <circle cx="172" cy="48" r="13" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.7" />
          <circle cx="172" cy="48" r="7.2" strokeWidth="1.35" />
          <path d="M160 56 L154 108 L188 108 L182 56 Z" strokeWidth="1.3" />
          {/* Donkey / Colt */}
          <path d="M138 98 L206 98 L218 80 L230 86 L216 112 L142 112 Z" strokeWidth="1.3" />
          <path d="M148 112 L146 150 M162 112 L162 150 M194 112 L194 150 M208 112 L210 150" strokeWidth="1.3" />
          {/* Crowd waving palm branches */}
          <circle cx="268" cy="64" r="6.8" strokeWidth="1.25" />
          <path d="M258 72 L252 150 L284 150 L278 72 Z" strokeWidth="1.25" />
          <path d="M256 76 L232 48 M236 52 L246 46 M242 58 L252 52" strokeWidth="1.2" />
        </svg>
      );

    case 'jesus_teaching':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Distant Galilean hills & sky hatching */}
          <path d="M14 128 Q95 98 180 120 T386 114" strokeWidth="1" opacity="0.6" />
          <path d="M12 150 L388 150" strokeWidth="1.3" />
          <path d="M40 26 L108 26 M58 32 L94 32 M280 24 L352 24" strokeWidth="0.75" opacity="0.45" />

          {/* Seated figure of Jesus on the mount (left-center) */}
          <circle cx="132" cy="52" r="15" strokeWidth="0.75" strokeDasharray="2 2" opacity="0.75" />
          <circle cx="132" cy="52" r="8" strokeWidth="1.35" />
          <path d="M124 50 Q123 61 126 65 M140 50 Q141 61 138 65" strokeWidth="1.1" />
          <path d="M127 57 Q132 63 137 57" strokeWidth="1" />
          {/* Raised right arm in teaching gesture */}
          <path d="M139 67 L162 50 L169 46" strokeWidth="1.4" />
          <path d="M136 74 L159 57" strokeWidth="1.2" />
          {/* Robe & drapery folds with engraved hatching */}
          <path d="M118 63 Q107 94 102 138 L158 138 Q154 100 143 65 Z" strokeWidth="1.4" />
          <path d="M114 80 L138 96 M112 98 L142 118 M110 118 L138 133" strokeWidth="0.85" opacity="0.75" />
          {/* Stone seat on hillside */}
          <path d="M92 138 Q95 114 114 114 M86 150 L170 150" strokeWidth="1.15" />

          {/* Listening Disciples (center & right) */}
          <circle cx="218" cy="70" r="7.5" strokeWidth="1.3" />
          <path d="M213 77 Q202 106 200 144 L238 144 Q235 106 225 78 Z" strokeWidth="1.3" />
          <path d="M210 88 L192 81" strokeWidth="1.25" />
          <path d="M206 104 L230 120 M204 118 L228 134" strokeWidth="0.8" opacity="0.7" />

          <circle cx="270" cy="58" r="7.5" strokeWidth="1.3" />
          <path d="M261 67 Q254 105 252 146 L288 146 Q285 105 279 67 Z" strokeWidth="1.3" />
          <path d="M258 85 L281 102 M256 105 L281 125" strokeWidth="0.8" opacity="0.7" />

          <circle cx="324" cy="74" r="7.2" strokeWidth="1.3" />
          <path d="M315 83 Q306 114 304 146 L344 146 Q340 114 333 83 Z" strokeWidth="1.3" />
          <path d="M308 100 L295 105 L295 116 L310 112" strokeWidth="1.1" />
          {/* Olive tree on hillside */}
          <path d="M42 150 L42 84 Q42 56 64 45 M42 72 Q24 61 18 52" strokeWidth="1.15" opacity="0.8" />
        </svg>
      );

    case 'jesus_crowd_reconciliation':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Classical Jerusalem archway in background */}
          <path d="M28 148 L372 148" strokeWidth="1.3" />
          <path d="M58 148 L58 56 A54 46 0 0 1 166 56 L166 148" strokeWidth="0.95" opacity="0.55" />
          <path d="M232 148 L232 66 L346 66 L346 148" strokeWidth="0.9" opacity="0.5" />

          {/* Jesus in center guiding reconciliation */}
          <circle cx="196" cy="52" r="14" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.7" />
          <circle cx="196" cy="52" r="7.8" strokeWidth="1.35" />
          <path d="M182 63 Q175 102 173 148 L218 148 Q216 102 209 63 Z" strokeWidth="1.35" />
          <path d="M182 72 L156 83 M209 72 L236 83" strokeWidth="1.3" />
          <path d="M180 92 L211 112 M178 112 L209 132" strokeWidth="0.8" opacity="0.7" />

          {/* Two brothers clasping hands in reconciliation */}
          <circle cx="128" cy="63" r="7.4" strokeWidth="1.3" />
          <path d="M117 72 Q110 107 108 148 L146 148 Q144 107 139 72 Z" strokeWidth="1.3" />
          <path d="M139 85 L168 92" strokeWidth="1.35" />

          <circle cx="264" cy="63" r="7.4" strokeWidth="1.3" />
          <path d="M253 72 Q248 107 246 148 L284 148 Q280 107 275 72 Z" strokeWidth="1.3" />
          <path d="M253 85 L224 92" strokeWidth="1.35" />

          {/* Witnessing disciple on right */}
          <circle cx="318" cy="68" r="6.8" strokeWidth="1.25" />
          <path d="M309 77 Q304 112 302 148 L334 148 Q332 112 327 77 Z" strokeWidth="1.25" />
        </svg>
      );

    case 'nativity_immanuel':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Star of Bethlehem & engraved light beams */}
          <path d="M200 12 L200 38 M187 25 L213 25 M191 17 L209 33 M209 17 L191 33" strokeWidth="1.3" />
          <path d="M200 40 L168 94 M200 40 L200 96 M200 40 L232 94" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.65" />

          {/* Stable timber frame */}
          <path d="M52 56 L200 24 L348 56" strokeWidth="1.25" opacity="0.8" />
          <path d="M70 52 L70 148 M330 52 L330 148 M28 148 L372 148" strokeWidth="1.3" />

          {/* Manger in center */}
          <path d="M168 112 L232 112 L220 132 L180 132 Z" strokeWidth="1.35" />
          <path d="M178 132 L164 148 M222 132 L236 148 M180 132 L194 148 M220 132 L206 148" strokeWidth="1.25" />
          <circle cx="200" cy="106" r="6" strokeWidth="1.25" />
          <circle cx="200" cy="106" r="11" strokeWidth="0.7" strokeDasharray="2 2" />

          {/* Mary kneeling on left */}
          <circle cx="135" cy="74" r="7.4" strokeWidth="1.3" />
          <path d="M124 83 Q113 114 108 148 L155 148 Q150 114 144 83 Z" strokeWidth="1.3" />
          <path d="M142 94 L162 102" strokeWidth="1.25" />

          {/* Joseph standing with staff on right */}
          <circle cx="264" cy="60" r="7.4" strokeWidth="1.3" />
          <path d="M253 70 Q246 107 244 148 L282 148 Q280 107 275 70 Z" strokeWidth="1.3" />
          <path d="M294 48 L294 148" strokeWidth="1.35" />
        </svg>
      );

    case 'baptism_jordan':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Heavens opening & descending dove */}
          <path d="M154 14 Q200 30 246 14" strokeWidth="1.05" opacity="0.7" />
          <path d="M193 28 Q200 21 207 28 M184 24 L195 28 L200 36 L205 28 L216 24" strokeWidth="1.3" />
          <path d="M200 38 L175 70 M200 38 L200 68 M200 38 L225 70" strokeWidth="0.75" strokeDasharray="2 3" opacity="0.7" />

          {/* River Jordan water ripples */}
          <path d="M20 134 Q68 128 115 134 T200 134 T285 134 T380 134" strokeWidth="1.3" />
          <path d="M36 143 Q88 138 140 143 T240 143 T355 143" strokeWidth="1.05" opacity="0.8" />
          <path d="M54 152 Q120 147 190 152 T325 152" strokeWidth="0.9" opacity="0.6" />

          {/* Jesus standing in the Jordan */}
          <circle cx="200" cy="72" r="7.5" strokeWidth="1.35" />
          <path d="M187 82 Q182 108 180 134 L220 134 Q218 108 213 82 Z" strokeWidth="1.35" />
          <path d="M191 94 L200 103 L209 94" strokeWidth="1.25" />

          {/* John the Baptist on the elevated riverbank */}
          <path d="M22 134 Q86 129 140 134" strokeWidth="1.35" />
          <circle cx="130" cy="56" r="7.5" strokeWidth="1.3" />
          <path d="M119 65 Q112 98 110 132 L146 132 Q144 98 139 65 Z" strokeWidth="1.3" />
          <path d="M139 72 L180 61" strokeWidth="1.35" />
          {/* Reed cross staff */}
          <path d="M103 40 L103 132 M96 49 L110 49" strokeWidth="1.2" />
        </svg>
      );

    case 'wilderness_scroll':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Craggy Judean wilderness mountains */}
          <path d="M16 140 L84 74 L145 116 L234 58 L318 108 L384 78" strokeWidth="1.05" opacity="0.6" />
          <path d="M14 148 L386 148" strokeWidth="1.3" />

          {/* Christ seated on desert stone with Torah scroll */}
          <circle cx="196" cy="56" r="14" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.7" />
          <circle cx="196" cy="56" r="7.8" strokeWidth="1.35" />
          <path d="M182 65 Q173 102 169 148 L224 148 Q220 102 209 65 Z" strokeWidth="1.35" />
          {/* Open scroll in hands */}
          <path d="M214 85 L242 80 L242 102 L214 107 Z" strokeWidth="1.25" />
          <path d="M218 90 L238 87 M218 96 L238 94" strokeWidth="0.8" />
          {/* Desert stones */}
          <path d="M108 148 Q113 128 138 130 Q155 132 160 148" strokeWidth="1.15" />
          <path d="M262 148 Q268 132 288 134 Q304 136 308 148" strokeWidth="1.15" />
        </svg>
      );

    case 'moses_song_witness':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Mount Nebo in the distance */}
          <path d="M244 140 L316 52 L384 140" strokeWidth="1.05" opacity="0.55" />
          <path d="M16 148 L384 148" strokeWidth="1.3" />

          {/* Moses standing elevated on left with long beard, staff & scroll */}
          <circle cx="120" cy="48" r="8" strokeWidth="1.35" />
          <path d="M115 55 Q120 72 126 55" strokeWidth="1.15" />
          <path d="M129 59 L160 39" strokeWidth="1.4" />
          <path d="M95 30 L95 146" strokeWidth="1.4" />
          <path d="M106 59 Q100 100 98 146 L142 146 Q140 100 133 59 Z" strokeWidth="1.35" />
          <path d="M104 81 L135 100 M102 103 L133 124" strokeWidth="0.85" opacity="0.7" />

          {/* Tablets of the Law beside Moses */}
          <path d="M50 104 L50 146 L80 146 L80 104 A15 11 0 0 0 50 104 Z" strokeWidth="1.2" />
          <path d="M57 115 L73 115 M57 124 L73 124 M57 133 L73 133" strokeWidth="0.8" />

          {/* Gathered elders & tribes of Israel listening on right */}
          <circle cx="206" cy="70" r="6.8" strokeWidth="1.25" />
          <path d="M197 78 L193 146 L220 146 L215 78 Z" strokeWidth="1.25" />
          <circle cx="242" cy="72" r="6.8" strokeWidth="1.25" />
          <path d="M233 80 L229 146 L256 146 L251 80 Z" strokeWidth="1.25" />
          <circle cx="278" cy="74" r="6.8" strokeWidth="1.25" />
          <path d="M269 82 L265 146 L292 146 L287 82 Z" strokeWidth="1.25" />
        </svg>
      );

    case 'moses_exodus_passover':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M16 148 L384 148" strokeWidth="1.3" />
          {/* Doorpost with lintel on left */}
          <path d="M46 148 L46 50 L106 50 L106 148" strokeWidth="1.45" />
          <path d="M40 50 L112 50 L112 41 L40 41 Z" strokeWidth="1.3" />
          {/* Hyssop marks on lintel & doorposts */}
          <path d="M58 45 L95 45 M50 63 L50 96 M102 63 L102 96" strokeWidth="1.8" />

          {/* Moses with raised staff leading the people */}
          <circle cx="186" cy="52" r="7.8" strokeWidth="1.35" />
          <path d="M173 61 L166 148 L206 148 L199 61 Z" strokeWidth="1.35" />
          <path d="M202 65 L230 41 M230 24 L230 148" strokeWidth="1.4" />

          {/* Israelites journeying with staffs */}
          <circle cx="272" cy="65" r="6.8" strokeWidth="1.25" />
          <path d="M263 74 L259 148 L286 148 L281 74 Z" strokeWidth="1.25" />
          <circle cx="314" cy="70" r="6.6" strokeWidth="1.25" />
          <path d="M305 79 L301 148 L328 148 L323 79 Z" strokeWidth="1.25" />
        </svg>
      );

    case 'bronze_serpent':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Wilderness tents & horizon */}
          <path d="M16 148 L384 148" strokeWidth="1.3" />
          <path d="M30 148 L64 106 L98 148 M304 148 L338 106 L372 148" strokeWidth="1.1" opacity="0.7" />

          {/* High standard / pole with Bronze Serpent in center */}
          <path d="M200 22 L200 148" strokeWidth="1.65" />
          <path d="M173 41 L227 41" strokeWidth="1.55" />
          <path d="M186 61 C175 48, 224 46, 211 32 C200 24, 184 35, 200 74" strokeWidth="1.5" />

          {/* Moses pointing toward the lifted standard */}
          <circle cx="140" cy="63" r="7.5" strokeWidth="1.3" />
          <path d="M129 72 L122 148 L158 148 L151 72 Z" strokeWidth="1.3" />
          <path d="M151 78 L184 52" strokeWidth="1.35" />

          {/* Kneeling Israelite looking up in faith */}
          <circle cx="258" cy="85" r="7.2" strokeWidth="1.3" />
          <path d="M249 94 L240 148 L276 148 L267 94 Z" strokeWidth="1.3" />
          <path d="M249 100 L220 74" strokeWidth="1.3" />
        </svg>
      );

    case 'crucifixion_calvary':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Hill of Golgotha */}
          <path d="M20 150 Q200 88 380 150" strokeWidth="1.4" />
          {/* Engraved sky rays */}
          <path d="M200 18 L100 58 M200 18 L300 58 M200 18 L144 35 M200 18 L256 35" strokeWidth="0.75" opacity="0.6" />
          {/* Central Cross */}
          <path d="M200 22 L200 118 M170 46 L230 46" strokeWidth="1.8" />
          {/* Two side crosses */}
          <path d="M124 46 L124 126 M104 63 L144 63" strokeWidth="1.35" />
          <path d="M276 46 L276 126 M256 63 L296 63" strokeWidth="1.35" />
        </svg>
      );

    case 'creation_light':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Primordial waters below */}
          <path d="M18 128 Q72 120 128 128 T238 128 T382 128" strokeWidth="1.3" />
          <path d="M26 139 Q88 131 150 139 T272 139 T374 139" strokeWidth="1.1" opacity="0.8" />
          <path d="M40 150 Q110 143 182 150 T360 150" strokeWidth="0.9" opacity="0.6" />

          {/* Radiant light burst parting the clouds */}
          <circle cx="200" cy="52" r="18" strokeWidth="1.35" />
          <path d="M200 14 L200 28 M200 76 L200 118 M162 52 L122 52 M238 52 L278 52" strokeWidth="1.15" />
          <path d="M173 28 L138 14 M227 28 L262 14 M173 74 L124 114 M227 74 L276 114" strokeWidth="0.95" opacity="0.8" />
          <path d="M184 78 L160 118 M216 78 L240 118" strokeWidth="0.75" strokeDasharray="3 3" opacity="0.7" />
        </svg>
      );

    case 'melchizedek_abraham':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 148 L382 148" strokeWidth="1.3" />
          {/* Melchizedek King of Salem on left with crown & chalice */}
          <path d="M131 41 L135 35 L142 41 L149 35 L153 41 Z" strokeWidth="1.15" />
          <circle cx="142" cy="50" r="7.5" strokeWidth="1.35" />
          <path d="M129 59 L122 148 L162 148 L155 59 Z" strokeWidth="1.35" />
          {/* Chalice & bread */}
          <path d="M158 78 L184 72 M184 61 L193 61 L188 70 L188 76 L184 76" strokeWidth="1.25" />

          {/* Abraham bowing in reverence on right */}
          <circle cx="246" cy="63" r="7.5" strokeWidth="1.3" />
          <path d="M235 72 L229 148 L268 148 L260 72 Z" strokeWidth="1.3" />
          <path d="M235 83 L209 78" strokeWidth="1.3" />
        </svg>
      );

    case 'isaiah_prophecy':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 148 L382 148" strokeWidth="1.3" />
          {/* Classical pillar of Jerusalem */}
          <path d="M64 30 L64 148 M91 30 L91 148 M58 30 L98 30" strokeWidth="1.15" opacity="0.65" />

          {/* Prophet Isaiah with scroll & outstretched hand */}
          <circle cx="169" cy="52" r="7.8" strokeWidth="1.35" />
          <path d="M155 61 L149 148 L191 148 L182 61 Z" strokeWidth="1.35" />
          <path d="M182 70 L226 50" strokeWidth="1.4" />
          <path d="M135 78 L153 78 L153 104 L135 104 Z" strokeWidth="1.15" />

          {/* Listener of the House of David */}
          <circle cx="275" cy="61" r="7.5" strokeWidth="1.3" />
          <path d="M264 70 L258 148 L295 148 L289 70 Z" strokeWidth="1.3" />
        </svg>
      );

    case 'lamb_of_god':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 146 L382 146" strokeWidth="1.3" />
          {/* John the Baptist pointing toward Christ */}
          <circle cx="126" cy="54" r="7.5" strokeWidth="1.3" />
          <path d="M115 63 L109 146 L144 146 L138 63 Z" strokeWidth="1.3" />
          <path d="M138 70 L180 61" strokeWidth="1.4" />

          {/* Christ walking in the distance */}
          <circle cx="253" cy="52" r="13.5" strokeWidth="0.7" strokeDasharray="2 2" opacity="0.7" />
          <circle cx="253" cy="52" r="7.5" strokeWidth="1.35" />
          <path d="M242 61 L235 146 L271 146 L264 61 Z" strokeWidth="1.35" />
        </svg>
      );

    case 'empty_tomb_resurrection':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 148 L382 148" strokeWidth="1.3" />
          {/* Rock-hewn tomb & rolled-away stone */}
          <path d="M62 148 L62 66 Q128 32 194 66 L194 148" strokeWidth="1.4" />
          <path d="M104 148 L104 94 A24 24 0 0 1 152 94 L152 148" strokeWidth="1.35" />
          <circle cx="216" cy="116" r="32" strokeWidth="1.4" />
          <circle cx="216" cy="116" r="18" strokeWidth="0.85" strokeDasharray="3 3" />
          {/* Dawn rays from open tomb */}
          <path d="M128 74 L92 26 M128 74 L128 18 M128 74 L164 26" strokeWidth="0.9" strokeDasharray="3 3" opacity="0.75" />
          {/* Women arriving at the tomb at dawn */}
          <circle cx="294" cy="64" r="7.2" strokeWidth="1.3" />
          <path d="M284 72 L276 148 L312 148 L304 72 Z" strokeWidth="1.3" />
          <circle cx="332" cy="68" r="7" strokeWidth="1.25" />
          <path d="M322 76 L316 148 L348 148 L342 76 Z" strokeWidth="1.25" />
        </svg>
      );

    case 'red_sea_parting':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 150 L380 150" strokeWidth="1.3" />
          {/* Parted walls of water on left and right */}
          <path d="M24 150 C34 96, 62 56, 98 38 C86 84, 94 118, 114 150" strokeWidth="1.4" />
          <path d="M44 146 C52 104, 72 72, 96 56" strokeWidth="1" opacity="0.7" />
          <path d="M376 150 C366 96, 338 56, 302 38 C314 84, 306 118, 286 150" strokeWidth="1.4" />
          <path d="M356 146 C348 104, 328 72, 304 56" strokeWidth="1" opacity="0.7" />
          {/* Moses with outstretched staff on dry ground in the midst */}
          <circle cx="176" cy="56" r="7.5" strokeWidth="1.35" />
          <path d="M164 65 L156 150 L194 150 L186 65 Z" strokeWidth="1.35" />
          <path d="M186 70 L226 42 M226 24 L226 110" strokeWidth="1.4" />
          <circle cx="248" cy="70" r="6.8" strokeWidth="1.25" />
          <path d="M238 78 L232 150 L264 150 L258 78 Z" strokeWidth="1.25" />
        </svg>
      );

    case 'eden_garden_tree':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 148 L380 148" strokeWidth="1.3" />
          {/* River parting into streams */}
          <path d="M180 148 Q200 126 230 148 M200 136 Q240 128 290 148" strokeWidth="1.1" opacity="0.75" />
          {/* Central ancient tree canopy & trunk */}
          <path d="M192 148 L192 84 Q192 64 166 52 M208 148 L208 84 Q208 64 234 52" strokeWidth="1.4" />
          <path d="M142 66 C132 36, 174 20, 200 28 C226 20, 268 36, 258 66 C272 84, 240 96, 200 90 C160 96, 128 84, 142 66 Z" strokeWidth="1.3" />
          {/* Two figures in the garden */}
          <circle cx="128" cy="72" r="7" strokeWidth="1.3" />
          <path d="M118 80 L112 148 L142 148 L136 80 Z" strokeWidth="1.3" />
          <circle cx="272" cy="74" r="7" strokeWidth="1.3" />
          <path d="M262 82 L256 148 L286 148 L280 82 Z" strokeWidth="1.3" />
        </svg>
      );

    case 'noah_ark_flood':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {/* Flood waters */}
          <path d="M16 132 Q76 122 136 132 T256 132 T384 132" strokeWidth="1.3" />
          <path d="M28 144 Q96 136 164 144 T300 144 T372 144" strokeWidth="1.1" opacity="0.8" />
          {/* Wooden Ark resting on the waters */}
          <path d="M96 112 L304 112 L284 132 L116 132 Z" strokeWidth="1.4" />
          <path d="M118 82 L282 82 L282 112 L118 112 Z" strokeWidth="1.35" />
          <path d="M108 82 L200 58 L292 82" strokeWidth="1.4" />
          {/* Rainbow covenant arch & dove with olive leaf */}
          <path d="M64 118 A140 92 0 0 1 336 118" strokeWidth="1.1" strokeDasharray="4 3" opacity="0.75" />
          <path d="M192 34 L200 40 L208 34 M196 38 L204 44" strokeWidth="1.25" />
        </svg>
      );

    case 'abraham_covenant_altar':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 148 L382 148" strokeWidth="1.3" />
          {/* Starry night sky of the Abrahamic promise */}
          <circle cx="92" cy="28" r="1.5" fill="currentColor" />
          <circle cx="144" cy="22" r="1.5" fill="currentColor" />
          <circle cx="204" cy="18" r="1.8" fill="currentColor" />
          <circle cx="262" cy="26" r="1.5" fill="currentColor" />
          <circle cx="314" cy="32" r="1.5" fill="currentColor" />
          {/* Stone altar with ascending flame */}
          <path d="M184 112 L236 112 L242 148 L178 148 Z" strokeWidth="1.35" />
          <path d="M182 128 L238 128 M210 112 L210 148" strokeWidth="1.05" />
          <path d="M202 112 C198 92, 210 78, 210 64 C218 80, 224 94, 218 112" strokeWidth="1.3" />
          {/* Abraham looking upward in faith */}
          <circle cx="128" cy="58" r="7.6" strokeWidth="1.35" />
          <path d="M116 67 L108 148 L146 148 L138 67 Z" strokeWidth="1.35" />
          <path d="M138 76 L168 54" strokeWidth="1.35" />
        </svg>
      );

    case 'david_harp_psalm':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 148 L380 148" strokeWidth="1.3" />
          <path d="M220 132 Q290 96 376 132" strokeWidth="1" opacity="0.6" />
          {/* King David seated with lyre/harp */}
          <circle cx="156" cy="54" r="7.6" strokeWidth="1.35" />
          <path d="M148 44 L152 38 L156 44 L160 38 L164 44 Z" strokeWidth="1.15" />
          <path d="M142 63 L134 148 L178 148 L170 63 Z" strokeWidth="1.35" />
          {/* Biblical kinnor (lyre) */}
          <path d="M180 68 Q192 98 206 68 M180 68 L206 68" strokeWidth="1.3" />
          <path d="M188 68 L188 86 M193 68 L193 88 M198 68 L198 86" strokeWidth="0.85" />
          {/* Grazing sheep on Judean hills */}
          <path d="M268 134 Q282 124 294 134 L294 148 L268 148 Z" strokeWidth="1.2" />
          <circle cx="298" cy="130" r="4.5" strokeWidth="1.2" />
        </svg>
      );

    case 'pentecost_spirit':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 148 L380 148" strokeWidth="1.3" />
          {/* Descending rays and tongues of fire */}
          <path d="M200 14 L132 52 M200 14 L200 48 M200 14 L268 52" strokeWidth="0.95" strokeDasharray="3 3" opacity="0.75" />
          <path d="M132 50 Q135 42 132 36 Q129 42 132 50 Z" strokeWidth="1.2" />
          <path d="M200 46 Q203 38 200 32 Q197 38 200 46 Z" strokeWidth="1.2" />
          <path d="M268 50 Q271 42 268 36 Q265 42 268 50 Z" strokeWidth="1.2" />
          {/* Gathered disciples in upper room */}
          <circle cx="132" cy="64" r="7.4" strokeWidth="1.3" />
          <path d="M120 73 L114 148 L150 148 L144 73 Z" strokeWidth="1.3" />
          <circle cx="200" cy="60" r="7.8" strokeWidth="1.35" />
          <path d="M186 70 L180 148 L220 148 L214 70 Z" strokeWidth="1.35" />
          <path d="M186 80 L166 64 M214 80 L234 64" strokeWidth="1.3" />
          <circle cx="268" cy="64" r="7.4" strokeWidth="1.3" />
          <path d="M256 73 L250 148 L286 148 L280 73 Z" strokeWidth="1.3" />
        </svg>
      );

    case 'apostolic_scroll':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 148 L380 148" strokeWidth="1.3" />
          {/* Writing desk, parchment scroll & oil lamp */}
          <path d="M188 106 L312 106 L312 148 M204 106 L204 148" strokeWidth="1.35" />
          <path d="M216 94 L276 94 L284 106 L208 106 Z" strokeWidth="1.25" />
          {/* Apostle writing at desk */}
          <circle cx="144" cy="58" r="7.8" strokeWidth="1.35" />
          <path d="M130 68 L122 148 L168 148 L158 68 Z" strokeWidth="1.35" />
          <path d="M158 80 L218 96" strokeWidth="1.35" />
        </svg>
      );

    case 'throne_new_jerusalem':
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 148 L380 148" strokeWidth="1.3" />
          {/* Sea of glass & river of life */}
          <path d="M176 148 Q200 116 212 96 M224 148 Q208 118 200 96" strokeWidth="1.2" />
          {/* Exalted throne & radiant glory */}
          <path d="M176 52 L224 52 L230 96 L170 96 Z" strokeWidth="1.4" />
          <path d="M140 96 A60 56 0 0 1 260 96" strokeWidth="1.15" strokeDasharray="3 3" />
          <path d="M200 16 L200 38 M156 26 L174 44 M244 26 L226 44" strokeWidth="1.1" />
        </svg>
      );

    case 'nicodemus_night':
    default:
      return (
        <svg
          viewBox="0 0 400 175"
          className={svgClass}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 148 L382 148" strokeWidth="1.3" />
          {/* Crescent moon & night stars */}
          <path d="M324 26 A13 13 0 1 0 338 44 A10 10 0 1 1 324 26 Z" strokeWidth="1.15" />
          {/* Oil lamp on pedestal in center */}
          <path d="M200 96 L200 148 M186 96 L214 96" strokeWidth="1.25" />
          <path d="M191 91 Q200 85 209 91 Z" strokeWidth="1.25" />
          <path d="M200 78 Q204 85 200 89 Q196 85 200 78 Z" strokeWidth="1.15" />

          {/* Jesus seated on left */}
          <circle cx="138" cy="58" r="7.8" strokeWidth="1.35" />
          <path d="M124 67 L118 148 L158 148 L151 67 Z" strokeWidth="1.35" />
          <path d="M151 78 L180 65" strokeWidth="1.35" />

          {/* Nicodemus leaning in to listen on right */}
          <circle cx="262" cy="61" r="7.8" strokeWidth="1.3" />
          <path d="M249 70 L242 148 L282 148 L275 70 Z" strokeWidth="1.3" />
        </svg>
      );
  }
}

export default function BibleLineDrawing({
  illustration,
  isLight,
}: {
  illustration: BiblicalLineIllustration;
  isLight: boolean;
}) {
  return (
    <div
      className={`my-6 sm:my-7 mx-auto w-full max-w-lg pointer-events-none select-none ${
        isLight ? 'text-stone-900' : 'text-zinc-200'
      }`}
    >
      <EngravedSceneArtwork sceneType={illustration.sceneType} />
    </div>
  );
}
