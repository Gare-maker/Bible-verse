import { SceneType } from '@/components/BibleLineDrawing';

export interface ChapterSectionDefinition {
  book: string;
  chapter: number;
  verse: number;
  heading: string;
  sceneType: SceneType;
  storyTitle?: string;
}

export const CANONICAL_CHAPTER_SECTIONS: ChapterSectionDefinition[] = [
  // Matthew 5 — Sermon on the Mount (Multiple distinct sections with their own headings and scenes)
  {
    book: 'Matthew',
    chapter: 5,
    verse: 1,
    heading: 'The Beatitudes',
    sceneType: 'beatitudes_mount',
    storyTitle: 'Jesus Blesses on the Mountain (Beatitudes)',
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 13,
    heading: 'Salt and Light',
    sceneType: 'salt_and_light',
    storyTitle: 'You Are the Salt and the Light',
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 17,
    heading: 'The Fulfillment of the Law',
    sceneType: 'wilderness_scroll',
    storyTitle: 'God’s Holy Law Fulfilled',
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 21,
    heading: 'Anger and Reconciliation',
    sceneType: 'jesus_crowd_reconciliation',
    storyTitle: 'Forgive and Make Peace with Others',
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 27,
    heading: 'Purity of Heart and Thoughts',
    sceneType: 'nicodemus_night',
    storyTitle: 'Keeping a Pure and Loving Heart',
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 33,
    heading: 'Oaths and Truthfulness',
    sceneType: 'apostolic_scroll',
    storyTitle: 'Always Speak the Truth with Love',
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 38,
    heading: 'Going the Second Mile',
    sceneType: 'jesus_teaching',
    storyTitle: 'Kindness Instead of Payback',
  },
  {
    book: 'Matthew',
    chapter: 5,
    verse: 43,
    heading: 'Love for Enemies',
    sceneType: 'love_enemies_prayer',
    storyTitle: 'Pray and Show Love to Everyone',
  },

  // Matthew 6
  {
    book: 'Matthew',
    chapter: 6,
    verse: 1,
    heading: 'Giving to the Needy in Secret',
    sceneType: 'jesus_teaching',
    storyTitle: 'Generosity That Pleases God',
  },
  {
    book: 'Matthew',
    chapter: 6,
    verse: 9,
    heading: 'The Lord’s Prayer',
    sceneType: 'jesus_teaching',
    storyTitle: 'How to Pray to Our Father',
  },
  {
    book: 'Matthew',
    chapter: 6,
    verse: 25,
    heading: 'Do Not Worry',
    sceneType: 'shepherd_psalm_23',
    storyTitle: 'God Cares for Birds, Flowers and You',
  },

  // Matthew 7
  {
    book: 'Matthew',
    chapter: 7,
    verse: 1,
    heading: 'Judging Others',
    sceneType: 'jesus_crowd_reconciliation',
    storyTitle: 'Look with Mercy and Love',
  },
  {
    book: 'Matthew',
    chapter: 7,
    verse: 7,
    heading: 'Ask, Seek, Knock',
    sceneType: 'jesus_teaching',
    storyTitle: 'Knock and the Door Will Open',
  },
  {
    book: 'Matthew',
    chapter: 7,
    verse: 24,
    heading: 'The Wise and Foolish Builders',
    sceneType: 'throne_new_jerusalem',
    storyTitle: 'Building on the Solid Rock',
  },

  // Genesis 1 & 2
  {
    book: 'Genesis',
    chapter: 1,
    verse: 1,
    heading: 'The Beginning of Creation',
    sceneType: 'creation_light',
    storyTitle: 'God Makes Light and the Universe',
  },
  {
    book: 'Genesis',
    chapter: 2,
    verse: 4,
    heading: 'The Garden of Eden and the Tree of Life',
    sceneType: 'eden_garden_tree',
    storyTitle: 'The Beautiful Garden of Eden',
  },

  // Genesis 6 & 8
  {
    book: 'Genesis',
    chapter: 6,
    verse: 9,
    heading: 'Noah and the Ark',
    sceneType: 'noah_ark_flood',
    storyTitle: 'Noah Obeys God and Builds the Ark',
  },

  // Exodus 14 & 20
  {
    book: 'Exodus',
    chapter: 14,
    verse: 1,
    heading: 'Crossing the Red Sea',
    sceneType: 'red_sea_parting',
    storyTitle: 'Parting the Waters of the Red Sea',
  },
  {
    book: 'Exodus',
    chapter: 20,
    verse: 1,
    heading: 'The Ten Commandments at Mount Sinai',
    sceneType: 'ten_commandments_sinai',
    storyTitle: 'God Gives the Ten Commandments',
  },

  // Numbers 21
  {
    book: 'Numbers',
    chapter: 21,
    verse: 4,
    heading: 'The Bronze Serpent',
    sceneType: 'bronze_serpent',
    storyTitle: 'Look and Live: The Bronze Serpent',
  },

  // 1 Samuel 17
  {
    book: '1 Samuel',
    chapter: 17,
    verse: 1,
    heading: 'David and Goliath',
    sceneType: 'david_and_goliath',
    storyTitle: 'Young David Defeats Giant Goliath',
  },

  // Psalm 23
  {
    book: 'Psalms',
    chapter: 23,
    verse: 1,
    heading: 'The Lord Is My Shepherd',
    sceneType: 'shepherd_psalm_23',
    storyTitle: 'The Good Shepherd Guides My Steps',
  },

  // Daniel 6
  {
    book: 'Daniel',
    chapter: 6,
    verse: 10,
    heading: 'Daniel in the Lions’ Den',
    sceneType: 'daniel_lions_den',
    storyTitle: 'Daniel Protected in the Lions’ Den',
  },

  // Jonah 1 & 2
  {
    book: 'Jonah',
    chapter: 1,
    verse: 1,
    heading: 'Jonah Flees from the Lord',
    sceneType: 'jonah_great_fish',
    storyTitle: 'Jonah and the Great Big Fish',
  },

  // Matthew 14 / Luke 9
  {
    book: 'Matthew',
    chapter: 14,
    verse: 13,
    heading: 'Jesus Feeds the Five Thousand',
    sceneType: 'feeding_five_thousand',
    storyTitle: 'Jesus Multiplies Loaves and Fish',
  },
  {
    book: 'Matthew',
    chapter: 14,
    verse: 22,
    heading: 'Jesus Walks on the Water & Calms the Storm',
    sceneType: 'calming_the_storm',
    storyTitle: 'Jesus Steps Across the Waves',
  },

  // Luke 10
  {
    book: 'Luke',
    chapter: 10,
    verse: 25,
    heading: 'The Parable of the Good Samaritan',
    sceneType: 'good_samaritan',
    storyTitle: 'The Good Samaritan Helps a Stranger',
  },

  // Luke 15
  {
    book: 'Luke',
    chapter: 15,
    verse: 11,
    heading: 'The Parable of the Lost Son',
    sceneType: 'prodigal_son_father',
    storyTitle: 'The Loving Father Hugs His Son',
  },

  // Luke 19
  {
    book: 'Luke',
    chapter: 19,
    verse: 1,
    heading: 'Zacchaeus the Tax Collector',
    sceneType: 'zacchaeus_sycamore',
    storyTitle: 'Zacchaeus Climbs the Sycamore Tree',
  },

  // Matthew 26
  {
    book: 'Matthew',
    chapter: 26,
    verse: 17,
    heading: 'The Last Supper',
    sceneType: 'last_supper_communion',
    storyTitle: 'Jesus Shares the Bread and Cup',
  },

  // Matthew 27
  {
    book: 'Matthew',
    chapter: 27,
    verse: 32,
    heading: 'The Crucifixion of Jesus',
    sceneType: 'crucifixion_calvary',
    storyTitle: 'Jesus Gives His Life on the Cross',
  },

  // Matthew 28
  {
    book: 'Matthew',
    chapter: 28,
    verse: 1,
    heading: 'The Resurrection of Jesus',
    sceneType: 'empty_tomb_resurrection',
    storyTitle: 'He Is Risen! The Empty Tomb',
  },

  // Ephesians 6
  {
    book: 'Ephesians',
    chapter: 6,
    verse: 10,
    heading: 'The Full Armor of God',
    sceneType: 'armor_of_god',
    storyTitle: 'Putting on the Strong Armor of God',
  },
];

export function findSectionForVerse(
  book: string,
  chapter: number,
  verse: number
): ChapterSectionDefinition | undefined {
  const normBook = book.trim().toLowerCase();
  return CANONICAL_CHAPTER_SECTIONS.find(
    (sec) =>
      sec.book.toLowerCase() === normBook &&
      sec.chapter === chapter &&
      sec.verse === verse
  );
}

export function findSectionByHeading(
  book: string,
  chapter: number,
  heading: string
): ChapterSectionDefinition | undefined {
  const normBook = book.trim().toLowerCase();
  const normHeading = heading.trim().toLowerCase();
  return CANONICAL_CHAPTER_SECTIONS.find(
    (sec) =>
      sec.book.toLowerCase() === normBook &&
      sec.chapter === chapter &&
      sec.heading.toLowerCase().includes(normHeading)
  );
}

