import { BibleBook, BibleTranslation } from '@/types/bible';

export const BIBLE_TRANSLATIONS: BibleTranslation[] = [
  {
    id: 'NIV',
    name: 'New International Version',
    abbreviation: 'NIV',
    year: '2011',
    description: 'Balanced thought-for-thought and word-for-word modern English translation.',
    licenseInfo: 'Biblica / Zondervan Reference Text',
  },
  {
    id: 'KJV',
    name: 'King James Version',
    abbreviation: 'KJV',
    year: '1611 / 1769',
    description: 'Classic Authorised Version renowned for literary majesty and formal equivalence.',
    licenseInfo: 'Public Domain (Crown Copyright in UK)',
  },
  {
    id: 'ESV',
    name: 'English Standard Version',
    abbreviation: 'ESV',
    year: '2016',
    description: 'Essentially literal translation emphasizing word-for-word precision.',
    licenseInfo: 'Crossway Bibles Reference Edition',
  },
  {
    id: 'NKJV',
    name: 'New King James Version',
    abbreviation: 'NKJV',
    year: '1982',
    description: 'Modernized vocabulary and grammar preserving the classic KJV structure and textual base.',
    licenseInfo: 'Thomas Nelson Reference Edition',
  },
  {
    id: 'NLT',
    name: 'New Living Translation',
    abbreviation: 'NLT',
    year: '2015',
    description: 'Dynamic equivalence translation designed for clarity and natural reading aloud.',
    licenseInfo: 'Tyndale House Publishers Reference',
  },
  {
    id: 'ASV',
    name: 'American Standard Version',
    abbreviation: 'ASV',
    year: '1901',
    description: 'Historic formal-equivalence scholarly revision prized for strict lexical consistency.',
    licenseInfo: 'Public Domain',
  },
];

export const BIBLE_BOOKS: BibleBook[] = [
  // OLD TESTAMENT (39 Books)
  { id: 1, slug: 'genesis', name: 'Genesis', abbreviation: 'Gen', testament: 'OT', category: 'Pentateuch', chapters: 50 },
  { id: 2, slug: 'exodus', name: 'Exodus', abbreviation: 'Exo', testament: 'OT', category: 'Pentateuch', chapters: 40 },
  { id: 3, slug: 'leviticus', name: 'Leviticus', abbreviation: 'Lev', testament: 'OT', category: 'Pentateuch', chapters: 27 },
  { id: 4, slug: 'numbers', name: 'Numbers', abbreviation: 'Num', testament: 'OT', category: 'Pentateuch', chapters: 36 },
  { id: 5, slug: 'deuteronomy', name: 'Deuteronomy', abbreviation: 'Deut', testament: 'OT', category: 'Pentateuch', chapters: 34 },
  { id: 6, slug: 'joshua', name: 'Joshua', abbreviation: 'Josh', testament: 'OT', category: 'Historical', chapters: 24 },
  { id: 7, slug: 'judges', name: 'Judges', abbreviation: 'Judg', testament: 'OT', category: 'Historical', chapters: 21 },
  { id: 8, slug: 'ruth', name: 'Ruth', abbreviation: 'Ruth', testament: 'OT', category: 'Historical', chapters: 4 },
  { id: 9, slug: '1-samuel', name: '1 Samuel', abbreviation: '1 Sam', testament: 'OT', category: 'Historical', chapters: 31 },
  { id: 10, slug: '2-samuel', name: '2 Samuel', abbreviation: '2 Sam', testament: 'OT', category: 'Historical', chapters: 24 },
  { id: 11, slug: '1-kings', name: '1 Kings', abbreviation: '1 Kgs', testament: 'OT', category: 'Historical', chapters: 22 },
  { id: 12, slug: '2-kings', name: '2 Kings', abbreviation: '2 Kgs', testament: 'OT', category: 'Historical', chapters: 25 },
  { id: 13, slug: '1-chronicles', name: '1 Chronicles', abbreviation: '1 Chr', testament: 'OT', category: 'Historical', chapters: 29 },
  { id: 14, slug: '2-chronicles', name: '2 Chronicles', abbreviation: '2 Chr', testament: 'OT', category: 'Historical', chapters: 36 },
  { id: 15, slug: 'ezra', name: 'Ezra', abbreviation: 'Ezra', testament: 'OT', category: 'Historical', chapters: 10 },
  { id: 16, slug: 'nehemiah', name: 'Nehemiah', abbreviation: 'Neh', testament: 'OT', category: 'Historical', chapters: 13 },
  { id: 17, slug: 'esther', name: 'Esther', abbreviation: 'Esth', testament: 'OT', category: 'Historical', chapters: 10 },
  { id: 18, slug: 'job', name: 'Job', abbreviation: 'Job', testament: 'OT', category: 'Wisdom & Poetry', chapters: 42 },
  { id: 19, slug: 'psalms', name: 'Psalms', abbreviation: 'Ps', testament: 'OT', category: 'Wisdom & Poetry', chapters: 150 },
  { id: 20, slug: 'proverbs', name: 'Proverbs', abbreviation: 'Prov', testament: 'OT', category: 'Wisdom & Poetry', chapters: 31 },
  { id: 21, slug: 'ecclesiastes', name: 'Ecclesiastes', abbreviation: 'Eccl', testament: 'OT', category: 'Wisdom & Poetry', chapters: 12 },
  { id: 22, slug: 'song-of-solomon', name: 'Song of Solomon', abbreviation: 'Song', testament: 'OT', category: 'Wisdom & Poetry', chapters: 8 },
  { id: 23, slug: 'isaiah', name: 'Isaiah', abbreviation: 'Isa', testament: 'OT', category: 'Major Prophets', chapters: 66 },
  { id: 24, slug: 'jeremiah', name: 'Jeremiah', abbreviation: 'Jer', testament: 'OT', category: 'Major Prophets', chapters: 52 },
  { id: 25, slug: 'lamentations', name: 'Lamentations', abbreviation: 'Lam', testament: 'OT', category: 'Major Prophets', chapters: 5 },
  { id: 26, slug: 'ezekiel', name: 'Ezekiel', abbreviation: 'Ezek', testament: 'OT', category: 'Major Prophets', chapters: 48 },
  { id: 27, slug: 'daniel', name: 'Daniel', abbreviation: 'Dan', testament: 'OT', category: 'Major Prophets', chapters: 12 },
  { id: 28, slug: 'hosea', name: 'Hosea', abbreviation: 'Hos', testament: 'OT', category: 'Minor Prophets', chapters: 14 },
  { id: 29, slug: 'joel', name: 'Joel', abbreviation: 'Joel', testament: 'OT', category: 'Minor Prophets', chapters: 3 },
  { id: 30, slug: 'amos', name: 'Amos', abbreviation: 'Amos', testament: 'OT', category: 'Minor Prophets', chapters: 9 },
  { id: 31, slug: 'obadiah', name: 'Obadiah', abbreviation: 'Obad', testament: 'OT', category: 'Minor Prophets', chapters: 1 },
  { id: 32, slug: 'jonah', name: 'Jonah', abbreviation: 'Jonah', testament: 'OT', category: 'Minor Prophets', chapters: 4 },
  { id: 33, slug: 'micah', name: 'Micah', abbreviation: 'Mic', testament: 'OT', category: 'Minor Prophets', chapters: 7 },
  { id: 34, slug: 'nahum', name: 'Nahum', abbreviation: 'Nah', testament: 'OT', category: 'Minor Prophets', chapters: 3 },
  { id: 35, slug: 'habakkuk', name: 'Habakkuk', abbreviation: 'Hab', testament: 'OT', category: 'Minor Prophets', chapters: 3 },
  { id: 36, slug: 'zephaniah', name: 'Zephaniah', abbreviation: 'Zeph', testament: 'OT', category: 'Minor Prophets', chapters: 3 },
  { id: 37, slug: 'haggai', name: 'Haggai', abbreviation: 'Hag', testament: 'OT', category: 'Minor Prophets', chapters: 2 },
  { id: 38, slug: 'zechariah', name: 'Zechariah', abbreviation: 'Zech', testament: 'OT', category: 'Minor Prophets', chapters: 14 },
  { id: 39, slug: 'malachi', name: 'Malachi', abbreviation: 'Mal', testament: 'OT', category: 'Minor Prophets', chapters: 4 },

  // NEW TESTAMENT (27 Books)
  { id: 40, slug: 'matthew', name: 'Matthew', abbreviation: 'Matt', testament: 'NT', category: 'Gospels', chapters: 28 },
  { id: 41, slug: 'mark', name: 'Mark', abbreviation: 'Mark', testament: 'NT', category: 'Gospels', chapters: 16 },
  { id: 42, slug: 'luke', name: 'Luke', abbreviation: 'Luke', testament: 'NT', category: 'Gospels', chapters: 24 },
  { id: 43, slug: 'john', name: 'John', abbreviation: 'John', testament: 'NT', category: 'Gospels', chapters: 21 },
  { id: 44, slug: 'acts', name: 'Acts', abbreviation: 'Acts', testament: 'NT', category: 'Church History', chapters: 28 },
  { id: 45, slug: 'romans', name: 'Romans', abbreviation: 'Rom', testament: 'NT', category: 'Pauline Epistles', chapters: 16 },
  { id: 46, slug: '1-corinthians', name: '1 Corinthians', abbreviation: '1 Cor', testament: 'NT', category: 'Pauline Epistles', chapters: 16 },
  { id: 47, slug: '2-corinthians', name: '2 Corinthians', abbreviation: '2 Cor', testament: 'NT', category: 'Pauline Epistles', chapters: 13 },
  { id: 48, slug: 'galatians', name: 'Galatians', abbreviation: 'Gal', testament: 'NT', category: 'Pauline Epistles', chapters: 6 },
  { id: 49, slug: 'ephesians', name: 'Ephesians', abbreviation: 'Eph', testament: 'NT', category: 'Pauline Epistles', chapters: 6 },
  { id: 50, slug: 'philippians', name: 'Philippians', abbreviation: 'Phil', testament: 'NT', category: 'Pauline Epistles', chapters: 4 },
  { id: 51, slug: 'colossians', name: 'Colossians', abbreviation: 'Col', testament: 'NT', category: 'Pauline Epistles', chapters: 4 },
  { id: 52, slug: '1-thessalonians', name: '1 Thessalonians', abbreviation: '1 Thess', testament: 'NT', category: 'Pauline Epistles', chapters: 5 },
  { id: 53, slug: '2-thessalonians', name: '2 Thessalonians', abbreviation: '2 Thess', testament: 'NT', category: 'Pauline Epistles', chapters: 3 },
  { id: 54, slug: '1-timothy', name: '1 Timothy', abbreviation: '1 Tim', testament: 'NT', category: 'Pastoral Epistles', chapters: 6 },
  { id: 55, slug: '2-timothy', name: '2 Timothy', abbreviation: '2 Tim', testament: 'NT', category: 'Pastoral Epistles', chapters: 4 },
  { id: 56, slug: 'titus', name: 'Titus', abbreviation: 'Titus', testament: 'NT', category: 'Pastoral Epistles', chapters: 3 },
  { id: 57, slug: 'philemon', name: 'Philemon', abbreviation: 'Phlm', testament: 'NT', category: 'Pastoral Epistles', chapters: 1 },
  { id: 58, slug: 'hebrews', name: 'Hebrews', abbreviation: 'Heb', testament: 'NT', category: 'General Epistles', chapters: 13 },
  { id: 59, slug: 'james', name: 'James', abbreviation: 'Jas', testament: 'NT', category: 'General Epistles', chapters: 5 },
  { id: 60, slug: '1-peter', name: '1 Peter', abbreviation: '1 Pet', testament: 'NT', category: 'General Epistles', chapters: 5 },
  { id: 61, slug: '2-peter', name: '2 Peter', abbreviation: '2 Pet', testament: 'NT', category: 'General Epistles', chapters: 3 },
  { id: 62, slug: '1-john', name: '1 John', abbreviation: '1 John', testament: 'NT', category: 'General Epistles', chapters: 5 },
  { id: 63, slug: '2-john', name: '2 John', abbreviation: '2 John', testament: 'NT', category: 'General Epistles', chapters: 1 },
  { id: 64, slug: '3-john', name: '3 John', abbreviation: '3 John', testament: 'NT', category: 'General Epistles', chapters: 1 },
  { id: 65, slug: 'jude', name: 'Jude', abbreviation: 'Jude', testament: 'NT', category: 'General Epistles', chapters: 1 },
  { id: 66, slug: 'revelation', name: 'Revelation', abbreviation: 'Rev', testament: 'NT', category: 'Apocalyptic Prophecy', chapters: 22 },
];

export const BOOK_INTRODUCTIONS: Record<string, { author: string; date: string; theme: string; summary: string; keyConnections: string[] }> = {
  Genesis: {
    author: 'Moses (Traditional)',
    date: 'c. 1445–1405 BC',
    theme: 'Creation, Fall, Covenant, and the Patriarchal Foundations of Redemption',
    summary: 'Genesis ("Beginnings") establishes the cosmic and covenantal foundations of all Scripture: the creation of the cosmos by the Word of God, the fall of humanity, the proto-evangelium promise (Gen 3:15), and God’s covenant with Abraham, Isaac, Jacob, and Joseph.',
    keyConnections: ['Genesis 1:1', 'Genesis 3:15', 'Genesis 12:3', 'Genesis 15:6', 'Genesis 22:18'],
  },
  Deuteronomy: {
    author: 'Moses',
    date: 'c. 1406 BC (Plains of Moab)',
    theme: 'Covenant Renewal, Fidelity to YHWH, and the Song of Moses',
    summary: 'Delivered on the plains of Moab before Israel enters Canaan, Deuteronomy ("Second Law") consists of Moses’ farewell discourses renewing the Sinai covenant, culminating in the prophetic Song of Moses (Chapter 32) quoted extensively by Jesus and the Apostles.',
    keyConnections: ['Deuteronomy 6:4', 'Deuteronomy 8:3', 'Deuteronomy 18:15', 'Deuteronomy 32:4', 'Deuteronomy 32:6'],
  },
  Isaiah: {
    author: 'Isaiah son of Amoz',
    date: 'c. 740–681 BC',
    theme: 'The Holy One of Israel, Judgment, and the Messianic Suffering Servant & Immanuel',
    summary: 'Often called the "Fifth Gospel," Isaiah unveils both the transcendent holiness of YHWH and the clearest Old Testament prophecies of the Messiah: His virgin birth as Immanuel (7:14), His Davidic reign (9:6–7), and His substitutionary atonement (53:1–12).',
    keyConnections: ['Isaiah 7:14', 'Isaiah 9:6', 'Isaiah 40:3', 'Isaiah 53:5', 'Isaiah 61:1'],
  },
  Psalms: {
    author: 'David, Asaph, Sons of Korah, Moses, Solomon',
    date: 'c. 1440–450 BC',
    theme: 'The Prayer, Praise, Lament, and Royal Messianic Hope of Israel',
    summary: 'The hymnal and prayer book of ancient Israel and the New Testament church. The Psalms are the most frequently quoted Old Testament book in the New Testament, illuminating Christ’s passion (Psalm 22), resurrection (Psalm 16), and eternal priesthood (Psalm 110).',
    keyConnections: ['Psalms 16:10', 'Psalms 22:1', 'Psalms 23:1', 'Psalms 110:1', 'Psalms 118:22'],
  },
  Matthew: {
    author: 'Matthew (Levi) the Apostle',
    date: 'c. AD 55–65',
    theme: 'Jesus the Promised Messianic King and Fulfiller of Old Testament Prophecy',
    summary: 'Written to demonstrate that Jesus of Nazareth is the long-awaited Davidic Messiah who brings the Hebrew Scriptures to their telos ("fulfilment"). Matthew structures his Gospel around five great discourses echoing the five books of Moses.',
    keyConnections: ['Matthew 1:23', 'Matthew 2:6', 'Matthew 4:4', 'Matthew 18:15', 'Matthew 27:46'],
  },
  John: {
    author: 'John the Apostle',
    date: 'c. AD 85–95',
    theme: 'The Eternal Logos Made Flesh, the Signs of the Son of God, and Eternal Life',
    summary: 'Opening with a deliberate echo of Genesis 1:1 ("In the beginning was the Word"), John presents Jesus as the pre-existent divine Logos, the Passover Lamb of God, and the great "I AM" who reveals the Father.',
    keyConnections: ['John 1:1', 'John 1:14', 'John 3:14', 'John 3:16', 'John 19:36'],
  },
};

export function findBookByName(nameOrSlug: string): BibleBook | undefined {
  const normalized = nameOrSlug.trim().toLowerCase();
  return BIBLE_BOOKS.find(
    (b) =>
      b.name.toLowerCase() === normalized ||
      b.slug.toLowerCase() === normalized ||
      b.abbreviation.toLowerCase() === normalized ||
      (normalized === 'psalm' && b.name === 'Psalms')
  );
}

export function parseScriptureReference(ref: string): { book: string; chapter: number; verse?: number } | null {
  const cleaned = ref.trim();
  const match = cleaned.match(/^([1-3]?\s*[A-Za-z\s]+?)\s+(\d+)(?::(\d+))?$/);
  if (!match) return null;
  const bookObj = findBookByName(match[1]);
  if (!bookObj) return null;
  return {
    book: bookObj.name,
    chapter: parseInt(match[2], 10),
    verse: match[3] ? parseInt(match[3], 10) : undefined,
  };
}

