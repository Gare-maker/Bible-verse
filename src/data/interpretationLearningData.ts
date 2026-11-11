import { EssentialConcept, InterpretationMethod, InterpretationPrinciple } from '@/types/bible';

// ============================================================================
// SECTION 3: ETYMOLOGY OVERVIEW AND CORE EXAMPLES
// ============================================================================
export interface EtymologyExample {
  englishWord: string;
  originalWord: string;
  language: 'Hebrew' | 'Greek' | 'Aramaic';
  transliteration: string;
  meaning: string;
  historicalDevelopment: string;
  rootVsContextualMeaning: string;
  scriptureReferences: string[];
  lexiconId?: string;
}

export const ETYMOLOGY_EXAMPLES: EtymologyExample[] = [
  {
    englishWord: 'Baptism',
    originalWord: 'βάπτισμα (Baptisma) / βαπτίζω (Baptizō)',
    language: 'Greek',
    transliteration: 'Baptisma',
    meaning: 'Baptism; related to baptizō, meaning to immerse, plunge, or dip',
    historicalDevelopment:
      'In classical Greek literature (e.g., Hippocrates, Euripides), baptō and baptizō described dyeing cloth by dipping it into dye or sinking a naval vessel. In second-temple Jewish practice, it described the ritual washings of the mikveh. The New Testament transformed the term into a sacred initiation rite symbolizing death to sin and rising to new spiritual life in Christ.',
    rootVsContextualMeaning:
      'While the physical root implies immersion in water, in biblical context it denotes spiritual union with Jesus Christ in his death and resurrection (Romans 6:3–4), cleansing of the conscience (1 Peter 3:21), and the baptism of the Holy Spirit (Acts 1:5).',
    scriptureReferences: ['Romans 6:3-4', 'Matthew 28:19', 'Acts 2:38', '1 Peter 3:21'],
    lexiconId: 'G908-baptisma',
  },
  {
    englishWord: 'Repentance',
    originalWord: 'μετάνοια (Metanoia)',
    language: 'Greek',
    transliteration: 'Metanoia',
    meaning: 'Change of mind or disposition; transformation of heart and purpose',
    historicalDevelopment:
      'In classical Greek, metanoia signified an afterthought, regret, or subsequent change of opinion. In the biblical canon, influenced by the prophetic Hebrew concept of shuv (turning back to Yahweh), it became the comprehensive conversion of the entire inner person away from sin and toward God.',
    rootVsContextualMeaning:
      'Root analysis (meta = change, nous = mind) could reduce repentance to a mere intellectual shift. In biblical context, however, metanoia is a whole-person reorientation accompanied by moral transformation, sorrow over sin, and obedience to the gospel.',
    scriptureReferences: ['Acts 2:38', 'Matthew 3:2', '2 Corinthians 7:10', 'Luke 13:3'],
    lexiconId: 'G3341-metanoia',
  },
  {
    englishWord: 'Gospel',
    originalWord: 'εὐαγγέλιον (Euangelion)',
    language: 'Greek',
    transliteration: 'Euangelion',
    meaning: 'Good news; glad tidings of divine victory and salvation',
    historicalDevelopment:
      'In the Roman Empire, an euangelion was an official public decree proclaiming a military conquest or the accession of a new emperor. The early church boldly seized this political and cultural term to declare that Jesus the crucified and risen Christ—not Caesar—is the true King and Lord of the cosmos.',
    rootVsContextualMeaning:
      'Etymologically "good announcement" (eu + angelia). In New Testament context, it specifically designates the historical redemptive narrative: Christ died for our sins according to the Scriptures, was buried, and was raised on the third day (1 Corinthians 15:1–4).',
    scriptureReferences: ['Romans 1:16', '1 Corinthians 15:1-4', 'Mark 1:1', 'Galatians 1:6-9'],
    lexiconId: 'G2098-euangelion',
  },
  {
    englishWord: 'Church',
    originalWord: 'ἐκκλησία (Ekklesia)',
    language: 'Greek',
    transliteration: 'Ekklesia',
    meaning: 'Assembly or congregation; the community summoned by God',
    historicalDevelopment:
      'In the Greek city-states (poleis), the ekklēsia was the assembly of free citizens summoned out of their homes into the public assembly to conduct civic affairs. In the Greek Old Testament (Septuagint), it translated qahal (the sacred gathering of Israel before God at Sinai). In the New Testament, it became the global body and local fellowship of believers in Christ.',
    rootVsContextualMeaning:
      'Popular etymology often overemphasizes "called-out ones" (ek + kaleō). In biblical context, it simply means an assembled gathering of God’s covenant people, never an inert brick-and-mortar building.',
    scriptureReferences: ['Matthew 16:18', 'Ephesians 1:22-23', 'Acts 20:28', '1 Corinthians 12:27'],
    lexiconId: 'G1577-ekklesia',
  },
  {
    englishWord: 'Grace',
    originalWord: 'χάρις (Charis)',
    language: 'Greek',
    transliteration: 'Charis',
    meaning: 'Favour, unearned graciousness, divine goodwill, and enabling power',
    historicalDevelopment:
      'In ancient Greco-Roman society, charis operated within the reciprocal patron-client system: a benefactor gave a favor (charis), and the client owed gratitude and loyalty (charis). Christianity radically redefined charis as God’s utterly unmerited, unilateral favor bestowed upon undeserving enemies through Christ.',
    rootVsContextualMeaning:
      'While the root connotes charm or pleasingness, in biblical theology it is the sovereign, unpurchased love of God that rescues sinners from condemnation and daily empowers them for holy living (Titus 2:11–12).',
    scriptureReferences: ['Ephesians 2:8-9', 'Romans 3:24', 'Titus 2:11', '2 Corinthians 12:9'],
    lexiconId: 'G5485-charis',
  },
];

// ============================================================================
// SECTION 5: TYPES, SHADOWS AND ANTITYPES
// ============================================================================
export interface TypologySectionData {
  typesGuide: {
    definition: string;
    howTheyFunction: string;
    identificationRules: string[];
    differenceFromIllustration: string;
    examples: {
      name: string;
      passage: string;
      explanation: string;
    }[];
  };
  shadowsGuide: {
    definition: string;
    colossiansHebrewsPrinciple: string;
    institutions: {
      name: string;
      otPassage: string;
      ntFulfilment: string;
      explanation: string;
    }[];
  };
  antitypesGuide: {
    definition: string;
    wordOrigin: string;
    relationshipToType: string;
    differenceFromShadow: string;
    examples: {
      title: string;
      typePassage: string;
      antitypePassage: string;
      originalEvent: string;
      ntConnection: string;
      spiritualSignificance: string;
    }[];
  };
}

export const TYPOLOGY_GUIDE: TypologySectionData = {
  typesGuide: {
    definition:
      'A biblical type (Greek typos, "impression, pattern, model") is a real historical person, event, institution, or ceremony preordained by God in the Old Testament to foreshadow and anticipate a corresponding greater spiritual reality fulfilled in the New Testament.',
    howTheyFunction:
      'Types are not allegorical inventions of human imagination; they are divinely designed historical foreshadowings rooted in redemptive history. God ordered the events and institutions of Israel’s history so that they would provide the theological vocabulary and visual architecture necessary to understand the person and work of Jesus Christ.',
    identificationRules: [
      'Historical Reality: Both the type and antitype must be real historical realities, not fictional fables.',
      'Divinely Ordained Correspondence: There must be a genuine, demonstrable theological analogy between the two.',
      'Escalation: The antitype is always far greater, higher, and more glorious than the type (e.g., Christ is greater than Solomon, greater than Jonah, greater than the temple).',
      'Scriptural Warrant: Legitimate types are explicitly identified or clearly warranted by New Testament writers rather than unchecked private speculation.',
    ],
    differenceFromIllustration:
      'An ordinary illustration is an analogy chosen by a teacher to explain an idea. A biblical type, by contrast, is a prophetic historical design woven into salvation history by God Himself that points forward to Christ.',
    examples: [
      {
        name: 'Adam and Christ',
        passage: 'Romans 5:14; 1 Corinthians 15:45',
        explanation:
          'Paul explicitly calls Adam "a type of the one who was to come" (typos tou mellontos). As Adam was the representative covenant head of fallen humanity whose disobedience brought death, so Christ is the Last Adam and federal head of redeemed humanity whose obedience brings life.',
      },
      {
        name: 'The Passover Lamb and Christ',
        passage: '1 Corinthians 5:7; Exodus 12:1–13',
        explanation:
          'Paul writes: "For Christ, our Passover lamb, has been sacrificed." The unblemished yearling lamb slain in Egypt whose blood shielded Israel from divine wrath foreshadowed the spotless Lamb of God whose blood cleanses believers from sin.',
      },
      {
        name: 'The Bronze Serpent and Christ',
        passage: 'John 3:14–15; Numbers 21:8–9',
        explanation:
          'Jesus Himself drew this direct typological connection: "Just as Moses lifted up the snake in the wilderness, so the Son of Man must be lifted up, that everyone who believes may have eternal life in him." Looking in faith at the lifted-up one brings deliverance from deadly venom/sin.',
      },
      {
        name: 'Jonah and Christ',
        passage: 'Matthew 12:40; Jonah 1:17',
        explanation:
          'Jesus identified Jonah’s three days and nights in the belly of the sea monster as a prophetic type of His own three days and nights in the heart of the earth followed by resurrection.',
      },
      {
        name: 'Melchizedek and Christ\'s Priesthood',
        passage: 'Hebrews 7:1–17; Genesis 14:18–20; Psalms 110:4',
        explanation:
          'Melchizedek, king of Salem and priest of God Most High without recorded genealogy, prefigures the eternal, superior royal-priesthood of Jesus Christ that transcends the temporary Levitical order.',
      },
    ],
  },
  shadowsGuide: {
    definition:
      'A biblical shadow (Greek skia) is an Old Testament ceremony, ritual, feast, or architectural pattern that possessed an outline of truth but lacked the ultimate physical substance, designed to point Israel toward the solid reality arriving in Christ.',
    colossiansHebrewsPrinciple:
      'Colossians 2:16–17 declares: "These are a shadow of the things that were to come; the reality, however, is found in Christ." Hebrews 10:1 affirms: "The law is only a shadow of the good things that are coming—not the realities themselves. For this reason it can never, by the same sacrifices repeated endlessly year after year, make perfect those who draw near to worship."',
    institutions: [
      {
        name: 'Passover',
        otPassage: 'Exodus 12:1–28',
        ntFulfilment: '1 Corinthians 5:7; John 1:29; Luke 22:15–20',
        explanation:
          'The annual slaughter of the spotless lamb and the feast of unleavened bread were shadows of redemption through Christ’s blood and living a life of sincere holiness.',
      },
      {
        name: 'Animal Sacrifices',
        otPassage: 'Leviticus 1–7; Leviticus 16',
        ntFulfilment: 'Hebrews 9:11–14; Hebrews 10:1–14',
        explanation:
          'The blood of bulls and goats could never take away sins; they were annual shadows that maintained ritual access until the one-for-all sacrifice of Jesus Christ abolished the need for further offerings.',
      },
      {
        name: 'Levitical Priesthood',
        otPassage: 'Exodus 28; Leviticus 8',
        ntFulfilment: 'Hebrews 4:14–16; Hebrews 7:23–28',
        explanation:
          'Mortal priests who had to offer sacrifices first for their own sins were shadows of our sinless, immortal High Priest who intercedes forever at the right hand of God.',
      },
      {
        name: 'The Tabernacle & Temple',
        otPassage: 'Exodus 25–40; 1 Kings 6',
        ntFulfilment: 'John 1:14; John 2:19–21; Hebrews 8:1–5; Revelation 21:3',
        explanation:
          'The earthly sanctuary with its Holy of Holies was a copy and shadow of the heavenly sanctuary; Jesus’ flesh is the true tabernacle, and His church is the temple of the living God.',
      },
      {
        name: 'Old Testament Festivals (Feasts of the Lord)',
        otPassage: 'Leviticus 23',
        ntFulfilment: 'Acts 2:1–4; 1 Corinthians 15:20; Colossians 2:16–17',
        explanation:
          'Feast of Firstfruits prefigures Christ’s resurrection; Pentecost (Shavuot) prefigures the outpouring of the Holy Spirit; the Day of Atonement (Yom Kippur) prefigures Christ’s once-for-all atonement.',
      },
      {
        name: 'The Sabbath',
        otPassage: 'Exodus 20:8–11; Deuteronomy 5:12–15',
        ntFulfilment: 'Matthew 11:28; Hebrews 4:1–11; Colossians 2:16–17',
        explanation:
          'The weekly rest from physical labor pointed toward the spiritual rest believers enter by ceasing from their own works of self-righteousness and resting in the finished redemption of Christ.',
      },
    ],
  },
  antitypesGuide: {
    definition:
      'An antitype (Greek antitypos, from anti = corresponding to, facing, or fulfilling + typos = pattern) is the greater, ultimate reality that corresponds to and fulfills an earlier prophetic type.',
    wordOrigin:
      'The Greek term antitypos occurs in 1 Peter 3:21 ("and this water symbolizes [antitypon] baptism that now saves you") and Hebrews 9:24 ("For Christ did not enter a sanctuary made with human hands that was only a copy [antitypa] of the true one; he entered heaven itself").',
    relationshipToType:
      'If the type is the wax seal, the antitype is the original signet ring. If the type is the photographic negative or shadow, the antitype is the living person. The type is provisional and preliminary; the antitype is eternal and climactic.',
    differenceFromShadow:
      'While "shadow" emphasizes the incomplete, shadowy outline of the Old Covenant ritual, "antitype" emphasizes the substantive New Covenant fulfillment that corresponds with accuracy to the ancient blueprint.',
    examples: [
      {
        title: 'Adam (Type) and Christ (Antitype)',
        typePassage: 'Genesis 2:7; Genesis 3:17–19',
        antitypePassage: 'Romans 5:14–19; 1 Corinthians 15:21–22, 45–49',
        originalEvent: 'God created Adam as the covenant head of the human race; his disobedience plunged all his descendants into condemnation and death.',
        ntConnection: 'Christ came as the Last Adam; his perfect obedience, righteousness, and resurrection bring justification and eternal life to all who belong to Him.',
        spiritualSignificance: 'Demonstrates that grace in Christ superabounds beyond the tragedy of the Fall.',
      },
      {
        title: 'Passover (Type) and Christ (Antitype)',
        typePassage: 'Exodus 12:1–13',
        antitypePassage: '1 Corinthians 5:7; John 19:36; Revelation 5:6–12',
        originalEvent: 'Israelite households killed an unblemished lamb and applied its blood to the doorposts to escape the destroying angel on the night of the Exodus.',
        ntConnection: 'Jesus Christ was crucified at Passover without a single bone broken, his blood securing eternal redemption from sin and death.',
        spiritualSignificance: 'Believers are delivered from spiritual bondage through the blood of the Lamb.',
      },
      {
        title: 'The Bronze Serpent (Type) and the Cross (Antitype)',
        typePassage: 'Numbers 21:4–9',
        antitypePassage: 'John 3:14–15; 2 Corinthians 5:21',
        originalEvent: 'Israelites dying of serpent bites looked at the bronze serpent on a pole and lived.',
        ntConnection: 'Jesus was lifted up on the cross, taking the curse of sin into his own body so that all who look to Him in faith receive eternal life.',
        spiritualSignificance: 'Salvation is received by looking in faith upon the crucified Savior, not by self-effort.',
      },
      {
        title: 'Noah\'s Ark & the Flood (Type) and Baptism in Christ (Antitype)',
        typePassage: 'Genesis 6–8',
        antitypePassage: '1 Peter 3:20–21; Romans 6:3–5',
        originalEvent: 'Eight souls were preserved through the judgment waters in the ark, coming out into a cleansed new creation.',
        ntConnection: 'Baptism represents the pledge of a good conscience toward God through the resurrection of Jesus Christ, passing through death into life.',
        spiritualSignificance: 'Passing safely through judgment into new creation through union with the resurrected Christ.',
      },
    ],
  },
};

// ============================================================================
// SECTION 6: 15 INTERPRETATION METHODS DETAIL DATA
// ============================================================================
export const INTERPRETATION_METHODS: InterpretationMethod[] = [
  {
    id: 'method-literal',
    number: 1,
    name: 'Literal Interpretation',
    slug: 'literal',
    shortSummary: 'Understanding the plain, natural sense of words according to normal linguistic rules.',
    definition:
      'The practice of interpreting biblical passages according to the plain, ordinary, and customary meaning of words in their grammatical and historical context, taking into account figures of speech and literary genre.',
    detailedExplanation:
      'Literal interpretation (often called the grammatical-historical method) insists that Scripture communicates clear meaning through human language. It does not mean wooden "letterism" that ignores poetry or hyperbole, but rather interpreting literal statements literally, poetic metaphors poetically, historical narratives historically, and parables parabolically.',
    howItWorks: [
      'Ascertain the normal grammatical meaning of the words at the time of writing.',
      'Identify whether the author is using figures of speech (metaphor, simile, hyperbole, idiom).',
      'Respect the genre: read history as history, poetry as poetry, apocalyptic as apocalyptic.',
      'Seek the author’s intended meaning rather than inventing hidden allegories.',
    ],
    biblicalExamples: [
      {
        title: 'Historical Fulfillment in the Virgin Birth',
        passage: 'Isaiah 7:14; Matthew 1:22–23',
        explanation: 'Matthew takes Isaiah’s prophecy of the virgin conceiving as a literal historical event fulfilled in Mary’s conception of Jesus.',
      },
      {
        title: 'Literal Historical Resurrection',
        passage: '1 Corinthians 15:3–4; Luke 24:39',
        explanation: 'Paul emphasizes that Christ literally died, was buried, and rose bodily on the third day; it is not a poetic metaphor.',
      },
    ],
    relevantBibleReferences: ['Nehemiah 8:8', 'Proverbs 8:8–9', '2 Peter 1:20–21'],
    practicalApplication:
      'Always start with the primary, plain sense of the text. If the plain sense makes good sense in light of the passage, seek no other sense unless the context clearly indicates figurative language.',
    relatedMethods: ['Grammatical Interpretation', 'Historical Interpretation', 'Contextual Interpretation'],
    sourceAttribution: 'Bernard Ramm, Protestant Biblical Interpretation & Millard Erickson, Christian Theology',
  },
  {
    id: 'method-historical',
    number: 2,
    name: 'Historical Interpretation',
    slug: 'historical',
    shortSummary: 'Examining the time, culture, author, audience, and circumstances of the original writing.',
    definition:
      'The method of interpreting Scripture within the historical, geographical, political, and cultural setting in which the text was originally composed and received.',
    detailedExplanation:
      'Scripture was not written in an abstract vacuum; God spoke to real people in specific times and cultures. Historical interpretation investigates who wrote the book, who the original recipients were, what crises or challenges they faced, and what customs or geopolitical realities shaped their worldview.',
    howItWorks: [
      'Determine the author, date, and original audience of the book.',
      'Investigate the contemporary historical and political backdrop (e.g., Assyrian, Babylonian, Persian, Greek, Roman rule).',
      'Identify ancient cultural practices, customs, and idioms that clarify the text.',
      'Distinguish timeless moral principles from culturally conditioned practices.',
    ],
    biblicalExamples: [
      {
        title: 'The Laodicean Lukewarmness',
        passage: 'Revelation 3:15–16',
        explanation:
          'Understanding that neighboring Hierapolis had hot mineral springs (healing) and Colossae had cold mountain water (refreshing), while Laodicea had tepid, calcified water piped in via aqueducts reveals that "lukewarm" means useless and nauseating, not moderate devotion.',
      },
      {
        title: 'The Roman Colony of Philippi',
        passage: 'Philippians 3:20',
        explanation:
          'Paul’s statement "our citizenship is in heaven" carried profound weight to Philippians, who were proud Roman citizens with special imperial privileges living far from the capital city.',
      },
    ],
    relevantBibleReferences: ['Luke 1:1–4', '1 Corinthians 10:11', 'Galatians 4:4'],
    practicalApplication:
      'Consult reputable Bible dictionaries and historical commentaries to understand the ancient world before attempting to apply a passage directly to modern life.',
    relatedMethods: ['Cultural Interpretation', 'Contextual Interpretation', 'Grammatical Interpretation'],
    sourceAttribution: 'FF Bruce, New Testament History & Craig Keener, The IVP Bible Background Commentary',
  },
  {
    id: 'method-grammatical',
    number: 3,
    name: 'Grammatical Interpretation',
    slug: 'grammatical',
    shortSummary: 'Analyzing syntax, word relationships, verb tenses, and sentence structures.',
    definition:
      'The practice of discovering the meaning of a passage by analyzing its grammatical structure, syntax, parts of speech, verbal aspects, and syntactical relationships in the original Hebrew, Aramaic, or Greek.',
    detailedExplanation:
      'Grammar is the vehicle of thought. By examining subjects, verbs, direct objects, conjunctions, prepositions, and verb tenses, the interpreter uncovers the exact relationships between ideas in a biblical text.',
    howItWorks: [
      'Trace the main clauses and dependent clauses in a sentence.',
      'Analyze verb forms (tenses, voices, moods in Greek; aspects and stems in Hebrew).',
      'Identify crucial connecting words (e.g., therefore, for, in order that, but, so that).',
      'Examine prepositional phrases that define location, agency, or purpose.',
    ],
    biblicalExamples: [
      {
        title: 'The Aorist and Perfect in Salvation',
        passage: 'Ephesians 2:8',
        explanation:
          'The phrase "you have been saved" uses the Greek perfect passive participle (sesōsmenoi), signifying a past completed action with permanent, ongoing results.',
      },
      {
        title: 'Connecting Doctrines to Duty',
        passage: 'Romans 12:1',
        explanation:
          'The opening word "Therefore" (oun) grammatically connects the practical commands of chapters 12–16 directly back to the vast theological mercies of God in chapters 1–11.',
      },
    ],
    relevantBibleReferences: ['Matthew 5:18', '2 Timothy 2:15', 'Titus 1:9'],
    practicalApplication:
      'Pay close attention to connecting words like "therefore", "because", and "in order that", and use interlinear bibles or lexicons to understand key original verb forms.',
    relatedMethods: ['Literal Interpretation', 'Word Study', 'Contextual Interpretation'],
    sourceAttribution: 'Daniel B. Wallace, Greek Grammar Beyond the Basics & Gesenius\' Hebrew Grammar',
  },
  {
    id: 'method-contextual',
    number: 4,
    name: 'Contextual Interpretation',
    slug: 'contextual',
    shortSummary: 'Interpreting every verse in light of its immediate paragraph, chapter, and book.',
    definition:
      'The principle that no verse may be isolated from its immediate literary setting, including the verses before and after, the chapter argument, and the overarching purpose of the entire biblical book.',
    detailedExplanation:
      'A text without a context is a pretext for a prooftext. Contextual interpretation recognizes expanding circles of context: immediate sentence -> paragraph -> chapter -> whole book -> author’s canon -> entire Bible.',
    howItWorks: [
      'Read the preceding and succeeding verses to track the flow of thought.',
      'Identify the main topic of the chapter or literary section.',
      'Ask why the author placed this specific argument in this specific location.',
      'Check if the verse is an answer to a question or part of an ongoing dialogue.',
    ],
    biblicalExamples: [
      {
        title: '"I Can Do All Things Through Christ"',
        passage: 'Philippians 4:13',
        explanation:
          'In context (verses 11–12), Paul is not promising athletic or financial victory, but divine empowerment to be content whether in hunger, abundance, need, or imprisonment.',
      },
      {
        title: '"Where Two or Three Are Gathered"',
        passage: 'Matthew 18:20',
        explanation:
          'In context (verses 15–19), Jesus is addressing church discipline and reconciliation between offended brothers, not establishing a minimum quorum for prayer meetings.',
      },
    ],
    relevantBibleReferences: ['2 Peter 3:15–16', 'Acts 17:11', '1 Corinthians 2:13'],
    practicalApplication:
      'Never build a doctrine or life decision on a single isolated verse; always read at least the surrounding chapter to understand the author’s primary train of thought.',
    relatedMethods: ['Literary Interpretation', 'Canonical Interpretation', 'Comparative Interpretation'],
    sourceAttribution: 'Gordon Fee & Douglas Stuart, How to Read the Bible for All Its Worth',
  },
  {
    id: 'method-theological',
    number: 5,
    name: 'Theological Interpretation',
    slug: 'theological',
    shortSummary: 'Understanding passages in light of the core doctrines of God, salvation, and Christ.',
    definition:
      'Reading and interpreting Scripture in light of the overall character of God, the coherence of divine revelation, and the major theological doctrines of the Christian faith.',
    detailedExplanation:
      'Since the Bible is inspired by one divine Author (the Holy Spirit), Scripture does not contradict itself. Theological interpretation seeks the theological truths revealed about God’s attributes, human nature, sin, redemption, covenant, and the kingdom.',
    howItWorks: [
      'Identify what the passage reveals about God’s nature, holiness, justice, or mercy.',
      'Correlate the passage with the broader teaching of Scripture on that subject (analogy of faith).',
      'Understand how historical covenants build toward the New Covenant in Christ.',
      'Distinguish descriptive historical accounts from prescriptive theological commands.',
    ],
    biblicalExamples: [
      {
        title: 'Abraham Justified by Faith',
        passage: 'Genesis 15:6; Romans 4:1–5',
        explanation:
          'Paul draws the theological conclusion that justification has always been by faith, not through Mosaic ceremonies or circumcision.',
      },
      {
        title: 'God’s Immutability in Covenant Mercy',
        passage: 'Malachi 3:6',
        explanation:
          'God links his unchanging nature ("I the LORD do not change") directly to Israel’s preservation from destruction.',
      },
    ],
    relevantBibleReferences: ['Romans 11:33–36', 'Hebrews 1:1–3', '1 Timothy 3:16'],
    practicalApplication:
      'Ask: "What does this passage reveal about who God is, what He has done, and how humans are called to respond?"',
    relatedMethods: ['Canonical Interpretation', 'Christological Interpretation', 'Contextual Interpretation'],
    sourceAttribution: 'J.I. Packer, Knowing God & Wayne Grudem, Systematic Theology',
  },
  {
    id: 'method-allegorical',
    number: 6,
    name: 'Allegorical Interpretation',
    slug: 'allegorical',
    shortSummary: 'Seeking hidden, spiritual, or figurative meanings beneath the surface narrative.',
    definition:
      'An interpretive method that looks beneath the literal sense of a passage to discover secondary, deeper, or spiritual meanings, often where the characters and details represent virtues, vices, or spiritual realities.',
    detailedExplanation:
      'While historical allegory was popularized by Alexandrian scholars like Origen and Philo, sound biblical hermeneutics distinguishes between biblical allegory (authorized by Scripture, e.g., Galatians 4:21–31) and arbitrary allegorization that imposes subjective fantasies onto plain historical narratives.',
    howItWorks: [
      'Check whether the text itself claims to be an allegory or parable (e.g., Ezekiel 17; Galatians 4).',
      'Look for explicit symbolic designations provided by Scripture.',
      'Refrain from assigning arbitrary spiritual meanings to physical details (e.g., the colors of tabernacle cords).',
      'Anchor all spiritual applications firmly to clear teaching elsewhere in the canon.',
    ],
    biblicalExamples: [
      {
        title: 'Hagar and Sarah in Galatians',
        passage: 'Galatians 4:21–31',
        explanation:
          'Paul explicitly states "these things may be taken figuratively" (allegoroumena), showing that Hagar represents the Sinai covenant of slavery while Sarah represents the heavenly Jerusalem of freedom.',
      },
      {
        title: 'The Parable of the Sower',
        passage: 'Mark 4:1–20',
        explanation:
          'Jesus provides the inspired interpretation of His own allegorical parable: the seed is the word of God, and the soils are different human heart responses.',
      },
    ],
    relevantBibleReferences: ['Galatians 4:24', 'Ezekiel 17:2', 'Mark 4:13'],
    practicalApplication:
      'Use allegorical explanations only where Scripture itself warrants them. Never use allegorization to bypass the plain, literal, and historical meaning of a passage.',
    relatedMethods: ['Typological Interpretation', 'Symbolic Interpretation', 'Figurative Interpretation'],
    sourceAttribution: 'Origen, On First Principles & Grant Osborne, The Hermeneutical Spiral',
  },
  {
    id: 'method-typological',
    number: 7,
    name: 'Typological Interpretation',
    slug: 'typological',
    shortSummary: 'Tracing divinely ordained Old Testament patterns fulfilled in Christ and the New Covenant.',
    definition:
      'The recognition of divinely designed historical correspondences between Old Testament persons, events, and institutions (types) and their climactic fulfillment in Jesus Christ and the New Covenant (antitypes).',
    detailedExplanation:
      'Unlike allegory, typology respects the genuine historical reality of the Old Testament event. It recognizes that God sovereignly ordered redemptive history so that earlier events foreshadowed the greater salvation accomplished by Christ.',
    howItWorks: [
      'Examine the historical reality and original significance of the Old Testament pattern.',
      'Identify the divine design connecting the pattern to Christ or the gospel.',
      'Demonstrate the escalation and superiority of the New Testament fulfillment.',
      'Ground the typological link in explicit New Testament testimony (e.g., Hebrews, Romans, 1 Peter).',
    ],
    biblicalExamples: [
      {
        title: 'The Rock in the Wilderness',
        passage: 'Exodus 17:6; 1 Corinthians 10:4',
        explanation: 'Paul writes: "they drank from the spiritual rock that accompanied them, and that rock was Christ."',
      },
      {
        title: 'The Melchizedek Priesthood',
        passage: 'Genesis 14:18; Hebrews 7:1–17',
        explanation: 'The author of Hebrews demonstrates that Christ’s eternal priesthood fulfills the ancient royal-priestly type of Melchizedek.',
      },
    ],
    relevantBibleReferences: ['Romans 5:14', '1 Corinthians 5:7', 'Colossians 2:16–17', 'Hebrews 9:24'],
    practicalApplication:
      'Look for the shadow-to-substance trajectory: see how Old Testament sacrifices, feasts, and offices find their true, ultimate fulfillment in Jesus.',
    relatedMethods: ['Christological Interpretation', 'Canonical Interpretation', 'Symbolic Interpretation'],
    sourceAttribution: 'Leonhard Goppelt, Typos & Richard B. Hays, Echoes of Scripture in the Gospels',
  },
  {
    id: 'method-symbolic',
    number: 8,
    name: 'Symbolic Interpretation',
    slug: 'symbolic',
    shortSummary: 'Deciphering biblical symbols, numbers, and colors according to canonical usage.',
    definition:
      'The identification and explanation of biblical symbols where a material object, action, color, or number represents a transcendent spiritual truth.',
    detailedExplanation:
      'Symbols are rich communication devices used extensively in prophetic, apocalyptic, and liturgical texts. Biblical symbols must be interpreted through the lens of consistent biblical usage rather than modern psychology or occult symbol dictionaries.',
    howItWorks: [
      'Determine whether the context indicates symbolic representation (e.g., visions, apocalyptic dreams).',
      'Search for how the Old Testament consistently uses the same symbol (e.g., horn = power; lampstand = witness).',
      'Check if the biblical author explicitly interprets the symbol within the text.',
      'Avoid pressing every incidental detail into an elaborate symbolic code.',
    ],
    biblicalExamples: [
      {
        title: 'Seven Golden Lampstands',
        passage: 'Revelation 1:12–20',
        explanation: 'Jesus Himself interprets the vision: "the seven lampstands are the seven churches."',
      },
      {
        title: 'The Horn of Salvation',
        passage: 'Psalms 18:2; Luke 1:69',
        explanation: 'In Hebrew symbolism, an animal’s horn represented strength, victory, and power; Zechariah celebrates Jesus as the mighty Horn of salvation.',
      },
    ],
    relevantBibleReferences: ['Zechariah 4:1–6', 'Daniel 7:15–28', 'Revelation 5:6'],
    practicalApplication:
      'Always look inside Scripture for the meaning of a biblical symbol before consulting outside sources.',
    relatedMethods: ['Figurative Interpretation', 'Typological Interpretation', 'Prophetic Interpretation'],
    sourceAttribution: 'G.K. Beale, The Book of Revelation & Leland Ryken, Dictionary of Biblical Imagery',
  },
  {
    id: 'method-figurative',
    number: 9,
    name: 'Figurative Interpretation',
    slug: 'figurative',
    shortSummary: 'Recognizing metaphors, similes, hyperboles, anthropomorphisms, and idioms.',
    definition:
      'Interpreting biblical language that uses figures of speech to convey vivid meaning beyond the literal definitions of the individual words.',
    detailedExplanation:
      'Biblical authors frequently used rich figurative devices: metaphors ("I am the door"), similes ("like a tree planted by streams"), hyperboles ("if your eye causes you to stumble, gouge it out"), and anthropomorphisms ("the hand of the Lord"). Interpreting these as strict physical mechanics results in absurd distortions.',
    howItWorks: [
      'Recognize when an expression cannot be physically or logically intended as literal.',
      'Identify the specific figure of speech being utilized.',
      'Determine the central point of comparison intended by the author.',
      'Do not carry the analogy beyond the scope intended by the speaker.',
    ],
    biblicalExamples: [
      {
        title: 'Jesus as the Vine',
        passage: 'John 15:1–5',
        explanation: 'Jesus uses agricultural metaphor to describe intimate, vital, life-sustaining spiritual union with his disciples.',
      },
      {
        title: 'Trees Clapping Their Hands',
        passage: 'Isaiah 55:12',
        explanation: 'Poetic personification celebrating the joy of cosmic renewal under God’s redemption.',
      },
    ],
    relevantBibleReferences: ['Psalms 23:1', 'Matthew 23:24', 'John 10:9'],
    practicalApplication:
      'When you encounter vivid word pictures, ask: "What single main truth is this imagery designed to impress upon my heart?"',
    relatedMethods: ['Literary Interpretation', 'Grammatical Interpretation', 'Symbolic Interpretation'],
    sourceAttribution: 'E.W. Bullinger, Figures of Speech Used in the Bible',
  },
  {
    id: 'method-prophetic',
    number: 10,
    name: 'Prophetic Interpretation',
    slug: 'prophetic',
    shortSummary: 'Understanding biblical prophecy, near and far horizons, and Messianic fulfillment.',
    definition:
      'The disciplined study of prophetic literature, accounting for the immediate historical horizon of the prophet, the prophetic perspective ("foreshortening"), and the ultimate fulfillment in Christ and the consummation.',
    detailedExplanation:
      'Prophecy in Scripture is both forth-telling (covenant proclamation to the prophet’s contemporaries) and fore-telling (predicting future redemptive events). Prophets often saw near events and far eschatological events together like mountain peaks seen in a single visual line.',
    howItWorks: [
      'Identify the immediate covenant context and moral challenge addressed by the prophet.',
      'Check for near-term historical fulfillment in Israel’s immediate future (e.g., Assyrian or Babylonian exile).',
      'Trace Messianic fulfillment in the first coming of Christ.',
      'Distinguish prophecies concerning Christ’s first advent from those concerning His second advent.',
    ],
    biblicalExamples: [
      {
        title: 'The Virgin Birth Prophecy',
        passage: 'Isaiah 7:14; Matthew 1:22–23',
        explanation: 'A sign to King Ahaz in the 8th century BC that found its ultimate, supernatural fulfillment in the virgin birth of Jesus.',
      },
      {
        title: 'The Pierced One in Jerusalem',
        passage: 'Zechariah 12:10; John 19:37; Revelation 1:7',
        explanation: 'Prophecy fulfilled initially at Calvary and ultimately when every eye beholds the returned Messiah.',
      },
    ],
    relevantBibleReferences: ['1 Peter 1:10–12', '2 Peter 1:19–21', 'Luke 24:25–27'],
    practicalApplication:
      'Do not tear prophecies out of their historical Old Testament soil; discover what God was saying to the prophet’s generation before examining its Messianic consummation.',
    relatedMethods: ['Typological Interpretation', 'Christological Interpretation', 'Historical Interpretation'],
    sourceAttribution: 'Walter C. Kaiser Jr., The Promise-Plan of God & J. Barton Payne, Encyclopedia of Biblical Prophecy',
  },
  {
    id: 'method-canonical',
    number: 11,
    name: 'Canonical Interpretation',
    slug: 'canonical',
    shortSummary: 'Reading every part of Scripture in context of the completed 66-book canon.',
    definition:
      'Interpreting individual passages in light of the unity, progression, and theological climax of the entire closed canon of Scripture (Genesis to Revelation).',
    detailedExplanation:
      'Scripture interprets Scripture (analogia Scripturae). Canonical interpretation reads earlier texts prospectively (moving forward toward Christ) and later texts retrospectively (looking back on how earlier promises are fulfilled in Christ).',
    howItWorks: [
      'Allow clearer passages of Scripture to interpret more obscure or difficult passages.',
      'Examine where a text fits in the unfolding progression of redemptive revelation.',
      'Harmonize teachings across different authors under the single divine author: the Holy Spirit.',
      'Interpret Old Testament types and shadows in light of New Testament apostolic reality.',
    ],
    biblicalExamples: [
      {
        title: 'The Seed of the Woman Crushing the Serpent',
        passage: 'Genesis 3:15; Romans 16:20; Revelation 12:9',
        explanation: 'The protoevangelium of Genesis 3 is progressively unfolded across the canon until the dragon is thrown into the lake of fire in Revelation.',
      },
      {
        title: 'Justification in Paul and James',
        passage: 'Romans 4:2–3; James 2:21–24',
        explanation:
          'Canonical harmony shows that Paul addresses the root of justification before God (faith alone), while James addresses the fruit of justification before humans (faith demonstrated by deeds).',
      },
    ],
    relevantBibleReferences: ['Luke 24:44', '2 Timothy 3:16', 'Acts 20:27'],
    practicalApplication:
      'When faced with a confusing verse, ask: "What does the rest of the Bible clearly teach on this topic?"',
    relatedMethods: ['Theological Interpretation', 'Comparative Interpretation', 'Christological Interpretation'],
    sourceAttribution: 'Brevard Childs, Biblical Theology in Crisis & Geerhardus Vos, Biblical Theology',
  },
  {
    id: 'method-christological',
    number: 12,
    name: 'Christological Interpretation',
    slug: 'christological',
    shortSummary: 'Seeing Christ as the climax, center, and interpretive key to all Scripture.',
    definition:
      'The hermeneutical conviction that the person, work, death, resurrection, and reign of Jesus Christ constitutes the unifying center and interpretive key to the entire Bible.',
    detailedExplanation:
      'Jesus Himself taught this method on the road to Emmaus: "And beginning with Moses and all the Prophets, he explained to them what was said in all the Scriptures concerning himself" (Luke 24:27). All the promises of God find their "Yes" in Christ (2 Corinthians 1:20).',
    howItWorks: [
      'Ask how every passage relates to Christ: by preparation, promise, shadow, contrast, or fulfillment.',
      'Avoid forced allegorizing, but trace genuine covenantal and redemptive paths leading to the Messiah.',
      'View Old Testament law as a tutor leading to Christ (Galatians 3:24).',
      'Understand the wisdom literature as reflecting the wisdom of God embodied in Christ.',
    ],
    biblicalExamples: [
      {
        title: 'Jesus Opening the Scriptures on the Emmaus Road',
        passage: 'Luke 24:25–27, 44–47',
        explanation: 'Jesus demonstrates that the Law, Prophets, and Psalms are fundamentally written concerning His suffering and glory.',
      },
      {
        title: 'The Law as a Schoolmaster',
        passage: 'Galatians 3:24–25',
        explanation: 'Paul reveals that the purpose of the Mosaic covenant was to convict of sin and escort sinners to faith in Christ.',
      },
    ],
    relevantBibleReferences: ['John 5:39', 'Luke 24:27', '2 Corinthians 1:20', 'Colossians 1:17'],
    practicalApplication:
      'After studying any passage, ask: "How does this point to humanity\'s need for Christ, the grace of Christ, or the glory of Christ?"',
    relatedMethods: ['Typological Interpretation', 'Canonical Interpretation', 'Theological Interpretation'],
    sourceAttribution: 'Graeme Goldsworthy, Preaching the Whole Bible as Christian Scripture & Edmund Clowney, The Unfolding Mystery',
  },
  {
    id: 'method-literary',
    number: 13,
    name: 'Literary Interpretation',
    slug: 'literary',
    shortSummary: 'Honoring the specific biblical genre: narrative, poetry, epistle, wisdom, or apocalypse.',
    definition:
      'Interpreting biblical texts in accordance with their distinct literary genre, structure, poetic devices, narrative plotlines, and rhetorical strategies.',
    detailedExplanation:
      'God chose to inspire Scripture through diverse literary forms: historical narrative, legal code, Hebrew poetry, wisdom proverbs, prophetic oracles, parables, epistles, and apocalyptic visions. Each genre has its own set of interpretive rules.',
    howItWorks: [
      'Identify the genre of the book and the specific passage.',
      'Apply genre-appropriate hermeneutical rules: do not read Hebrew parallelism like Western prose.',
      'In narrative, trace character development, conflict, climax, and narrator commentary.',
      'In epistles, trace logical argumentation and pastoral application.',
    ],
    biblicalExamples: [
      {
        title: 'Hebrew Parallelism in the Psalms',
        passage: 'Psalms 1:1–2; Psalms 19:1–2',
        explanation:
          'Understanding synonymous, antithetical, and synthetic parallelism reveals that Hebrew poetry pairs lines of thought rather than rhyming sounds.',
      },
      {
        title: 'Proverbs as General Principles, Not Unconditional Guarantees',
        passage: 'Proverbs 22:6',
        explanation:
          'A proverb by literary genre is a general observation about wise living in God’s world, not an absolute legal contract without exceptions.',
      },
    ],
    relevantBibleReferences: ['Psalms 119:105', 'Proverbs 1:1–7', 'Revelation 1:1–3'],
    practicalApplication:
      'Before interpreting a passage, ask: "What genre is this, and what are the rules for reading this kind of literature?"',
    relatedMethods: ['Grammatical Interpretation', 'Figurative Interpretation', 'Contextual Interpretation'],
    sourceAttribution: 'Robert Alter, The Art of Biblical Narrative & Leland Ryken, Words of Delight',
  },
  {
    id: 'method-cultural',
    number: 14,
    name: 'Cultural Interpretation',
    slug: 'cultural',
    shortSummary: 'Understanding Ancient Near Eastern and Greco-Roman social customs and traditions.',
    definition:
      'The process of exploring ancient social values, customs, honor-shame dynamics, patron-client relationships, and family structures to understand how original readers understood the text.',
    detailedExplanation:
      'The biblical world was deeply communal, agrarian, patriarchal, and driven by honor and shame. Anachronistically projecting modern Western individualistic assumptions onto the biblical world leads to severe misunderstandings.',
    howItWorks: [
      'Investigate ancient customs regarding hospitality, weddings, funerals, covenants, and inheritance.',
      'Understand honor-shame dynamics in social interactions (e.g., Jesus debating Pharisees).',
      'Distinguish between normative universal truths and cultural expressions of those truths.',
      'Consult ancient Near Eastern and Greco-Roman historical background resources.',
    ],
    biblicalExamples: [
      {
        title: 'The Father Running to the Prodigal Son',
        passage: 'Luke 15:20',
        explanation:
          'In ancient Middle Eastern culture, an aristocratic patriarch never ran, as lifting his robes was humiliating. The father’s sprint to embrace the wayward son displayed astonishing, shame-bearing love.',
      },
      {
        title: 'Shaking the Dust Off One\'s Feet',
        passage: 'Matthew 10:14',
        explanation:
          'A Jewish practice when returning from Gentile territory to signify separation from uncleanness, used by Jesus as a prophetic sign of judgment for rejecting the gospel.',
      },
    ],
    relevantBibleReferences: ['Genesis 24:1–9', 'Ruth 4:7', 'John 4:7–9'],
    practicalApplication:
      'When an action in the Bible seems strange or foreign, research the cultural background instead of dismissing it or modernizing it.',
    relatedMethods: ['Historical Interpretation', 'Contextual Interpretation', 'Comparative Interpretation'],
    sourceAttribution: 'Kenneth E. Bailey, Jesus Through Middle Eastern Eyes & David deSilva, Honor, Patronage, Kinship and Purity',
  },
  {
    id: 'method-comparative',
    number: 15,
    name: 'Comparative Interpretation',
    slug: 'comparative',
    shortSummary: 'Comparing parallel passages, synoptic accounts, and Old Testament quotations.',
    definition:
      'The method of analyzing parallel biblical accounts of the same event, comparison of Synoptic Gospel passages, and contrasting Old Testament texts with their New Testament citations.',
    detailedExplanation:
      'The Holy Spirit provided four distinct Gospels, parallel accounts in Samuel/Kings and Chronicles, and hundreds of Old Testament citations in the Epistles. Comparing these accounts highlights the unique pastoral and theological emphasis of each inspired author.',
    howItWorks: [
      'Place parallel passages side by side (e.g., Matthew 14, Mark 6, Luke 9, John 6).',
      'Note what details are included, omitted, or highlighted by each author.',
      'Discover each writer’s specific pastoral purpose for their audience.',
      'Compare how New Testament writers adapt the Septuagint and Hebrew texts.',
    ],
    biblicalExamples: [
      {
        title: 'The Beatitudes in Matthew and Luke',
        passage: 'Matthew 5:3; Luke 6:20',
        explanation:
          'Matthew highlights the spiritual dimension ("poor in spirit"), while Luke emphasizes the social-economic reality ("blessed are you who are poor") alongside prophetic woes.',
      },
      {
        title: 'The Census of David in Samuel and Chronicles',
        passage: '2 Samuel 24:1; 1 Chronicles 21:1',
        explanation:
          'Samuel records God’s sovereign overarching purpose ("the anger of the LORD burned against Israel"), while Chronicles notes the immediate demonic agent ("Satan rose up against Israel"). Both give complementary angles on divine sovereignty and spiritual warfare.',
      },
    ],
    relevantBibleReferences: ['Proverbs 27:17', 'Acts 9 / Acts 22 / Acts 26', 'Matthew 26 / Mark 14 / Luke 22'],
    practicalApplication:
      'When studying the Gospels, compare all four accounts to appreciate the distinct theological portrait painted by each evangelist.',
    relatedMethods: ['Contextual Interpretation', 'Canonical Interpretation', 'Literary Interpretation'],
    sourceAttribution: 'Kurt Aland, Synopsis of the Four Gospels & Robert L. Thomas, A Harmony of the Gospels',
  },
];

// ============================================================================
// SECTION 7: ESSENTIAL BIBLE STUDY CONCEPTS
// ============================================================================
export const ESSENTIAL_CONCEPTS: EssentialConcept[] = [
  {
    id: 'concept-hermeneutics',
    name: 'Hermeneutics',
    greekOrHebrewOrigin: 'From Greek ἑρμηνεύω (hermēneuō, to explain, interpret, translate); related to Hermes, the Greek messenger god.',
    definition:
      'The theory, science, and art of biblical interpretation. It establishes the principles, rules, and methods by which the meaning of Scripture is discovered and applied.',
    importance:
      'Without sound hermeneutics, Scripture becomes a mirror reflecting the reader’s personal prejudices and cultural biases rather than the objective truth of God’s Word.',
    howItWorks:
      'Hermeneutics operates as both a science (with established grammatical, historical, and literary rules) and an art (requiring spiritual discernment, humility, and contextual skill). It guides the transition from "What did the text mean to the original audience?" to "What does the text mean for us today?"',
    scriptureReferences: ['Nehemiah 8:8', 'Luke 24:27', '2 Timothy 2:15'],
    sourceAttribution: 'Louis Berkhof, Principles of Biblical Interpretation & Grant Osborne, The Hermeneutical Spiral',
  },
  {
    id: 'concept-exegesis',
    name: 'Exegesis',
    greekOrHebrewOrigin: 'From Greek ἐξηγέομαι (exēgeomai, from ek = out of + hēgeomai = to lead); literally "to lead out, draw out, explain".',
    definition:
      'The careful, objective, systematic analysis of a passage to draw out the author’s intended original meaning, rather than injecting the reader’s foreign ideas.',
    importance:
      'Exegesis is the foundation of all authentic theology and preaching. It honors God by listening to what He actually said in His historical revelation.',
    howItWorks:
      'Combines historical research, grammatical analysis, literary context, and original word meanings to discover the author’s meaning in its native setting.',
    practicalDemonstration: {
      passage: 'John 3:5 — "Unless one is born of water and the Spirit, he cannot enter the kingdom of God."',
      stepByStep: [
        'Historical Setting: Jesus is speaking at night to Nicodemus, a ruler of the Jews, teacher of Israel, and member of the Sanhedrin steeped in the Hebrew Scriptures.',
        'Literary Context: Follows John 3:3 where Jesus introduces being born from above (anōthen); Nicodemus stumbles over physical rebirth. Jesus rebukes him in verse 10: "You are Israel’s teacher, and do you not understand these things?"',
        'Old Testament Echoes: As Israel’s teacher, Nicodemus was expected to know Ezekiel 36:25–27: "I will sprinkle clean water on you, and you will be clean... And I will put my Spirit in you and move you to follow my decrees."',
        'Grammatical Analysis: In the Greek phrase "ex hydatos kai pneumatos" (of water and spirit), a single preposition "ex" governs both nouns without definite articles, pointing to a unified concept: water-cleansing combined with Spirit-regeneration.',
        'Conclusion: Jesus is not speaking of natural amniotic fluid or merely Christian water baptism, but the eschatological renewal promised by the prophets where God cleanses from defilement (water) and grants a new divine heart (Spirit).',
      ],
    },
    scriptureReferences: ['Nehemiah 8:8', 'John 1:18', '2 Timothy 2:15'],
    sourceAttribution: 'Gordon Fee, New Testament Exegesis & Douglas Stuart, Old Testament Exegesis',
  },
  {
    id: 'concept-eisegesis',
    name: 'Eisegesis',
    greekOrHebrewOrigin: 'From Greek εἰς (eis = into) + hēgeomai (to lead); literally "to lead into, read into".',
    definition:
      'The faulty practice of reading one’s personal presuppositions, modern cultural agendas, biases, or wishful thinking INTO the biblical text, forcing the text to say what the reader wants.',
    importance:
      'Eisegesis produces false doctrines, spiritual abuse, and self-serving interpretations. It elevates human opinion above the authority of God’s Word.',
    howItWorks:
      'Occurs when readers isolate verses out of context, ignore grammar and history, use allegorization to bypass hard truths, or assume modern psychological concepts were held by ancient biblical authors.',
    keySubtopics: [
      {
        title: 'Common Mistake 1: Proof-Texting',
        description: 'Pulling a verse out of its chapter to support an idea never intended by the author.',
        references: ['Philippians 4:13', 'Jeremiah 29:11'],
      },
      {
        title: 'Common Mistake 2: Anachronism',
        description: 'Projecting 21st-century Western political, cultural, or scientific frameworks back onto ancient Hebrew narratives.',
        references: ['Genesis 1:1', '1 Corinthians 11:2–16'],
      },
    ],
    scriptureReferences: ['2 Peter 3:16', 'Jeremiah 23:16', 'Proverbs 30:5–6'],
    sourceAttribution: 'D.A. Carson, Exegetical Fallacies & James Sire, Scripture Twisting',
  },
  {
    id: 'concept-cross-referencing',
    name: 'Cross-Referencing',
    definition:
      'Comparing related scripture passages across the Bible to clarify meaning, trace recurring biblical themes, and observe divine fulfillment.',
    importance:
      'Because Scripture is inspired by one Holy Spirit, the Bible is its own best interpreter. Cross-referencing prevents narrow, one-sided interpretations.',
    howItWorks:
      'Identifies direct quotations, prophetic fulfillments, parallel historical accounts, verbal allusions, and overarching theological themes connecting the Old and New Testaments.',
    practicalDemonstration: {
      passage: 'Connecting John 3:5 with Ezekiel 36:25–27',
      stepByStep: [
        'Identify Key Terms: "Water" and "Spirit" appearing together in connection with entering God’s kingdom.',
        'Locate Prophetic Precedent: Ezekiel 36:25–27 prophesied the New Covenant: "I will sprinkle clean water upon you, and you shall be clean... A new heart also will I give you, and a new spirit will I put within you."',
        'Observe Apostolic Parallel: Titus 3:5 describes salvation as "the washing of rebirth and renewal by the Holy Spirit."',
        'Synthesize Meaning: Cross-referencing proves that Jesus’ words in John 3:5 are anchored in the prophetic promises of covenant renewal.',
      ],
    },
    scriptureReferences: ['1 Corinthians 2:13', 'Acts 17:11', 'Isaiah 28:10'],
    sourceAttribution: 'R.A. Torrey, Treasury of Scripture Knowledge & Martin Luther on Analogia Scripturae',
  },
  {
    id: 'concept-biblical-theology',
    name: 'Biblical Theology',
    definition:
      'The discipline that studies how God’s revelation unfolds historically through the narrative timeline of Scripture, tracing overarching themes from Genesis to Revelation.',
    importance:
      'Keeps Bible study anchored in the progressive storyline of redemptive history rather than treating the Bible like an encyclopedia of timeless fragments.',
    howItWorks:
      'Traces divine themes through distinct historical epochs: Creation, Fall, Redemption, and New Creation.',
    keySubtopics: [
      {
        title: 'Kingdom of God',
        description: 'God’s sovereign rule over creation, rejected in the Fall, prefigured in Israel, inaugurated by Jesus, and consummated in the New Jerusalem.',
        references: ['Exodus 19:6', 'Mark 1:15', 'Revelation 11:15'],
      },
      {
        title: 'Covenant',
        description: 'The organic architecture of God’s relationship with humanity: Noahic, Abrahamic, Mosaic, Davidic, and New Covenant in Christ.',
        references: ['Genesis 12:1–3', 'Exodus 24:8', 'Jeremiah 31:31', 'Luke 22:20'],
      },
      {
        title: 'Messiah',
        description: 'The promised seed of the woman who crushes the serpent, the seed of Abraham, the Son of David, the Suffering Servant, and exalted Lord.',
        references: ['Genesis 3:15', 'Isaiah 53:5', 'Matthew 16:16'],
      },
    ],
    scriptureReferences: ['Hebrews 1:1–2', 'Luke 24:27', 'Ephesians 1:9–10'],
    sourceAttribution: 'Geerhardus Vos, Biblical Theology: Old and New Testaments & T.D. Alexander, From Eden to the New Jerusalem',
  },
  {
    id: 'concept-systematic-theology',
    name: 'Systematic Theology',
    definition:
      'The organization of the entire teaching of Scripture on specific doctrinal topics into a coherent, comprehensive, and logically structured system.',
    importance:
      'Answers the question: "What does the whole Bible teach us today regarding any given topic?" Provides guardrails against error and strengthens Christian discipleship.',
    howItWorks:
      'Gathers all biblical passages addressing a doctrine, evaluates their meaning in context, synthesizes them into comprehensive statements, and defends them against heresy.',
    keySubtopics: [
      {
        title: 'Theology Proper',
        description: 'The doctrine of God: His triune nature (Father, Son, Holy Spirit), attributes, sovereignty, and eternal decrees.',
        references: ['Deuteronomy 6:4', 'Matthew 28:19', '1 Timothy 1:17'],
      },
      {
        title: 'Christology',
        description: 'The person and work of Jesus Christ: His eternal deity, true humanity, hypostatic union, sinless life, atoning death, and resurrection.',
        references: ['John 1:1', 'Colossians 1:15–20', 'Philippians 2:5–11'],
      },
      {
        title: 'Pneumatology',
        description: 'The doctrine of the Holy Spirit: His personhood, deity, work in creation, inspiration of Scripture, regeneration, and sanctification.',
        references: ['John 14:16–17', 'Romans 8:9–11', 'Galatians 5:22–23'],
      },
      {
        title: 'Soteriology',
        description: 'The doctrine of salvation: election, calling, regeneration, justification by faith, adoption, sanctification, perseverance, and glorification.',
        references: ['Romans 8:29–30', 'Ephesians 2:8–10', 'Romans 3:21–26'],
      },
      {
        title: 'Hamartiology',
        description: 'The doctrine of sin: the origin of evil, the Fall, original sin, total depravity, guilt, and the devastating consequences of transgression.',
        references: ['Genesis 3', 'Romans 3:9–20', 'Romans 5:12'],
      },
      {
        title: 'Ecclesiology',
        description: 'The doctrine of the Church: its nature, ordinances (baptism and Lord’s supper), leadership, mission, and worship.',
        references: ['Matthew 16:18', 'Ephesians 4:11–16', '1 Timothy 3:1–13'],
      },
      {
        title: 'Eschatology',
        description: 'The doctrine of the last things: Christ’s return, the resurrection of the dead, final judgment, hell, and the new heavens and earth.',
        references: ['1 Thessalonians 4:13–18', 'Revelation 20–22', '1 Corinthians 15'],
      },
    ],
    scriptureReferences: ['2 Timothy 1:13', 'Titus 1:9', 'Acts 20:27'],
    sourceAttribution: 'Wayne Grudem, Systematic Theology & Louis Berkhof, Systematic Theology',
  },
];

// ============================================================================
// SECTION 8: 8 INTERPRETATION PRINCIPLES
// ============================================================================
export const INTERPRETATION_PRINCIPLES: InterpretationPrinciple[] = [
  {
    number: 1,
    name: 'Literal Principle',
    role: 'Establishes the primary, normal meaning of words and phrases.',
    explanation:
      'We interpret the text in its natural, plain sense according to the normal rules of communication, respecting figures of speech, parables, and poetic imagery.',
    complementaryAspect: 'Provides the objective textual anchor that prevents wild allegorical fantasy.',
  },
  {
    number: 2,
    name: 'Historical Principle',
    role: 'Anchors the text in the original time, author, audience, and culture.',
    explanation:
      'We discover what the passage meant to the original recipients in their ancient Near Eastern or Greco-Roman world before attempting contemporary application.',
    complementaryAspect: 'Guards against modern anachronism and cultural distortion.',
  },
  {
    number: 3,
    name: 'Grammatical Principle',
    role: 'Analyzes sentence structure, syntax, and original language nuances.',
    explanation:
      'We examine verb forms, prepositions, conjunctions, and syntactical clauses in Hebrew, Aramaic, and Greek to follow the author’s exact train of thought.',
    complementaryAspect: 'Reveals the structural logic that holds the author’s argument together.',
  },
  {
    number: 4,
    name: 'Contextual Principle',
    role: 'Examines the immediate paragraph, chapter, and whole book.',
    explanation:
      'No verse may be read in isolation. Every sentence draws its life from the preceding argument and contributes to the surrounding chapter.',
    complementaryAspect: 'Prevents prooftexting and protects the flow of biblical thought.',
  },
  {
    number: 5,
    name: 'Theological Principle',
    role: 'Understands passages in harmony with the character of God and the analogy of faith.',
    explanation:
      'Because all Scripture is breathed out by the one true God, the Bible does not contradict itself. Clearer passages guide our understanding of difficult passages.',
    complementaryAspect: 'Maintains doctrinal consistency across the diverse books of the canon.',
  },
  {
    number: 6,
    name: 'Typological Principle',
    role: 'Traces divine patterns and Old Testament shadows fulfilled in Christ.',
    explanation:
      'We recognize that God sovereignly patterned Israel’s history, sacrifices, offices, and ceremonies to point forward to Jesus Christ and the New Covenant.',
    complementaryAspect: 'Connects the two testaments into a unified historical tapestry.',
  },
  {
    number: 7,
    name: 'Comparative Principle',
    role: 'Compares parallel accounts, synoptic gospels, and cross-references.',
    explanation:
      'We compare parallel historical recordings and cross-references to observe complementary perspectives and emphasize the unique message of each inspired author.',
    complementaryAspect: 'Enriches our depth of understanding through multiple inspired witnesses.',
  },
  {
    number: 8,
    name: 'Literary Principle',
    role: 'Honors the specific genre: poetry, narrative, epistle, prophecy, or apocalypse.',
    explanation:
      'We read poetry as poetry, law as law, narrative as narrative, and apocalyptic as apocalyptic, using the rules appropriate to each literary art form.',
    complementaryAspect: 'Ensures we evaluate the text using the literary criteria intended by the author.',
  },
];

