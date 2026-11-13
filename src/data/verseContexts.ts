import { BIBLE_BOOKS, BOOK_INTRODUCTIONS, findBookByName, parseScriptureReference } from './bibleBooks';
import { getVerseText } from './scriptureDatabase';

export interface VerseContextExplanation {
  canonicalRef: string;
  whatVerseIsTalkingAbout: string;
  surroundingPassage: string;
  speakerAndAudience: string;
  whatPromptedIt: string;
  immediateContextMeaning: string;
  connectionWithSurroundingVerses: string;
}

const CURATED_VERSE_CONTEXTS: Record<string, VerseContextExplanation> = {
  'John 14:9': {
    canonicalRef: 'John 14:9',
    whatVerseIsTalkingAbout:
      'Jesus declaring His essential unity with God the Father, assuring Philip that whoever has seen and known Jesus has truly seen and known the Father.',
    surroundingPassage:
      'In John 14, Jesus is in the Upper Room during the Last Supper with His disciples, preparing them for His impending arrest, crucifixion, and departure. He comforts them with the promise of the Father\'s house and reveals that He is the way, the truth, and the life.',
    speakerAndAudience:
      'Jesus Christ is speaking directly to Philip, one of the Twelve Apostles, in the presence of the other disciples.',
    whatPromptedIt:
      'In verse 8, Philip requested: "Lord, show us the Father and that will be enough for us." Philip was longing for a visible, dramatic manifestation (theophany) of God, not realizing that God was already standing directly before him in bodily form.',
    immediateContextMeaning:
      'Jesus gently corrects Philip\'s misconception after their long companionship. Because Jesus is the exact representation and incarnation of the Father (John 1:18; Colossians 1:15), to behold Jesus—His character, compassion, words, and works—is to behold the Father Himself.',
    connectionWithSurroundingVerses:
      'Verse 9 directly answers Philip\'s request in verse 8 and leads into verses 10–11, where Jesus challenges the disciples to believe in His mutual indwelling with the Father ("I am in the Father, and the Father is in me") based on the words He speaks and the miraculous works He performs.',
  },
  'John 1:1': {
    canonicalRef: 'John 1:1',
    whatVerseIsTalkingAbout:
      'The eternal pre-existence, distinct personhood, and absolute deity of Jesus Christ as the divine Word (Logos).',
    surroundingPassage:
      'The Prologue of the Gospel of John (John 1:1–18), which establishes the cosmic, divine, and historical framework for the entire Gospel.',
    speakerAndAudience:
      'The Apostle John writing to the early Christian church and all seekers of truth.',
    whatPromptedIt:
      'The author opens his Gospel not with an earthly genealogy or birth narrative, but by anchoring Jesus in eternity before creation to declare His supreme divine authority.',
    immediateContextMeaning:
      'Echoing Genesis 1:1 ("In the beginning"), the verse reveals three truths about Jesus: He already existed before time began, He existed in personal relationship with God the Father, and He was fully God in essence and nature.',
    connectionWithSurroundingVerses:
      'Verse 1 establishes the divine identity of the Word, which verses 2–5 expand by attributing creation and life to Him, leading to verse 14 where "the Word became flesh and made his dwelling among us."',
  },
  'John 1:29': {
    canonicalRef: 'John 1:29',
    whatVerseIsTalkingAbout:
      'John the Baptist publicly identifying and proclaiming Jesus as the sacrificial Lamb of God who removes the guilt and power of sin for the world.',
    surroundingPassage:
      'John 1:19–34 records John the Baptist\'s formal testimony along the Jordan River, first to Jerusalem\'s religious leaders and then directly regarding Jesus.',
    speakerAndAudience:
      'John the Baptist speaking to his disciples and the crowd witnessing Jesus approach.',
    whatPromptedIt:
      'John the Baptist saw Jesus walking toward him the day after declaring to Jewish authorities that he was merely a voice preparing the way for one far greater.',
    immediateContextMeaning:
      'John invokes ancient Israel\'s sacrificial imagery—particularly the Passover Lamb (Exodus 12) and Isaiah\'s Suffering Servant led like a lamb to slaughter (Isaiah 53:7)—applying it comprehensively to Jesus as the ultimate, universal remedy for human sin.',
    connectionWithSurroundingVerses:
      'This declaration builds on John\'s testimony in verses 19–28, continues in verses 30–34 where John affirms Jesus as the Son of God attested by the Holy Spirit, and prompts two of his disciples to start following Jesus in verses 35–37.',
  },
  'John 3:5': {
    canonicalRef: 'John 3:5',
    whatVerseIsTalkingAbout:
      'The absolute necessity of spiritual rebirth produced by the Holy Spirit to enter into the Kingdom of God.',
    surroundingPassage:
      'John 3:1–21 records Jesus\' nighttime conversation in Jerusalem with Nicodemus, a respected teacher and member of the Jewish ruling council (Sanhedrin).',
    speakerAndAudience:
      'Jesus speaking directly to Nicodemus.',
    whatPromptedIt:
      'Nicodemus\' puzzled response in verse 4, asking literally how an adult can return into their mother\'s womb to be born a second time.',
    immediateContextMeaning:
      'Jesus clarifies that entering God\'s kingdom is not achieved by physical descent or moral achievement, but requires an internal spiritual cleansing and regeneration, alluding to Ezekiel 36:25–27 where God promises clean water and a new Spirit.',
    connectionWithSurroundingVerses:
      'Verse 5 clarifies Jesus\' opening assertion in verse 3 ("no one can see the kingdom of God unless they are born again") and leads into verses 6–8, where Jesus contrasts natural birth with the wind-like sovereign work of the Spirit.',
  },
  'John 3:16': {
    canonicalRef: 'John 3:16',
    whatVerseIsTalkingAbout:
      'The supreme expression of God\'s love in giving His only Son so that anyone who trusts in Him is rescued from spiritual death and receives eternal life.',
    surroundingPassage:
      'John 3:11–21, concluding Jesus\' discourse with Nicodemus and expounding the redemptive purpose of the Son of Man being lifted up.',
    speakerAndAudience:
      'Jesus teaching Nicodemus (with the Evangelist unfolding the heart of the Gospel for the whole world).',
    whatPromptedIt:
      'Jesus\' reference in verses 14–15 to Moses lifting up the bronze snake in the desert so that dying Israelites could look and live (Numbers 21).',
    immediateContextMeaning:
      'The passage summarizes the Christian message: God\'s motive is unearned love; the scope is the entire world; the sacrifice is His own Son; the condition is personal faith; and the outcome is deliverance from ruin and the gift of eternal life.',
    connectionWithSurroundingVerses:
      'Connects the cross foreshadowed in verses 14–15 with the comforting assurance of verse 17 that God sent His Son not to condemn the world, but to save it through Him.',
  },
  'Matthew 1:23': {
    canonicalRef: 'Matthew 1:23',
    whatVerseIsTalkingAbout:
      'The miraculous virgin birth of Jesus as the fulfilment of prophetic Scripture, establishing that God has come to live personally among His people.',
    surroundingPassage:
      'Matthew 1:18–25, the account of the circumstances surrounding the birth of Jesus Christ and Joseph\'s dilemma.',
    speakerAndAudience:
      'Matthew the Evangelist providing inspired editorial explanation to his readers.',
    whatPromptedIt:
      'Joseph\'s intention to divorce Mary quietly after discovering her pregnancy, until an angel of the Lord appeared to him in a dream to explain that the child was conceived by the Holy Spirit.',
    immediateContextMeaning:
      'Matthew quotes the prophetic sign of Isaiah 7:14, showing that Jesus\' virgin birth was not an unexpected anomaly, but the fulfilment of the ancient promise that God would dwell with the House of David as "Immanuel" (God with us).',
    connectionWithSurroundingVerses:
      'Follows the angel\'s command in verse 21 to name the baby Jesus because He will save His people from their sins, and leads into verses 24–25 where Joseph faithfully obeys the angel\'s instructions.',
  },
  'Isaiah 7:14': {
    canonicalRef: 'Isaiah 7:14',
    whatVerseIsTalkingAbout:
      'God offering a miraculous sign to the House of David that a virgin/maiden will conceive and bear a son named Immanuel.',
    surroundingPassage:
      'Isaiah 7:1–17, recounting the Syro-Ephraimite crisis around 734 BC during the reign of King Ahaz of Judah.',
    speakerAndAudience:
      'The prophet Isaiah speaking to King Ahaz and the royal court of Judah.',
    whatPromptedIt:
      'King Ahaz refused to ask God for a sign of protection against invading northern kings, masking his lack of faith in false piety.',
    immediateContextMeaning:
      'God gives His own sovereign sign to the Davidic dynasty: a child named Immanuel ("God with us") whose arrival guarantees that God\'s covenant promises to David will never fail despite hostile earthly threats.',
    connectionWithSurroundingVerses:
      'Follows Ahaz\'s refusal in verse 12 and leads to verses 15–16 predicting the rapid fall of the enemy kings before the child reaches maturity, pointing onward to the royal Child of Isaiah 9:6.',
  },
  'Isaiah 53:7': {
    canonicalRef: 'Isaiah 53:7',
    whatVerseIsTalkingAbout:
      'The patient, voluntary submission and innocence of the Lord\'s Suffering Servant as He is led to slaughter without protest.',
    surroundingPassage:
      'Isaiah 52:13–53:12, the Fourth Servant Song, describing the redemptive suffering, vicarious death, and exaltation of the Messiah.',
    speakerAndAudience:
      'The prophet Isaiah speaking under prophetic inspiration to Israel and all who await God\'s redemption.',
    whatPromptedIt:
      'The revelation in verses 4–6 that humanity\'s straying sins were laid upon the Servant: "The Lord has laid on him the iniquity of us all."',
    immediateContextMeaning:
      'Contrasting wayward human rebellion with the Servant\'s gentle compliance, the verse portrays Him submitting meekly like a sacrificial lamb, yielding His life willingly for the redemption of others.',
    connectionWithSurroundingVerses:
      'Follows the confession of universal human sin in verse 6 and transitions to verses 8–9 describing His unjust trial, death, and burial among the wicked and rich.',
  },
  'Genesis 1:26': {
    canonicalRef: 'Genesis 1:26',
    whatVerseIsTalkingAbout:
      'The divine decision to create humanity in God\'s image and likeness, endowing them with representative stewardship over the earth.',
    surroundingPassage:
      'Genesis 1:1–2:3, the creation account detailing the six days of God bringing order, light, and life into the cosmos.',
    speakerAndAudience:
      'God speaking within the divine council / Godhead ("Let us"), recorded by Moses for Israel.',
    whatPromptedIt:
      'The culmination of Day Six; the earth was fully furnished and filled with creatures, preparing the stage for the creation of God\'s supreme earthly stewards.',
    immediateContextMeaning:
      'Unlike animals made "according to their kinds," humans are formed in the divine image, possessing capacity for communion with God, moral responsibility, and royal stewardship over creation.',
    connectionWithSurroundingVerses:
      'Directly follows the creation of land creatures in verses 24–25 and leads into verse 27 ("So God created mankind in his own image; in the image of God he created them; male and female he created them") and the mandate in verse 28.',
  },
  'Romans 5:12': {
    canonicalRef: 'Romans 5:12',
    whatVerseIsTalkingAbout:
      'How sin, alienation, and death entered the human race through one man (Adam), affecting all humanity.',
    surroundingPassage:
      'Romans 5:12–21, Paul\'s profound comparison between the two representative heads of humanity: Adam and Jesus Christ.',
    speakerAndAudience:
      'The Apostle Paul writing to the Christian church in Rome.',
    whatPromptedIt:
      'After explaining justification by faith and peace with God in Romans 5:1–11, Paul explains why universal redemption in Christ was necessary.',
    immediateContextMeaning:
      'Paul identifies Adam\'s disobedience in Eden as the entry point of sin and mortality into human history, establishing the foundational need for the greater obedience and righteousness of Christ.',
    connectionWithSurroundingVerses:
      'Begins an extended comparison between Adam\'s trespass bringing condemnation to all, and Christ\'s one act of righteousness bringing justification and life to all who receive Him (vv. 15–19).',
  },
  'Acts 2:38': {
    canonicalRef: 'Acts 2:38',
    whatVerseIsTalkingAbout:
      'Peter\'s apostolic proclamation of repentance, baptism in Jesus\' name for the forgiveness of sins, and the promise of the Holy Spirit.',
    surroundingPassage:
      'Acts 2:14–41, the Day of Pentecost in Jerusalem where the Holy Spirit is poured out and Peter preaches the first Christian sermon.',
    speakerAndAudience:
      'The Apostle Peter addressing thousands of Jewish pilgrims gathered in Jerusalem.',
    whatPromptedIt:
      'The hearers were "cut to the heart" after realizing they had crucified their promised Messiah, asking Peter in verse 37: "Brothers, what shall we do?"',
    immediateContextMeaning:
      'Peter gives the biblical response to the Gospel: turning away from sin (repentance) and making public allegiance to Jesus through baptism, promising absolute forgiveness and the indwelling gift of the Holy Spirit.',
    connectionWithSurroundingVerses:
      'Directly answers the urgent question in verse 37 and is supported by the generational promise in verse 39 ("The promise is for you and your children and for all who are far off"), leading to about 3,000 people being baptized that day (v. 41).',
  },
  '1 Corinthians 10:4': {
    canonicalRef: '1 Corinthians 10:4',
    whatVerseIsTalkingAbout:
      'The Apostle Paul identifying the rock that provided water in the wilderness as a type of Christ, showing Christ\'s active spiritual presence sustaining His people.',
    surroundingPassage:
      '1 Corinthians 10:1–13, where Paul uses Israel\'s wilderness journey in the Exodus to warn the Corinthian church against spiritual overconfidence and idolatry.',
    speakerAndAudience:
      'The Apostle Paul writing to the church at Corinth.',
    whatPromptedIt:
      'Some Corinthian believers presumed that because they had received baptism and communion, they were immune to the dangers of participating in pagan temple feasts.',
    immediateContextMeaning:
      'Paul explains that ancient Israel enjoyed equivalent spiritual blessings—supernatural bread from heaven and water from the rock—and that the rock foreshadowed Christ who was spiritually with them. Yet despite these privileges, many fell because they engaged in idolatry.',
    connectionWithSurroundingVerses:
      'Follows verses 1–3 highlighting the shared blessings of the cloud, sea, and manna, and leads directly into verse 5: "Nevertheless, God was not pleased with most of them; their bodies were scattered in the wilderness."',
  },
};

/**
 * Get or dynamically generate a high-quality 6-point Context explanation for any verse in Scripture.
 */
export function getVerseContextExplanation(
  canonicalRef: string,
  verseText?: string,
  sectionHeading?: string,
  precedingVerse?: { ref: string; text: string },
  followingVerse?: { ref: string; text: string }
): VerseContextExplanation {
  const norm = canonicalRef.trim();

  // 1. Direct curated match
  if (CURATED_VERSE_CONTEXTS[norm]) {
    return CURATED_VERSE_CONTEXTS[norm];
  }

  // 2. Parse canonical reference
  const parsed = parseScriptureReference(norm);
  const bookName = parsed?.book || norm.split(' ')[0] || 'Matthew';
  const chapterNum = parsed?.chapter || 1;
  const verseNum = parsed?.verse || 1;

  const bookObj = findBookByName(bookName);
  const introMeta = BOOK_INTRODUCTIONS[bookName];
  const isNT = bookObj ? bookObj.testament === 'NT' : true;
  const actualText = verseText || getVerseText(norm, 'NIV') || '';

  const cleanText = actualText.replace(/^\[.*?\]\s*/, '').trim();

  // Dynamic 6-point synthesis grounded in actual biblical data
  const whatVerseIsTalkingAbout = cleanText
    ? `The text of ${norm} states: "${cleanText}" — highlighting ${
        sectionHeading
          ? `a key moment within "${sectionHeading}"`
          : introMeta?.theme
          ? `the broader theme of ${introMeta.theme.toLowerCase()}`
          : `the narrative and theological message of ${bookName} ${chapterNum}`
      }.`
    : `A key passage within ${bookName} chapter ${chapterNum}, developing the central message of ${
        introMeta?.theme || bookName
      }.`;

  const surroundingPassage = sectionHeading
    ? `In ${bookName} ${chapterNum}, this verse forms an integral part of the passage entitled "${sectionHeading}". The surrounding narrative develops God's redemptive purpose for His people in this historical setting.`
    : `In ${bookName} ${chapterNum}, this passage unfolds the ongoing train of thought in ${bookName}, which ${
        introMeta?.summary ||
        `instructs believers in faith, covenant obedience, and God's sovereign promises.`
      }`;

  const speakerAndAudience = introMeta
    ? `${introMeta.author} writing or speaking to ${introMeta.theme ? `God's covenant people regarding ${introMeta.theme}` : 'the community of faith'}.`
    : isNT
    ? `The inspired apostolic writer addressing the early Christian church.`
    : `The inspired biblical author addressing the covenant people of Israel.`;

  const whatPromptedIt = precedingVerse
    ? `This statement directly follows the preceding verse ${precedingVerse.ref} ("${precedingVerse.text.slice(0, 80)}${
        precedingVerse.text.length > 80 ? '...' : ''
      }"), which sets the premise for what is communicated here.`
    : chapterNum > 1
    ? `Following the events and theological developments of ${bookName} ${chapterNum - 1}, this verse continues the author's message into ${bookName} ${chapterNum}.`
    : `The opening section of ${bookName} introduces foundational themes that shape the remainder of the book.`;

  const immediateContextMeaning =
    `Within its immediate context, this verse communicates that God's truth is grounded in His character and covenant faithfulness. It instructs the reader to understand how this passage functions not as an isolated quote, but as part of the author's purposeful message in ${bookName} ${chapterNum}.`;

  const connectionWithSurroundingVerses = followingVerse
    ? `This verse connects backward to the preceding context and moves forward into ${followingVerse.ref} ("${followingVerse.text.slice(0, 80)}${
        followingVerse.text.length > 80 ? '...' : ''
      }"), ensuring a continuous and coherent reading of the passage.`
    : `This verse connects with the surrounding chapter by reinforcing the main theological thrust of ${bookName} ${chapterNum}, calling the reader to thoughtful reflection and faithful application.`;

  return {
    canonicalRef: norm,
    whatVerseIsTalkingAbout,
    surroundingPassage,
    speakerAndAudience,
    whatPromptedIt,
    immediateContextMeaning,
    connectionWithSurroundingVerses,
  };
}

