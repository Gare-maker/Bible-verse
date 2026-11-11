import { ContextualInterpretationData } from '@/types/bible';

/**
 * Authoritative Contextual Scripture Interpretations
 * Grounded in peer-reviewed historical, lexical, and theological sources:
 * D.A. Carson (Pillar New Testament Commentary: The Gospel According to John),
 * Leon Morris (NICNT: The Gospel According to John),
 * F.F. Bruce (New Testament History),
 * Raymond E. Brown (Anchor Bible),
 * Craig S. Keener (The IVP Bible Background Commentary).
 */
export const SCRIPTURE_INTERPRETATIONS: Record<string, ContextualInterpretationData> = {
  // 1. JOHN 3:5 (PRIMARY DEMO PASSAGE REQUIRED BY PROMPT)
  'John 3:5': {
    canonicalRef: 'John 3:5',
    chapterScope: 'John 3:1–10',
    availableTags: [
      'Historical Context',
      'Contextual Explanation',
      'Theological Interpretation',
      'Original Words',
      'Cross References',
      'Literary and Cultural',
      'Typology and Symbolism',
    ],
    historicalContext: {
      author: 'John the Apostle, son of Zebedee, the beloved disciple and eyewitness of Jesus Christ.',
      originalAudience:
        'A diverse community of Jewish and Gentile believers in the Greco-Roman world (likely Ephesus, late 1st century AD), facing growing tensions with the synagogue and seeking theological grounding in Christ’s true identity.',
      dateWritten: 'Circa AD 80–95.',
      historicalCircumstances:
        'First-century Judea was under Roman military occupation while domestic religious and legal affairs were overseen by the Sanhedrin—the 71-member high council of chief priests, elders, and Pharisees in Jerusalem.',
      politicalReligiousSocialConditions:
        'Nicodemus was not merely a private seeker; he was an influential member of the Sanhedrin ("a ruler of the Jews") and designated by Jesus as "the teacher of Israel" (ho didaskalos tou Israēl, John 3:10). His arrival at night reflects prudent discretion among the ruling elite who were suspicious of Jesus’ unauthorized cleansing of the temple in John 2:13–22.',
      historicalEventsExplanation:
        'Following Jesus’ disruptive actions at Passover and the signs He performed in Jerusalem (John 2:23), Nicodemus came as an aristocratic representative of religious academia seeking to understand Jesus’ credentials.',
      sourceAttribution:
        'D.A. Carson, The Gospel According to John (Pillar Commentary, pp. 185–191) & Craig S. Keener, The IVP Bible Background Commentary: New Testament (pp. 263–264).',
    },
    contextualExplanation: {
      beforePassage:
        'In John 2:23–25, Jesus refuses to entrust Himself to crowds with superficial sign-faith. John 3:1 immediately introduces Nicodemus as a specific individual testing this reality. In verse 3, Jesus abruptly tells him that no one can see the kingdom of God unless born from above (anōthen). Nicodemus objects with physical confusion ("Can one enter a second time into his mother\'s womb?").',
      afterPassage:
        'In John 3:6–10, Jesus contrasts flesh giving birth to flesh with Spirit giving birth to spirit, uses the sovereign analogy of the wind (pneuma), and gently rebukes Nicodemus for failing to grasp these truths despite being Israel’s master teacher.',
      mainSubject:
        'The absolute, indispensable necessity of supernatural, spiritual regeneration initiated by God for entrance into the Kingdom of God.',
      authorsIntendedMessage:
        'Natural pedigree, moral virtue, Abrahamic lineage, and Pharisaic legal observance are completely powerless to qualify anyone for God’s kingdom. Only a divine recreation by the Holy Spirit can grant eternal life.',
      chapterAndBookFit:
        'Fits John’s overarching prologue theme: those who believe are born "not of natural descent, nor of human decision or a husband’s will, but born of God" (John 1:13).',
      sourceAttribution:
        'Leon Morris, The Gospel According to John (NICNT, pp. 210–220) & Raymond E. Brown, The Gospel According to John (Anchor Bible, Vol. 1, pp. 138–144).',
    },
    theologicalInterpretation: {
      coreTheologicalThemes: [
        'Regeneration (New Birth)',
        'The Holy Spirit as the Agent of Divine Life',
        'Covenant Cleansing and Moral Renewal',
        'The Kingdom of God',
        'Human Inability and Sovereign Grace',
      ],
      explanation:
        'Jesus uses the single Greek preposition "ex" governing both nouns ("ex hydatos kai pneumatos" — of water and spirit) to express a single, unified spiritual reality: inward moral cleansing from defilement coupled with the sovereign impartation of new spiritual life by the Holy Spirit.',
      traditionsAndPerspectives: [
        {
          tradition: 'Patristic, Catholic, and Anglican Perspective',
          perspective:
            'Many historic church fathers and sacramental theologians connect "water" directly to the sacrament of Christian baptism as the outward instrument through which the Holy Spirit conveys regenerating grace, citing Titus 3:5 and 1 Peter 3:21.',
        },
        {
          tradition: 'Reformed and Evangelical Prophetic-Renewal Perspective',
          perspective:
            'Scholars like D.A. Carson, Leon Morris, and J.C. Ryle argue that Jesus was rebuking Nicodemus for not knowing his Old Testament (Ezekiel 36:25–27). In this view, "water and spirit" does not refer to Christian baptism (which was not yet instituted as a church ordinance), but to the prophetic promise where "water" symbolizes cleansing from sin and "Spirit" symbolizes internal heart transformation.',
        },
        {
          tradition: 'John the Baptist Purificatory Context Perspective',
          perspective:
            'Some scholars view "water" as John’s water baptism of repentance (prominent in John 1:26–33 and 3:22–26), meaning one must accept John’s baptism of public repentance AND receive the Messiah’s baptism of the Holy Spirit.',
        },
      ],
      disputedInterpretationsNote:
        'Scholars agree that physical amniotic fluid (natural birth) is an unlikely interpretation, since "born of water and spirit" forms a single syntactical unit contrasting the old order with the new.',
      sourceAttribution:
        'D.A. Carson, Exegetical Fallacies & Herman Bavinck, Reformed Dogmatics (Vol. 4: Holy Spirit and the Church).',
    },
    originalLanguageWords: [
      {
        englishWord: 'Water',
        originalSpelling: 'ὕδωρ',
        language: 'Greek',
        transliteration: 'Hydōr',
        strongsNumber: 'G5204',
        partOfSpeech: 'Noun, Neuter (Genitive Singular: ὕδατος, hydatos)',
        meaning: 'Water; in prophetic typology, the vehicle of ceremonial cleansing and spiritual washing.',
        contextualUsage:
          'Governed by the preposition ex (out of, from), pointing to the essential source and cleansing quality of the new birth.',
        lexiconEntryId: 'G5204-hydor',
      },
      {
        englishWord: 'Spirit',
        originalSpelling: 'πνεῦμα',
        language: 'Greek',
        transliteration: 'Pneuma',
        strongsNumber: 'G4151',
        partOfSpeech: 'Noun, Neuter (Genitive Singular: πνεύματος, pneumatos)',
        meaning: 'Spirit, breath, wind; specifically the Holy Spirit of God.',
        contextualUsage:
          'Paired with hydōr without a second preposition, emphasizing the divine, non-human agency that performs regeneration.',
        lexiconEntryId: 'G4151-pneuma',
      },
      {
        englishWord: 'Born Again / From Above',
        originalSpelling: 'ἄνωθεν',
        language: 'Greek',
        transliteration: 'Anōthen',
        strongsNumber: 'G509',
        partOfSpeech: 'Adverb',
        meaning: 'From above (heavenly origin) and anew (second time).',
        contextualUsage:
          'From verse 3 and 7: the intentional Johannine wordplay between heavenly divine birth and starting over anew.',
        lexiconEntryId: 'G509-anothen',
      },
    ],
    crossReferences: [
      {
        ref: 'Ezekiel 36:25–27',
        category: 'Theological connection',
        relevanceExplanation:
          'The primary Old Testament background for Jesus’ words to Nicodemus: "I will sprinkle clean water on you, and you will be clean... And I will put my Spirit in you and move you to follow my decrees."',
      },
      {
        ref: 'Titus 3:5',
        category: 'Theological connection',
        relevanceExplanation:
          'Paul’s apostolic definition of salvation through "the washing of rebirth and renewal by the Holy Spirit", echoing John 3:5.',
      },
      {
        ref: 'John 1:12–13',
        category: 'Thematic connection',
        relevanceExplanation:
          'The prologue states that children of God are born "not of natural descent, nor of human decision, but born of God."',
      },
      {
        ref: 'Romans 8:9–11',
        category: 'Theological connection',
        relevanceExplanation:
          'Affirms that anyone who does not have the Spirit of Christ does not belong to Him, confirming that the Spirit is the vital prerequisite for life in God’s kingdom.',
      },
    ],
    literaryAndCulturalContext: {
      genre: 'Gospel Narrative with Dialogical Discourse.',
      figuresOfSpeechAndIdioms:
        'Employs Johannine irony and misunderstanding: Nicodemus takes Jesus’ figurative and spiritual metaphor of rebirth in a wooden physical sense, allowing Jesus to clarify divine truth.',
      jewishCustomsAndTraditions:
        'Pharisees practiced scrupulous daily ritual washings for ritual purity (mikveh); Jesus shows that external washings cannot reach the human heart—only God’s Spirit can impart life.',
      socialStructures:
        'Nicodemus occupies the pinnacle of Jerusalem’s socio-religious hierarchy; his need for the new birth demonstrates that high religious status confers zero entitlement to the kingdom of God.',
      sourceAttribution:
        'Craig S. Keener, The Gospel of John: A Commentary (Vol. 1, pp. 533–558).',
    },
    typologyAndSymbolism: {
      typesAndShadowsIdentified:
        'The creation motif of Genesis 1:2 (where the Spirit hovered over the waters to bring forth life) and the Red Sea crossing (where Israel passed through water into covenant life) prefigure the water and Spirit of new creation.',
      propheticConnections:
        'Points back to Ezekiel 37 (the valley of dry bones brought to life by the breath/Spirit of God) and Joel 2:28 (the pouring out of the Spirit on all flesh).',
      supportingReferences: ['Genesis 1:2', 'Ezekiel 37:9–14', 'Joel 2:28', '1 Corinthians 10:2'],
      sourceAttribution:
        'Richard B. Hays, Echoes of Scripture in the Gospels & G.K. Beale, A New Testament Biblical Theology.',
    },
  },

  // 2. MATTHEW 1:23
  'Matthew 1:23': {
    canonicalRef: 'Matthew 1:23',
    chapterScope: 'Matthew 1:18–25',
    availableTags: [
      'Historical Context',
      'Contextual Explanation',
      'Theological Interpretation',
      'Original Words',
      'Cross References',
      'Typology and Symbolism',
    ],
    historicalContext: {
      author: 'Matthew the Apostle (Levi the tax collector), writing to a Jewish-Christian audience.',
      originalAudience: 'Jewish Christians seeking confirmation that Jesus of Nazareth is the promised Messianic King of Israel.',
      dateWritten: 'Circa AD 60–70.',
      historicalCircumstances: 'Written under Roman rule in Judea/Syria, where Jewish identity centered on the promises made to Abraham and David.',
      politicalReligiousSocialConditions: 'Joseph was an observant, righteous Jewish craftsman (tekton) betrothed to Mary in a legally binding Jewish marriage contract.',
      historicalEventsExplanation: 'The angelic message reassures Joseph in a dream to take Mary as his wife despite her scandalous pregnancy by the Holy Spirit.',
      sourceAttribution: 'D.A. Carson, Matthew (Expositor\'s Bible Commentary) & R.T. France, The Gospel of Matthew (NICNT).',
    },
    contextualExplanation: {
      beforePassage: 'Matthew 1:1–17 established Jesus’ legal royal genealogy from Abraham and David through Joseph.',
      afterPassage: 'Joseph obediently wakes, marries Mary, preserves her virginity until she gives birth, and names the child Jesus.',
      mainSubject: 'The virgin birth of Jesus as the direct fulfillment of Isaiah’s Messianic prophecy of Immanuel.',
      authorsIntendedMessage: 'Jesus is not an ordinary human teacher; He is literally God with us, conceived by the Holy Spirit.',
      chapterAndBookFit: 'Acts as the foundation of Matthew’s Gospel: bookends with Matthew 28:20 ("I am with you always").',
      sourceAttribution: 'R.T. France, The Gospel of Matthew (NICNT, pp. 56–59).',
    },
    theologicalInterpretation: {
      coreTheologicalThemes: ['Incarnation', 'Virgin Conception', 'Deity of Christ', 'Prophetic Fulfillment'],
      explanation: 'Jesus’ name Immanuel (God with us) is an ontological statement: in Jesus, the infinite God has tabernacled in human flesh to save his people from their sins.',
      traditionsAndPerspectives: [
        {
          tradition: 'Historic Orthodox/Nicene Consensus',
          perspective: 'Unanimous confession of the Virgin Conception and the Hypostatic Union: Jesus is fully God and fully man in one person.',
        },
      ],
      sourceAttribution: 'Athanasius, On the Incarnation & Council of Chalcedon (AD 451).',
    },
    originalLanguageWords: [
      {
        englishWord: 'Virgin',
        originalSpelling: 'παρθένος',
        language: 'Greek',
        transliteration: 'Parthenos',
        strongsNumber: 'G3933',
        partOfSpeech: 'Noun, Feminine',
        meaning: 'A virgin; a woman who has never had sexual intercourse.',
        contextualUsage: 'Matthew quotes the Septuagint translation of Isaiah 7:14, affirming the biological virginity of Mary.',
      },
      {
        englishWord: 'Immanuel',
        originalSpelling: 'Ἐμμανουήλ',
        language: 'Greek',
        transliteration: 'Emmanouēl',
        strongsNumber: 'G1694',
        partOfSpeech: 'Proper Noun',
        meaning: 'God with us (from Hebrew Immanu-El: immanu = with us, El = God).',
        contextualUsage: 'The divine title revealing Jesus’ identity as the personal presence of God among his people.',
      },
    ],
    crossReferences: [
      {
        ref: 'Isaiah 7:14',
        category: 'Prophecy fulfilment',
        relevanceExplanation: 'The original 8th-century BC prophetic sign delivered to King Ahaz fulfilled in Mary and Jesus.',
      },
      {
        ref: 'John 1:14',
        category: 'Parallel passage',
        relevanceExplanation: 'John’s theological equivalent: "The Word became flesh and made his dwelling among us."',
      },
      {
        ref: 'Matthew 28:20',
        category: 'Thematic connection',
        relevanceExplanation: 'Matthew bookends his Gospel with Jesus declaring: "And surely I am with you always, to the very end of the age."',
      },
    ],
  },

  // 3. ROMANS 5:12
  'Romans 5:12': {
    canonicalRef: 'Romans 5:12',
    chapterScope: 'Romans 5:12–21',
    availableTags: [
      'Historical Context',
      'Contextual Explanation',
      'Theological Interpretation',
      'Original Words',
      'Cross References',
      'Typology and Symbolism',
    ],
    historicalContext: {
      author: 'Paul the Apostle, writing from Corinth to the church in Rome.',
      originalAudience: 'The mixed Jewish and Gentile Christian community in the imperial capital.',
      dateWritten: 'Circa AD 57.',
      historicalCircumstances: 'Jewish believers expelled under Claudius (AD 49) had returned to Rome, creating social friction between Jewish and Gentile factions.',
      politicalReligiousSocialConditions: 'Paul writes to unite the church around the shared reality of human condemnation under Adam and shared redemption in Christ.',
      historicalEventsExplanation: 'Prepares the Roman church for Paul’s anticipated mission to Spain and deepens their grasp of the gospel.',
      sourceAttribution: 'Douglas Moo, The Epistle to the Romans (NICNT) & Thomas Schreiner, Romans (Baker Exegetical).',
    },
    contextualExplanation: {
      beforePassage: 'Romans 5:1–11 celebrates the peace, joy, and reconciliation believers have with God through Jesus’ death.',
      afterPassage: 'Romans 5:13–21 draws the monumental contrast between Adam’s one trespass leading to condemnation and Christ’s one righteous act leading to justification.',
      mainSubject: 'The federal headship of Adam and the cosmic entry of sin and death into the world.',
      authorsIntendedMessage: 'Just as sin entered through one man (Adam), so God’s superabounding grace enters through the One Man (Jesus Christ).',
      chapterAndBookFit: 'Forms the theological climax of Paul’s doctrine of justification by faith.',
      sourceAttribution: 'Douglas Moo, The Epistle to the Romans (NICNT, pp. 314–330).',
    },
    theologicalInterpretation: {
      coreTheologicalThemes: ['Original Sin', 'Federal Headship', 'Death as the Penalty for Sin', 'Superabounding Grace'],
      explanation: 'Adam represented the entire human race in Eden. When he fell, his sin imputed guilt and inherited corruption to all descendants; Christ represents the new redeemed humanity.',
      traditionsAndPerspectives: [
        {
          tradition: 'Reformed / Augustinian Federalism',
          perspective: 'Adam acted as the covenant head (federal head) of the human race; his guilt and corruption are legally imputed and biologically transmitted.',
        },
        {
          tradition: 'Eastern Orthodox Perspective',
          perspective: 'Emphasizes that humanity inherits mortality and corruption from Adam, but personal guilt is incurred by individual transgression.',
        },
      ],
      sourceAttribution: 'Augustine of Hippo, On Nature and Grace & John Murray, The Imputation of Adam’s Sin.',
    },
    originalLanguageWords: [
      {
        englishWord: 'Sin',
        originalSpelling: 'ἁμαρτία',
        language: 'Greek',
        transliteration: 'Hamartia',
        strongsNumber: 'G266',
        partOfSpeech: 'Noun, Feminine',
        meaning: 'Missing the mark; rebellion against God; personified alien power ruling over humanity.',
        contextualUsage: 'Paul personifies Hamartia as a tyrant king entering the world stage and enslaving human beings.',
      },
      {
        englishWord: 'Death',
        originalSpelling: 'θάνατος',
        language: 'Greek',
        transliteration: 'Thanatos',
        strongsNumber: 'G2288',
        partOfSpeech: 'Noun, Masculine',
        meaning: 'Physical, spiritual, and eternal death; separation from God.',
        contextualUsage: 'The wages and consequence of sin, reigning over all who are in Adam.',
      },
    ],
    crossReferences: [
      {
        ref: 'Genesis 3:19',
        category: 'Theological connection',
        relevanceExplanation: 'The original penalty pronounced on Adam: "for dust you are and to dust you will return."',
      },
      {
        ref: '1 Corinthians 15:21–22',
        category: 'Parallel passage',
        relevanceExplanation: 'Paul’s parallel summary: "For as in Adam all die, so in Christ all will be made alive."',
      },
      {
        ref: 'Romans 6:23',
        category: 'Thematic connection',
        relevanceExplanation: 'Summarizes: "For the wages of sin is death, but the gift of God is eternal life in Christ Jesus our Lord."',
      },
    ],
  },

  // 4. ACTS 2:38
  'Acts 2:38': {
    canonicalRef: 'Acts 2:38',
    chapterScope: 'Acts 2:14–41',
    availableTags: [
      'Historical Context',
      'Contextual Explanation',
      'Theological Interpretation',
      'Original Words',
      'Cross References',
      'Literary and Cultural',
    ],
    historicalContext: {
      author: 'Luke the physician, companion of Paul and historian.',
      originalAudience: 'Theophilus and second-generation believers across the Roman empire.',
      dateWritten: 'Circa AD 62–64.',
      historicalCircumstances: 'The Feast of Pentecost (Shavuot) in Jerusalem, 50 days after Passover, with tens of thousands of diaspora pilgrims gathered from across the Mediterranean.',
      politicalReligiousSocialConditions: 'The Holy Spirit fell with the sound of a rushing wind and tongues of fire; Peter stood up with the Eleven to explain the event from the prophets.',
      historicalEventsExplanation: 'The birth of the New Testament church; Peter confronts the crowd with having crucified Jesus whom God made both Lord and Messiah.',
      sourceAttribution: 'F.F. Bruce, The Book of Acts (NICNT) & I. Howard Marshall, Acts (Tyndale).',
    },
    contextualExplanation: {
      beforePassage: 'Peter cites Joel 2 and Psalms 16 & 110, concluding that God made Jesus Lord and Christ. Cut to the heart, the crowd asks: "Brothers, what shall we do?" (verse 37).',
      afterPassage: 'Peter promises that the gift is for them, their children, and all who are far off; about 3,000 were baptized and devoted themselves to the apostles’ teaching and fellowship.',
      mainSubject: 'The apostolic command of repentance and baptism in the name of Jesus, and the reception of the promised Holy Spirit.',
      authorsIntendedMessage: 'Entrance into the New Covenant requires metanoia (turning to Jesus) and the public pledge of baptism, resulting in forgiveness of sins and the gift of the Spirit.',
      chapterAndBookFit: 'The inaugural sermon and blueprint for gospel proclamation throughout the Book of Acts.',
      sourceAttribution: 'F.F. Bruce, The Book of Acts (NICNT, pp. 68–75).',
    },
    theologicalInterpretation: {
      coreTheologicalThemes: ['Repentance', 'Baptism', 'Forgiveness of Sins', 'The Gift of the Holy Spirit'],
      explanation: 'Peter links inward repentance (metanoēsate) with outward covenant identification in baptism (baptisthētō), promising the pardon of guilt and the indwelling Holy Spirit.',
      traditionsAndPerspectives: [
        {
          tradition: 'Evangelical / Baptist Perspective',
          perspective: 'Emphasizes that repentance is the primary ground of forgiveness; the Greek preposition eis can mean "in view of / with reference to" forgiveness, with baptism as the outward sign of inward faith.',
        },
        {
          tradition: 'Restoration Movement / Churches of Christ',
          perspective: 'Interprets eis as telic ("in order to obtain"), viewing baptism as the moment when God remits sins.',
        },
      ],
      sourceAttribution: 'Daniel B. Wallace, Greek Grammar & F.F. Bruce, Commentary on the Book of the Acts.',
    },
    originalLanguageWords: [
      {
        englishWord: 'Repent',
        originalSpelling: 'μετανοήσατε',
        language: 'Greek',
        transliteration: 'Metanoēsate',
        strongsNumber: 'G3340',
        partOfSpeech: 'Verb, Aorist Active Imperative, 2nd Person Plural',
        meaning: 'Change your mind, turn around, undergo total life-reorientation.',
        contextualUsage: 'Peter’s urgent, decisive command to the crowd to turn away from rebellion and embrace Jesus.',
        lexiconEntryId: 'G3341-metanoia',
      },
      {
        englishWord: 'Be Baptized',
        originalSpelling: 'βαπτισθήτω',
        language: 'Greek',
        transliteration: 'Baptisthētō',
        strongsNumber: 'G907',
        partOfSpeech: 'Verb, Aorist Passive Imperative, 3rd Person Singular',
        meaning: 'Be immersed, submerged, wash ceremonially into the name of Christ.',
        contextualUsage: 'Shifts to 3rd person singular: "let each one of you be baptized."',
        lexiconEntryId: 'G908-baptisma',
      },
    ],
    crossReferences: [
      {
        ref: 'Joel 2:28–32',
        category: 'Prophecy fulfilment',
        relevanceExplanation: 'The prophetic foundation for Pentecost: God pouring out His Spirit on all flesh.',
      },
      {
        ref: 'Luke 24:47',
        category: 'Parallel passage',
        relevanceExplanation: 'Jesus commanded: "repentance for the forgiveness of sins will be preached in his name to all nations, beginning at Jerusalem."',
      },
    ],
  },
};

/**
 * Retrieve contextual interpretation data for a given verse or chapter.
 * Matches exact verse reference, or falls back to chapter matches.
 */
export function getContextualInterpretation(canonicalRef: string): ContextualInterpretationData | undefined {
  const norm = canonicalRef.trim();
  if (SCRIPTURE_INTERPRETATIONS[norm]) {
    return SCRIPTURE_INTERPRETATIONS[norm];
  }

  // Check if verse is within known chapter scope (e.g. "John 3:1" -> "John 3:5")
  const parts = norm.split(' ');
  if (parts.length >= 2) {
    const book = parts.slice(0, -1).join(' ');
    const chapterAndVerse = parts[parts.length - 1];
    const [chapter] = chapterAndVerse.split(':');
    if (book.toLowerCase() === 'john' && chapter === '3') {
      return SCRIPTURE_INTERPRETATIONS['John 3:5'];
    }
    if (book.toLowerCase() === 'matthew' && chapter === '1') {
      return SCRIPTURE_INTERPRETATIONS['Matthew 1:23'];
    }
    if (book.toLowerCase() === 'romans' && chapter === '5') {
      return SCRIPTURE_INTERPRETATIONS['Romans 5:12'];
    }
    if (book.toLowerCase() === 'acts' && chapter === '2') {
      return SCRIPTURE_INTERPRETATIONS['Acts 2:38'];
    }
  }

  return undefined;
}

