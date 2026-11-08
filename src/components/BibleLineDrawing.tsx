'use client';

import React from 'react';

export interface BiblicalLineIllustration {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  title: string;
  caption: string;
  scriptureRef: string;
  sceneType:
    | 'jesus_teaching'
    | 'jesus_crowd_reconciliation'
    | 'nativity_immanuel'
    | 'baptism_jordan'
    | 'wilderness_scroll'
    | 'moses_song_witness'
    | 'moses_exodus_passover'
    | 'bronze_serpent'
    | 'crucifixion_calvary'
    | 'creation_light'
    | 'melchizedek_abraham'
    | 'isaiah_prophecy'
    | 'lamb_of_god'
    | 'nicodemus_night';
  attribution: string;
}

export const BIBLICAL_LINE_ILLUSTRATIONS: BiblicalLineIllustration[] = [
  {
    id: 'ill-matt-1-23',
    book: 'Matthew',
    chapter: 1,
    verse: 23,
    title: 'The Birth of Immanuel — “God With Us”',
    caption:
      'Mary and Joseph beside the manger in Bethlehem beneath the star of David’s house (Matthew 1:18–25).',
    scriptureRef: 'Matthew 1:23',
    sceneType: 'nativity_immanuel',
    attribution:
      'Traditional Biblical Line Engraving (Public Domain / Classical Printed Bible Style)',
  },
  {
    id: 'ill-matt-3-16',
    book: 'Matthew',
    chapter: 3,
    verse: 16,
    title: 'The Baptism of Jesus in the River Jordan',
    caption:
      'John the Baptist on the bank of the Jordan as the heavens open and the Spirit of God descends like a dove (Matthew 3:13–17).',
    scriptureRef: 'Matthew 3:16',
    sceneType: 'baptism_jordan',
    attribution:
      'Traditional Biblical Line Engraving (Public Domain / Classical Printed Bible Style)',
  },
  {
    id: 'ill-matt-4-4',
    book: 'Matthew',
    chapter: 4,
    verse: 4,
    title: 'Christ in the Judean Wilderness — “It Is Written”',
    caption:
      'Jesus answering temptation in the desert with the written word of Moses from Deuteronomy 8:3 (Matthew 4:1–4).',
    scriptureRef: 'Matthew 4:4',
    sceneType: 'wilderness_scroll',
    attribution:
      'Traditional Biblical Line Engraving (Public Domain / Classical Printed Bible Style)',
  },
  {
    id: 'ill-matt-5-1',
    book: 'Matthew',
    chapter: 5,
    verse: 1,
    title: 'Jesus Teaching His Disciples on the Mount',
    caption:
      'Seeing the crowds, Jesus went up on the mountainside and sat down, and His disciples came to Him as He began to teach them (Matthew 5:1–2).',
    scriptureRef: 'Matthew 5:1',
    sceneType: 'jesus_teaching',
    attribution:
      'Traditional Biblical Line Engraving (Public Domain / Classical Printed Bible Style)',
  },
  {
    id: 'ill-matt-18-15',
    book: 'Matthew',
    chapter: 18,
    verse: 15,
    title: 'Jesus Teaching on Restoring a Brother',
    caption:
      'Jesus instructing His disciples on reconciliation, humility, and winning back a brother in truth and mercy (Matthew 18:15–20).',
    scriptureRef: 'Matthew 18:15',
    sceneType: 'jesus_crowd_reconciliation',
    attribution:
      'Traditional Biblical Line Engraving (Public Domain / Classical Printed Bible Style)',
  },
  {
    id: 'ill-matt-22-37',
    book: 'Matthew',
    chapter: 22,
    verse: 37,
    title: 'Jesus Teaching in the Temple Courts — The Greatest Commandment',
    caption:
      'Jesus proclaiming the Shema of Deuteronomy 6:5 before the gathered listeners in Jerusalem (Matthew 22:37–40).',
    scriptureRef: 'Matthew 22:37',
    sceneType: 'jesus_teaching',
    attribution:
      'Traditional Biblical Line Engraving (Public Domain / Classical Printed Bible Style)',
  },
  {
    id: 'ill-matt-27-35',
    book: 'Matthew',
    chapter: 27,
    verse: 35,
    title: 'Golgotha — The Crucifixion of Christ',
    caption:
      'The hill of Calvary outside Jerusalem, fulfilling the prophetic witness of Psalm 22 and Isaiah 53.',
    scriptureRef: 'Matthew 27:35',
    sceneType: 'crucifixion_calvary',
    attribution:
      'Traditional Biblical Line Engraving (Public Domain / Classical Printed Bible Style)',
  },
  {
    id: 'ill-deut-32-1',
    book: 'Deuteronomy',
    chapter: 32,
    verse: 1,
    title: 'Moses Reciting the Song of Witness Before All Israel',
    caption:
      'Moses standing before the assembled tribes on the plains of Moab with the Law of the Covenant prior to ascending Mount Nebo (Deuteronomy 32:1–6).',
    scriptureRef: 'Deuteronomy 32:1',
    sceneType: 'moses_song_witness',
    attribution:
      'Traditional Biblical Line Engraving (Public Domain / Classical Printed Bible Style)',
  },
  {
    id: 'ill-exod-12-13',
    book: 'Exodus',
    chapter: 12,
    verse: 13,
    title: 'Moses and the Israelites — The Passover & Exodus from Egypt',
    caption:
      'The blood of the Passover lamb upon the doorposts and Moses leading the children of Israel out of bondage (Exodus 12:13).',
    scriptureRef: 'Exodus 12:13',
    sceneType: 'moses_exodus_passover',
    attribution:
      'Traditional Biblical Line Engraving (Public Domain / Classical Printed Bible Style)',
  },
  {
    id: 'ill-num-21-9',
    book: 'Numbers',
    chapter: 21,
    verse: 9,
    title: 'Moses Lifting Up the Bronze Serpent in the Wilderness',
    caption:
      'Moses raising the bronze serpent upon the pole so that any who looked upon it lived—foreshadowing Christ lifted up (Numbers 21:8–9; John 3:14–15).',
    scriptureRef: 'Numbers 21:9',
    sceneType: 'bronze_serpent',
    attribution:
      'Traditional Biblical Line Engraving (Public Domain / Classical Printed Bible Style)',
  },
  {
    id: 'ill-gen-1-1',
    book: 'Genesis',
    chapter: 1,
    verse: 1,
    title: 'The Creation — “Let There Be Light”',
    caption:
      'In the beginning God created the heavens and the earth, and the Spirit of God hovered over the face of the waters (Genesis 1:1–3).',
    scriptureRef: 'Genesis 1:1',
    sceneType: 'creation_light',
    attribution:
      'Traditional Biblical Line Engraving (Public Domain / Classical Printed Bible Style)',
  },
  {
    id: 'ill-gen-14-18',
    book: 'Genesis',
    chapter: 14,
    verse: 18,
    title: 'Melchizedek King of Salem Blessing Abraham',
    caption:
      'Melchizedek, priest of God Most High, bringing forth bread and wine to bless Abram in the Valley of Shaveh (Genesis 14:18–20).',
    scriptureRef: 'Genesis 14:18',
    sceneType: 'melchizedek_abraham',
    attribution:
      'Traditional Biblical Line Engraving (Public Domain / Classical Printed Bible Style)',
  },
  {
    id: 'ill-isa-7-14',
    book: 'Isaiah',
    chapter: 7,
    verse: 14,
    title: 'The Prophet Isaiah Proclaiming the Sign of Immanuel',
    caption:
      'Isaiah declaring to the House of David that the virgin shall conceive and bear a Son called Immanuel (Isaiah 7:14).',
    scriptureRef: 'Isaiah 7:14',
    sceneType: 'isaiah_prophecy',
    attribution:
      'Traditional Biblical Line Engraving (Public Domain / Classical Printed Bible Style)',
  },
  {
    id: 'ill-isa-53-7',
    book: 'Isaiah',
    chapter: 53,
    verse: 7,
    title: 'The Suffering Servant — “Led Like a Lamb to the Slaughter”',
    caption:
      'Isaiah’s prophetic portrait of the Servant who bore the iniquities of many in silence and humility (Isaiah 53:5–7).',
    scriptureRef: 'Isaiah 53:7',
    sceneType: 'lamb_of_god',
    attribution:
      'Traditional Biblical Line Engraving (Public Domain / Classical Printed Bible Style)',
  },
  {
    id: 'ill-john-1-1',
    book: 'John',
    chapter: 1,
    verse: 1,
    title: 'The Eternal Word & Light Shining in the Darkness',
    caption:
      'In the beginning was the Word, and in Him was life, and that life was the light of all mankind (John 1:1–5).',
    scriptureRef: 'John 1:1',
    sceneType: 'creation_light',
    attribution:
      'Traditional Biblical Line Engraving (Public Domain / Classical Printed Bible Style)',
  },
  {
    id: 'ill-john-1-29',
    book: 'John',
    chapter: 1,
    verse: 29,
    title: 'John the Baptist Witnessing to Jesus — “Behold, the Lamb of God”',
    caption:
      'John pointing his disciples to Jesus walking by the Jordan River as the Lamb of God who takes away the sin of the world (John 1:29).',
    scriptureRef: 'John 1:29',
    sceneType: 'lamb_of_god',
    attribution:
      'Traditional Biblical Line Engraving (Public Domain / Classical Printed Bible Style)',
  },
  {
    id: 'ill-john-3-14',
    book: 'John',
    chapter: 3,
    verse: 14,
    title: 'Jesus Teaching Nicodemus by Night',
    caption:
      'Jesus explaining to the Pharisee Nicodemus how the Son of Man must be lifted up just as Moses lifted up the serpent in the wilderness (John 3:14–15).',
    scriptureRef: 'John 3:14',
    sceneType: 'nicodemus_night',
    attribution:
      'Traditional Biblical Line Engraving (Public Domain / Classical Printed Bible Style)',
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
 * Renders an authentic monochrome engraved line-art SVG illustration
 * in the style of 19th-century printed Bibles (fine ink strokes, hatching,
 * classical figures, no modern cartoon fills or photographic effects).
 */
function EngravedSceneArtwork({
  sceneType,
}: {
  sceneType: BiblicalLineIllustration['sceneType'];
}) {
  switch (sceneType) {
    case 'jesus_teaching':
      return (
        <svg
          viewBox="0 0 360 155"
          className="w-full h-auto max-h-40"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Traditional line drawing of Jesus teaching His disciples"
        >
          {/* Distant Galilean hills & sky hatching */}
          <path d="M12 118 Q85 92 160 112 T348 106" strokeWidth="0.9" opacity="0.55" />
          <path d="M10 138 L350 138" strokeWidth="1.1" />
          <path d="M35 24 L95 24 M50 29 L82 29 M255 22 L320 22" strokeWidth="0.6" opacity="0.4" />

          {/* Seated figure of Jesus on the mount (left-center) */}
          {/* Subtle halo rays in classic engraved style */}
          <circle cx="118" cy="48" r="14" strokeWidth="0.65" strokeDasharray="2 2" opacity="0.7" />
          {/* Head, hair & beard */}
          <circle cx="118" cy="48" r="7.5" strokeWidth="1.2" />
          <path d="M111 46 Q110 56 113 60 M125 46 Q126 56 123 60" strokeWidth="1" />
          <path d="M114 53 Q118 58 122 53" strokeWidth="0.9" />
          {/* Raised right arm in teaching gesture */}
          <path d="M124 62 L145 47 L151 43" strokeWidth="1.25" />
          <path d="M122 68 L143 53" strokeWidth="1.1" />
          {/* Robe & drapery folds with engraved hatching */}
          <path d="M106 58 Q96 86 92 126 L142 126 Q138 92 128 60 Z" strokeWidth="1.25" />
          <path d="M102 74 L124 88 M100 90 L128 108 M98 108 L124 122" strokeWidth="0.75" opacity="0.7" />
          {/* Stone seat on hillside */}
          <path d="M82 126 Q85 104 102 104 M78 138 L152 138" strokeWidth="1" />

          {/* Listening Disciples (center & right) */}
          {/* Disciple 1 — kneeling/leaning forward */}
          <circle cx="196" cy="64" r="6.8" strokeWidth="1.15" />
          <path d="M192 70 Q182 96 180 132 L214 132 Q212 96 202 71 Z" strokeWidth="1.15" />
          <path d="M190 80 L174 74" strokeWidth="1.1" />
          <path d="M186 94 L208 110 M184 108 L206 122" strokeWidth="0.7" opacity="0.65" />

          {/* Disciple 2 — standing attentive */}
          <circle cx="242" cy="54" r="6.8" strokeWidth="1.15" />
          <path d="M234 62 Q228 96 226 134 L258 134 Q256 96 250 62 Z" strokeWidth="1.15" />
          <path d="M232 78 L252 94 M230 96 L252 114" strokeWidth="0.7" opacity="0.65" />

          {/* Disciple 3 — seated with scroll */}
          <circle cx="290" cy="68" r="6.5" strokeWidth="1.15" />
          <path d="M282 76 Q274 104 272 134 L308 134 Q304 104 298 76 Z" strokeWidth="1.15" />
          <path d="M276 92 L264 96 L264 106 L278 102" strokeWidth="0.95" />
          {/* Olive branch / hillside detail */}
          <path d="M38 138 L38 78 Q38 52 58 42 M38 66 Q22 56 16 48" strokeWidth="1" opacity="0.75" />
        </svg>
      );

    case 'jesus_crowd_reconciliation':
      return (
        <svg
          viewBox="0 0 360 155"
          className="w-full h-auto max-h-40"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Traditional line drawing of Jesus teaching on restoring a brother"
        >
          {/* Classical Jerusalem archway in background */}
          <path d="M30 136 L330 136" strokeWidth="1.1" />
          <path d="M55 136 L55 52 A48 42 0 0 1 151 52 L151 136" strokeWidth="0.85" opacity="0.5" />
          <path d="M210 136 L210 62 L310 62 L310 136" strokeWidth="0.8" opacity="0.45" />

          {/* Jesus in center guiding reconciliation */}
          <circle cx="176" cy="48" r="13" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.65" />
          <circle cx="176" cy="48" r="7.2" strokeWidth="1.2" />
          <path d="M164 58 Q158 94 156 136 L196 136 Q194 94 188 58 Z" strokeWidth="1.2" />
          <path d="M164 66 L140 76 M188 66 L212 76" strokeWidth="1.15" />
          <path d="M162 84 L190 102 M160 102 L188 120" strokeWidth="0.7" opacity="0.65" />

          {/* Two brothers clasping hands in reconciliation */}
          <circle cx="116" cy="58" r="6.8" strokeWidth="1.15" />
          <path d="M106 66 Q100 98 98 136 L132 136 Q130 98 126 66 Z" strokeWidth="1.15" />
          <path d="M126 78 L152 84" strokeWidth="1.2" />

          <circle cx="238" cy="58" r="6.8" strokeWidth="1.15" />
          <path d="M228 66 Q224 98 222 136 L256 136 Q252 98 248 66 Z" strokeWidth="1.15" />
          <path d="M228 78 L202 84" strokeWidth="1.2" />

          {/* Witnessing disciple on right */}
          <circle cx="286" cy="62" r="6.2" strokeWidth="1.1" />
          <path d="M278 70 Q274 102 272 136 L300 136 Q298 102 294 70 Z" strokeWidth="1.1" />
        </svg>
      );

    case 'nativity_immanuel':
      return (
        <svg
          viewBox="0 0 360 155"
          className="w-full h-auto max-h-40"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Traditional line drawing of the Birth of Immanuel"
        >
          {/* Star of Bethlehem & engraved light beams */}
          <path d="M180 12 L180 34 M169 23 L191 23 M173 16 L187 30 M187 16 L173 30" strokeWidth="1.1" />
          <path d="M180 36 L152 86 M180 36 L180 88 M180 36 L208 86" strokeWidth="0.65" strokeDasharray="3 3" opacity="0.6" />

          {/* Stable timber frame */}
          <path d="M48 52 L180 22 L312 52" strokeWidth="1.1" opacity="0.75" />
          <path d="M64 48 L64 136 M296 48 L296 136 M28 136 L332 136" strokeWidth="1.1" />

          {/* Manger in center */}
          <path d="M152 104 L208 104 L198 122 L162 122 Z" strokeWidth="1.2" />
          <path d="M160 122 L148 136 M200 122 L212 136 M162 122 L174 136 M198 122 L186 136" strokeWidth="1.1" />
          <circle cx="180" cy="98" r="5.5" strokeWidth="1.1" />
          <circle cx="180" cy="98" r="10" strokeWidth="0.6" strokeDasharray="2 2" />

          {/* Mary kneeling on left */}
          <circle cx="122" cy="68" r="6.8" strokeWidth="1.15" />
          <path d="M112 76 Q102 104 98 136 L140 136 Q136 104 130 76 Z" strokeWidth="1.15" />
          <path d="M128 86 L146 94" strokeWidth="1.1" />

          {/* Joseph standing with staff on right */}
          <circle cx="238" cy="56" r="6.8" strokeWidth="1.15" />
          <path d="M228 64 Q222 98 220 136 L254 136 Q252 98 248 64 Z" strokeWidth="1.15" />
          <path d="M264 44 L264 136" strokeWidth="1.2" />
        </svg>
      );

    case 'baptism_jordan':
      return (
        <svg
          viewBox="0 0 360 155"
          className="w-full h-auto max-h-40"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Traditional line drawing of the Baptism of Jesus in the Jordan"
        >
          {/* Heavens opening & descending dove */}
          <path d="M140 14 Q180 28 220 14" strokeWidth="0.9" opacity="0.65" />
          <path d="M174 26 Q180 20 186 26 M166 22 L176 26 L180 33 L184 26 L194 22" strokeWidth="1.15" />
          <path d="M180 34 L158 64 M180 34 L180 62 M180 34 L202 64" strokeWidth="0.65" strokeDasharray="2 3" opacity="0.65" />

          {/* River Jordan water ripples */}
          <path d="M20 122 Q60 117 100 122 T180 122 T260 122 T340 122" strokeWidth="1.1" />
          <path d="M35 130 Q80 126 125 130 T215 130 T315 130" strokeWidth="0.9" opacity="0.75" />
          <path d="M50 138 Q110 134 170 138 T290 138" strokeWidth="0.8" opacity="0.55" />

          {/* Jesus standing in the Jordan */}
          <circle cx="180" cy="66" r="6.8" strokeWidth="1.2" />
          <path d="M168 75 Q164 98 162 122 L198 122 Q196 98 192 75 Z" strokeWidth="1.2" />
          <path d="M172 86 L180 94 L188 86" strokeWidth="1.1" />

          {/* John the Baptist on the elevated riverbank */}
          <path d="M22 122 Q78 118 126 122" strokeWidth="1.2" />
          <circle cx="118" cy="52" r="6.8" strokeWidth="1.15" />
          <path d="M108 60 Q102 90 100 120 L132 120 Q130 90 126 60 Z" strokeWidth="1.15" />
          <path d="M126 66 L162 56" strokeWidth="1.2" />
          {/* Reed cross staff */}
          <path d="M94 38 L94 120 M88 46 L100 46" strokeWidth="1.05" />
        </svg>
      );

    case 'wilderness_scroll':
      return (
        <svg
          viewBox="0 0 360 155"
          className="w-full h-auto max-h-40"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Traditional line drawing of Christ in the Judean wilderness"
        >
          {/* Craggy Judean wilderness mountains */}
          <path d="M15 128 L75 68 L130 106 L210 54 L285 98 L345 72" strokeWidth="0.9" opacity="0.55" />
          <path d="M12 136 L348 136" strokeWidth="1.1" />

          {/* Christ seated on desert stone with Torah scroll */}
          <circle cx="176" cy="52" r="13" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.65" />
          <circle cx="176" cy="52" r="7" strokeWidth="1.2" />
          <path d="M164 60 Q156 94 152 136 L202 136 Q198 94 188 60 Z" strokeWidth="1.2" />
          {/* Open scroll in hands */}
          <path d="M192 78 L218 74 L218 94 L192 98 Z" strokeWidth="1.1" />
          <path d="M196 82 L214 80 M196 88 L214 86" strokeWidth="0.7" />
          {/* Desert stones */}
          <path d="M98 136 Q102 118 124 120 Q140 122 144 136" strokeWidth="1" />
          <path d="M236 136 Q242 122 260 124 Q274 126 278 136" strokeWidth="1" />
        </svg>
      );

    case 'moses_song_witness':
      return (
        <svg
          viewBox="0 0 360 155"
          className="w-full h-auto max-h-40"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Traditional line drawing of Moses reciting the Song of Witness before Israel"
        >
          {/* Mount Nebo in the distance */}
          <path d="M220 128 L285 48 L345 128" strokeWidth="0.9" opacity="0.5" />
          <path d="M14 136 L346 136" strokeWidth="1.15" />

          {/* Moses standing elevated on left with long beard, staff & scroll */}
          <circle cx="108" cy="44" r="7.2" strokeWidth="1.2" />
          {/* Flowing beard of Moses */}
          <path d="M104 50 Q108 66 113 50" strokeWidth="1" />
          {/* Raised arm addressing the assembly */}
          <path d="M116 54 L144 36" strokeWidth="1.25" />
          {/* Staff in left hand */}
          <path d="M86 28 L86 134" strokeWidth="1.25" />
          <path d="M96 54 Q90 92 88 134 L128 134 Q126 92 120 54 Z" strokeWidth="1.2" />
          <path d="M94 74 L122 92 M92 94 L120 114" strokeWidth="0.75" opacity="0.65" />

          {/* Ark / Tablets of the Law beside Moses */}
          <path d="M46 96 L46 134 L72 134 L72 96 A13 10 0 0 0 46 96 Z" strokeWidth="1.05" />
          <path d="M52 106 L66 106 M52 114 L66 114 M52 122 L66 122" strokeWidth="0.7" />

          {/* Gathered elders & tribes of Israel listening on right */}
          <circle cx="186" cy="64" r="6.2" strokeWidth="1.1" />
          <path d="M178 71 L174 134 L198 134 L194 71 Z" strokeWidth="1.1" />
          <circle cx="218" cy="66" r="6.2" strokeWidth="1.1" />
          <path d="M210 73 L206 134 L230 134 L226 73 Z" strokeWidth="1.1" />
          <circle cx="250" cy="68" r="6.2" strokeWidth="1.1" />
          <path d="M242 75 L238 134 L262 134 L258 75 Z" strokeWidth="1.1" />
        </svg>
      );

    case 'moses_exodus_passover':
      return (
        <svg
          viewBox="0 0 360 155"
          className="w-full h-auto max-h-40"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Traditional line drawing of Moses and the Israelites at the Passover and Exodus"
        >
          <path d="M14 136 L346 136" strokeWidth="1.15" />
          {/* Doorpost with lintel on left */}
          <path d="M42 136 L42 46 L96 46 L96 136" strokeWidth="1.3" />
          <path d="M36 46 L102 46 L102 38 L36 38 Z" strokeWidth="1.15" />
          {/* Hyssop marks on lintel & doorposts */}
          <path d="M52 42 L86 42 M45 58 L45 88 M93 58 L93 88" strokeWidth="1.6" />

          {/* Moses with raised staff leading the people */}
          <circle cx="168" cy="48" r="7" strokeWidth="1.2" />
          <path d="M156 56 L150 136 L186 136 L180 56 Z" strokeWidth="1.2" />
          <path d="M182 60 L208 38 M208 22 L208 136" strokeWidth="1.25" />

          {/* Israelites journeying with staffs */}
          <circle cx="246" cy="60" r="6.2" strokeWidth="1.1" />
          <path d="M238 68 L234 136 L258 136 L254 68 Z" strokeWidth="1.1" />
          <circle cx="284" cy="64" r="6" strokeWidth="1.1" />
          <path d="M276 72 L272 136 L296 136 L292 72 Z" strokeWidth="1.1" />
        </svg>
      );

    case 'bronze_serpent':
      return (
        <svg
          viewBox="0 0 360 155"
          className="w-full h-auto max-h-40"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Traditional line drawing of Moses lifting up the bronze serpent in the wilderness"
        >
          {/* Wilderness tents & horizon */}
          <path d="M14 136 L346 136" strokeWidth="1.15" />
          <path d="M28 136 L58 98 L88 136 M275 136 L305 98 L335 136" strokeWidth="0.95" opacity="0.65" />

          {/* High standard / pole with Bronze Serpent in center */}
          <path d="M180 20 L180 136" strokeWidth="1.5" />
          <path d="M156 38 L204 38" strokeWidth="1.4" />
          <path d="M168 56 C158 44, 202 42, 190 30 C180 22, 166 32, 180 68" strokeWidth="1.35" />

          {/* Moses pointing toward the lifted standard */}
          <circle cx="126" cy="58" r="6.8" strokeWidth="1.15" />
          <path d="M116 66 L110 136 L142 136 L136 66 Z" strokeWidth="1.15" />
          <path d="M136 72 L166 48" strokeWidth="1.2" />

          {/* Kneeling Israelite looking up in faith */}
          <circle cx="232" cy="78" r="6.5" strokeWidth="1.15" />
          <path d="M224 86 L216 136 L248 136 L240 86 Z" strokeWidth="1.15" />
          <path d="M224 92 L198 68" strokeWidth="1.15" />
        </svg>
      );

    case 'crucifixion_calvary':
      return (
        <svg
          viewBox="0 0 360 155"
          className="w-full h-auto max-h-40"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Traditional line drawing of Golgotha and the three crosses"
        >
          {/* Hill of Golgotha */}
          <path d="M20 138 Q180 82 340 138" strokeWidth="1.25" />
          {/* Engraved sky rays */}
          <path d="M180 16 L90 54 M180 16 L270 54 M180 16 L130 32 M180 16 L230 32" strokeWidth="0.65" opacity="0.55" />
          {/* Central Cross */}
          <path d="M180 20 L180 108 M154 42 L206 42" strokeWidth="1.6" />
          {/* Two side crosses */}
          <path d="M112 42 L112 116 M94 58 L130 58" strokeWidth="1.2" />
          <path d="M248 42 L248 116 M230 58 L266 58" strokeWidth="1.2" />
        </svg>
      );

    case 'creation_light':
      return (
        <svg
          viewBox="0 0 360 155"
          className="w-full h-auto max-h-40"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Traditional line drawing of the Creation of Light over the waters"
        >
          {/* Primordial waters below */}
          <path d="M16 118 Q65 110 115 118 T215 118 T344 118" strokeWidth="1.15" />
          <path d="M24 128 Q80 121 135 128 T245 128 T336 128" strokeWidth="0.95" opacity="0.75" />
          <path d="M36 138 Q100 132 165 138 T324 138" strokeWidth="0.8" opacity="0.55" />

          {/* Radiant sun/light burst parting the clouds */}
          <circle cx="180" cy="48" r="16" strokeWidth="1.2" />
          <path d="M180 14 L180 26 M180 70 L180 108 M146 48 L110 48 M214 48 L250 48" strokeWidth="1" />
          <path d="M156 26 L124 14 M204 26 L236 14 M156 68 L112 104 M204 68 L248 104" strokeWidth="0.85" opacity="0.75" />
          <path d="M166 72 L144 108 M194 72 L216 108" strokeWidth="0.65" strokeDasharray="3 3" opacity="0.65" />
        </svg>
      );

    case 'melchizedek_abraham':
      return (
        <svg
          viewBox="0 0 360 155"
          className="w-full h-auto max-h-40"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Traditional line drawing of Melchizedek blessing Abraham with bread and wine"
        >
          <path d="M16 136 L344 136" strokeWidth="1.15" />
          {/* Melchizedek King of Salem on left with crown & chalice */}
          <path d="M118 38 L122 32 L128 38 L134 32 L138 38 Z" strokeWidth="1" />
          <circle cx="128" cy="46" r="6.8" strokeWidth="1.2" />
          <path d="M116 54 L110 136 L146 136 L140 54 Z" strokeWidth="1.2" />
          {/* Chalice & bread */}
          <path d="M142 72 L166 66 M166 56 L174 56 L170 64 L170 70 L166 70" strokeWidth="1.1" />

          {/* Abraham bowing in reverence on right */}
          <circle cx="222" cy="58" r="6.8" strokeWidth="1.15" />
          <path d="M212 66 L206 136 L242 136 L234 66 Z" strokeWidth="1.15" />
          <path d="M212 76 L188 72" strokeWidth="1.15" />
        </svg>
      );

    case 'isaiah_prophecy':
      return (
        <svg
          viewBox="0 0 360 155"
          className="w-full h-auto max-h-40"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Traditional line drawing of the Prophet Isaiah proclaiming the sign of Immanuel"
        >
          <path d="M16 136 L344 136" strokeWidth="1.15" />
          {/* Classical pillar of Jerusalem */}
          <path d="M58 28 L58 136 M82 28 L82 136 M52 28 L88 28" strokeWidth="1" opacity="0.6" />

          {/* Prophet Isaiah with scroll & outstretched hand */}
          <circle cx="152" cy="48" r="7" strokeWidth="1.2" />
          <path d="M140 56 L134 136 L172 136 L164 56 Z" strokeWidth="1.2" />
          <path d="M164 64 L204 46" strokeWidth="1.25" />
          <path d="M122 72 L138 72 L138 96 L122 96 Z" strokeWidth="1" />

          {/* Listener of the House of David */}
          <circle cx="248" cy="56" r="6.8" strokeWidth="1.15" />
          <path d="M238 64 L232 136 L266 136 L260 64 Z" strokeWidth="1.15" />
        </svg>
      );

    case 'lamb_of_god':
      return (
        <svg
          viewBox="0 0 360 155"
          className="w-full h-auto max-h-40"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Traditional line drawing of Behold the Lamb of God"
        >
          <path d="M16 134 L344 134" strokeWidth="1.15" />
          {/* John the Baptist pointing toward Christ */}
          <circle cx="114" cy="50" r="6.8" strokeWidth="1.15" />
          <path d="M104 58 L98 134 L130 134 L124 58 Z" strokeWidth="1.15" />
          <path d="M124 64 L162 56" strokeWidth="1.25" />

          {/* Christ walking in the distance */}
          <circle cx="228" cy="48" r="12" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.65" />
          <circle cx="228" cy="48" r="6.8" strokeWidth="1.2" />
          <path d="M218 56 L212 134 L244 134 L238 56 Z" strokeWidth="1.2" />
        </svg>
      );

    case 'nicodemus_night':
    default:
      return (
        <svg
          viewBox="0 0 360 155"
          className="w-full h-auto max-h-40"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          role="img"
          aria-label="Traditional line drawing of Jesus teaching Nicodemus by night"
        >
          <path d="M16 136 L344 136" strokeWidth="1.15" />
          {/* Crescent moon & night stars */}
          <path d="M292 24 A12 12 0 1 0 304 40 A9 9 0 1 1 292 24 Z" strokeWidth="1" />
          {/* Oil lamp on pedestal in center */}
          <path d="M180 88 L180 136 M168 88 L192 88" strokeWidth="1.1" />
          <path d="M172 84 Q180 78 188 84 Z" strokeWidth="1.1" />
          <path d="M180 72 Q184 78 180 82 Q176 78 180 72 Z" strokeWidth="1" />

          {/* Jesus seated on left */}
          <circle cx="124" cy="54" r="7" strokeWidth="1.2" />
          <path d="M112 62 L106 136 L142 136 L136 62 Z" strokeWidth="1.2" />
          <path d="M136 72 L162 60" strokeWidth="1.2" />

          {/* Nicodemus leaning in to listen on right */}
          <circle cx="236" cy="56" r="7" strokeWidth="1.15" />
          <path d="M224 64 L218 136 L254 136 L248 64 Z" strokeWidth="1.15" />
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
    <figure
      className={`my-4 rounded-xl border px-4 py-3.5 transition select-none ${
        isLight
          ? 'bg-[#FAF7F0] border-stone-300/80 text-stone-900'
          : 'bg-[#141414] border-zinc-800 text-zinc-200'
      }`}
    >
      <div className="mx-auto max-w-md">
        <EngravedSceneArtwork sceneType={illustration.sceneType} />
      </div>
      <figcaption className="mt-2.5 pt-2 border-t border-stone-200/80 dark:border-zinc-800 text-center space-y-0.5">
        <p
          className={`font-serif text-xs sm:text-sm font-bold tracking-tight ${
            isLight ? 'text-stone-900' : 'text-zinc-100'
          }`}
        >
          {illustration.title} ({illustration.scriptureRef})
        </p>
        <p
          className={`font-serif text-[11px] sm:text-xs italic leading-relaxed ${
            isLight ? 'text-stone-600' : 'text-zinc-400'
          }`}
        >
          {illustration.caption}
        </p>
        <p
          className={`text-[10px] pt-0.5 ${
            isLight ? 'text-stone-400' : 'text-zinc-500'
          }`}
        >
          {illustration.attribution}
        </p>
      </figcaption>
    </figure>
  );
}

