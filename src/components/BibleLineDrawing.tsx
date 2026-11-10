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
  | 'throne_new_jerusalem'
  | 'beatitudes_mount'
  | 'salt_and_light'
  | 'love_enemies_prayer'
  | 'ten_commandments_sinai'
  | 'david_and_goliath'
  | 'shepherd_psalm_23'
  | 'daniel_lions_den'
  | 'jonah_great_fish'
  | 'feeding_five_thousand'
  | 'calming_the_storm'
  | 'good_samaritan'
  | 'prodigal_son_father'
  | 'zacchaeus_sycamore'
  | 'last_supper_communion'
  | 'armor_of_god';

export interface BiblicalLineIllustration {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  sceneType: SceneType;
  childrenStoryTitle?: string;
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

const SCENE_STORY_TITLES: Record<SceneType, string> = {
  creation_light: 'God Creates Light, Sky, Land & Living Creatures',
  eden_garden_tree: 'The Garden of Eden & God’s Promise',
  noah_ark_flood: 'Noah’s Ark & God’s Rainbow Promise',
  abraham_covenant_altar: 'God’s Promise to Abraham Under the Stars',
  melchizedek_abraham: 'Abraham Meets King Melchizedek',
  joseph_angel_dream: 'God’s Messenger Brings Good News',
  moses_exodus_passover: 'Moses & The Passover Deliverance',
  red_sea_parting: 'God Parts the Waters for His People',
  moses_song_witness: 'Moses Teaches God’s Covenant Word',
  wilderness_scroll: 'Learning & Living by God’s Word',
  bronze_serpent: 'Looking Up in Faith for Healing in the Wilderness',
  david_harp_psalm: 'Songs of Praise, Wisdom & Trust in the Lord',
  isaiah_prophecy: 'The Prophet Shares God’s Promise of Hope',
  nativity_immanuel: 'The Birth of Jesus — Immanuel, God With Us',
  temple_presentation: 'Worship & Dedication in the House of the Lord',
  baptism_jordan: 'The Baptism at the Jordan River',
  calling_fishermen: 'Jesus Calls the Fishermen by the Sea of Galilee',
  healing_multitudes: 'Jesus Heals & Helps the People with Kindness',
  jesus_teaching: 'Jesus Teaches About God’s Kingdom',
  jesus_crowd_reconciliation: 'Forgiving, Sharing & Loving One Another',
  nicodemus_night: 'Talking with Jesus Under the Night Sky',
  lamb_of_god: 'The Good Shepherd & The Lamb of God',
  triumphal_entry: 'Hosanna! Welcoming the King into Jerusalem',
  crucifixion_calvary: 'Jesus Gives His Life Out of Love for All',
  empty_tomb_resurrection: 'He Is Risen! The Joy of the Empty Tomb',
  pentecost_spirit: 'God’s Spirit Fills Believers with Joy & Courage',
  apostolic_scroll: 'Sharing the Good News Letters with the Church',
  throne_new_jerusalem: 'God’s Shining City & Forever Kingdom',
  beatitudes_mount: 'Jesus Blesses and Teaches on the Mountain',
  salt_and_light: 'You Are the Salt and the Light of the World',
  love_enemies_prayer: 'Loving and Praying for Everyone Like Our Father',
  ten_commandments_sinai: 'God Gives the Ten Holy Commandments on Mount Sinai',
  david_and_goliath: 'Young David With Faith Defeats Giant Goliath',
  shepherd_psalm_23: 'The Good Shepherd Leads Beside Still Waters',
  daniel_lions_den: 'Daniel Safe and Protected in the Lions’ Den',
  jonah_great_fish: 'Jonah and the Great Big Fish by the Shore',
  feeding_five_thousand: 'Jesus Multiplies the Five Loaves and Two Fish',
  calming_the_storm: 'Jesus Calms the Wind and Waves from the Boat',
  good_samaritan: 'The Good Samaritan Shows Loving Kindness',
  prodigal_son_father: 'The Loving Father Welcomes His Lost Son Home',
  zacchaeus_sycamore: 'Jesus Calls Zacchaeus Down from the Tree',
  last_supper_communion: 'Jesus Breaks the Bread with His Disciples',
  armor_of_god: 'Standing Strong in the Whole Armor of God',
};

const BOOK_SCENE_POOLS: Record<string, SceneType[]> = {
  torah: [
    'creation_light',
    'eden_garden_tree',
    'noah_ark_flood',
    'abraham_covenant_altar',
    'melchizedek_abraham',
    'joseph_angel_dream',
    'moses_exodus_passover',
    'red_sea_parting',
    'moses_song_witness',
    'wilderness_scroll',
    'bronze_serpent',
    'temple_presentation',
    'lamb_of_god',
  ],
  history: [
    'moses_song_witness',
    'red_sea_parting',
    'abraham_covenant_altar',
    'david_harp_psalm',
    'temple_presentation',
    'isaiah_prophecy',
    'jesus_crowd_reconciliation',
    'wilderness_scroll',
  ],
  wisdom: [
    'david_harp_psalm',
    'creation_light',
    'lamb_of_god',
    'wilderness_scroll',
    'temple_presentation',
    'eden_garden_tree',
    'throne_new_jerusalem',
  ],
  prophets: [
    'isaiah_prophecy',
    'nativity_immanuel',
    'lamb_of_god',
    'throne_new_jerusalem',
    'pentecost_spirit',
    'triumphal_entry',
    'moses_song_witness',
    'david_harp_psalm',
  ],
  gospels: [
    'joseph_angel_dream',
    'nativity_immanuel',
    'temple_presentation',
    'baptism_jordan',
    'wilderness_scroll',
    'calling_fishermen',
    'healing_multitudes',
    'jesus_teaching',
    'jesus_crowd_reconciliation',
    'nicodemus_night',
    'lamb_of_god',
    'triumphal_entry',
    'crucifixion_calvary',
    'empty_tomb_resurrection',
  ],
  epistles: [
    'apostolic_scroll',
    'pentecost_spirit',
    'jesus_crowd_reconciliation',
    'jesus_teaching',
    'abraham_covenant_altar',
    'lamb_of_god',
    'empty_tomb_resurrection',
    'throne_new_jerusalem',
  ],
};

function getPoolForBook(bookLower: string): SceneType[] {
  if (
    bookLower === 'genesis' ||
    bookLower === 'exodus' ||
    bookLower === 'leviticus' ||
    bookLower === 'numbers' ||
    bookLower === 'deuteronomy'
  ) {
    return BOOK_SCENE_POOLS.torah;
  }
  if (
    bookLower === 'joshua' ||
    bookLower === 'judges' ||
    bookLower === 'ruth' ||
    bookLower === '1 samuel' ||
    bookLower === '2 samuel' ||
    bookLower === '1 kings' ||
    bookLower === '2 kings' ||
    bookLower === '1 chronicles' ||
    bookLower === '2 chronicles' ||
    bookLower === 'ezra' ||
    bookLower === 'nehemiah' ||
    bookLower === 'esther'
  ) {
    return BOOK_SCENE_POOLS.history;
  }
  if (
    bookLower === 'job' ||
    bookLower === 'psalms' ||
    bookLower === 'proverbs' ||
    bookLower === 'ecclesiastes' ||
    bookLower === 'song of solomon'
  ) {
    return BOOK_SCENE_POOLS.wisdom;
  }
  if (
    bookLower === 'isaiah' ||
    bookLower === 'jeremiah' ||
    bookLower === 'lamentations' ||
    bookLower === 'ezekiel' ||
    bookLower === 'daniel' ||
    bookLower === 'hosea' ||
    bookLower === 'joel' ||
    bookLower === 'amos' ||
    bookLower === 'obadiah' ||
    bookLower === 'jonah' ||
    bookLower === 'micah' ||
    bookLower === 'nahum' ||
    bookLower === 'habakkuk' ||
    bookLower === 'zephaniah' ||
    bookLower === 'haggai' ||
    bookLower === 'zechariah' ||
    bookLower === 'malachi'
  ) {
    return BOOK_SCENE_POOLS.prophets;
  }
  if (
    bookLower === 'matthew' ||
    bookLower === 'mark' ||
    bookLower === 'luke' ||
    bookLower === 'john'
  ) {
    return BOOK_SCENE_POOLS.gospels;
  }
  return BOOK_SCENE_POOLS.epistles;
}

/**
 * Determines the primary visual storytelling scene for any Bible chapter.
 * Persistent and deterministic across navigation and page refreshes.
 */
function resolvePrimaryChapterScene(book: string, chapter: number): SceneType {
  const b = book.trim().toLowerCase();

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
    if (chapter === 2 || chapter === 3) return 'eden_garden_tree';
    if (chapter === 4) return 'abraham_covenant_altar';
    if (chapter >= 6 && chapter <= 9)
      return chapter % 2 === 0 ? 'noah_ark_flood' : 'abraham_covenant_altar';
    if (chapter === 12 || chapter === 15 || chapter === 17 || chapter === 22)
      return 'abraham_covenant_altar';
    if (chapter === 14) return 'melchizedek_abraham';
    if (chapter === 28 || chapter === 32 || chapter === 37 || chapter === 41)
      return 'joseph_angel_dream';
  }

  if (b === 'exodus') {
    if (chapter === 1 || chapter === 2) return 'moses_exodus_passover';
    if (chapter === 3 || chapter === 19 || chapter === 20 || chapter === 24 || chapter === 32 || chapter === 34)
      return 'moses_song_witness';
    if (chapter === 12) return 'moses_exodus_passover';
    if (chapter === 14 || chapter === 15) return 'red_sea_parting';
    if (chapter === 16 || chapter === 17) return 'wilderness_scroll';
    if (chapter >= 25 && chapter <= 40)
      return chapter % 2 === 1 ? 'temple_presentation' : 'lamb_of_god';
  }

  if (b === 'leviticus') {
    if (chapter === 1 || chapter === 16) return 'lamb_of_god';
    if (chapter === 8 || chapter === 9) return 'temple_presentation';
    if (chapter === 19 || chapter === 23) return 'moses_song_witness';
  }

  if (b === 'numbers') {
    if (chapter === 21) return 'bronze_serpent';
    if (chapter === 6 || chapter === 11 || chapter === 20 || chapter === 24)
      return 'moses_song_witness';
    if (chapter === 9) return 'moses_exodus_passover';
  }

  if (b === 'deuteronomy') {
    if (chapter === 1 || chapter === 5 || chapter === 6 || chapter === 28 || chapter === 31 || chapter === 32)
      return 'moses_song_witness';
    if (chapter === 8) return 'wilderness_scroll';
    if (chapter === 16) return 'moses_exodus_passover';
    if (chapter === 18) return 'isaiah_prophecy';
  }

  if (b === 'joshua') {
    if (chapter === 1 || chapter === 24) return 'moses_song_witness';
    if (chapter === 3 || chapter === 4) return 'red_sea_parting';
    if (chapter === 6) return 'triumphal_entry';
  }

  if (b === '1 samuel' || b === '2 samuel') {
    if (b === '1 samuel' && chapter === 17) return 'david_and_goliath';
    if ((b === '1 samuel' && chapter === 16) || (b === '2 samuel' && chapter === 7))
      return 'david_harp_psalm';
  }

  if (b === '1 kings' && (chapter === 6 || chapter === 8)) {
    return 'temple_presentation';
  }

  if (b === 'psalms') {
    if (chapter === 22) return 'crucifixion_calvary';
    if (chapter === 23) return 'shepherd_psalm_23';
    if (chapter === 2 || chapter === 110 || chapter === 150) return 'david_harp_psalm';
    if (chapter === 119 || chapter === 19 || chapter === 1) return 'wilderness_scroll';
  }

  if (b === 'isaiah') {
    if (chapter === 6) return 'throne_new_jerusalem';
    if (chapter === 7 || chapter === 9) return 'nativity_immanuel';
    if (chapter === 40) return 'wilderness_scroll';
    if (chapter === 53) return 'lamb_of_god';
    if (chapter === 61) return 'jesus_teaching';
  }

  if (b === 'matthew') {
    if (chapter === 1) return 'joseph_angel_dream';
    if (chapter === 2) return 'nativity_immanuel';
    if (chapter === 3) return 'baptism_jordan';
    if (chapter === 4) return 'wilderness_scroll';
    if (chapter === 5) return 'beatitudes_mount';
    if (chapter === 14) return 'feeding_five_thousand';
    if (chapter === 26) return 'last_supper_communion';
    if (chapter === 6) return 'jesus_crowd_reconciliation';
    if (chapter === 7) return 'wilderness_scroll';
    if (chapter === 8 || chapter === 9) return 'healing_multitudes';
    if (chapter === 13) return 'calling_fishermen';
    if (chapter === 14) return 'healing_multitudes';
    if (chapter === 18) return 'jesus_crowd_reconciliation';
    if (chapter === 21) return 'triumphal_entry';
    if (chapter === 22) return 'jesus_teaching';
    if (chapter === 26) return 'nicodemus_night';
    if (chapter === 27) return 'crucifixion_calvary';
    if (chapter === 28) return 'empty_tomb_resurrection';
  }

  if (b === 'mark') {
    if (chapter === 1) return 'baptism_jordan';
    if (chapter === 2 || chapter === 5) return 'healing_multitudes';
    if (chapter === 4) return 'calling_fishermen';
    if (chapter === 11) return 'triumphal_entry';
    if (chapter === 15) return 'crucifixion_calvary';
    if (chapter === 16) return 'empty_tomb_resurrection';
  }

  if (b === 'luke') {
    if (chapter === 10) return 'good_samaritan';
    if (chapter === 15) return 'prodigal_son_father';
    if (chapter === 19) return 'zacchaeus_sycamore';
    if (chapter === 22) return 'last_supper_communion';
    if (chapter === 1) return 'joseph_angel_dream';
    if (chapter === 2) return 'nativity_immanuel';
    if (chapter === 3) return 'baptism_jordan';
    if (chapter === 4) return 'wilderness_scroll';
    if (chapter === 5) return 'calling_fishermen';
    if (chapter === 15) return 'jesus_crowd_reconciliation';
    if (chapter === 19) return 'triumphal_entry';
    if (chapter === 23) return 'crucifixion_calvary';
    if (chapter === 24) return 'empty_tomb_resurrection';
  }

  if (b === 'john') {
    if (chapter === 1) return 'creation_light';
    if (chapter === 2) return 'temple_presentation';
    if (chapter === 3) return 'nicodemus_night';
    if (chapter === 4) return 'jesus_teaching';
    if (chapter === 6 || chapter === 9 || chapter === 11) return 'healing_multitudes';
    if (chapter === 10) return 'lamb_of_god';
    if (chapter === 12) return 'triumphal_entry';
    if (chapter === 13 || chapter === 15) return 'jesus_crowd_reconciliation';
    if (chapter === 14 || chapter === 16 || chapter === 17) return 'jesus_teaching';
    if (chapter === 19) return 'crucifixion_calvary';
    if (chapter === 20) return 'empty_tomb_resurrection';
    if (chapter === 21) return 'calling_fishermen';
  }

  if (b === 'acts') {
    if (chapter === 1) return 'jesus_teaching';
    if (chapter === 2) return 'pentecost_spirit';
    if (chapter === 3) return 'healing_multitudes';
    if (chapter === 9) return 'joseph_angel_dream';
  }

  if (b === 'revelation') {
    if (chapter === 1 || chapter === 4 || chapter === 21 || chapter === 22)
      return 'throne_new_jerusalem';
    if (chapter === 5) return 'lamb_of_god';
    if (chapter === 12) return 'nativity_immanuel';
  }

  // Deterministic chapter-specific fallback from book's thematic pool
  const pool = getPoolForBook(b);
  let hash = 0;
  for (let i = 0; i < b.length; i++) {
    hash = (hash * 31 + b.charCodeAt(i)) % 997;
  }
  const idx = (hash + chapter * 3) % pool.length;
  return pool[idx];
}


export function getIllustrationForSection(
  book: string,
  chapter: number,
  heading?: string,
  verse?: number
): BiblicalLineIllustration | null {
  const b = book.trim().toLowerCase();
  const h = (heading || '').toLowerCase();

  // Matthew 5 distinct sections
  if (b === 'matthew' && chapter === 5) {
    if (h.includes('beatitudes') || verse === 1) {
      return { id: 'ill-sec-mat-5-beatitudes', book, chapter, verse: 1, sceneType: 'beatitudes_mount', childrenStoryTitle: SCENE_STORY_TITLES.beatitudes_mount };
    }
    if (h.includes('salt') || h.includes('light') || (verse && verse >= 13 && verse <= 16)) {
      return { id: 'ill-sec-mat-5-salt-light', book, chapter, verse: 13, sceneType: 'salt_and_light', childrenStoryTitle: SCENE_STORY_TITLES.salt_and_light };
    }
    if (h.includes('fulfillment') || h.includes('law') || (verse && verse >= 17 && verse <= 20)) {
      return { id: 'ill-sec-mat-5-law', book, chapter, verse: 17, sceneType: 'wilderness_scroll', childrenStoryTitle: SCENE_STORY_TITLES.wilderness_scroll };
    }
    if (h.includes('anger') || h.includes('reconciliation') || (verse && verse >= 21 && verse <= 26)) {
      return { id: 'ill-sec-mat-5-reconcile', book, chapter, verse: 21, sceneType: 'jesus_crowd_reconciliation', childrenStoryTitle: SCENE_STORY_TITLES.jesus_crowd_reconciliation };
    }
    if (h.includes('love') || h.includes('enemies') || (verse && verse >= 43)) {
      return { id: 'ill-sec-mat-5-love-enemies', book, chapter, verse: 43, sceneType: 'love_enemies_prayer', childrenStoryTitle: SCENE_STORY_TITLES.love_enemies_prayer };
    }
  }

  // Heading-based resolution
  if (h.includes('beatitude')) {
    return { id: `ill-sec-${b}-${chapter}-beatitudes`, book, chapter, verse: verse || 1, sceneType: 'beatitudes_mount', childrenStoryTitle: SCENE_STORY_TITLES.beatitudes_mount };
  }
  if (h.includes('salt and light') || h.includes('salt of the earth') || h.includes('light of the world')) {
    return { id: `ill-sec-${b}-${chapter}-salt`, book, chapter, verse: verse || 13, sceneType: 'salt_and_light', childrenStoryTitle: SCENE_STORY_TITLES.salt_and_light };
  }
  if (h.includes('ten commandments') || h.includes('commandments')) {
    return { id: `ill-sec-${b}-${chapter}-decalogue`, book, chapter, verse: verse || 1, sceneType: 'ten_commandments_sinai', childrenStoryTitle: SCENE_STORY_TITLES.ten_commandments_sinai };
  }
  if (h.includes('goliath') || (b === '1 samuel' && chapter === 17)) {
    return { id: `ill-sec-${b}-${chapter}-goliath`, book, chapter, verse: verse || 1, sceneType: 'david_and_goliath', childrenStoryTitle: SCENE_STORY_TITLES.david_and_goliath };
  }
  if (h.includes('shepherd') || (b === 'psalms' && chapter === 23)) {
    return { id: `ill-sec-${b}-${chapter}-shepherd`, book, chapter, verse: verse || 1, sceneType: 'shepherd_psalm_23', childrenStoryTitle: SCENE_STORY_TITLES.shepherd_psalm_23 };
  }
  if (h.includes('lions’ den') || h.includes('lions den') || (b === 'daniel' && chapter === 6)) {
    return { id: `ill-sec-${b}-${chapter}-daniel`, book, chapter, verse: verse || 1, sceneType: 'daniel_lions_den', childrenStoryTitle: SCENE_STORY_TITLES.daniel_lions_den };
  }
  if (h.includes('jonah') || b === 'jonah') {
    return { id: `ill-sec-${b}-${chapter}-jonah`, book, chapter, verse: verse || 1, sceneType: 'jonah_great_fish', childrenStoryTitle: SCENE_STORY_TITLES.jonah_great_fish };
  }
  if (h.includes('five thousand') || h.includes('loaves')) {
    return { id: `ill-sec-${b}-${chapter}-5000`, book, chapter, verse: verse || 1, sceneType: 'feeding_five_thousand', childrenStoryTitle: SCENE_STORY_TITLES.feeding_five_thousand };
  }
  if (h.includes('calms the storm') || h.includes('walks on the water') || h.includes('wind and waves')) {
    return { id: `ill-sec-${b}-${chapter}-storm`, book, chapter, verse: verse || 1, sceneType: 'calming_the_storm', childrenStoryTitle: SCENE_STORY_TITLES.calming_the_storm };
  }
  if (h.includes('good samaritan')) {
    return { id: `ill-sec-${b}-${chapter}-samaritan`, book, chapter, verse: verse || 25, sceneType: 'good_samaritan', childrenStoryTitle: SCENE_STORY_TITLES.good_samaritan };
  }
  if (h.includes('lost son') || h.includes('prodigal')) {
    return { id: `ill-sec-${b}-${chapter}-prodigal`, book, chapter, verse: verse || 11, sceneType: 'prodigal_son_father', childrenStoryTitle: SCENE_STORY_TITLES.prodigal_son_father };
  }
  if (h.includes('zacchaeus')) {
    return { id: `ill-sec-${b}-${chapter}-zacchaeus`, book, chapter, verse: verse || 1, sceneType: 'zacchaeus_sycamore', childrenStoryTitle: SCENE_STORY_TITLES.zacchaeus_sycamore };
  }
  if (h.includes('last supper') || h.includes('communion') || h.includes('lord’s supper')) {
    return { id: `ill-sec-${b}-${chapter}-supper`, book, chapter, verse: verse || 1, sceneType: 'last_supper_communion', childrenStoryTitle: SCENE_STORY_TITLES.last_supper_communion };
  }
  if (h.includes('armor of god') || (b === 'ephesians' && chapter === 6)) {
    return { id: `ill-sec-${b}-${chapter}-armor`, book, chapter, verse: verse || 10, sceneType: 'armor_of_god', childrenStoryTitle: SCENE_STORY_TITLES.armor_of_god };
  }

  return null;
}

export function getIllustrationForChapter(
  book: string,
  chapter: number
): BiblicalLineIllustration | null {
  if (chapter <= 0) return null;
  const b = book.trim().toLowerCase();
  const pool = getPoolForBook(b);
  let scene = resolvePrimaryChapterScene(book, chapter);

  // Ensure consecutive chapters in the same book have distinct illustrations
  if (chapter > 1) {
    const prevScene = resolvePrimaryChapterScene(book, chapter - 1);
    if (prevScene === scene) {
      const currentIdx = pool.indexOf(scene);
      scene = pool[(currentIdx + 1) % pool.length];
    }
  }

  return {
    id: `ill-chap-${b}-${chapter}`,
    book,
    chapter,
    verse: 1,
    sceneType: scene,
    childrenStoryTitle: SCENE_STORY_TITLES[scene],
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


    case 'beatitudes_mount':
      return (
        <svg viewBox="0 0 400 175" className={svgClass} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 156 L388 156" strokeWidth="1.3" />
          {/* Mountains rising into background */}
          <path d="M20 156 L120 74 L210 156" strokeWidth="1.2" opacity="0.6" />
          <path d="M160 156 L270 54 L380 156" strokeWidth="1.2" opacity="0.5" />
          <path d="M170 30 L170 12 M150 36 L138 24 M190 36 L202 24" strokeWidth="1" strokeDasharray="2 3" opacity="0.6" />
          {/* Jesus seated on hill on left raising right hand */}
          <circle cx="168" cy="72" r="8" strokeWidth="1.35" />
          <path d="M152 82 Q144 120 140 156 L196 156 Q190 120 184 82 Z" strokeWidth="1.35" />
          <path d="M184 94 L212 78" strokeWidth="1.4" />
          {/* Multitude listening on slopes */}
          <circle cx="242" cy="116" r="6" strokeWidth="1.1" />
          <path d="M232 124 L228 156 L256 156 L252 124 Z" strokeWidth="1.1" />
          <circle cx="282" cy="112" r="6" strokeWidth="1.1" />
          <path d="M272 120 L268 156 L296 156 L292 120 Z" strokeWidth="1.1" />
          <circle cx="328" cy="122" r="5.5" strokeWidth="1.05" />
          <path d="M318 129 L314 156 L342 156 L338 129 Z" strokeWidth="1.05" />
        </svg>
      );

    case 'salt_and_light':
      return (
        <svg viewBox="0 0 400 175" className={svgClass} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M24 154 L376 154" strokeWidth="1.3" />
          {/* Table stand */}
          <path d="M140 154 L140 114 L260 114 L260 154" strokeWidth="1.3" />
          {/* Lampstand elevated in center */}
          <path d="M200 114 L200 52" strokeWidth="2.2" />
          <path d="M184 114 L216 114" strokeWidth="1.5" />
          {/* Clay oil lamp */}
          <path d="M182 52 Q200 42 218 52 Q224 58 200 60 Q176 58 182 52 Z" strokeWidth="1.3" />
          {/* Radiating flame */}
          <path d="M200 32 Q206 42 200 48 Q194 42 200 32 Z" strokeWidth="1.35" fill="none" />
          {/* Sunburst light rays shining around the room */}
          <path d="M200 20 L200 10 M176 26 L164 16 M224 26 L236 16 M156 42 L140 40 M244 42 L260 40 M166 62 L150 68 M234 62 L250 68" strokeWidth="1" strokeDasharray="3 3" opacity="0.75" />
          {/* Salt bowl and salt cellar */}
          <path d="M84 154 L88 132 L120 132 L124 154 Z" strokeWidth="1.25" />
          <path d="M92 132 Q104 124 116 132" strokeWidth="1.1" />
          <circle cx="102" cy="128" r="1" />
          <circle cx="108" cy="126" r="1" />
          <circle cx="105" cy="130" r="1" />
        </svg>
      );

    case 'love_enemies_prayer':
      return (
        <svg viewBox="0 0 400 175" className={svgClass} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 156 L380 156" strokeWidth="1.3" />
          {/* Sun shining on righteous and unrighteous */}
          <circle cx="92" cy="52" r="16" strokeWidth="1.3" />
          <path d="M92 26 L92 16 M92 78 L92 88 M66 52 L56 52 M118 52 L128 52 M74 34 L66 26 M110 70 L118 78 M74 70 L66 78 M110 34 L118 26" strokeWidth="1" strokeDasharray="2 3" opacity="0.7" />
          {/* Gentle rain clouds providing water for fields */}
          <path d="M270 48 Q282 36 298 42 Q316 38 326 50 Q336 54 330 64 L264 64 Q258 54 270 48 Z" strokeWidth="1.2" />
          <path d="M276 74 L272 86 M294 74 L290 86 M312 74 L308 86" strokeWidth="1" strokeDasharray="2 2" opacity="0.65" />
          {/* Hands lifted in peaceful prayer in center */}
          <path d="M184 156 L192 108 L198 108 L194 156 Z" strokeWidth="1.3" />
          <path d="M216 156 L208 108 L202 108 L206 156 Z" strokeWidth="1.3" />
          <circle cx="200" cy="98" r="8" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.6" />
        </svg>
      );

    case 'ten_commandments_sinai':
      return (
        <svg viewBox="0 0 400 175" className={svgClass} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M16 156 L384 156" strokeWidth="1.3" />
          {/* Mount Sinai crags & clouds */}
          <path d="M40 156 L160 52 L260 156" strokeWidth="1.2" opacity="0.6" />
          <path d="M120 38 Q160 22 200 36 Q240 20 280 34" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />
          {/* Two Stone Tablets */}
          <path d="M164 68 Q164 56 178 56 Q192 56 192 68 L192 144 L164 144 Z" strokeWidth="1.5" />
          <path d="M196 68 Q196 56 210 56 Q224 56 224 68 L224 144 L196 144 Z" strokeWidth="1.5" />
          {/* Inscribed commandments lines */}
          <path d="M172 74 L184 74 M172 86 L184 86 M172 98 L184 98 M172 110 L184 110 M172 122 L184 122" strokeWidth="1.2" />
          <path d="M204 74 L216 74 M204 86 L216 86 M204 98 L216 98 M204 110 L216 110 M204 122 L216 122" strokeWidth="1.2" />
        </svg>
      );

    case 'david_and_goliath':
      return (
        <svg viewBox="0 0 400 175" className={svgClass} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 154 L380 154" strokeWidth="1.3" />
          {/* Brook in valley of Elah with smooth stones */}
          <path d="M140 154 Q170 146 200 154 Q230 162 260 154" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
          <circle cx="166" cy="151" r="2" />
          <circle cx="174" cy="150" r="2" />
          <circle cx="182" cy="152" r="2" />
          {/* Young David on left with sling */}
          <circle cx="112" cy="88" r="7.5" strokeWidth="1.35" />
          <path d="M102 98 L96 154 L128 154 L122 98 Z" strokeWidth="1.35" />
          <path d="M122 108 L146 94 M146 94 L152 74" strokeWidth="1.4" />
          {/* Giant Goliath on right with spear and shield */}
          <circle cx="288" cy="52" r="10" strokeWidth="1.5" />
          <path d="M272 65 L264 154 L312 154 L304 65 Z" strokeWidth="1.5" />
          <path d="M258 78 L258 138 L274 138 L274 78 Z" strokeWidth="1.3" />
          <path d="M304 74 L328 32 M324 36 L332 28" strokeWidth="1.8" />
        </svg>
      );

    case 'shepherd_psalm_23':
      return (
        <svg viewBox="0 0 400 175" className={svgClass} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 154 L388 154" strokeWidth="1.3" />
          {/* Still Waters brook */}
          <path d="M0 134 Q100 120 200 136 T400 132" strokeWidth="1.2" opacity="0.6" />
          {/* Rolling green pastures */}
          <path d="M30 154 Q120 102 240 142" strokeWidth="1" opacity="0.5" />
          {/* Good Shepherd with staff */}
          <circle cx="152" cy="62" r="7.5" strokeWidth="1.35" />
          <path d="M140 71 L134 154 L170 154 L164 71 Z" strokeWidth="1.35" />
          <path d="M172 154 L172 52 Q172 40 182 46" strokeWidth="1.6" />
          {/* Gentle sheep resting */}
          <ellipse cx="236" cy="142" rx="14" ry="9" strokeWidth="1.2" />
          <circle cx="224" cy="138" r="4.5" strokeWidth="1.2" />
          <ellipse cx="278" cy="144" rx="12" ry="8" strokeWidth="1.2" />
          <circle cx="268" cy="140" r="4" strokeWidth="1.2" />
        </svg>
      );

    case 'daniel_lions_den':
      return (
        <svg viewBox="0 0 400 175" className={svgClass} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M16 156 L384 156" strokeWidth="1.3" />
          {/* Stone Den Wall & High Window */}
          <path d="M184 18 L216 18 L216 48 L184 48 Z" strokeWidth="1.3" />
          <path d="M200 48 L160 110 M200 48 L240 110" strokeWidth="0.85" strokeDasharray="3 3" opacity="0.65" />
          {/* Daniel praying in center */}
          <circle cx="200" cy="84" r="7.5" strokeWidth="1.35" />
          <path d="M190 94 L186 156 L214 156 L210 94 Z" strokeWidth="1.35" />
          <path d="M196 98 L196 112 M204 98 L204 112" strokeWidth="1.2" />
          {/* Peaceful lions lying down */}
          <path d="M84 156 Q100 134 126 138 Q140 144 144 156 Z" strokeWidth="1.3" />
          <circle cx="86" cy="142" r="7" strokeWidth="1.3" />
          <path d="M264 156 Q280 134 306 138 Q320 144 324 156 Z" strokeWidth="1.3" />
          <circle cx="322" cy="142" r="7" strokeWidth="1.3" />
        </svg>
      );

    case 'jonah_great_fish':
      return (
        <svg viewBox="0 0 400 175" className={svgClass} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 156 L380 156" strokeWidth="1.3" />
          {/* Ocean waves */}
          <path d="M0 138 Q50 126 100 138 T200 138 T300 138 T400 138" strokeWidth="1.2" />
          {/* Great Fish emerging */}
          <path d="M180 156 Q190 92 250 102 Q310 110 330 138 Q344 130 354 136 L344 148 L354 154" strokeWidth="1.5" />
          <circle cx="224" cy="116" r="3" fill="currentColor" />
          {/* Shoreline on left with Jonah delivered */}
          <path d="M20 156 Q60 144 110 156" strokeWidth="1.4" />
          <circle cx="94" cy="128" r="6" strokeWidth="1.2" />
          <path d="M86 135 L82 156 L106 156 L102 135 Z" strokeWidth="1.2" />
          <path d="M102 138 L118 126" strokeWidth="1.2" />
        </svg>
      );

    case 'feeding_five_thousand':
      return (
        <svg viewBox="0 0 400 175" className={svgClass} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M16 156 L384 156" strokeWidth="1.3" />
          {/* Five barley loaves and two fish in basket */}
          <path d="M168 156 L174 126 L226 126 L232 156 Z" strokeWidth="1.35" />
          <ellipse cx="188" cy="120" rx="9" ry="6" strokeWidth="1.2" />
          <ellipse cx="204" cy="118" rx="9" ry="6" strokeWidth="1.2" />
          <ellipse cx="218" cy="121" rx="8" ry="5" strokeWidth="1.2" />
          {/* Two fish */}
          <path d="M184 112 Q194 106 204 112 Q194 118 184 112 Z M204 112 L210 108 L210 116 Z" strokeWidth="1.2" />
          {/* Multitudes seated on hillside */}
          <circle cx="86" cy="132" r="5" strokeWidth="1.1" />
          <path d="M78 138 L74 156 L98 156 L94 138 Z" strokeWidth="1.1" />
          <circle cx="120" cy="128" r="5" strokeWidth="1.1" />
          <path d="M112 134 L108 156 L132 156 L128 134 Z" strokeWidth="1.1" />
          <circle cx="280" cy="130" r="5" strokeWidth="1.1" />
          <path d="M272 136 L268 156 L292 156 L288 136 Z" strokeWidth="1.1" />
          <circle cx="316" cy="134" r="5" strokeWidth="1.1" />
          <path d="M308 140 L304 156 L328 156 L324 140 Z" strokeWidth="1.1" />
        </svg>
      );

    case 'calming_the_storm':
      return (
        <svg viewBox="0 0 400 175" className={svgClass} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {/* Fierce storm waves on left, calm on right */}
          <path d="M12 158 Q50 118 90 158 Q130 118 170 158 L400 158" strokeWidth="1.4" />
          <path d="M180 156 L390 156" strokeWidth="1.2" />
          {/* Fishing Boat */}
          <path d="M164 156 Q194 168 254 156 L274 136 L154 136 Z" strokeWidth="1.4" />
          <path d="M214 136 L214 74 M214 84 L248 104" strokeWidth="1.4" />
          {/* Jesus standing in bow stretching out hand */}
          <circle cx="178" cy="108" r="7" strokeWidth="1.35" />
          <path d="M168 116 L164 144 L192 144 L188 116 Z" strokeWidth="1.35" />
          <path d="M168 124 L138 116" strokeWidth="1.5" />
        </svg>
      );

    case 'good_samaritan':
      return (
        <svg viewBox="0 0 400 175" className={svgClass} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 156 L380 156" strokeWidth="1.3" />
          {/* Samaritan bandaging traveler */}
          <circle cx="164" cy="98" r="7.5" strokeWidth="1.35" />
          <path d="M152 108 L148 156 L180 156 L176 108 Z" strokeWidth="1.35" />
          <circle cx="218" cy="128" r="7" strokeWidth="1.2" />
          <path d="M228 136 L268 152 L260 156 L220 156 Z" strokeWidth="1.2" />
          {/* Oil & Wine cruets */}
          <path d="M136 156 L138 144 L146 144 L148 156 Z" strokeWidth="1.2" />
          {/* Patient Donkey waiting on right */}
          <ellipse cx="324" cy="126" rx="20" ry="14" strokeWidth="1.3" />
          <path d="M308 126 L308 156 M340 126 L340 156" strokeWidth="1.3" />
          <circle cx="348" cy="108" r="6" strokeWidth="1.3" />
          <path d="M346 102 L344 92 M352 102 L354 92" strokeWidth="1.2" />
        </svg>
      );

    case 'prodigal_son_father':
      return (
        <svg viewBox="0 0 400 175" className={svgClass} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 156 L380 156" strokeWidth="1.3" />
          {/* Father with open arms */}
          <circle cx="166" cy="74" r="8" strokeWidth="1.35" />
          <path d="M152 84 L144 156 L188 156 L180 84 Z" strokeWidth="1.35" />
          <path d="M180 94 L212 94 M152 94 L130 98" strokeWidth="1.4" />
          {/* Son kneeling before father in embrace */}
          <circle cx="224" cy="104" r="7.5" strokeWidth="1.3" />
          <path d="M214 114 L204 156 L238 156 L234 126 Z" strokeWidth="1.3" />
          {/* House / estate archway in background */}
          <path d="M68 156 L68 92 Q88 74 108 92 L108 156" strokeWidth="1.2" opacity="0.65" />
        </svg>
      );

    case 'zacchaeus_sycamore':
      return (
        <svg viewBox="0 0 400 175" className={svgClass} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 156 L380 156" strokeWidth="1.3" />
          {/* Sycamore-fig tree on left */}
          <path d="M84 156 L84 82 Q84 62 104 54 Q124 62 124 82 L124 156" strokeWidth="1.6" />
          <path d="M52 74 Q84 28 124 28 Q164 28 184 68 Q154 98 114 88" strokeWidth="1.3" />
          {/* Zacchaeus in tree branches */}
          <circle cx="132" cy="54" r="6.5" strokeWidth="1.3" />
          <path d="M124 62 L120 86 L144 86 L140 62 Z" strokeWidth="1.3" />
          <path d="M140 68 L156 60" strokeWidth="1.3" />
          {/* Jesus looking up from road */}
          <circle cx="248" cy="88" r="8" strokeWidth="1.35" />
          <path d="M236 98 L230 156 L266 156 L260 98 Z" strokeWidth="1.35" />
          <path d="M236 108 L206 88" strokeWidth="1.4" />
        </svg>
      );

    case 'last_supper_communion':
      return (
        <svg viewBox="0 0 400 175" className={svgClass} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 156 L380 156" strokeWidth="1.3" />
          {/* Table */}
          <path d="M72 156 L72 118 L328 118 L328 156" strokeWidth="1.35" />
          <path d="M60 118 L340 118" strokeWidth="1.8" />
          {/* Bread and Chalice */}
          <path d="M194 118 L197 106 L203 106 L206 118 Z" strokeWidth="1.3" />
          <path d="M192 106 Q200 98 208 106 Z" strokeWidth="1.3" />
          <ellipse cx="178" cy="114" rx="7" ry="4" strokeWidth="1.2" />
          {/* Jesus at center */}
          <circle cx="200" cy="68" r="8" strokeWidth="1.35" />
          <path d="M188 78 L182 118 L218 118 L212 78 Z" strokeWidth="1.35" />
          <path d="M188 88 L176 106 M212 88 L224 106" strokeWidth="1.3" />
          {/* Disciples on both sides */}
          <circle cx="146" cy="78" r="6.5" strokeWidth="1.15" />
          <path d="M136 86 L130 118 L162 118 L156 86 Z" strokeWidth="1.15" />
          <circle cx="254" cy="78" r="6.5" strokeWidth="1.15" />
          <path d="M244 86 L238 118 L270 118 L264 86 Z" strokeWidth="1.15" />
        </svg>
      );

    case 'armor_of_god':
      return (
        <svg viewBox="0 0 400 175" className={svgClass} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M24 156 L376 156" strokeWidth="1.3" />
          {/* Helmet of Salvation */}
          <path d="M186 52 Q200 36 214 52 L214 68 L186 68 Z" strokeWidth="1.4" />
          <path d="M184 68 L216 68" strokeWidth="1.6" />
          {/* Breastplate of Righteousness */}
          <path d="M182 72 L218 72 L212 124 L188 124 Z" strokeWidth="1.4" />
          <path d="M194 84 L206 84 M194 96 L206 96" strokeWidth="1.1" />
          {/* Shield of Faith */}
          <path d="M128 76 L164 76 Q168 114 146 138 Q124 114 128 76 Z" strokeWidth="1.5" />
          <path d="M146 86 L146 122 M134 98 L158 98" strokeWidth="1.2" />
          {/* Sword of the Spirit */}
          <path d="M254 54 L254 138 M244 70 L264 70" strokeWidth="1.8" />
          <path d="M254 54 L250 62 L258 62 Z" strokeWidth="1.4" />
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

function CartoonPerson({
  x,
  y,
  robeColor,
  sashColor,
  skinColor = '#FBCFA8',
  hasHalo = false,
  hasStaff = false,
  isSmiling = true,
}: {
  x: number;
  y: number;
  robeColor: string;
  sashColor?: string;
  skinColor?: string;
  hasHalo?: boolean;
  hasStaff?: boolean;
  isSmiling?: boolean;
}) {
  return (
    <g>
      {hasHalo && (
        <circle
          cx={x}
          cy={y - 2}
          r={18}
          fill="#FDE047"
          fillOpacity={0.35}
          stroke="#FACC15"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
      )}
      {/* Body robe */}
      <path
        d={`M${x - 14} ${y + 12} Q${x - 18} ${y + 42} ${x - 20} ${y + 58} L${x + 20} ${y + 58} Q${x + 18} ${y + 42} ${x + 14} ${y + 12} Z`}
        fill={robeColor}
        stroke="#1E293B"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {sashColor && (
        <path
          d={`M${x - 10} ${y + 13} L${x + 12} ${y + 48} L${x + 4} ${y + 52} L${x - 14} ${y + 18} Z`}
          fill={sashColor}
        />
      )}
      {/* Head */}
      <circle
        cx={x}
        cy={y}
        r={12}
        fill={skinColor}
        stroke="#1E293B"
        strokeWidth="2"
      />
      {/* Hair */}
      <path
        d={`M${x - 12} ${y - 2} Q${x} ${y - 16} ${x + 12} ${y - 2} Q${x + 8} ${y - 9} ${x} ${y - 9} Q${x - 8} ${y - 9} ${x - 12} ${y - 2} Z`}
        fill="#451A03"
      />
      {/* Friendly eyes & smile */}
      <circle cx={x - 4} cy={y - 1} r={1.6} fill="#1E293B" />
      <circle cx={x + 4} cy={y - 1} r={1.6} fill="#1E293B" />
      {isSmiling && (
        <path
          d={`M${x - 4.5} ${y + 4} Q${x} ${y + 8} ${x + 4.5} ${y + 4}`}
          fill="none"
          stroke="#1E293B"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
      {/* Rosy cheeks */}
      <circle cx={x - 7} cy={y + 2.5} r={2.2} fill="#FB7185" fillOpacity="0.55" />
      <circle cx={x + 7} cy={y + 2.5} r={2.2} fill="#FB7185" fillOpacity="0.55" />
      {hasStaff && (
        <path
          d={`M${x + 18} ${y + 58} L${x + 18} ${y - 8} Q${x + 18} ${y - 18} ${x + 26} ${y - 14} Q${x + 30} ${y - 10} ${x + 24} ${y - 6}`}
          fill="none"
          stroke="#92400E"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

/**
 * Playful, colourful, cartoon-style storybook illustration for Children's Mode.
 * Properly adapted for both Light and Dark themes.
 */
function ChildrenCartoonSceneArtwork({
  illustration,
  isLight,
}: {
  illustration: BiblicalLineIllustration;
  isLight: boolean;
}) {
  const { sceneType, book, chapter, childrenStoryTitle } = illustration;
  const isNightScene =
    sceneType === 'nicodemus_night' ||
    sceneType === 'nativity_immanuel' ||
    sceneType === 'joseph_angel_dream' ||
    sceneType === 'abraham_covenant_altar';

  const skyBg = isNightScene
    ? isLight
      ? '#1E293B'
      : '#0F172A'
    : isLight
    ? '#E0F2FE'
    : '#1E2642';
  const hillBack = isLight ? '#86EFAC' : '#1E4638';
  const hillFront = isLight ? '#4ADE80' : '#15803D';
  const desertHill = isLight ? '#FDE68A' : '#78350F';

  return (
    <div
      className={`rounded-3xl border-2 overflow-hidden shadow-md transition ${
        isLight
          ? 'bg-gradient-to-b from-sky-50 to-amber-50/60 border-amber-300'
          : 'bg-gradient-to-b from-[#1B223B] to-[#151A2E] border-indigo-500/40'
      }`}
    >
      <svg
        viewBox="0 0 400 185"
        className="w-full h-auto max-h-60 sm:max-h-68 block mx-auto"
        role="img"
        aria-label={childrenStoryTitle || `${book} ${chapter} Story Picture`}
      >
        {/* Sky Background */}
        <rect x="0" y="0" width="400" height="185" fill={skyBg} />

        {/* Sun or Stars + Moon */}
        {isNightScene || !isLight ? (
          <g>
            <circle cx="348" cy="34" r="16" fill="#FDE047" />
            <circle cx="355" cy="29" r="13" fill={skyBg} />
            <circle cx="52" cy="28" r="2.5" fill="#FEF08A" />
            <circle cx="108" cy="22" r="3" fill="#FDE047" />
            <circle cx="176" cy="30" r="2.2" fill="#FEF08A" />
            <circle cx="248" cy="18" r="2.8" fill="#FDE047" />
            <circle cx="298" cy="36" r="2.2" fill="#FEF08A" />
          </g>
        ) : (
          <g>
            <circle cx="346" cy="36" r="22" fill="#FDE047" fillOpacity="0.4" />
            <circle cx="346" cy="36" r="15" fill="#FACC15" stroke="#F59E0B" strokeWidth="2" />
            {/* Fluffy Cartoon Clouds */}
            <g fill="#FFFFFF" fillOpacity="0.92">
              <circle cx="66" cy="34" r="12" />
              <circle cx="80" cy="30" r="15" />
              <circle cx="95" cy="34" r="11" />
              <circle cx="238" cy="28" r="10" />
              <circle cx="250" cy="25" r="13" />
              <circle cx="263" cy="28" r="10" />
            </g>
          </g>
        )}

        {/* Rolling Cartoon Hills */}
        <path
          d="M0 145 Q100 105 220 138 T400 130 L400 185 L0 185 Z"
          fill={
            sceneType === 'wilderness_scroll' ||
            sceneType === 'bronze_serpent' ||
            sceneType === 'moses_song_witness'
              ? desertHill
              : hillBack
          }
        />
        <path
          d="M0 155 Q150 130 280 152 T400 148 L400 185 L0 185 Z"
          fill={hillFront}
        />

        {/* Scene-Specific Playful Cartoon Elements */}

        {sceneType === 'beatitudes_mount' && (
          <g>
            <circle cx="160" cy="62" r="38" fill="#FDE047" fillOpacity="0.35" />
            <CartoonPerson x={160} y={68} robeColor="#38BDF8" sashColor="#FACC15" hasHalo isSmiling />
            <CartoonPerson x={96} y={108} robeColor="#34D399" isSmiling />
            <CartoonPerson x={232} y={104} robeColor="#FB923C" isSmiling />
            <CartoonPerson x={286} y={112} robeColor="#A78BFA" isSmiling />
          </g>
        )}

        {sceneType === 'salt_and_light' && (
          <g>
            {/* Bright glowing lamp */}
            <circle cx="200" cy="56" r="36" fill="#FDE047" fillOpacity="0.45" />
            <path d="M192 110 L208 110 L204 68 L196 68 Z" fill="#92400E" stroke="#451A03" strokeWidth="2" />
            <circle cx="200" cy="52" r="14" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
            <circle cx="200" cy="46" r="8" fill="#FEF08A" />
            {/* Salt cellar with cute face */}
            <rect x="110" y="112" width="28" height="38" rx="8" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />
            <circle cx="120" cy="126" r="2" fill="#1E293B" />
            <circle cx="128" cy="126" r="2" fill="#1E293B" />
            <path d="M120 134 Q124 138 128 134" stroke="#1E293B" strokeWidth="1.5" fill="none" />
            <CartoonPerson x={286} y={88} robeColor="#F43F5E" sashColor="#FEF08A" isSmiling />
          </g>
        )}

        {sceneType === 'love_enemies_prayer' && (
          <g>
            <circle cx="86" cy="48" r="22" fill="#FACC15" stroke="#EA580C" strokeWidth="2" />
            <CartoonPerson x={168} y={88} robeColor="#10B981" isSmiling />
            <CartoonPerson x={232} y={88} robeColor="#EC4899" isSmiling />
            <path d="M194 96 Q200 90 206 96" stroke="#EF4444" strokeWidth="3" fill="none" />
          </g>
        )}

        {sceneType === 'ten_commandments_sinai' && (
          <g>
            <rect x="160" y="68" width="34" height="48" rx="8" fill="#CBD5E1" stroke="#334155" strokeWidth="2" />
            <rect x="206" y="68" width="34" height="48" rx="8" fill="#CBD5E1" stroke="#334155" strokeWidth="2" />
            <path d="M168 80 L186 80 M168 90 L186 90 M168 100 L186 100" stroke="#334155" strokeWidth="2" />
            <path d="M214 80 L232 80 M214 90 L232 90 M214 100 L232 100" stroke="#334155" strokeWidth="2" />
            <CartoonPerson x={112} y={84} robeColor="#DC2626" sashColor="#FEF08A" hasStaff isSmiling />
          </g>
        )}

        {sceneType === 'david_and_goliath' && (
          <g>
            {/* Small brave David */}
            <CartoonPerson x={108} y={102} robeColor="#38BDF8" isSmiling />
            {/* Big armor Goliath */}
            <g transform="scale(1.4) translate(130, 20)">
              <CartoonPerson x={90} y={54} robeColor="#64748B" sashColor="#DC2626" isSmiling={false} />
            </g>
          </g>
        )}

        {sceneType === 'shepherd_psalm_23' && (
          <g>
            <CartoonPerson x={156} y={74} robeColor="#059669" sashColor="#FEF08A" hasStaff isSmiling />
            {/* Cute fluffy sheep */}
            <ellipse cx="232" cy="136" rx="18" ry="12" fill="#FFFFFF" stroke="#475569" strokeWidth="2" />
            <circle cx="216" cy="130" r="7" fill="#F1F5F9" stroke="#475569" strokeWidth="1.5" />
            <ellipse cx="282" cy="140" rx="16" ry="10" fill="#FFFFFF" stroke="#475569" strokeWidth="2" />
            <circle cx="268" cy="134" r="6" fill="#F1F5F9" stroke="#475569" strokeWidth="1.5" />
          </g>
        )}

        {sceneType === 'daniel_lions_den' && (
          <g>
            <CartoonPerson x={198} y={78} robeColor="#7C3AED" sashColor="#FACC15" isSmiling />
            {/* Friendly smiling lions */}
            <g>
              <ellipse cx="114" cy="138" rx="24" ry="16" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
              <circle cx="94" cy="130" r="14" fill="#D97706" />
              <circle cx="94" cy="130" r="10" fill="#FCD34D" />
              <circle cx="91" cy="128" r="1.8" fill="#1E293B" />
              <circle cx="97" cy="128" r="1.8" fill="#1E293B" />
              <path d="M91 133 Q94 136 97 133" stroke="#1E293B" strokeWidth="1.5" fill="none" />
            </g>
            <g>
              <ellipse cx="286" cy="138" rx="24" ry="16" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
              <circle cx="306" cy="130" r="14" fill="#D97706" />
              <circle cx="306" cy="130" r="10" fill="#FCD34D" />
              <circle cx="303" cy="128" r="1.8" fill="#1E293B" />
              <circle cx="309" cy="128" r="1.8" fill="#1E293B" />
              <path d="M303 133 Q306 136 309 133" stroke="#1E293B" strokeWidth="1.5" fill="none" />
            </g>
          </g>
        )}

        {sceneType === 'jonah_great_fish' && (
          <g>
            {/* Big friendly cartoon blue whale/fish */}
            <path d="M190 156 Q210 90 280 100 Q350 110 370 144 Q386 134 394 140 L386 150 L394 156 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" />
            <circle cx="236" cy="116" r="4" fill="#0C4A6E" />
            <circle cx="238" cy="114" r="1.5" fill="#FFFFFF" />
            <CartoonPerson x={96} y={102} robeColor="#F59E0B" isSmiling />
          </g>
        )}

        {sceneType === 'feeding_five_thousand' && (
          <g>
            <rect x="178" y="112" width="44" height="32" rx="8" fill="#D97706" stroke="#78350F" strokeWidth="2" />
            <ellipse cx="192" cy="108" rx="8" ry="5" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
            <ellipse cx="208" cy="108" rx="8" ry="5" fill="#FDE68A" stroke="#B45309" strokeWidth="1.5" />
            <CartoonPerson x={132} y={82} robeColor="#38BDF8" hasHalo isSmiling />
            <CartoonPerson x={268} y={86} robeColor="#34D399" isSmiling />
          </g>
        )}

        {sceneType === 'calming_the_storm' && (
          <g>
            <path d="M140 148 Q180 162 250 148 L270 124 L130 124 Z" fill="#92400E" stroke="#451A03" strokeWidth="2.5" />
            <CartoonPerson x={168} y={84} robeColor="#38BDF8" hasHalo isSmiling />
            <CartoonPerson x={224} y={92} robeColor="#F59E0B" isSmiling />
          </g>
        )}

        {sceneType === 'good_samaritan' && (
          <g>
            <CartoonPerson x={152} y={84} robeColor="#EC4899" sashColor="#FEF08A" isSmiling />
            <CartoonPerson x={212} y={102} robeColor="#94A3B8" isSmiling />
            {/* Friendly Donkey */}
            <ellipse cx="294" cy="126" rx="22" ry="14" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
            <circle cx="318" cy="108" r="8" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
          </g>
        )}

        {sceneType === 'prodigal_son_father' && (
          <g>
            <CartoonPerson x={164} y={82} robeColor="#DC2626" sashColor="#FDE047" isSmiling />
            <CartoonPerson x={216} y={86} robeColor="#38BDF8" isSmiling />
          </g>
        )}

        {sceneType === 'zacchaeus_sycamore' && (
          <g>
            {/* Tree */}
            <rect x="94" y="80" width="22" height="75" fill="#78350F" />
            <circle cx="105" cy="62" r="34" fill="#22C55E" />
            <CartoonPerson x={105} y={48} robeColor="#F59E0B" isSmiling />
            <CartoonPerson x={232} y={82} robeColor="#38BDF8" hasHalo isSmiling />
          </g>
        )}

        {sceneType === 'last_supper_communion' && (
          <g>
            <rect x="80" y="118" width="240" height="38" rx="8" fill="#F8FAFC" stroke="#94A3B8" strokeWidth="2" />
            <CartoonPerson x={200} y={72} robeColor="#38BDF8" hasHalo isSmiling />
            <CartoonPerson x={148} y={78} robeColor="#F59E0B" isSmiling />
            <CartoonPerson x={252} y={78} robeColor="#10B981" isSmiling />
          </g>
        )}

        {sceneType === 'armor_of_god' && (
          <g>
            {/* Golden helmet */}
            <circle cx="200" cy="54" r="16" fill="#FACC15" stroke="#B45309" strokeWidth="2" />
            {/* Heart shield */}
            <path d="M128 78 L160 78 Q164 110 144 130 Q124 110 128 78 Z" fill="#EF4444" stroke="#991B1B" strokeWidth="2" />
            {/* Shining sword */}
            <path d="M256 56 L256 136 M246 72 L266 72" stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" />
            <CartoonPerson x={200} y={84} robeColor="#64748B" isSmiling />
          </g>
        )}

        {sceneType === 'creation_light' && (
          <g>
            {/* Rainbow arc */}
            <path
              d="M70 155 A130 110 0 0 1 330 155"
              fill="none"
              stroke="#FB7185"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M78 155 A122 102 0 0 1 322 155"
              fill="none"
              stroke="#FACC15"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M86 155 A114 94 0 0 1 314 155"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Glowing globe & birds & trees */}
            <circle cx="200" cy="96" r="32" fill="#38BDF8" stroke="#1E293B" strokeWidth="2.5" />
            <path
              d="M182 82 Q196 74 206 88 Q216 98 202 114 Q186 118 178 102 Z"
              fill="#4ADE80"
            />
            {/* Happy birds */}
            <path d="M118 68 Q124 60 130 68 Q136 60 142 68" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M262 62 Q268 54 274 62 Q280 54 286 62" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        )}

        {sceneType === 'noah_ark_flood' && (
          <g>
            {/* Rainbow */}
            <path d="M60 140 A140 105 0 0 1 340 140" fill="none" stroke="#F43F5E" strokeWidth="5" />
            <path d="M66 140 A134 99 0 0 1 334 140" fill="none" stroke="#FACC15" strokeWidth="5" />
            <path d="M72 140 A128 93 0 0 1 328 140" fill="none" stroke="#38BDF8" strokeWidth="5" />
            {/* Blue waves */}
            <rect x="0" y="138" width="400" height="47" fill="#0284C7" />
            {/* Cartoon Ark */}
            <path
              d="M115 112 L285 112 L265 148 L135 148 Z"
              fill="#B45309"
              stroke="#1E293B"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <rect
              x="145"
              y="82"
              width="110"
              height="30"
              rx="6"
              fill="#D97706"
              stroke="#1E293B"
              strokeWidth="2.5"
            />
            <path
              d="M135 84 L200 58 L265 84 Z"
              fill="#EF4444"
              stroke="#1E293B"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Windows */}
            <circle cx="172" cy="97" r="7" fill="#FEF08A" stroke="#1E293B" strokeWidth="2" />
            <circle cx="200" cy="97" r="7" fill="#FEF08A" stroke="#1E293B" strokeWidth="2" />
            <circle cx="228" cy="97" r="7" fill="#FEF08A" stroke="#1E293B" strokeWidth="2" />
          </g>
        )}

        {(sceneType === 'red_sea_parting' ||
          sceneType === 'baptism_jordan' ||
          sceneType === 'calling_fishermen') && (
          <g>
            {/* Friendly water stream / sea */}
            <path
              d="M0 135 Q100 125 200 135 T400 132 L400 185 L0 185 Z"
              fill="#38BDF8"
              stroke="#0284C7"
              strokeWidth="2"
            />
            {sceneType === 'red_sea_parting' && (
              <>
                {/* Dry path in center */}
                <path d="M165 130 L140 185 L260 185 L235 130 Z" fill="#FDE68A" />
                {/* Parted water walls */}
                <path d="M80 140 Q125 70 165 135 Z" fill="#0EA5E9" stroke="#0369A1" strokeWidth="2" />
                <path d="M320 140 Q275 70 235 135 Z" fill="#0EA5E9" stroke="#0369A1" strokeWidth="2" />
                <CartoonPerson x={200} y={88} robeColor="#EF4444" sashColor="#FACC15" hasStaff />
              </>
            )}
            {sceneType === 'baptism_jordan' && (
              <>
                {/* Dove above */}
                <circle cx="200" cy="36" r="14" fill="#FEF08A" fillOpacity="0.6" />
                <path d="M188 36 Q200 24 212 36 Q200 42 188 36 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="1.8" />
                <CartoonPerson x={175} y={88} robeColor="#3B82F6" hasHalo />
                <CartoonPerson x={228} y={90} robeColor="#D97706" />
              </>
            )}
            {sceneType === 'calling_fishermen' && (
              <>
                {/* Cartoon Wooden Boat */}
                <path
                  d="M175 122 L305 122 L285 152 L195 152 Z"
                  fill="#D97706"
                  stroke="#1E293B"
                  strokeWidth="2.5"
                />
                <path d="M240 60 L240 122 M240 64 L285 110 L240 110 Z" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2" />
                <CartoonPerson x={115} y={86} robeColor="#3B82F6" sashColor="#EF4444" hasHalo />
                <CartoonPerson x={225} y={86} robeColor="#10B981" />
                <CartoonPerson x={265} y={88} robeColor="#F59E0B" />
              </>
            )}
          </g>
        )}

        {(sceneType === 'lamb_of_god' || sceneType === 'moses_exodus_passover') && (
          <g>
            <CartoonPerson x={148} y={84} robeColor="#3B82F6" sashColor="#FACC15" hasHalo={sceneType === 'lamb_of_god'} hasStaff />
            {/* Cute Cartoon Fluffy Lamb */}
            <g transform="translate(225, 118)">
              <ellipse cx="22" cy="14" rx="20" ry="14" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.2" />
              <circle cx="6" cy="6" r="9" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.2" />
              <circle cx="4" cy="5" r="1.6" fill="#1E293B" />
              <path d="M12 28 L12 38 M20 28 L20 38 M28 28 L28 38 M34 28 L34 38" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </g>
        )}

        {(sceneType === 'nativity_immanuel' || sceneType === 'joseph_angel_dream') && (
          <g>
            {/* Bright Bethlehem Star */}
            <path
              d="M200 14 L205 28 L220 28 L208 36 L212 50 L200 41 L188 50 L192 36 L180 28 L195 28 Z"
              fill="#FACC15"
              stroke="#F59E0B"
              strokeWidth="1.5"
            />
            <CartoonPerson x={148} y={88} robeColor="#3B82F6" />
            <CartoonPerson x={252} y={88} robeColor="#8B5CF6" hasHalo={sceneType === 'joseph_angel_dream'} />
            {/* Manger Crib */}
            <path d="M180 126 L220 126 L214 148 L186 148 Z" fill="#D97706" stroke="#1E293B" strokeWidth="2" />
            <circle cx="200" cy="122" r="8" fill="#FDE047" stroke="#1E293B" strokeWidth="1.8" />
          </g>
        )}

        {sceneType !== 'creation_light' &&
          sceneType !== 'noah_ark_flood' &&
          sceneType !== 'red_sea_parting' &&
          sceneType !== 'baptism_jordan' &&
          sceneType !== 'calling_fishermen' &&
          sceneType !== 'lamb_of_god' &&
          sceneType !== 'moses_exodus_passover' &&
          sceneType !== 'nativity_immanuel' &&
          sceneType !== 'joseph_angel_dream' && (
            <g>
              {/* Friendly Cartoon Trees */}
              <rect x="48" y="102" width="10" height="42" rx="3" fill="#92400E" stroke="#1E293B" strokeWidth="2" />
              <circle cx="53" cy="90" r="22" fill="#22C55E" stroke="#1E293B" strokeWidth="2" />
              <circle cx="44" cy="84" r="4" fill="#EF4444" />
              <circle cx="62" cy="92" r="4" fill="#EF4444" />

              {/* Central Storytelling Figures */}
              <CartoonPerson
                x={160}
                y={84}
                robeColor="#3B82F6"
                sashColor="#FACC15"
                hasHalo={
                  sceneType === 'jesus_teaching' ||
                  sceneType === 'healing_multitudes' ||
                  sceneType === 'jesus_crowd_reconciliation' ||
                  sceneType === 'triumphal_entry' ||
                  sceneType === 'crucifixion_calvary' ||
                  sceneType === 'empty_tomb_resurrection' ||
                  sceneType === 'nicodemus_night'
                }
                hasStaff={
                  sceneType === 'moses_song_witness' ||
                  sceneType === 'bronze_serpent' ||
                  sceneType === 'abraham_covenant_altar'
                }
              />
              <CartoonPerson x={228} y={88} robeColor="#10B981" sashColor="#FDE047" />
              <CartoonPerson x={282} y={92} robeColor="#F97316" />

              {/* Open Scroll / Harp / City Crown Accent */}
              <rect
                x="182"
                y="112"
                width="28"
                height="20"
                rx="4"
                fill="#FEF3C7"
                stroke="#B45309"
                strokeWidth="2"
              />
            </g>
          )}
      </svg>

      {/* Playful Children's Story Caption Strip */}
      <div
        className={`px-4 py-2.5 flex items-center justify-between gap-2 border-t ${
          isLight
            ? 'bg-amber-100/80 border-amber-200 text-amber-950'
            : 'bg-indigo-950/80 border-indigo-800/60 text-amber-200'
        }`}
      >
        <span className="text-xs sm:text-sm font-extrabold tracking-tight">
          🎨 {childrenStoryTitle || `${book} ${chapter} Story Picture`}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${
            isLight
              ? 'bg-white text-amber-800 border border-amber-300'
              : 'bg-indigo-900 text-amber-300 border border-indigo-700'
          }`}
        >
          {book} {chapter}
        </span>
      </div>
    </div>
  );
}

export default function BibleLineDrawing({
  illustration,
  isLight,
  mode = 'adult',
}: {
  illustration: BiblicalLineIllustration;
  isLight: boolean;
  mode?: 'adult' | 'children';
}) {
  if (mode === 'children') {
    return (
      <div className="my-5 sm:my-6 mx-auto w-full max-w-xl select-none">
        <ChildrenCartoonSceneArtwork illustration={illustration} isLight={isLight} />
      </div>
    );
  }

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
