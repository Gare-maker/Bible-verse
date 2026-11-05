import { TranslationId, VerseData } from '@/types/bible';

// Helper to create multi-translation verse entries cleanly
function v(
  book: string,
  chapter: number,
  verse: number,
  translations: {
    NIV: string;
    KJV: string;
    ESV: string;
    NKJV: string;
    NLT: string;
    ASV: string;
  },
  options?: { heading?: string; isRedLetter?: boolean; footnote?: string; isPoetry?: boolean }
): VerseData {
  return {
    book,
    chapter,
    verse,
    canonicalRef: `${book} ${chapter}:${verse}`,
    translations,
    ...options,
  };
}

// Helper for standard verses where KJV/NIV/NKJV/ESV/NLT/ASV share close wording or have tailored renderings
function vQuick(
  book: string,
  chapter: number,
  verse: number,
  niv: string,
  kjv: string,
  esv?: string,
  nkjv?: string,
  nlt?: string,
  asv?: string,
  options?: { heading?: string; isRedLetter?: boolean; footnote?: string; isPoetry?: boolean }
): VerseData {
  return {
    book,
    chapter,
    verse,
    canonicalRef: `${book} ${chapter}:${verse}`,
    translations: {
      NIV: niv,
      KJV: kjv,
      ESV: esv || niv,
      NKJV: nkjv || kjv,
      NLT: nlt || niv,
      ASV: asv || kjv,
    },
    ...options,
  };
}

export const CORE_SCRIPTURE_VERSES: VerseData[] = [
  // ==========================================================================
  // DEUTERONOMY 31 (Preceding Chapter to Song of Moses in Deuteronomy 32)
  // ==========================================================================
  v(
    'Deuteronomy',
    31,
    19,
    {
      NIV: '“Now write down this song and teach it to the Israelites and have them sing it, so that it may be a witness for me against them.',
      KJV: 'Now therefore write ye this song for you, and teach it the children of Israel: put it in their mouths, that this song may be a witness for me against the children of Israel.',
      ESV: '“Now therefore write this song and teach it to the people of Israel. Put it in their mouths, that this song may be a witness for me against the people of Israel.',
      NKJV: '“Now therefore, write down this song for yourselves, and teach it to the children of Israel; put it in their mouths, that this song may be a witness for Me against the children of Israel.',
      NLT: '“Now write down the words of this song, and teach it to the people of Israel. Help them learn it, so it may serve as a witness for me against them.',
      ASV: 'Now therefore write ye this song for you, and teach thou it the children of Israel: put it in their mouths, that this song may be a witness for me against the children of Israel.',
    },
    { heading: 'Moses Commissioned to Write the Song of Witness' }
  ),
  v(
    'Deuteronomy',
    31,
    24,
    {
      NIV: 'After Moses finished writing in a book the words of this law from beginning to end,',
      KJV: 'And it came to pass, when Moses had made an end of writing the words of this law in a book, until they were finished,',
      ESV: 'When Moses had finished writing the words of this law in a book to the very end,',
      NKJV: 'So it was, when Moses had completed writing the words of this law in a book, when they were finished,',
      NLT: 'When Moses had finished writing this entire body of instruction in a book,',
      ASV: 'And it came to pass, when Moses had made an end of writing the words of this law in a book, until they were finished,',
    }
  ),
  v(
    'Deuteronomy',
    31,
    30,
    {
      NIV: 'And Moses recited the words of this song from beginning to end in the hearing of the whole assembly of Israel:',
      KJV: 'And Moses spake in the ears of all the congregation of Israel the words of this song, until they were ended.',
      ESV: 'Then Moses spoke the words of this song until they were finished, in the ears of all the assembly of Israel:',
      NKJV: 'Then Moses spoke in the hearing of all the assembly of Israel the words of this song until they were ended:',
      NLT: 'So Moses recited this entire song publicly to the whole assembly of Israel:',
      ASV: 'And Moses spake in the ears of all the assembly of Israel the words of this song, until they were finished:',
    }
  ),

  // ==========================================================================
  // DEUTERONOMY 32 (The Song of Moses — Matches User Screenshots 1, 2, 4)
  // ==========================================================================
  v(
    'Deuteronomy',
    32,
    1,
    {
      NIV: 'Listen, you heavens, and I will speak; hear, you earth, the words of my mouth.',
      KJV: 'Give ear, O ye heavens, and I will speak; and hear, O earth, the words of my mouth.',
      ESV: 'Give ear, O heavens, and I will speak, and let the earth hear the words of my mouth.',
      NKJV: 'Give ear, O heavens, and I will speak; And hear, O earth, the words of my mouth.',
      NLT: 'Listen, O heavens, and I will speak! Hear, O earth, the words that I say!',
      ASV: 'Give ear, ye heavens, and I will speak; And let the earth hear the words of my mouth.',
    },
    { heading: 'The Song of Moses', isPoetry: true }
  ),
  v(
    'Deuteronomy',
    32,
    2,
    {
      NIV: 'Let my teaching fall like rain and my words descend like dew, like showers on new grass, like abundant rain on tender plants.',
      KJV: 'My doctrine shall drop as the rain, my speech shall distil as the dew, as the small rain upon the tender herb, and as the showers upon the grass:',
      ESV: 'May my teaching drop as the rain, my speech distill as the dew, like gentle rain upon the tender grass, and like showers upon the herb.',
      NKJV: 'Let my teaching drop as the rain, My speech distill as the dew, As raindrops on the tender herb, And as showers on the grass.',
      NLT: 'Let my teaching fall on you like rain; let my speech settle like dew. Let my words fall like rain on tender grass, like gentle showers on young plants.',
      ASV: 'My doctrine shall drop as the rain; My speech shall distil as the dew, As the small rain upon the tender grass, And as the showers upon the herb.',
    },
    { isPoetry: true }
  ),
  v(
    'Deuteronomy',
    32,
    3,
    {
      NIV: 'I will proclaim the name of the LORD. Oh, praise the greatness of our God!',
      KJV: 'Because I will publish the name of the LORD: ascribe ye greatness unto our God.',
      ESV: 'For I will proclaim the name of the LORD; ascribe greatness to our God!',
      NKJV: 'For I proclaim the name of the LORD: Ascribe greatness to our God.',
      NLT: 'I will proclaim the name of the LORD; how glorious is our God!',
      ASV: 'For I will proclaim the name of Jehovah: Ascribe ye greatness unto our God.',
    },
    { isPoetry: true }
  ),
  v(
    'Deuteronomy',
    32,
    4,
    {
      NIV: 'He is the Rock, his works are perfect, and all his ways are just. A faithful God who does no wrong, upright and just is he.',
      KJV: 'He is the Rock, his work is perfect: for all his ways are judgment: a God of truth and without iniquity, just and right is he.',
      ESV: 'The Rock, his work is perfect, for all his ways are justice. A God of faithfulness and without iniquity, just and upright is he.',
      NKJV: 'He is the Rock, His work is perfect; For all His ways are justice, A God of truth and without injustice; Righteous and upright is He.',
      NLT: 'He is the Rock; his deeds are perfect. Everything he does is just and fair. He is a faithful God who does no wrong; how just and upright he is!',
      ASV: 'The Rock, his work is perfect; For all his ways are justice: A God of faithfulness and without iniquity, Just and right is he.',
    },
    { isPoetry: true }
  ),
  v(
    'Deuteronomy',
    32,
    5,
    {
      NIV: 'They are corrupt and not his children; to their shame they are a warped and crooked generation.',
      KJV: 'They have corrupted themselves, their spot is not the spot of his children: they are a perverse and crooked generation.',
      ESV: 'They have dealt corruptly with him; they are no longer his children because they are blemished; they are a crooked and twisted generation.',
      NKJV: 'They have corrupted themselves; They are not His children, Because of their blemish: A perverse and crooked generation.',
      NLT: 'But they have acted corruptly toward him; when they act so perversely, are they really his children? They are a deceitful and twisted generation.',
      ASV: 'They have dealt corruptly with him, they are not his children, it is their blemish; They are a perverse and crooked generation.',
    },
    { isPoetry: true }
  ),
  v(
    'Deuteronomy',
    32,
    6,
    {
      NIV: 'Is this the way you repay the LORD, you foolish and unwise people? Is he not your Father, your Creator, who made you and formed you?',
      KJV: 'Do ye thus requite the LORD, O foolish people and unwise? is not he thy father that hath bought thee? hath he not made thee, and established thee?',
      ESV: 'Do you thus repay the LORD, you foolish and senseless people? Is not he your father, who created you, who made you and established you?',
      NKJV: 'Do you thus deal with the LORD, O foolish and unwise people? Is He not your Father, who bought you? Has He not made you and established you?',
      NLT: 'Is this the way you repay the LORD, you foolish and senseless people? Isn’t he your Father who created you? Has he not made you and established you?',
      ASV: 'Do ye thus requite Jehovah, O foolish people and unwise? Is not he thy father that hath bought thee? He hath made thee, and established thee.',
    },
    {
      isPoetry: true,
      footnote: '32:6 Or Father, who bought you',
    }
  ),
  v(
    'Deuteronomy',
    32,
    7,
    {
      NIV: 'Remember the days of old; consider the generations long past. Ask your father and he will tell you, your elders, and they will explain to you.',
      KJV: 'Remember the days of old, consider the years of many generations: ask thy father, and he will shew thee; thy elders, and they will tell thee.',
      ESV: 'Remember the days of old; consider the years of many generations; ask your father, and he will show you, your elders, and they will tell you.',
      NKJV: 'Remember the days of old, Consider the years of many generations. Ask your father, and he will show you; Your elders, and they will tell you:',
      NLT: 'Remember the days of long ago; think about the generations past. Ask your father, and he will inform you. Inquire of your elders, and they will tell you.',
      ASV: 'Remember the days of old, Consider the years of many generations: Ask thy father, and he will show thee; Thine elders, and they will tell thee.',
    },
    { isPoetry: true }
  ),
  v(
    'Deuteronomy',
    32,
    8,
    {
      NIV: 'When the Most High gave the nations their inheritance, when he divided all mankind, he set up boundaries for the peoples according to the number of the sons of Israel.',
      KJV: 'When the Most High divided to the nations their inheritance, when he separated the sons of Adam, he set the bounds of the people according to the number of the children of Israel.',
      ESV: 'When the Most High gave to the nations their inheritance, when he divided mankind, he fixed the borders of the peoples according to the number of the sons of God.',
      NKJV: 'When the Most High divided their inheritance to the nations, When He separated the sons of Adam, He set the boundaries of the peoples According to the number of the children of Israel.',
      NLT: 'When the Most High assigned lands to the nations, when he divided up the human race, he established the boundaries of the peoples according to the number in his heavenly court.',
      ASV: 'When the Most High gave to the nations their inheritance, When he separated the children of men, He set the bounds of the peoples According to the number of the children of Israel.',
    },
    { isPoetry: true, footnote: '32:8 Dead Sea Scrolls (see also Septuagint): sons of God / heavenly court' }
  ),
  vQuick(
    'Deuteronomy',
    32,
    9,
    'For the LORD’s portion is his people, Jacob his allotted inheritance.',
    'For the LORD’S portion is his people; Jacob is the lot of his inheritance.',
    'But the LORD’s portion is his people, Jacob his allotted heritage.',
    'For the LORD’s portion is His people; Jacob is the place of His inheritance.',
    'For the people of Israel belong to the LORD; Jacob is his special possession.',
    'For Jehovah’s portion is his people; Jacob is the lot of his inheritance.',
    { isPoetry: true }
  ),
  vQuick(
    'Deuteronomy',
    32,
    10,
    'In a desert land he found him, in a barren and howling waste. He shielded him and cared for him; he guarded him as the apple of his eye,',
    'He found him in a desert land, and in the waste howling wilderness; he led him about, he instructed him, he kept him as the apple of his eye.',
    'He found him in a desert land, and in the howling waste of the wilderness; he encircled him, he cared for him, he kept him as the apple of his eye.',
    'He found him in a desert land And in the wasteland, a howling wilderness; He encircled him, He instructed him, He kept him as the apple of His eye.',
    'He found them in a desert land, in an empty, howling wasteland. He surrounded them and watched over them; he guarded them as the apple of his eye.',
    'He found him in a desert land, And in the waste howling wilderness; He compassed him about, he cared for him, He kept him as the apple of his eye.',
    { isPoetry: true }
  ),

  // ==========================================================================
  // MATTHEW 1 (Genealogy & Virgin Birth — MVP Test 1, 2, 3, 4, 5)
  // ==========================================================================
  vQuick(
    'Matthew',
    1,
    1,
    'This is the genealogy of Jesus the Messiah the son of David, the son of Abraham:',
    'The book of the generation of Jesus Christ, the son of David, the son of Abraham.',
    'The book of the genealogy of Jesus Christ, the son of David, the son of Abraham.',
    'The book of the genealogy of Jesus Christ, the Son of David, the Son of Abraham:',
    'This is a record of the ancestors of Jesus the Messiah, a descendant of David and of Abraham:',
    'The book of the generation of Jesus Christ, the son of David, the son of Abraham.',
    { heading: 'The Genealogy of Jesus the Messiah' }
  ),
  vQuick(
    'Matthew',
    1,
    2,
    'Abraham was the father of Isaac, Isaac the father of Jacob, Jacob the father of Judah and his brothers,',
    'Abraham begat Isaac; and Isaac begat Jacob; and Jacob begat Judas and his brethren;',
    'Abraham was the father of Isaac, and Isaac the father of Jacob, and Jacob the father of Judah and his brothers,',
    'Abraham begot Isaac, Isaac begot Jacob, and Jacob begot Judah and his brothers.'
  ),
  vQuick(
    'Matthew',
    1,
    3,
    'Judah the father of Perez and Zerah, whose mother was Tamar, Perez the father of Hezron, Hezron the father of Ram,',
    'And Judas begat Phares and Zara of Thamar; and Phares begat Esrom; and Esrom begat Aram;'
  ),
  vQuick(
    'Matthew',
    1,
    4,
    'Ram the father of Amminadab, Amminadab the father of Nahshon, Nahshon the father of Salmon,',
    'And Aram begat Aminadab; and Aminadab begat Naasson; and Naasson begat Salmon;'
  ),
  vQuick(
    'Matthew',
    1,
    5,
    'Salmon the father of Boaz, whose mother was Rahab, Boaz the father of Obed, whose mother was Ruth, Obed the father of Jesse,',
    'And Salmon begat Booz of Rachab; and Booz begat Obed of Ruth; and Obed begat Jesse;'
  ),
  vQuick(
    'Matthew',
    1,
    6,
    'and Jesse the father of King David. David was the father of Solomon, whose mother had been Uriah’s wife,',
    'And Jesse begat David the king; and David the king begat Solomon of her that had been the wife of Urias;'
  ),
  vQuick(
    'Matthew',
    1,
    7,
    'Solomon the father of Rehoboam, Rehoboam the father of Abijah, Abijah the father of Asa,',
    'And Solomon begat Roboam; and Roboam begat Abia; and Abia begat Asa;'
  ),
  vQuick(
    'Matthew',
    1,
    8,
    'Asa the father of Jehoshaphat, Jehoshaphat the father of Jehoram, Jehoram the father of Uzziah,',
    'And Asa begat Josaphat; and Josaphat begat Joram; and Joram begat Ozias;'
  ),
  vQuick(
    'Matthew',
    1,
    9,
    'Uzziah the father of Jotham, Jotham the father of Ahaz, Ahaz the father of Hezekiah,',
    'And Ozias begat Joatham; and Joatham begat Achaz; and Achaz begat Ezekias;'
  ),
  vQuick(
    'Matthew',
    1,
    10,
    'Hezekiah the father of Manasseh, Manasseh the father of Amon, Amon the father of Josiah,',
    'And Ezekias begat Manasses; and Manasses begat Amon; and Amon begat Josias;'
  ),
  vQuick(
    'Matthew',
    1,
    11,
    'and Josiah the father of Jeconiah and his brothers at the time of the exile to Babylon.',
    'And Josias begat Jechonias and his brethren, about the time they were carried away to Babylon:'
  ),
  vQuick(
    'Matthew',
    1,
    12,
    'After the exile to Babylon: Jeconiah was the father of Shealtiel, Shealtiel the father of Zerubbabel,',
    'And after they were brought to Babylon, Jechonias begat Salathiel; and Salathiel begat Zorobabel;'
  ),
  vQuick(
    'Matthew',
    1,
    13,
    'Zerubbabel the father of Abihud, Abihud the father of Eliakim, Eliakim the father of Azor,',
    'And Zorobabel begat Abiud; and Abiud begat Eliakim; and Eliakim begat Azor;'
  ),
  vQuick(
    'Matthew',
    1,
    14,
    'Azor the father of Zadok, Zadok the father of Akim, Akim the father of Elihud,',
    'And Azor begat Sadoc; and Sadoc begat Achim; and Achim begat Eliud;'
  ),
  vQuick(
    'Matthew',
    1,
    15,
    'Elihud the father of Eleazar, Eleazar the father of Matthan, Matthan the father of Jacob,',
    'And Eliud begat Eleazar; and Eleazar begat Matthan; and Matthan begat Jacob;'
  ),
  vQuick(
    'Matthew',
    1,
    16,
    'and Jacob the father of Joseph, the husband of Mary, and Mary was the mother of Jesus who is called the Messiah.',
    'And Jacob begat Joseph the husband of Mary, of whom was born Jesus, who is called Christ.',
    'and Jacob the father of Joseph the husband of Mary, of whom Jesus was born, who is called Christ.',
    'And Jacob begot Joseph the husband of Mary, of whom was born Jesus who is called Christ.'
  ),
  vQuick(
    'Matthew',
    1,
    17,
    'Thus there were fourteen generations in all from Abraham to David, fourteen from David to the exile to Babylon, and fourteen from the exile to the Messiah.',
    'So all the generations from Abraham to David are fourteen generations; and from David until the carrying away into Babylon are fourteen generations; and from the carrying away into Babylon unto Christ are fourteen generations.'
  ),
  vQuick(
    'Matthew',
    1,
    18,
    'This is how the birth of Jesus the Messiah came about: His mother Mary was pledged to be married to Joseph, but before they came together, she was found to be pregnant through the Holy Spirit.',
    'Now the birth of Jesus Christ was on this wise: When as his mother Mary was espoused to Joseph, before they came together, she was found with child of the Holy Ghost.',
    'Now the birth of Jesus Christ took place in this way. When his mother Mary had been betrothed to Joseph, before they came together she was found to be with child from the Holy Spirit.',
    'Now the birth of Jesus Christ was as follows: After His mother Mary was betrothed to Joseph, before they came together, she was found with child of the Holy Spirit.',
    'This is how Jesus the Messiah was born. His mother, Mary, was engaged to be married to Joseph. But before the marriage took place, while she was still a virgin, she became pregnant through the power of the Holy Spirit.',
    'Now the birth of Jesus Christ was on this wise: When his mother Mary had been betrothed to Joseph, before they came together she was found with child of the Holy Spirit.',
    { heading: 'Joseph Accepts Jesus as His Son' }
  ),
  vQuick(
    'Matthew',
    1,
    19,
    'Because Joseph her husband was faithful to the law, and yet did not want to expose her to public disgrace, he had in mind to divorce her quietly.',
    'Then Joseph her husband, being a just man, and not willing to make her a publick example, was minded to put her away privily.',
    'And her husband Joseph, being a just man and unwilling to put her to shame, resolved to divorce her quietly.',
    'Then Joseph her husband, being a just man, and not wanting to make her a public example, was minded to put her away secretly.'
  ),
  vQuick(
    'Matthew',
    1,
    20,
    'But after he had considered this, an angel of the Lord appeared to him in a dream and said, “Joseph son of David, do not be afraid to take Mary home as your wife, because what is conceived in her is from the Holy Spirit.',
    'But while he thought on these things, behold, the angel of the Lord appeared unto him in a dream, saying, Joseph, thou son of David, fear not to take unto thee Mary thy wife: for that which is conceived in her is of the Holy Ghost.',
    'But as he considered these things, behold, an angel of the Lord appeared to him in a dream, saying, “Joseph, son of David, do not fear to take Mary as your wife, for that which is conceived in her is from the Holy Spirit.',
    'But while he thought about these things, behold, an angel of the Lord appeared to him in a dream, saying, “Joseph, son of David, do not be afraid to take to you Mary your wife, for that which is conceived in her is of the Holy Spirit.'
  ),
  vQuick(
    'Matthew',
    1,
    21,
    'She will give birth to a son, and you are to give him the name Jesus, because he will save his people from their sins.”',
    'And she shall bring forth a son, and thou shalt call his name JESUS: for he shall save his people from their sins.',
    'She will bear a son, and you shall call his name Jesus, for he will save his people from their sins.”',
    'And she will bring forth a Son, and you shall call His name JESUS, for He will save His people from their sins.”',
    'And she will have a son, and you are to name him Jesus, for he will save his people from their sins.”',
    'And she shall bring forth a son; and thou shalt call his name JESUS; for it is he that shall save his people from their sins.',
    { footnote: '1:21 Jesus is the Greek form of Joshua, which means the LORD saves.' }
  ),
  vQuick(
    'Matthew',
    1,
    22,
    'All this took place to fulfill what the Lord had said through the prophet:',
    'Now all this was done, that it might be fulfilled which was spoken of the Lord by the prophet, saying,',
    'All this took place to fulfill what the Lord had spoken by the prophet:',
    'So all this was done that it might be fulfilled which was spoken by the Lord through the prophet, saying:'
  ),
  v(
    'Matthew',
    1,
    23,
    {
      NIV: '“The virgin will conceive and give birth to a son, and they will call him Immanuel” (which means “God with us”).',
      KJV: 'Behold, a virgin shall be with child, and shall bring forth a son, and they shall call his name Emmanuel, which being interpreted is, God with us.',
      ESV: '“Behold, the virgin shall conceive and bear a son, and they shall call his name Immanuel” (which means, God with us).',
      NKJV: '“Behold, the virgin shall be with child, and bear a Son, and they shall call His name Immanuel,” which is translated, “God with us.”',
      NLT: '“Look! The virgin will conceive a child! She will give birth to a son, and they will call him Immanuel, which means ‘God is with us.’”',
      ASV: 'Behold, the virgin shall be with child, and shall bring forth a son, And they shall call his name Immanuel; which is, being interpreted, God with us.',
    },
    { footnote: '1:23 Isaiah 7:14' }
  ),
  vQuick(
    'Matthew',
    1,
    24,
    'When Joseph woke up, he did what the angel of the Lord had commanded him and took Mary home as his wife.',
    'Then Joseph being raised from sleep did as the angel of the Lord had bidden him, and took unto him his wife:'
  ),
  vQuick(
    'Matthew',
    1,
    25,
    'But he did not consummate their marriage until she gave birth to a son. And he gave him the name Jesus.',
    'And knew her not till she had brought forth her firstborn son: and he called his name JESUS.'
  ),

  // ==========================================================================
  // MATTHEW 17 & EARLY MATTHEW 18 (Preceding Context to Matthew 18:15-20)
  // ==========================================================================
  v(
    'Matthew',
    17,
    22,
    {
      NIV: 'When they came together in Galilee, he said to them, “The Son of Man is going to be delivered into the hands of men.',
      KJV: 'And while they abode in Galilee, Jesus said unto them, The Son of man shall be betrayed into the hands of men:',
      ESV: 'As they were gathering in Galilee, Jesus said to them, “The Son of Man is about to be delivered into the hands of men,',
      NKJV: 'Now while they were staying in Galilee, Jesus said to them, “The Son of Man is about to be betrayed into the hands of men,',
      NLT: 'After they gathered again in Galilee, Jesus told them, “The Son of Man is going to be betrayed into the hands of his enemies.',
      ASV: 'And while they abode in Galilee, Jesus said unto them, The Son of man shall be delivered up into the hands of men;',
    },
    { heading: 'Jesus Predicts His Death a Second Time', isRedLetter: true }
  ),
  v(
    'Matthew',
    17,
    23,
    {
      NIV: 'They will kill him, and on the third day he will be raised to life.” And the disciples were filled with grief.',
      KJV: 'And they shall kill him, and the third day he shall be raised again. And they were exceeding sorry.',
      ESV: 'and they will kill him, and he will be raised on the third day.” And they were greatly distressed.',
      NKJV: 'and they will kill Him, and the third day He will be raised up.” And they were exceedingly sorrowful.',
      NLT: 'He will be killed, but on the third day he will be raised from the dead.” And the disciples were filled with grief.',
      ASV: 'and they shall kill him, and the third day he shall be raised up. And they were exceeding sorry.',
    },
    { isRedLetter: true }
  ),
  v(
    'Matthew',
    18,
    1,
    {
      NIV: 'At that time the disciples came to Jesus and asked, “Who, then, is the greatest in the kingdom of heaven?”',
      KJV: 'At the same time came the disciples unto Jesus, saying, Who is the greatest in the kingdom of heaven?',
      ESV: 'At that time the disciples came to Jesus, saying, “Who is the greatest in the kingdom of heaven?”',
      NKJV: 'At that time the disciples came to Jesus, saying, “Who then is greatest in the kingdom of heaven?”',
      NLT: 'About that time the disciples came to Jesus and asked, “Who is greatest in the Kingdom of Heaven?”',
      ASV: 'In that hour came the disciples unto Jesus, saying, Who then is greatest in the kingdom of heaven?',
    },
    { heading: 'The Greatest in the Kingdom of Heaven' }
  ),
  v(
    'Matthew',
    18,
    3,
    {
      NIV: 'And he said: “Truly I tell you, unless you change and become like little children, you will never enter the kingdom of heaven.',
      KJV: 'And said, Verily I say unto you, Except ye be converted, and become as little children, ye shall not enter into the kingdom of heaven.',
      ESV: 'and said, “Truly, I say to you, unless you turn and become like children, you will never enter the kingdom of heaven.',
      NKJV: 'and said, “Assuredly, I say to you, unless you are converted and become as little children, you will by no means enter the kingdom of heaven.',
      NLT: 'Then he said, “I tell you the truth, unless you turn from your sins and become like little children, you will never get into the Kingdom of Heaven.',
      ASV: 'and said, Verily I say unto you, Except ye turn, and become as little children, ye shall in no wise enter into the kingdom of heaven.',
    },
    { isRedLetter: true }
  ),
  v(
    'Matthew',
    18,
    12,
    {
      NIV: '“What do you think? If a man owns a hundred sheep, and one of them wanders away, will he not leave the ninety-nine on the hills and go to look for the one that wandered off?',
      KJV: 'How think ye? if a man have an hundred sheep, and one of them be gone astray, doth he not leave the ninety and nine, and goeth into the mountains, and seeketh that which is gone astray?',
      ESV: 'What do you think? If a man has a hundred sheep, and one of them has gone astray, does he not leave the ninety-nine on the mountains and go in search of the one that went astray?',
      NKJV: '“What do you think? If a man has a hundred sheep, and one of them goes astray, does he not leave the ninety-nine and go to the mountains to seek the one that is straying?',
      NLT: '“If a man has a hundred sheep and one of them wanders away, what will he do? Won’t he leave the ninety-nine others on the hills and go out to search for the one that is lost?',
      ASV: 'How think ye? if any man have a hundred sheep, and one of them be gone astray, doth he not leave the ninety and nine, and go unto the mountains, and seek that which goeth astray?',
    },
    { heading: 'The Parable of the Wandering Sheep', isRedLetter: true }
  ),
  v(
    'Matthew',
    18,
    14,
    {
      NIV: 'In the same way your Father in heaven is not willing that any of these little ones should perish.',
      KJV: 'Even so it is not the will of your Father which is in heaven, that one of these little ones should perish.',
      ESV: 'So it is not the will of my Father who is in heaven that one of these little ones should perish.',
      NKJV: 'Even so it is not the will of your Father who is in heaven that one of these little ones should perish.',
      NLT: 'In the same way, it is not my heavenly Father’s will that even one of these little ones should perish.',
      ASV: 'Even so it is not the will of your Father who is in heaven, that one of these little ones should perish.',
    },
    { isRedLetter: true }
  ),

  // ==========================================================================
  // MATTHEW 18 (Matches User Screenshot 3 — Red-Letter Words of Jesus)
  // ==========================================================================
  v(
    'Matthew',
    18,
    15,
    {
      NIV: '“If your brother or sister sins, go and point out their fault, just between the two of you. If they listen to you, you have won them over.',
      KJV: 'Moreover if thy brother shall trespass against thee, go and tell him his fault between thee and him alone: if he shall hear thee, thou hast gained thy brother.',
      ESV: '“If your brother sins against you, go and tell him his fault, between you and him alone. If he listens to you, you have gained your brother.',
      NKJV: '“Moreover if your brother sins against you, go and tell him his fault between you and him alone. If he hears you, you have gained your brother.',
      NLT: '“If another believer sins against you, go privately and point out the offense. If the other person listens and confesses it, you have won that person back.',
      ASV: 'And if thy brother sin against thee, go, show him his fault between thee and him alone: if he hear thee, thou hast gained thy brother.',
    },
    { heading: 'Dealing with a Sinning Brother', isRedLetter: true }
  ),
  v(
    'Matthew',
    18,
    16,
    {
      NIV: 'But if they will not listen, take one or two others along, so that ‘every matter may be established by the testimony of two or three witnesses.’',
      KJV: 'But if he will not hear thee, then take with thee one or two more, that in the mouth of two or three witnesses every word may be established.',
      ESV: 'But if he does not listen, take one or two others along with you, that every charge may be established by the evidence of two or three witnesses.',
      NKJV: 'But if he will not hear, take with you one or two more, that ‘by the mouth of two or three witnesses every word may be established.’',
      NLT: 'But if you are unsuccessful, take one or two others with you and go back again, so that everything you say may be confirmed by two or three witnesses.',
      ASV: 'But if he hear thee not, take with thee one or two more, that at the mouth of two witnesses or three every word may be established.',
    },
    { isRedLetter: true, footnote: '18:16 Deut. 19:15' }
  ),
  v(
    'Matthew',
    18,
    17,
    {
      NIV: 'If they still refuse to listen, tell it to the church; and if they refuse to listen even to the church, treat them as you would a pagan or a tax collector.',
      KJV: 'And if he shall neglect to hear them, tell it unto the church: but if he neglect to hear the church, let him be unto thee as an heathen man and a publican.',
      ESV: 'If he refuses to listen to them, tell it to the church. And if he refuses to listen even to the church, let him be to you as a Gentile and a tax collector.',
      NKJV: 'And if he refuses to hear them, tell it to the church. But if he refuses even to hear the church, let him be to you like a heathen and a tax collector.',
      NLT: 'If the person still refuses to listen, take your case to the church. Then if he or she won’t accept the church’s decision, treat that person as a pagan or a corrupt tax collector.',
      ASV: 'And if he refuse to hear them, tell it unto the church: and if he refuse to hear the church also, let him be unto thee as the Gentile and the publican.',
    },
    { isRedLetter: true }
  ),
  v(
    'Matthew',
    18,
    18,
    {
      NIV: '“Truly I tell you, whatever you bind on earth will be bound in heaven, and whatever you loose on earth will be loosed in heaven.',
      KJV: 'Verily I say unto you, Whatsoever ye shall bind on earth shall be bound in heaven: and whatsoever ye shall loose on earth shall be loosed in heaven.',
      ESV: 'Truly, I say to you, whatever you bind on earth shall be bound in heaven, and whatever you loose on earth shall be loosed in heaven.',
      NKJV: '“Assuredly, I say to you, whatever you bind on earth will be bound in heaven, and whatever you loose on earth will be loosed in heaven.',
      NLT: '“I tell you the truth, whatever you forbid on earth will be forbidden in heaven, and whatever you permit on earth will be permitted in heaven.',
      ASV: 'Verily I say unto you, What things soever ye shall bind on earth shall be bound in heaven; and what things soever ye shall loose on earth shall be loosed in heaven.',
    },
    { isRedLetter: true }
  ),
  v(
    'Matthew',
    18,
    19,
    {
      NIV: '“Again, truly I tell you that if two of you on earth agree about anything they ask for, it will be done for them by my Father in heaven.',
      KJV: 'Again I say unto you, That if two of you shall agree on earth as touching any thing that they shall ask, it shall be done for them of my Father which is in heaven.',
      ESV: 'Again I say to you, if two of you agree on earth about anything they ask, it will be done for them by my Father in heaven.',
      NKJV: '“Again I say to you that if two of you agree on earth concerning anything that they ask, it will be done for them by My Father in heaven.',
      NLT: '“I also tell you this: If two of you agree here on earth concerning anything you ask, my Father in heaven will do it for you.',
      ASV: 'Again I say unto you, that if two of you shall agree on earth as touching anything that they shall ask, it shall be done for them of my Father who is in heaven.',
    },
    { isRedLetter: true }
  ),
  v(
    'Matthew',
    18,
    20,
    {
      NIV: 'For where two or three gather in my name, there am I with them.”',
      KJV: 'For where two or three are gathered together in my name, there am I in the midst of them.',
      ESV: 'For where two or three are gathered in my name, there am I among them.”',
      NKJV: 'For where two or three are gathered together in My name, I am there in the midst of them.”',
      NLT: 'For where two or three gather together as my followers, I am there among them.”',
      ASV: 'For where two or three are gathered together in my name, there am I in the midst of them.',
    },
    { isRedLetter: true }
  ),

  // ==========================================================================
  // ISAIAH 6 & EARLY ISAIAH 7 (Preceding Context to Isaiah 7:14)
  // ==========================================================================
  v(
    'Isaiah',
    6,
    1,
    {
      NIV: 'In the year that King Uzziah died, I saw the Lord, high and exalted, seated on a throne; and the train of his robe filled the temple.',
      KJV: 'In the year that king Uzziah died I saw also the Lord sitting upon a throne, high and lifted up, and his train filled the temple.',
      ESV: 'In the year that King Uzziah died I saw the Lord sitting upon a throne, high and lifted up; and the train of his robe filled the temple.',
      NKJV: 'In the year that King Uzziah died, I saw the Lord sitting on a throne, high and lifted up, and the train of His robe filled the temple.',
      NLT: 'It was in the year King Uzziah died that I saw the Lord. He was sitting on a lofty throne, and the train of his robe filled the Temple.',
      ASV: 'In the year that king Uzziah died I saw the Lord sitting upon a throne, high and lifted up; and his train filled the temple.',
    },
    { heading: 'Isaiah’s Commission in the Temple' }
  ),
  v(
    'Isaiah',
    6,
    8,
    {
      NIV: 'Then I heard the voice of the Lord saying, “Whom shall I send? And who will go for us?” And I said, “Here am I. Send me!”',
      KJV: 'Also I heard the voice of the Lord, saying, Whom shall I send, and who will go for us? Then said I, Here am I; send me.',
      ESV: 'And I heard the voice of the Lord saying, “Whom shall I send, and who will go for us?” Then I said, “Here I am! Send me.”',
      NKJV: 'Also I heard the voice of the Lord, saying: “Whom shall I send, And who will go for Us?” Then I said, “Here am I! Send me.”',
      NLT: 'Then I heard the Lord asking, “Whom should I send as a messenger to this people? Who will go for us?” I said, “Here I am. Send me.”',
      ASV: 'And I heard the voice of the Lord, saying, Whom shall I send, and who will go for us? Then I said, Here am I; send me.',
    }
  ),
  v(
    'Isaiah',
    7,
    1,
    {
      NIV: 'When Ahaz son of Jotham, the son of Uzziah, was king of Judah, King Rezin of Aram and Pekah son of Remaliah king of Israel marched up to fight against Jerusalem, but they could not overpower it.',
      KJV: 'And it came to pass in the days of Ahaz the son of Jotham, the son of Uzziah, king of Judah, that Rezin the king of Syria, and Pekah the son of Remaliah, king of Israel, went up toward Jerusalem to war against it, but could not prevail against it.',
      ESV: 'In the days of Ahaz the son of Jotham, son of Uzziah, king of Judah, Rezin the king of Syria and Pekah the son of Remaliah the king of Israel came up to Jerusalem to wage war against it, but could not yet mount an attack against it.',
      NKJV: 'Now it came to pass in the days of Ahaz the son of Jotham, the son of Uzziah, king of Judah, that Rezin king of Syria and Pekah the son of Remaliah, king of Israel, went up to Jerusalem to make war against it, but could not prevail against it.',
      NLT: 'When Ahaz, the son of Jotham and grandson of Uzziah, was king of Judah, King Rezin of Aram and Pekah son of Remaliah, the king of Israel, set out to attack Jerusalem. However, they were unable to carry out their plan.',
      ASV: 'And it came to pass in the days of Ahaz the son of Jotham, the son of Uzziah, king of Judah, that Rezin the king of Syria, and Pekah the son of Remaliah, king of Israel, went up to Jerusalem to war against it, but could not prevail against it.',
    },
    { heading: 'The Crisis of King Ahaz and the Threat to David’s House' }
  ),
  v(
    'Isaiah',
    7,
    2,
    {
      NIV: 'Now the house of David was told, “Aram has allied itself with Ephraim”; so the hearts of Ahaz and his people were shaken, as the trees of the forest are shaken by the wind.',
      KJV: 'And it was told the house of David, saying, Syria is confederate with Ephraim. And his heart was moved, and the heart of his people, as the trees of the wood are moved with the wind.',
      ESV: 'When the house of David was told, “Syria is in league with Ephraim,” the heart of Ahaz and the heart of his people shook as the trees of the forest shake before the wind.',
      NKJV: 'And it was told to the house of David, saying, “Syria’s forces are deployed in Ephraim.” So his heart and the heart of his people were moved as the trees of the woods are moved with the wind.',
      NLT: 'The news had come to the royal court of David: “Aram is allied with Ephraim against us!” So the hearts of the king and his people trembled with fear, like trees shaking in a storm.',
      ASV: 'And it was told the house of David, saying, Syria is confederate with Ephraim. And his heart trembled, and the heart of his people, as the trees of the forest tremble with the wind.',
    }
  ),
  v(
    'Isaiah',
    7,
    9,
    {
      NIV: 'The head of Ephraim is Samaria, and the head of Samaria is only Remaliah’s son. If you do not stand firm in your faith, you will not stand at all.’”',
      KJV: 'And the head of Ephraim is Samaria, and the head of Samaria is Remaliah’s son. If ye will not believe, surely ye shall not be established.',
      ESV: 'And the head of Ephraim is Samaria, and the head of Samaria is the son of Remaliah. If you are not firm in faith, you will not be firm at all.’”',
      NKJV: 'The head of Ephraim is Samaria, And the head of Samaria is Remaliah’s son. If you will not believe, Surely you shall not be established.’”',
      NLT: 'The capital of Ephraim is Samaria, and the ruler of Samaria is only Remaliah’s son. Unless your faith is firm, I cannot make you stand firm.’”',
      ASV: 'and the head of Ephraim is Samaria, and the head of Samaria is Remaliah’s son. If ye will not believe, surely ye shall not be established.',
    }
  ),

  // ==========================================================================
  // ISAIAH 7 (The Prophecy of Immanuel — Bidirectional with Matthew 1:23)
  // ==========================================================================
  vQuick(
    'Isaiah',
    7,
    10,
    'Again the LORD spoke to Ahaz,',
    'Moreover the LORD spake again unto Ahaz, saying,',
    'Again the LORD spoke to Ahaz:',
    'Moreover the LORD spoke again to Ahaz, saying,',
    'Later, the LORD sent this message to King Ahaz:',
    'And Jehovah spake again unto Ahaz, saying,',
    { heading: 'The Sign of Immanuel' }
  ),
  vQuick(
    'Isaiah',
    7,
    11,
    '“Ask the LORD your God for a sign, whether in the deepest depths or in the highest heights.”',
    'Ask thee a sign of the LORD thy God; ask it either in the depth, or in the height above.',
    '“Ask a sign of the LORD your God; let it be deep as Sheol or high as heaven.”',
    '“Ask a sign for yourself from the LORD your God; ask it either in the depth or in the height above.”'
  ),
  vQuick(
    'Isaiah',
    7,
    12,
    'But Ahaz said, “I will not ask; I will not put the LORD to the test.”',
    'But Ahaz said, I will not ask, neither will I tempt the LORD.',
    'But Ahaz said, “I will not ask, and I will not put the LORD to the test.”',
    'But Ahaz said, “I will not ask, nor will I test the LORD!”'
  ),
  vQuick(
    'Isaiah',
    7,
    13,
    'Then Isaiah said, “Hear now, you house of David! Is it not enough to try the patience of humans? Will you try the patience of my God also?',
    'And he said, Hear ye now, O house of David; Is it a small thing for you to weary men, but will ye weary my God also?',
    'And he said, “Hear then, O house of David! Is it too little for you to weary men, that you weary my God also?',
    'Then he said, “Hear now, O house of David! Is it a small thing for you to weary men, but will you weary my God also?'
  ),
  v(
    'Isaiah',
    7,
    14,
    {
      NIV: 'Therefore the Lord himself will give you a sign: The virgin will conceive and give birth to a son, and will call him Immanuel.',
      KJV: 'Therefore the Lord himself shall give you a sign; Behold, a virgin shall conceive, and bear a son, and shall call his name Immanuel.',
      ESV: 'Therefore the Lord himself will give you a sign. Behold, the virgin shall conceive and bear a son, and shall call his name Immanuel.',
      NKJV: 'Therefore the Lord Himself will give you a sign: Behold, the virgin shall conceive and bear a Son, and shall call His name Immanuel.',
      NLT: 'All right then, the Lord himself will give you the sign. Look! The virgin will conceive a child! She will give birth to a son and will call him Immanuel (which means ‘God is with us’).',
      ASV: 'Therefore the Lord himself will give you a sign: behold, a virgin shall conceive, and bear a son, and shall call his name Immanuel.',
    },
    { footnote: '7:14 Hebrew almah; Septuagint parthenos; fulfilled in Matthew 1:23' }
  ),
  vQuick(
    'Isaiah',
    7,
    15,
    'He will be eating curds and honey when he knows enough to reject the wrong and choose the right,',
    'Butter and honey shall he eat, that he may know to refuse the evil, and choose the good.'
  ),

  // ==========================================================================
  // JOHN 1 (The Eternal Word — Bidirectional with Genesis 1:1)
  // ==========================================================================
  v(
    'John',
    1,
    1,
    {
      NIV: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
      KJV: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
      ESV: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
      NKJV: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
      NLT: 'In the beginning the Word already existed. The Word was with God, and the Word was God.',
      ASV: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
    },
    { heading: 'The Word Became Flesh' }
  ),
  v(
    'John',
    1,
    2,
    {
      NIV: 'He was with God in the beginning.',
      KJV: 'The same was in the beginning with God.',
      ESV: 'He was in the beginning with God.',
      NKJV: 'He was in the beginning with God.',
      NLT: 'He existed in the beginning with God.',
      ASV: 'The same was in the beginning with God.',
    }
  ),
  v(
    'John',
    1,
    3,
    {
      NIV: 'Through him all things were made; without him nothing was made that has been made.',
      KJV: 'All things were made by him; and without him was not any thing made that was made.',
      ESV: 'All things were made through him, and without him was not any thing made that was made.',
      NKJV: 'All things were made through Him, and without Him nothing was made that was made.',
      NLT: 'God created everything through him, and nothing was created except through him.',
      ASV: 'All things were made through him; and without him was not anything made that hath been made.',
    }
  ),
  vQuick(
    'John',
    1,
    4,
    'In him was life, and that life was the light of all mankind.',
    'In him was life; and the life was the light of men.',
    'In him was life, and the life was the light of men.',
    'In Him was life, and the life was the light of men.'
  ),
  vQuick(
    'John',
    1,
    5,
    'The light shines in the darkness, and the darkness has not overcome it.',
    'And the light shineth in darkness; and the darkness comprehended it not.',
    'The light shines in the darkness, and the darkness has not overcome it.',
    'And the light shines in the darkness, and the darkness did not comprehend it.'
  ),
  v(
    'John',
    1,
    14,
    {
      NIV: 'The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth.',
      KJV: 'And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.',
      ESV: 'And the Word became flesh and dwelt among us, and we have seen his glory, glory as of the only Son from the Father, full of grace and truth.',
      NKJV: 'And the Word became flesh and dwelt among us, and we beheld His glory, the glory as of the only begotten of the Father, full of grace and truth.',
      NLT: 'So the Word became human and made his home among us. He was full of unfailing love and faithfulness. And we have seen his glory, the glory of the Father’s one and only Son.',
      ASV: 'And the Word became flesh, and dwelt among us (and we beheld his glory, glory as of the only begotten from the Father), full of grace and truth.',
    }
  ),
  vQuick(
    'John',
    1,
    29,
    'The next day John saw Jesus coming toward him and said, “Look, the Lamb of God, who takes away the sin of the world!”',
    'The next day John seeth Jesus coming unto him, and saith, Behold the Lamb of God, which taketh away the sin of the world.',
    'The next day he saw Jesus coming toward him, and said, “Behold, the Lamb of God, who takes away the sin of the world!”',
    'The next day John saw Jesus coming toward him, and said, “Behold! The Lamb of God who takes away the sin of the world!”',
    undefined,
    undefined,
    { heading: 'John Testifies About Jesus' }
  ),

  // ==========================================================================
  // GENESIS 1 (The Creation — Bidirectional with John 1:1)
  // ==========================================================================
  v(
    'Genesis',
    1,
    1,
    {
      NIV: 'In the beginning God created the heavens and the earth.',
      KJV: 'In the beginning God created the heaven and the earth.',
      ESV: 'In the beginning, God created the heavens and the earth.',
      NKJV: 'In the beginning God created the heavens and the earth.',
      NLT: 'In the beginning God created the heavens and the earth.',
      ASV: 'In the beginning God created the heavens and the earth.',
    },
    { heading: 'The Beginning of Creation' }
  ),
  v(
    'Genesis',
    1,
    2,
    {
      NIV: 'Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.',
      KJV: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.',
      ESV: 'The earth was without form and void, and darkness was over the face of the deep. And the Spirit of God was hovering over the face of the waters.',
      NKJV: 'The earth was without form, and void; and darkness was on the face of the deep. And the Spirit of God was hovering over the face of the waters.',
      NLT: 'The earth was formless and empty, and darkness covered the deep waters. And the Spirit of God was hovering over the surface of the waters.',
      ASV: 'And the earth was waste and void; and darkness was upon the face of the deep: and the Spirit of God moved upon the face of the waters.',
    }
  ),
  v(
    'Genesis',
    1,
    3,
    {
      NIV: 'And God said, “Let there be light,” and there was light.',
      KJV: 'And God said, Let there be light: and there was light.',
      ESV: 'And God said, “Let there be light,” and there was light.',
      NKJV: 'Then God said, “Let there be light”; and there was light.',
      NLT: 'Then God said, “Let there be light,” and there was light.',
      ASV: 'And God said, Let there be light: and there was light.',
    }
  ),
  vQuick(
    'Genesis',
    1,
    4,
    'God saw that the light was good, and he separated the light from the darkness.',
    'And God saw the light, that it was good: and God divided the light from the darkness.'
  ),
  vQuick(
    'Genesis',
    1,
    5,
    'God called the light “day,” and the darkness he called “night.” And there was evening, and there was morning—the first day.',
    'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.'
  ),
  vQuick(
    'Genesis',
    1,
    26,
    'Then God said, “Let us make mankind in our image, in our likeness, so that they may rule over the fish in the sea and the birds in the sky, over the livestock and all the wild animals, and over all the creatures that move along the ground.”',
    'And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.'
  ),
  vQuick(
    'Genesis',
    1,
    27,
    'So God created mankind in his own image, in the image of God he created them; male and female he created them.',
    'So God created man in his own image, in the image of God created he him; male and female created he them.'
  ),

  // ==========================================================================
  // KEY CONNECTED PASSAGES ACROSS OT & NT FOR BIDIRECTIONAL EXPLORATION
  // ==========================================================================
  // Isaiah 53:4-6 & 1 Peter 2:24
  vQuick(
    'Isaiah',
    53,
    4,
    'Surely he took up our pain and bore our suffering, yet we considered him punished by God, stricken by him, and afflicted.',
    'Surely he hath borne our griefs, and carried our sorrows: yet we did esteem him stricken, smitten of God, and afflicted.',
    'Surely he has borne our griefs and carried our sorrows; yet we esteemed him stricken, smitten by God, and afflicted.',
    'Surely He has borne our griefs And carried our sorrows; Yet we esteemed Him stricken, Smitten by God, and afflicted.',
    undefined,
    undefined,
    { heading: 'The Suffering and Glory of the Servant', isPoetry: true }
  ),
  v(
    'Isaiah',
    53,
    5,
    {
      NIV: 'But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.',
      KJV: 'But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.',
      ESV: 'But he was pierced for our transgressions; he was crushed for our iniquities; upon him was the chastisement that brought us peace, and with his wounds we are healed.',
      NKJV: 'But He was wounded for our transgressions, He was bruised for our iniquities; The chastisement for our peace was upon Him, And by His stripes we are healed.',
      NLT: 'But he was pierced for our rebellion, crushed for our sins. He was beaten so we could be whole. He was whipped so we could be healed.',
      ASV: 'But he was wounded for our transgressions, he was bruised for our iniquities; the chastisement of our peace was upon him; and with his stripes we are healed.',
    },
    { isPoetry: true }
  ),
  vQuick(
    'Isaiah',
    53,
    6,
    'We all, like sheep, have gone astray, each of us has turned to our own way; and the LORD has laid on him the iniquity of us all.',
    'All we like sheep have gone astray; we have turned every one to his own way; and the LORD hath laid on him the iniquity of us all.',
    undefined,
    undefined,
    undefined,
    undefined,
    { isPoetry: true }
  ),
  v(
    '1 Peter',
    2,
    24,
    {
      NIV: '“He himself bore our sins” in his body on the cross, so that we might die to sins and live for righteousness; “by his wounds you have been healed.”',
      KJV: 'Who his own self bare our sins in his own body on the tree, that we, being dead to sins, should live unto righteousness: by whose stripes ye were healed.',
      ESV: 'He himself bore our sins in his body on the tree, that we might die to sin and live to righteousness. By his wounds you have been healed.',
      NKJV: 'who Himself bore our sins in His own body on the tree, that we, having died to sins, might live for righteousness—by whose stripes you were healed.',
      NLT: 'He personally carried our sins in his body on the cross so that we can be dead to sin and live for what is right. By his wounds you are healed.',
      ASV: 'who his own self bare our sins in his body upon the tree, that we, having died unto sins, might live unto righteousness; by whose stripes ye were healed.',
    }
  ),

  // Deuteronomy 19:15 & Leviticus 19:17 (Connected to Matthew 18:15-16)
  v(
    'Deuteronomy',
    19,
    15,
    {
      NIV: 'One witness is not enough to convict anyone accused of any crime or offense they may have committed. A matter must be established by the testimony of two or three witnesses.',
      KJV: 'One witness shall not rise up against a man for any iniquity, or for any sin, in any sin that he sinneth: at the mouth of two witnesses, or at the mouth of three witnesses, shall the matter be established.',
      ESV: '“A single witness shall not suffice against a person for any crime or for any wrong in connection with any offense that he has committed. Only on the evidence of two witnesses or of three witnesses shall a charge be established.',
      NKJV: '“One witness shall not rise against a man concerning any iniquity or any sin that he commits; by the mouth of two or three witnesses the matter shall be established.',
      NLT: '“You must not convict anyone of a crime on the testimony of only one witness. The facts of the case must be established by the testimony of two or three witnesses.',
      ASV: 'One witness shall not rise up against a man for any iniquity, or for any sin, in any sin that he sinneth: at the mouth of two witnesses, or at the mouth of three witnesses, shall a matter be established.',
    },
    { heading: 'Witnesses in Israel' }
  ),
  v(
    'Leviticus',
    19,
    17,
    {
      NIV: '“‘Do not hate a fellow Israelite in your heart. Rebuke your neighbor frankly so you will not share in their guilt.',
      KJV: 'Thou shalt not hate thy brother in thine heart: thou shalt in any wise rebuke thy neighbour, and not suffer sin upon him.',
      ESV: '“You shall not hate your brother in your heart, but you shall reason frankly with your neighbor, lest you incur sin because of him.',
      NKJV: '‘You shall not hate your brother in your heart. You shall surely rebuke your neighbor, and not bear sin because of him.',
      NLT: '“Do not nurse hatred in your heart for any of your relatives. Confront people directly so you will not be held guilty for their sin.',
      ASV: 'Thou shalt not hate thy brother in thy heart: thou shalt surely rebuke thy neighbor, and not bear sin because of him.',
    }
  ),

  // Connections to Deuteronomy 32:4 & 32:6
  v(
    'Isaiah',
    63,
    16,
    {
      NIV: 'But you are our Father, though Abraham does not know us or Israel acknowledge us; you, LORD, are our Father, our Redeemer from of old is your name.',
      KJV: 'Doubtless thou art our father, though Abraham be ignorant of us, and Israel acknowledge us not: thou, O LORD, art our father, our redeemer; thy name is from everlasting.',
      ESV: 'For you are our Father, though Abraham does not know us, and Israel does not acknowledge us; you, O LORD, are our Father, our Redeemer from of old is your name.',
      NKJV: 'Doubtless You are our Father, Though Abraham was ignorant of us, And Israel does not acknowledge us. You, O LORD, are our Father; Our Redeemer from Everlasting is Your name.',
      NLT: 'Surely you are still our Father! Even if Abraham and Jacob would disown us, LORD, you would still be our Father. You are our Redeemer from ages past.',
      ASV: 'For thou art our Father, though Abraham knoweth us not, and Israel doth not acknowledge us: thou, O Jehovah, art our Father; our Redeemer from everlasting is thy name.',
    }
  ),
  v(
    '1 Corinthians',
    8,
    6,
    {
      NIV: 'yet for us there is but one God, the Father, from whom all things came and for whom we live; and there is but one Lord, Jesus Christ, through whom all things came and through whom we live.',
      KJV: 'But to us there is but one God, the Father, of whom are all things, and we in him; and one Lord Jesus Christ, by whom are all things, and we by him.',
      ESV: 'yet for us there is one God, the Father, from whom are all things and for whom we exist, and one Lord, Jesus Christ, through whom are all things and through whom we exist.',
      NKJV: 'yet for us there is one God, the Father, of whom are all things, and we for Him; and one Lord Jesus Christ, through whom are all things, and through whom we live.',
      NLT: 'But for us, There is one God, the Father, by whom all things were created, and for whom we live. And there is one Lord, Jesus Christ, through whom all things were created, and through whom we live.',
      ASV: 'yet to us there is one God, the Father, of whom are all things, and we unto him; and one Lord, Jesus Christ, through whom are all things, and we through him.',
    }
  ),
  v(
    '1 Corinthians',
    10,
    4,
    {
      NIV: 'and drank the same spiritual drink; for they drank from the spiritual rock that accompanied them, and that rock was Christ.',
      KJV: 'And did all drink the same spiritual drink: for they drank of that spiritual Rock that followed them: and that Rock was Christ.',
      ESV: 'and all drank the same spiritual drink. For they drank from the spiritual Rock that followed them, and the Rock was Christ.',
      NKJV: 'and all drank the same spiritual drink. For they drank of that spiritual Rock that followed them, and that Rock was Christ.',
      NLT: 'and all of them drank the same spiritual water. For they drank from the spiritual rock that traveled with them, and that rock was Christ.',
      ASV: 'and did all drink the same spiritual drink: for they drank of a spiritual rock that followed them: and the rock was Christ.',
    }
  ),

  // Psalms 22:1 & Matthew 27:46
  v(
    'Psalms',
    22,
    1,
    {
      NIV: 'My God, my God, why have you forsaken me? Why are you so far from saving me, so far from my cries of anguish?',
      KJV: 'My God, my God, why hast thou forsaken me? why art thou so far from helping me, and from the words of my roaring?',
      ESV: 'My God, my God, why have you forsaken me? Why are you so far from saving me, from the words of my groaning?',
      NKJV: 'My God, My God, why have You forsaken Me? Why are You so far from helping Me, And from the words of My groaning?',
      NLT: 'My God, my God, why have you abandoned me? Why are you so far away when I groan for help?',
      ASV: 'My God, my God, why hast thou forsaken me? Why art thou so far from helping me, and from the words of my groaning?',
    },
    { heading: 'Psalm 22 — A Cry of Anguish and Song of Praise', isPoetry: true }
  ),
  v(
    'Matthew',
    27,
    46,
    {
      NIV: 'About three in the afternoon Jesus cried out in a loud voice, “Eli, Eli, lema sabachthani?” (which means “My God, my God, why have you forsaken me?”).',
      KJV: 'And about the ninth hour Jesus cried with a loud voice, saying, Eli, Eli, lama sabachthani? that is to say, My God, my God, why hast thou forsaken me?',
      ESV: 'And about the ninth hour Jesus cried out with a loud voice, saying, “Eli, Eli, lema sabachthani?” that is, “My God, my God, why have you forsaken me?”',
      NKJV: 'And about the ninth hour Jesus cried out with a loud voice, saying, “Eli, Eli, lama sabachthani?” that is, “My God, My God, why have You forsaken Me?”',
      NLT: 'At about three o’clock, Jesus called out with a loud voice, “Eli, Eli, lema sabachthani?” which means “My God, my God, why have you abandoned me?”',
      ASV: 'And about the ninth hour Jesus cried with a loud voice, saying, Eli, Eli, lama sabachthani? that is, My God, my God, why hast thou forsaken me?',
    },
    { isRedLetter: true }
  ),

  // Micah 5:2 & Matthew 2:6
  v(
    'Micah',
    5,
    2,
    {
      NIV: '“But you, Bethlehem Ephrathah, though you are small among the clans of Judah, out of you will come for me one who will be ruler over Israel, whose origins are from of old, from ancient times.”',
      KJV: 'But thou, Beth-lehem Ephratah, though thou be little among the thousands of Judah, yet out of thee shall he come forth unto me that is to be ruler in Israel; whose goings forth have been from of old, from everlasting.',
      ESV: 'But you, O Bethlehem Ephrathah, who are too little to be among the clans of Judah, from you shall come forth for me one who is to be ruler in Israel, whose coming forth is from of old, from ancient days.',
      NKJV: '“But you, Bethlehem Ephrathah, Though you are little among the thousands of Judah, Yet out of you shall come forth to Me The One to be Ruler in Israel, Whose goings forth are from of old, From everlasting.”',
      NLT: 'But you, O Bethlehem Ephrathah, are only a small village among all the people of Judah. Yet a ruler of Israel, whose origins are in the distant past, will come from you on my behalf.',
      ASV: 'But thou, Beth-lehem Ephrathah, which art little to be among the thousands of Judah, out of thee shall one come forth unto me that is to be ruler in Israel; whose goings forth are from of old, from ancient days.',
    },
    { heading: 'A Promised Ruler from Bethlehem', isPoetry: true }
  ),
  v(
    'Matthew',
    2,
    6,
    {
      NIV: '“‘But you, Bethlehem, in the land of Judah, are by no means least among the rulers of Judah; for out of you will come a ruler who will shepherd my people Israel.’”',
      KJV: 'And thou Bethlehem, in the land of Juda, art not the least among the princes of Juda: for out of thee shall come a Governor, that shall rule my people Israel.',
      ESV: '“‘And you, O Bethlehem, in the land of Judah, are by no means least among the rulers of Judah; for from you shall come a ruler who will shepherd my people Israel.’”',
      NKJV: '‘But you, Bethlehem, in the land of Judah, Are not the least among the rulers of Judah; For out of you shall come a Ruler Who will shepherd My people Israel.’',
      NLT: '‘And you, O Bethlehem in the land of Judah, are not least among the ruling cities of Judah, for a ruler will come from you who will be the shepherd for my people Israel.’',
      ASV: 'And thou Bethlehem, land of Judah, Art in no wise least among the princes of Judah: For out of thee shall come forth a governor, Who shall be shepherd of my people Israel.',
    }
  ),

  // Genesis 12:3 & Matthew 1:1 / Galatians 3:8
  v(
    'Genesis',
    12,
    3,
    {
      NIV: 'I will bless those who bless you, and whoever curses you I will curse; and all peoples on earth will be blessed through you.”',
      KJV: 'And I will bless them that bless thee, and curse him that curseth thee: and in thee shall all families of the earth be blessed.',
      ESV: 'I will bless those who bless you, and him who dishonors you I will curse, and in you all the families of the earth shall be blessed.”',
      NKJV: 'I will bless those who bless you, And I will curse him who curses you; And in you all the families of the earth shall be blessed.”',
      NLT: 'I will bless those who bless you and curse those who treat you with contempt. All the families on earth will be blessed through you.”',
      ASV: 'And I will bless them that bless thee, and him that curseth thee will I curse: and in thee shall all the families of the earth be blessed.',
    },
    { heading: 'The Call of Abram' }
  ),
  v(
    '2 Samuel',
    7,
    12,
    {
      NIV: 'When your days are over and you rest with your ancestors, I will raise up your offspring to succeed you, your own flesh and blood, and I will establish his kingdom.',
      KJV: 'And when thy days be fulfilled, and thou shalt sleep with thy fathers, I will set up thy seed after thee, which shall proceed out of thy bowels, and I will establish his kingdom.',
      ESV: 'When your days are fulfilled and you lie down with your fathers, I will raise up your offspring after you, who shall come from your body, and I will establish his kingdom.',
      NKJV: '“When your days are fulfilled and you rest with your fathers, I will set up your seed after you, who will come from your body, and I will establish his kingdom.',
      NLT: 'For when you die and are buried with your ancestors, I will raise up one of your descendants, your own offspring, and I will make his kingdom strong.',
      ASV: 'When thy days are fulfilled, and thou shalt sleep with thy fathers, I will set up thy seed after thee, that shall proceed out of thy bowels, and I will establish his kingdom.',
    },
    { heading: 'God’s Covenant with David' }
  ),
  v(
    'Colossians',
    1,
    16,
    {
      NIV: 'For in him all things were created: things in heaven and on earth, visible and invisible, whether thrones or powers or rulers or authorities; all things have been created through him and for him.',
      KJV: 'For by him were all things created, that are in heaven, and that are in earth, visible and invisible, whether they be thrones, or dominions, or principalities, or powers: all things were created by him, and for him:',
      ESV: 'For by him all things were created, in heaven and on earth, visible and invisible, whether thrones or dominions or rulers or authorities—all things were created through him and for him.',
      NKJV: 'For by Him all things were created that are in heaven and that are on earth, visible and invisible, whether thrones or dominions or principalities or powers. All things were created through Him and for Him.',
      NLT: 'For through him God created everything in the heavenly realms and on earth. He made the things we can see and the things we can’t see—such as thrones, kingdoms, rulers, and authorities in the unseen world. Everything was created through him and for him.',
      ASV: 'For in him were all things created, in the heavens and upon the earth, things visible and things invisible, whether thrones or dominions or principalities or powers; all things have been created through him, and unto him;',
    },
    { heading: 'The Supremacy of the Son of God' }
  ),
  v(
    'Hebrews',
    1,
    2,
    {
      NIV: 'but in these last days he has spoken to us by his Son, whom he appointed heir of all things, and through whom also he made the universe.',
      KJV: 'Hath in these last days spoken unto us by his Son, whom he hath appointed heir of all things, by whom also he made the worlds;',
      ESV: 'but in these last days he has spoken to us by his Son, whom he appointed the heir of all things, through whom also he created the world.',
      NKJV: 'has in these last days spoken to us by His Son, whom He has appointed heir of all things, through whom also He made the worlds;',
      NLT: 'And now in these final days, he has spoken to us through his Son. God promised everything to the Son as an inheritance, and through the Son he created the universe.',
      ASV: 'hath at the end of these days spoken unto us in his Son, whom he appointed heir of all things, through whom also he made the worlds;',
    },
    { heading: 'God’s Final Word: His Son' }
  ),
  v(
    'Genesis',
    3,
    15,
    {
      NIV: 'And I will put enmity between you and the woman, and between your offspring and hers; he will crush your head, and you will strike his heel.”',
      KJV: 'And I will put enmity between thee and the woman, and between thy seed and her seed; it shall bruise thy head, and thou shalt bruise his heel.',
      ESV: 'I will put enmity between you and the woman, and between your offspring and her offspring; he shall bruise your head, and you shall bruise his heel.”',
      NKJV: 'And I will put enmity Between you and the woman, And between your seed and her Seed; He shall bruise your head, And you shall bruise His heel.”',
      NLT: 'And I will cause hostility between you and the woman, and between your offspring and her offspring. He will strike your head, and you will strike his heel.”',
      ASV: 'And I will put enmity between thee and the woman, and between thy seed and her seed: he shall bruise thy head, and thou shalt bruise his heel.',
    },
    { heading: 'The Protoevangelium (First Gospel Promise)' }
  ),
  v(
    'Romans',
    16,
    20,
    {
      NIV: 'The God of peace will soon crush Satan under your feet. The grace of our Lord Jesus be with you.',
      KJV: 'And the God of peace shall bruise Satan under your feet shortly. The grace of our Lord Jesus Christ be with you. Amen.',
      ESV: 'The God of peace will soon crush Satan under your feet. The grace of our Lord Jesus Christ be with you.',
      NKJV: 'And the God of peace will crush Satan under your feet shortly. The grace of our Lord Jesus Christ be with you. Amen.',
      NLT: 'The God of peace will soon crush Satan under your feet. May the grace of our Lord Jesus be with you.',
      ASV: 'And the God of peace shall bruise Satan under your feet shortly. The grace of our Lord Jesus Christ be with you.',
    }
  ),
  v(
    'Deuteronomy',
    8,
    3,
    {
      NIV: 'He humbled you, causing you to hunger and then feeding you with manna, which neither you nor your ancestors had known, to teach you that man does not live on bread alone but on every word that comes from the mouth of the LORD.',
      KJV: 'And he humbled thee, and suffered thee to hunger, and fed thee with manna, which thou knewest not, neither did thy fathers know; that he might make thee know that man doth not live by bread only, but by every word that proceedeth out of the mouth of the LORD doth man live.',
      ESV: 'And he humbled you and let you hunger and fed you with manna, which you did not know, nor did your fathers know, that he might make you know that man does not live by bread alone, but man lives by every word that comes from the mouth of the LORD.',
      NKJV: 'So He humbled you, allowed you to hunger, and fed you with manna which you did not know nor did your fathers know, that He might make you know that man shall not live by bread alone; but man lives by every word that proceeds from the mouth of the LORD.',
      NLT: 'Yes, he humbled you by letting you go hungry and then feeding you with manna, a food previously unknown to you and your ancestors. He did it to teach you that people do not live by bread alone; rather, we live by every word that comes from the mouth of the LORD.',
      ASV: 'And he humbled thee, and suffered thee to hunger, and fed thee with manna, which thou knewest not, neither did thy fathers know; that he might make thee know that man doth not live by bread only, but by everything that proceedeth out of the mouth of Jehovah doth man live.',
    }
  ),
  v(
    'Matthew',
    4,
    4,
    {
      NIV: 'Jesus answered, “It is written: ‘Man shall not live on bread alone, but on every word that comes from the mouth of God.’”',
      KJV: 'But he answered and said, It is written, Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God.',
      ESV: 'But he answered, “It is written, “‘Man shall not live by bread alone, but by every word that comes from the mouth of God.’”',
      NKJV: 'But He answered and said, “It is written, ‘Man shall not live by bread alone, but by every word that proceeds from the mouth of God.’”',
      NLT: 'People do not live by bread alone, but by every word that comes from the mouth of God.”',
      ASV: 'But he answered and said, It is written, Man shall not live by bread alone, but by every word that proceedeth out of the mouth of God.',
    },
    { heading: 'Jesus Is Tested in the Wilderness', isRedLetter: true }
  ),
  v(
    'Numbers',
    21,
    9,
    {
      NIV: 'So Moses made a bronze snake and put it up on a pole. Then when anyone was bitten by a snake and looked at the bronze snake, they lived.',
      KJV: 'And Moses made a serpent of brass, and put it upon a pole, and it came to pass, that if a serpent had bitten any man, when he beheld the serpent of brass, he lived.',
      ESV: 'So Moses made a bronze serpent and set it on a pole. And if a serpent bit anyone, he would look at the bronze serpent and live.',
      NKJV: 'So Moses made a bronze serpent, and put it on a pole; and so it was, if a serpent had bitten anyone, when he looked at the bronze serpent, he lived.',
      NLT: 'So Moses made a snake out of bronze and attached it to a pole. Then anyone who was bitten by a snake could look at the bronze snake and be healed!',
      ASV: 'And Moses made a serpent of brass, and set it upon the standard: and it came to pass, that if a serpent had bitten any man, when he looked unto the serpent of brass, he lived.',
    },
    { heading: 'The Bronze Snake' }
  ),
  v(
    'John',
    3,
    14,
    {
      NIV: 'Just as Moses lifted up the snake in the wilderness, so the Son of Man must be lifted up,',
      KJV: 'And as Moses lifted up the serpent in the wilderness, even so must the Son of man be lifted up:',
      ESV: 'And as Moses lifted up the serpent in the wilderness, so must the Son of Man be lifted up,',
      NKJV: 'And as Moses lifted up the serpent in the wilderness, even so must the Son of Man be lifted up,',
      NLT: 'And as Moses lifted up the bronze snake on a pole in the wilderness, so the Son of Man must be lifted up,',
      ASV: 'And as Moses lifted up the serpent in the wilderness, even so must the Son of man be lifted up;',
    },
    { isRedLetter: true }
  ),
  v(
    'John',
    3,
    16,
    {
      NIV: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
      KJV: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
      ESV: '“For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
      NKJV: 'For God so loved the world that He gave His only begotten Son, that whoever believes in Him should not perish but have everlasting life.',
      NLT: '“For this is how God loved the world: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.',
      ASV: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth on him should not perish, but have eternal life.',
    },
    { isRedLetter: true }
  ),
  v(
    'Jeremiah',
    31,
    31,
    {
      NIV: '“The days are coming,” declares the LORD, “when I will make a new covenant with the people of Israel and with the people of Judah.',
      KJV: 'Behold, the days come, saith the LORD, that I will make a new covenant with the house of Israel, and with the house of Judah:',
      ESV: '“Behold, the days are coming, declares the LORD, when I will make a new covenant with the house of Israel and the house of Judah,',
      NKJV: '“Behold, the days are coming, says the LORD, when I will make a new covenant with the house of Israel and with the house of Judah—',
      NLT: '“The day is coming,” says the LORD, “when I will make a new covenant with the people of Israel and Judah.',
      ASV: 'Behold, the days come, saith Jehovah, that I will make a new covenant with the house of Israel, and with the house of Judah:',
    },
    { heading: 'The New Covenant' }
  ),
  v(
    'Hebrews',
    8,
    8,
    {
      NIV: 'But God found fault with the people and said: “The days are coming, declares the Lord, when I will make a new covenant with the people of Israel and with the people of Judah.',
      KJV: 'For finding fault with them, he saith, Behold, the days come, saith the Lord, when I will make a new covenant with the house of Israel and with the house of Judah:',
      ESV: 'For he finds fault with them when he says: “Behold, the days are coming, declares the Lord, when I will establish a new covenant with the house of Israel and with the house of Judah,',
      NKJV: 'Because finding fault with them, He says: “Behold, the days are coming, says the LORD, when I will make a new covenant with the house of Israel and with the house of Judah—',
      NLT: 'But God found fault with the people and said: “The day is coming, says the LORD, when I will make a new covenant with the people of Israel and Judah.',
      ASV: 'For finding fault with them, he saith, Behold, the days come, saith the Lord, That I will make a new covenant with the house of Israel and with the house of Judah;',
    }
  ),
  v(
    'Psalms',
    110,
    1,
    {
      NIV: 'The LORD says to my lord: “Sit at my right hand until I make your enemies a footstool for your feet.”',
      KJV: 'The LORD said unto my Lord, Sit thou at my right hand, until I make thine enemies thy footstool.',
      ESV: 'The LORD says to my Lord: “Sit at my right hand, until I make your enemies your footstool.”',
      NKJV: 'The LORD said to my Lord, “Sit at My right hand, Till I make Your enemies Your footstool.”',
      NLT: 'The LORD said to my Lord, “Sit in the place of honor at my right hand until I humble your enemies, making them a footstool under your feet.”',
      ASV: 'Jehovah saith unto my Lord, Sit thou at my right hand, Until I make thine enemies thy footstool.',
    },
    { heading: 'Psalm 110 — The Lord Gives Dominion to the King', isPoetry: true }
  ),
  v(
    'Hebrews',
    1,
    13,
    {
      NIV: 'To which of the angels did God ever say, “Sit at my right hand until I make your enemies a footstool for your feet”?',
      KJV: 'But to which of the angels said he at any time, Sit on my right hand, until I make thine enemies thy footstool?',
      ESV: 'And to which of the angels has he ever said, “Sit at my right hand until I make your enemies a footstool for your feet”?',
      NKJV: 'But to which of the angels has He ever said: “Sit at My right hand, Till I make Your enemies Your footstool”?',
      NLT: 'And God never said to any of the angels, “Sit in the place of honor at my right hand until I humble your enemies, making them a footstool under your feet.”',
      ASV: 'But of which of the angels hath he said at any time, Sit thou on my right hand, Till I make thine enemies the footstool of thy feet?',
    }
  ),
  v(
    'Habakkuk',
    2,
    4,
    {
      NIV: '“See, the enemy is puffed up; his desires are not upright—but the righteous person will live by his faithfulness—',
      KJV: 'Behold, his soul which is lifted up is not upright in him: but the just shall live by his faith.',
      ESV: '“Behold, his soul is puffed up; it is not upright within him, but the righteous shall live by his faith.',
      NKJV: '“Behold the proud, His soul is not upright in him; But the just shall live by his faith.',
      NLT: '“Look at the proud! They trust in themselves, and their lives are crooked. But the righteous will live by their faithfulness to God.',
      ASV: 'Behold, his soul is puffed up, it is not upright in him; but the righteous shall live by his faith.',
    }
  ),
  v(
    'Romans',
    1,
    17,
    {
      NIV: 'For in the gospel the righteousness of God is revealed—a righteousness that is by faith from first to last, just as it is written: “The righteous will live by faith.”',
      KJV: 'For therein is the righteousness of God revealed from faith to faith: as it is written, The just shall live by faith.',
      ESV: 'For in it the righteousness of God is revealed from faith for faith, as it is written, “The righteous shall live by faith.”',
      NKJV: 'For in it the righteousness of God is revealed from faith to faith; as it is written, “The just shall live by faith.”',
      NLT: 'This Good News tells us how God makes us right in his sight. This is accomplished from start to finish by faith. As the Scriptures say, “It is through faith that a righteous person has life.”',
      ASV: 'For therein is revealed a righteousness of God from faith unto faith: as it is written, But the righteous shall live by faith.',
    }
  ),
];

// Fast index by canonical reference and by book+chapter
const verseByRefMap = new Map<string, VerseData>();
const versesByChapterMap = new Map<string, VerseData[]>();

for (const verse of CORE_SCRIPTURE_VERSES) {
  verseByRefMap.set(verse.canonicalRef.toLowerCase(), verse);
  const chapKey = `${verse.book.toLowerCase()}:${verse.chapter}`;
  const list = versesByChapterMap.get(chapKey) || [];
  list.push(verse);
  versesByChapterMap.set(chapKey, list);
}

export function getVerseByReference(ref: string): VerseData | undefined {
  return verseByRefMap.get(ref.trim().toLowerCase());
}

export function getVerseText(ref: string, translation: TranslationId): string {
  const found = getVerseByReference(ref);
  if (found) {
    return found.translations[translation] || found.translations.NIV;
  }
  return '';
}

export function getChapterVersesSync(book: string, chapter: number): VerseData[] {
  const key = `${book.trim().toLowerCase()}:${chapter}`;
  const existing = versesByChapterMap.get(key);
  if (existing && existing.length > 0) {
    return [...existing].sort((a, b) => a.verse - b.verse);
  }
  return [];
}

export function registerFetchedChapterVerses(verses: VerseData[]) {
  for (const verse of verses) {
    if (!verseByRefMap.has(verse.canonicalRef.toLowerCase())) {
      verseByRefMap.set(verse.canonicalRef.toLowerCase(), verse);
    }
    const chapKey = `${verse.book.toLowerCase()}:${verse.chapter}`;
    const list = versesByChapterMap.get(chapKey) || [];
    if (!list.some((v) => v.verse === verse.verse)) {
      list.push(verse);
    }
    versesByChapterMap.set(chapKey, list);
  }
}

export function searchLocalScriptures(query: string, translation: TranslationId): VerseData[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return CORE_SCRIPTURE_VERSES.filter((v) => {
    const refMatch = v.canonicalRef.toLowerCase().includes(q);
    const textMatch = v.translations[translation].toLowerCase().includes(q) || v.translations.NIV.toLowerCase().includes(q);
    const headingMatch = v.heading?.toLowerCase().includes(q);
    return refMatch || textMatch || headingMatch;
  });
}
