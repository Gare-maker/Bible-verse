import { LexiconEntry } from '@/types/bible';

/**
 * Authoritative Biblical Original-Language Lexicon
 * Grounded in Strong's Exhaustive Concordance, Thayer's Greek-English Lexicon,
 * and Brown-Driver-Briggs Hebrew and English Lexicon (BDB).
 */
export const BIBLICAL_LEXICON: LexiconEntry[] = [
  // 1. REPENTANCE (Metanoia - Greek)
  {
    id: 'G3341-metanoia',
    englishWord: 'Repentance',
    originalSpelling: 'μετάνοια',
    language: 'Greek',
    transliteration: 'Metanoia',
    pronunciation: 'meh-TAH-noy-ah',
    strongsNumber: 'G3341',
    partOfSpeech: 'Noun, Feminine',
    rootWordAndRelatedForms:
      'From μετά (meta, denoting change of place or condition) and νοέω (noeō, to exercise the mind, think, comprehend); related to verb μετανοέω (metanoeō, G3340).',
    lexicalDefinition:
      'A transformative change of mind, disposition, and heart; an inward turning of the intellect and purpose away from sin and toward God.',
    etymologyAndOrigin:
      'Composed of the Greek preposition "meta" (after, beyond, change) and "nous" (mind, intellect). In classical Greek, it referred to an afterthought or change of intention; in the Septuagint and New Testament apostolic preaching, it gained urgent moral and covenantal depth denoting total conversion to God.',
    contextualMeaning:
      'In New Testament preaching, metanoia is never mere emotional remorse (which is metamelomai, as in Judas), but a decisive, voluntary turning of one’s life direction toward God, producing tangible spiritual fruit.',
    biblicalOccurrences: 22,
    relevantReferences: ['Acts 2:38', 'Matthew 3:2', '2 Corinthians 7:10', 'Luke 24:47', 'Romans 2:4', 'Acts 26:20'],
    examplesOfUsage: [
      {
        ref: 'Acts 2:38',
        passageSnippet: 'Repent and be baptized, every one of you, in the name of Jesus Christ...',
        translationNote: 'Peter uses the imperative of metanoeō calling for immediate covenant realignment and receipt of the Holy Spirit.',
      },
      {
        ref: '2 Corinthians 7:10',
        passageSnippet: 'Godly sorrow brings repentance that leads to salvation and leaves no regret...',
        translationNote: 'Distinguishes genuine godly metanoia from worldly despair (metamelomai).',
      },
      {
        ref: 'Matthew 3:2',
        passageSnippet: 'Repent, for the kingdom of heaven has come near.',
        translationNote: 'John the Baptist inaugurates the Messianic era with the call to metanoia.',
      },
    ],
    sourceAttribution: "Thayer's Greek-English Lexicon (G3341) & Strong's Exhaustive Concordance",
    relatedEnglishWords: ['Conversion', 'Turning', 'Reorientation', 'Mindset change'],
  },

  // 1B. REPENTANCE / RETURN (Shuv - Hebrew)
  {
    id: 'H7725-shuv',
    englishWord: 'Repentance / Turn Back',
    originalSpelling: 'שׁוּב',
    language: 'Hebrew',
    transliteration: 'Shuv',
    pronunciation: 'shoov',
    strongsNumber: 'H7725',
    partOfSpeech: 'Verb',
    rootWordAndRelatedForms: 'Primary root; related to teshuvah (repentance, return).',
    lexicalDefinition:
      'To turn back, return, turn around; in covenant theology, to return from apostasy and reorient one’s entire life toward Yahweh.',
    etymologyAndOrigin:
      'Ancient Semitic root denoting physical motion of turning back; used by Hebrew prophets to signify the covenant return of Israel to the Lord.',
    contextualMeaning:
      'The foundational Old Testament term for repentance: turning away from evil paths and returning home to covenant fellowship with God.',
    biblicalOccurrences: 1058,
    relevantReferences: ['Ezekiel 18:30', 'Joel 2:12', 'Jeremiah 3:12', 'Isaiah 55:7', 'Hosea 14:1'],
    examplesOfUsage: [
      {
        ref: 'Joel 2:12',
        passageSnippet: 'Return to me with all your heart, with fasting and weeping and mourning.',
        translationNote: 'Prophetic call to inner turn toward Yahweh.',
      },
      {
        ref: 'Ezekiel 18:30',
        passageSnippet: 'Repent! Turn away from all your offenses; then sin will not be your downfall.',
        translationNote: 'Double imperative of shuv commanding personal covenant turning.',
      },
    ],
    sourceAttribution: 'Brown-Driver-Briggs Hebrew and English Lexicon (H7725)',
    relatedEnglishWords: ['Return', 'Turn', 'Teshuvah'],
  },

  // 2. BAPTISM (Baptisma - Greek)
  {
    id: 'G908-baptisma',
    englishWord: 'Baptism',
    originalSpelling: 'βάπτισμα',
    language: 'Greek',
    transliteration: 'Baptisma',
    pronunciation: 'BAHP-tis-mah',
    strongsNumber: 'G908',
    partOfSpeech: 'Noun, Neuter',
    rootWordAndRelatedForms:
      'From βαπτίζω (baptizō, G907, to immerse, submerge); intensive of βάπτω (baptō, G911, to dip or dye).',
    lexicalDefinition:
      'Immersion, submersion, washing; ceremonial dipping; an ordinance of symbolic identification, purification, and entrance into the covenant community.',
    etymologyAndOrigin:
      'Derived from classical Greek baptō (used for dipping garments in dye or sinking a vessel), expanded in Hellenistic and Jewish ritual washings (mikveh), and transformed into Christian baptism of repentance and spiritual rebirth.',
    contextualMeaning:
      'In the New Testament, baptisma signifies the believer’s public identification with Christ in his death, burial, and resurrection (Romans 6:3–4), and the washing of regeneration (Titus 3:5).',
    biblicalOccurrences: 19,
    relevantReferences: ['Romans 6:4', 'Ephesians 4:5', 'Colossians 2:12', '1 Peter 3:21', 'Matthew 3:7', 'Mark 1:4'],
    examplesOfUsage: [
      {
        ref: 'Romans 6:4',
        passageSnippet: 'We were therefore buried with him through baptism into death in order that, just as Christ was raised...',
        translationNote: 'Paul links baptisma to bodily co-burial with Christ and walking in newness of life.',
      },
      {
        ref: 'Ephesians 4:5',
        passageSnippet: '...one Lord, one faith, one baptism; one God and Father of all...',
        translationNote: 'Baptisma marks the undivided covenant sign of unity in the Spirit.',
      },
    ],
    sourceAttribution: "Thayer's Greek-English Lexicon (G908) & Liddell-Scott-Jones",
    relatedEnglishWords: ['Immersion', 'Washing', 'Purification'],
  },

  // 3. GOSPEL (Euangelion - Greek)
  {
    id: 'G2098-euangelion',
    englishWord: 'Gospel',
    originalSpelling: 'εὐαγγέλιον',
    language: 'Greek',
    transliteration: 'Euangelion',
    pronunciation: 'yoo-ang-GHEL-ee-on',
    strongsNumber: 'G2098',
    partOfSpeech: 'Noun, Neuter',
    rootWordAndRelatedForms:
      'From εὖ (eu, good, well) and ἄγγελος (angelos, messenger); related to εὐαγγελίζω (euangelizō, G2097, to proclaim good news).',
    lexicalDefinition:
      'Good news, glad tidings; in the New Testament, the proclamation of the grace of God and the victory of Jesus Christ as Lord and Savior.',
    etymologyAndOrigin:
      'In the Greco-Roman world, an euangelion was an official imperial announcement of military victory or the accession/birth of a Caesar. The Apostles appropriated this imperial term to proclaim that Jesus, not Caesar, is the true Lord of the world.',
    contextualMeaning:
      'The message of salvation: that Christ died for our sins according to the Scriptures, was buried, and rose again on the third day (1 Corinthians 15:1–4).',
    biblicalOccurrences: 76,
    relevantReferences: ['Romans 1:16', 'Mark 1:1', '1 Corinthians 15:1', 'Galatians 1:6', 'Ephesians 1:13'],
    examplesOfUsage: [
      {
        ref: 'Romans 1:16',
        passageSnippet: 'For I am not ashamed of the gospel, because it is the power of God that brings salvation to everyone who believes...',
        translationNote: 'Paul identifies euangelion as dynamic divine power (dynamis theou).',
      },
      {
        ref: 'Mark 1:1',
        passageSnippet: 'The beginning of the good news about Jesus the Messiah, the Son of God...',
        translationNote: 'Mark frames his entire book as the heraldic proclamation of the victory of King Jesus.',
      },
    ],
    sourceAttribution: "Thayer's Greek-English Lexicon (G2098) & BDAG",
    relatedEnglishWords: ['Good News', 'Glad Tidings', 'Evangel'],
  },

  // 4. CHURCH (Ekklesia - Greek)
  {
    id: 'G1577-ekklesia',
    englishWord: 'Church / Assembly',
    originalSpelling: 'ἐκκλησία',
    language: 'Greek',
    transliteration: 'Ekklesia',
    pronunciation: 'ek-klay-SEE-ah',
    strongsNumber: 'G1577',
    partOfSpeech: 'Noun, Feminine',
    rootWordAndRelatedForms:
      'From ἐκ (ek, out of) and καλέω (kaleō, to call); literally "the called-out ones".',
    lexicalDefinition:
      'A called-out assembly, gathering, or congregation; specifically, the community of believers united in Jesus Christ.',
    etymologyAndOrigin:
      'In ancient Greek democracy, an ekklēsia was the legal assembly of citizens summoned out of their homes into the public square. In the Septuagint, it translates the Hebrew qahal (the assembly of Israel gathered before Yahweh at Sinai).',
    contextualMeaning:
      'In the New Testament, never a physical building; it refers exclusively to the people of God—both the local gathering of disciples and the universal body of Christ.',
    biblicalOccurrences: 114,
    relevantReferences: ['Matthew 16:18', 'Ephesians 1:22', 'Acts 2:47', '1 Corinthians 12:28', 'Colossians 1:18', 'Hebrews 12:23'],
    examplesOfUsage: [
      {
        ref: 'Matthew 16:18',
        passageSnippet: '...and on this rock I will build my church, and the gates of Hades will not overcome it.',
        translationNote: 'First occurrence in the Gospels; Jesus establishes His new covenant assembly.',
      },
      {
        ref: 'Ephesians 1:22–23',
        passageSnippet: '...and appointed him to be head over everything for the church, which is his body, the fullness of him...',
        translationNote: 'Paul expounds ekklēsia as the organic, living body of the exalted Christ.',
      },
    ],
    sourceAttribution: "Thayer's Greek-English Lexicon (G1577) & Strong's Exhaustive Concordance",
    relatedEnglishWords: ['Assembly', 'Congregation', 'Body of Christ', 'Qahal'],
  },

  // 5. GRACE (Charis - Greek)
  {
    id: 'G5485-charis',
    englishWord: 'Grace',
    originalSpelling: 'χάρις',
    language: 'Greek',
    transliteration: 'Charis',
    pronunciation: 'KHAH-ris',
    strongsNumber: 'G5485',
    partOfSpeech: 'Noun, Feminine',
    rootWordAndRelatedForms:
      'From χαίρω (chairō, G5463, to rejoice, be glad); related to χάρισμα (charisma, free gift) and χαρίζομαι (charizomai, to forgive freely).',
    lexicalDefinition:
      'Unmerited favor, gracious goodwill, lovingkindness, and divine enablement freely bestowed without human earning.',
    etymologyAndOrigin:
      'In classical Greek, charis denoted beauty, charm, pleasantness, or reciprocity between patrons and clients. The New Testament writers revolutionized the term to describe God’s sovereign, one-way, unearned generosity to helpless sinners.',
    contextualMeaning:
      'The foundational principle of salvation: God giving his best (Christ) to those who deserve his wrath, enabling holy living through the Spirit.',
    biblicalOccurrences: 156,
    relevantReferences: ['Ephesians 2:8', 'Romans 3:24', 'John 1:16', 'Titus 2:11', '2 Corinthians 12:9'],
    examplesOfUsage: [
      {
        ref: 'Ephesians 2:8',
        passageSnippet: 'For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God...',
        translationNote: 'Emphasizes that charis is the absolute origin and basis of salvation.',
      },
      {
        ref: '2 Corinthians 12:9',
        passageSnippet: 'My grace is sufficient for you, for my power is made perfect in weakness.',
        translationNote: 'Charis as present divine strengthening in human fragility.',
      },
    ],
    sourceAttribution: "Thayer's Greek-English Lexicon (G5485) & BDAG",
    relatedEnglishWords: ['Unmerited Favor', 'Gift', 'Goodwill', 'Hesed'],
  },

  // 5B. GRACE / STEADFAST LOVE (Hesed - Hebrew)
  {
    id: 'H2617-hesed',
    englishWord: 'Steadfast Love / Covenant Grace',
    originalSpelling: 'חֶסֶד',
    language: 'Hebrew',
    transliteration: 'Hesed',
    pronunciation: 'KHEH-sed',
    strongsNumber: 'H2617',
    partOfSpeech: 'Noun, Masculine',
    rootWordAndRelatedForms: 'Primary root; related to chasid (godly, saint).',
    lexicalDefinition:
      'Steadfast love, unfailing covenant loyalty, mercy, lovingkindness, faithfulness to a promised relationship.',
    etymologyAndOrigin:
      'A dense Hebrew covenant term with no direct single English equivalent; conveys the unshakeable commitment of Yahweh to his covenant partners even when they fail.',
    contextualMeaning:
      'Often paired with emet (truth/faithfulness) to describe God’s fundamental character revealed to Moses at Sinai (Exodus 34:6).',
    biblicalOccurrences: 248,
    relevantReferences: ['Exodus 34:6', 'Psalms 136:1', 'Lamentations 3:22', 'Micah 6:8', 'Hosea 6:6'],
    examplesOfUsage: [
      {
        ref: 'Exodus 34:6',
        passageSnippet: 'The LORD, the LORD, the compassionate and gracious God, slow to anger, abounding in hesed and truth...',
        translationNote: 'The supreme self-revelation of God’s nature in the Torah.',
      },
      {
        ref: 'Lamentations 3:22',
        passageSnippet: 'Because of the LORD’s great love [hesed] we are not consumed, for his compassions never fail.',
        translationNote: 'Jeremiah clings to hesed amidst Jerusalem’s ruins.',
      },
    ],
    sourceAttribution: 'Brown-Driver-Briggs Hebrew and English Lexicon (H2617)',
    relatedEnglishWords: ['Lovingkindness', 'Covenant Loyalty', 'Mercy'],
  },

  // 6. LOVE (Agapē - Greek)
  {
    id: 'G26-agape',
    englishWord: 'Love (Self-Giving)',
    originalSpelling: 'ἀγάπη',
    language: 'Greek',
    transliteration: 'Agapē',
    pronunciation: 'ah-GAH-pay',
    strongsNumber: 'G26',
    partOfSpeech: 'Noun, Feminine',
    rootWordAndRelatedForms:
      'Related to verb ἀγαπάω (agapaō, G25); distinct from φιλέω (phileō, G5368, personal friendship) and ἔρως (erōs, romantic desire, which never appears in the New Testament).',
    lexicalDefinition:
      'Self-giving, unconditional, willful love; benevolent devotion that seeks the highest good of the beloved regardless of worthiness or return.',
    etymologyAndOrigin:
      'A rarely used word in classical secular Greek, which preferred erōs, philia, and storgē. The biblical writers adopted agapē to express God’s uncaused, sacrificial love demonstrated at the Cross.',
    contextualMeaning:
      'The nature of God Himself ("God is agapē", 1 John 4:8) and the supreme virtue of Christian discipleship (1 Corinthians 13:13).',
    biblicalOccurrences: 116,
    relevantReferences: ['John 3:16', 'Romans 5:8', '1 Corinthians 13:4', '1 John 4:8', 'Galatians 5:22'],
    examplesOfUsage: [
      {
        ref: 'Romans 5:8',
        passageSnippet: 'But God demonstrates his own love [agapē] for us in this: While we were still sinners, Christ died for us.',
        translationNote: 'The ultimate definition of agapē: sacrificial death for enemies.',
      },
      {
        ref: '1 John 4:8',
        passageSnippet: 'Whoever does not love does not know God, because God is love.',
        translationNote: 'Identifies agapē as the essential character of the Triune God.',
      },
    ],
    sourceAttribution: "Thayer's Greek-English Lexicon (G26) & Strong's Exhaustive Concordance",
    relatedEnglishWords: ['Unconditional Love', 'Charity', 'Self-Sacrifice'],
    distinctionNote:
      'Crucial Lexical Distinction: In biblical Greek, "Agapē" is willful, self-sacrificing love; "Phileō" is affectionate brotherhood or friendship; "Philia" is brotherly affinity; and "Erōs" denotes passionate or romantic love. Crucially, the noun "Erōs" does not appear anywhere in the New Testament text. These words should not be treated as strictly interchangeable, nor should minor distinctions be exaggerated.',
  },

  // 6B. LOVE (Phileō - Greek)
  {
    id: 'G5368-phileo',
    englishWord: 'Love (Affection / Friendship)',
    originalSpelling: 'φιλέω',
    language: 'Greek',
    transliteration: 'Phileō',
    pronunciation: 'fee-LEH-oh',
    strongsNumber: 'G5368',
    partOfSpeech: 'Verb',
    rootWordAndRelatedForms:
      'Related to φίλος (philos, friend) and φιλία (philia, friendship); distinct from ἀγαπάω (agapaō).',
    lexicalDefinition:
      'To love with personal affection, fondness, friendly attachment, or warm regard; to kiss or cherish as a friend.',
    etymologyAndOrigin:
      'Classical Greek word for fraternal affection and kinship bonds. Used in the New Testament to describe deep emotional connection, such as Jesus weeping for his friend Lazarus (John 11:36).',
    contextualMeaning:
      'Expresses personal tenderness and attachment; notably contrasted with agapaō in Jesus’ post-resurrection dialogue with Peter in John 21:15–17.',
    biblicalOccurrences: 25,
    relevantReferences: ['John 11:36', 'John 21:15', 'Matthew 10:37', 'Revelation 3:19'],
    examplesOfUsage: [
      {
        ref: 'John 11:36',
        passageSnippet: 'Then the Jews said, "See how he loved [ephilei] him!"',
        translationNote: 'The onlookers observe Jesus’ deep personal affection and tears for Lazarus.',
      },
      {
        ref: 'John 21:15',
        passageSnippet: 'Jesus said to Simon Peter, "Simon son of John, do you love [agapas] me more than these?" "Yes, Lord," he said, "you know that I love [philō] you."',
        translationNote: 'A famous dialogue featuring intentional stylistic interplay between agapaō and phileō.',
      },
    ],
    sourceAttribution: "Thayer's Greek-English Lexicon (G5368) & Liddell-Scott-Jones",
    relatedEnglishWords: ['Friendship', 'Affection', 'Brotherly Love'],
    distinctionNote:
      'Contrasted with Agapē: Phileō conveys warmth, friendship, and personal affection, whereas Agapē is purposeful, unconditional commitment.',
  },

  // 7. FAITH (Pistis - Greek)
  {
    id: 'G4102-pistis',
    englishWord: 'Faith',
    originalSpelling: 'πίστις',
    language: 'Greek',
    transliteration: 'Pistis',
    pronunciation: 'PEES-tis',
    strongsNumber: 'G4102',
    partOfSpeech: 'Noun, Feminine',
    rootWordAndRelatedForms:
      'From πείθω (peithō, G3982, to persuade, trust, be convinced); related to πιστεύω (pisteuō, G4100, to believe) and πιστός (pistos, faithful).',
    lexicalDefinition:
      'Conviction, trust, reliance, fidelity; a firm persuasion and confident reliance upon the character, promise, and work of God.',
    etymologyAndOrigin:
      'Derived from the root of persuasion; in the biblical context, it moves beyond mere intellectual consent (assensus) to personal surrender and entrustment (fiducia) to Christ.',
    contextualMeaning:
      'The sole instrument of justification before God (Romans 3:28): not a human work, but receiving the finished work of Jesus Christ.',
    biblicalOccurrences: 243,
    relevantReferences: ['Hebrews 11:1', 'Romans 1:17', 'Ephesians 2:8', 'Galatians 2:20', 'Romans 10:17'],
    examplesOfUsage: [
      {
        ref: 'Hebrews 11:1',
        passageSnippet: 'Now faith is confidence in what we hope for and assurance about what we do not see.',
        translationNote: 'The biblical definition: hypostasis (substance) of hoped realities.',
      },
      {
        ref: 'Romans 1:17',
        passageSnippet: 'The righteous will live by faith.',
        translationNote: 'Paul quotes Habakkuk 2:4 establishing justification by pistis as the thesis of Romans.',
      },
    ],
    sourceAttribution: "Thayer's Greek-English Lexicon (G4102) & BDAG",
    relatedEnglishWords: ['Trust', 'Belief', 'Fidelity', 'Emunah'],
  },

  // 7B. FAITH / FAITHFULNESS (Emunah - Hebrew)
  {
    id: 'H530-emunah',
    englishWord: 'Faithfulness / Trust',
    originalSpelling: 'אֱמוּנָה',
    language: 'Hebrew',
    transliteration: 'Emunah',
    pronunciation: 'eh-moo-NAH',
    strongsNumber: 'H530',
    partOfSpeech: 'Noun, Feminine',
    rootWordAndRelatedForms: 'From אָמַן (aman, H539, to be firm, reliable, established); origin of the word "Amen".',
    lexicalDefinition:
      'Firmness, fidelity, steadfastness, stability, trustworthy character and faithful endurance.',
    etymologyAndOrigin:
      'Built upon the root aman, which describes a pillar standing firm or a nurse supporting a child. In Hebrew thought, faith is not passive belief but steadfast, reliable loyalty.',
    contextualMeaning:
      'Describes God’s unshakeable reliability toward his promises, and the faithful steadfastness of the righteous person.',
    biblicalOccurrences: 49,
    relevantReferences: ['Habakkuk 2:4', 'Lamentations 3:23', 'Psalms 36:5', 'Deuteronomy 32:4'],
    examplesOfUsage: [
      {
        ref: 'Habakkuk 2:4',
        passageSnippet: '...but the righteous person will live by their faithfulness [emunah].',
        translationNote: 'The foundational text quoted by Paul in Romans 1:17 and Galatians 3:11.',
      },
      {
        ref: 'Lamentations 3:23',
        passageSnippet: 'They are new every morning; great is your faithfulness [emunah].',
        translationNote: 'Celebrating God’s unwavering stability amidst catastrophe.',
      },
    ],
    sourceAttribution: 'Brown-Driver-Briggs Hebrew and English Lexicon (H530)',
    relatedEnglishWords: ['Steadfastness', 'Stability', 'Truthfulness', 'Amen'],
  },

  // 8. SALVATION (Sōtēria - Greek)
  {
    id: 'G4991-soteria',
    englishWord: 'Salvation',
    originalSpelling: 'σωτηρία',
    language: 'Greek',
    transliteration: 'Sōtēria',
    pronunciation: 'so-tay-REE-ah',
    strongsNumber: 'G4991',
    partOfSpeech: 'Noun, Feminine',
    rootWordAndRelatedForms:
      'From σωτήρ (sōtēr, G4990, Savior, deliverer) and σῴζω (sōzō, G4982, to save, rescue, heal, make whole).',
    lexicalDefinition:
      'Deliverance, rescue, preservation, safety, and ultimate spiritual wholeness and redemption from sin, death, and judgment.',
    etymologyAndOrigin:
      'In ancient Greece, sōtēria meant rescue from military destruction or recovery from mortal illness. In the New Testament, it encompasses the comprehensive redemptive work of Christ: past justification, present sanctification, and future glorification.',
    contextualMeaning:
      'The comprehensive gift of eternal deliverance purchased by Christ’s blood and realized through the Holy Spirit.',
    biblicalOccurrences: 45,
    relevantReferences: ['Romans 1:16', 'Acts 4:12', 'Ephesians 2:8', 'Philippians 2:12', 'Hebrews 2:3'],
    examplesOfUsage: [
      {
        ref: 'Acts 4:12',
        passageSnippet: 'Salvation is found in no one else, for there is no other name under heaven given to mankind by which we must be saved.',
        translationNote: 'Peter proclaims sōtēria exclusively centered in Jesus of Nazareth.',
      },
      {
        ref: 'Hebrews 2:3',
        passageSnippet: '...how shall we escape if we ignore so great a salvation?',
        translationNote: 'Exhortation regarding the supreme magnitude of Christ’s covenant deliverance.',
      },
    ],
    sourceAttribution: "Thayer's Greek-English Lexicon (G4991) & Strong's Exhaustive Concordance",
    relatedEnglishWords: ['Deliverance', 'Rescue', 'Redemption', 'Yeshuah'],
  },

  // 8B. SALVATION (Yeshuah - Hebrew)
  {
    id: 'H3444-yeshuah',
    englishWord: 'Salvation / Deliverance',
    originalSpelling: 'יְשׁוּעָה',
    language: 'Hebrew',
    transliteration: 'Yeshuah',
    pronunciation: 'yeh-shoo-AH',
    strongsNumber: 'H3444',
    partOfSpeech: 'Noun, Feminine',
    rootWordAndRelatedForms: 'From יָשַׁע (yasha, H3467, to be broad, to deliver, save); direct etymological origin of the name Jesus (Yeshua).',
    lexicalDefinition:
      'Salvation, deliverance, victory, welfare, help, rescue out of distress into spacious freedom.',
    etymologyAndOrigin:
      'The root yasha signifies bringing someone out of narrow constraint into wide open safety. In Matthew 1:21, the angel explicitly plays on this Hebrew name: "You shall call his name Jesus [Yeshua], for he will save [yoshia] his people from their sins."',
    contextualMeaning:
      'Exemplified in Israel’s Exodus through the Red Sea and ultimately embodied in the person and work of the Messiah.',
    biblicalOccurrences: 78,
    relevantReferences: ['Exodus 14:13', 'Isaiah 12:2', 'Psalms 27:1', 'Jonah 2:9', 'Genesis 49:18'],
    examplesOfUsage: [
      {
        ref: 'Exodus 14:13',
        passageSnippet: 'Moses answered the people, "Do not be afraid. Stand firm and you will see the deliverance [yeshuah] the LORD will bring you today."',
        translationNote: 'The archetypal Old Testament experience of salvation.',
      },
      {
        ref: 'Jonah 2:9',
        passageSnippet: 'Salvation comes from the LORD.',
        translationNote: 'Jonah’s climactic confession inside the sea monster: Yeshuah belongs to Yahweh.',
      },
    ],
    sourceAttribution: 'Brown-Driver-Briggs Hebrew and English Lexicon (H3444)',
    relatedEnglishWords: ['Deliverance', 'Rescue', 'Victory', 'Jesus'],
  },

  // 9. GLORY (Doxa - Greek)
  {
    id: 'G1391-doxa',
    englishWord: 'Glory',
    originalSpelling: 'δόξα',
    language: 'Greek',
    transliteration: 'Doxa',
    pronunciation: 'DOK-sah',
    strongsNumber: 'G1391',
    partOfSpeech: 'Noun, Feminine',
    rootWordAndRelatedForms: 'From δοκέω (dokeō, G1380, to think, suppose, seem); related to orthodox (right thinking/praise).',
    lexicalDefinition:
      'Splendor, radiance, majestic honor, renown; in biblical usage, the visible manifestation of God’s supreme excellence, holiness, and presence.',
    etymologyAndOrigin:
      'In classical Greek, doxa meant personal opinion, reputation, or fame. The Septuagint radically transformed it by using it to translate Hebrew kavod (the heavy, radiant weight of God’s majestic presence).',
    contextualMeaning:
      'The radiant perfection of God revealed in the face of Jesus Christ (2 Corinthians 4:6) and the ultimate destiny of glorified believers.',
    biblicalOccurrences: 166,
    relevantReferences: ['John 1:14', 'Romans 3:23', '2 Corinthians 3:18', 'Colossians 1:27', 'Revelation 21:23'],
    examplesOfUsage: [
      {
        ref: 'John 1:14',
        passageSnippet: '...and we have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth.',
        translationNote: 'The Tabernacle Shekinah glory localized in Jesus’ human flesh.',
      },
      {
        ref: 'Romans 3:23',
        passageSnippet: '...for all have sinned and fall short of the glory of God...',
        translationNote: 'Human fallenness understood as missing the reflection of God’s glorious image.',
      },
    ],
    sourceAttribution: "Thayer's Greek-English Lexicon (G1391) & BDAG",
    relatedEnglishWords: ['Majesty', 'Splendor', 'Honor', 'Kavod'],
  },

  // 9B. GLORY (Kavod - Hebrew)
  {
    id: 'H3519-kavod',
    englishWord: 'Glory / Weight',
    originalSpelling: 'כָּבוֹד',
    language: 'Hebrew',
    transliteration: 'Kavod',
    pronunciation: 'kah-VOHD',
    strongsNumber: 'H3519',
    partOfSpeech: 'Noun, Masculine',
    rootWordAndRelatedForms: 'From כָּבֵד (kaved, H3513, to be heavy, weighty, burdensome, honorable).',
    lexicalDefinition:
      'Weight, heaviness, substantive worth, splendor, majesty; the manifest presence of God filled with light, cloud, and fire.',
    etymologyAndOrigin:
      'Derived from the root of physical weight. To the Hebrew mind, that which is glorious is not light or fleeting, but has substance, gravitas, and immense significance.',
    contextualMeaning:
      'The Shekinah presence that filled the Tabernacle (Exodus 40:34) and Temple (1 Kings 8:11), and will cover the earth as waters cover the sea (Habakkuk 2:14).',
    biblicalOccurrences: 200,
    relevantReferences: ['Exodus 33:18', 'Exodus 40:34', 'Isaiah 6:3', 'Psalms 19:1', 'Ezekiel 1:28'],
    examplesOfUsage: [
      {
        ref: 'Exodus 33:18',
        passageSnippet: 'Then Moses said, "Now show me your glory [kavod]."',
        translationNote: 'Moses asks to gaze upon the unmediated reality of God’s being.',
      },
      {
        ref: 'Isaiah 6:3',
        passageSnippet: 'Holy, holy, holy is the LORD Almighty; the whole earth is full of his glory [kavod].',
        translationNote: 'Seraphic declaration of God’s holiness manifest in creation.',
      },
    ],
    sourceAttribution: 'Brown-Driver-Briggs Hebrew and English Lexicon (H3519)',
    relatedEnglishWords: ['Weight', 'Honor', 'Splendor', 'Shekinah'],
  },

  // 10. RIGHTEOUSNESS (Dikaiosynē - Greek)
  {
    id: 'G1343-dikaiosyne',
    englishWord: 'Righteousness',
    originalSpelling: 'δικαιοσύνη',
    language: 'Greek',
    transliteration: 'Dikaiosynē',
    pronunciation: 'dih-kai-oh-SOO-nay',
    strongsNumber: 'G1343',
    partOfSpeech: 'Noun, Feminine',
    rootWordAndRelatedForms:
      'From δίκαιος (dikaios, G1342, righteous, just); related to δικαιόω (dikaioō, G1344, to justify, declare righteous).',
    lexicalDefinition:
      'Justice, uprightness, conformity to the divine standard; in Paul’s letters, both God’s covenant-faithfulness and the imputed status of righteousness given to believers through faith.',
    etymologyAndOrigin:
      'In Greek civic thought, it represented civic justice and fairness according to law. In the Bible, it is fundamentally relational: alignment with God’s holy nature and covenant promises.',
    contextualMeaning:
      'The status of right standing before God credited to faith without the works of the law (Romans 4:3–5), resulting in practical holiness.',
    biblicalOccurrences: 92,
    relevantReferences: ['Romans 1:17', 'Matthew 5:6', '2 Corinthians 5:21', 'Philippians 3:9', 'Romans 3:21'],
    examplesOfUsage: [
      {
        ref: '2 Corinthians 5:21',
        passageSnippet: 'God made him who had no sin to be sin for us, so that in him we might become the righteousness of God.',
        translationNote: 'The Great Exchange: Christ takes our sin; we receive His dikaiosynē.',
      },
      {
        ref: 'Philippians 3:9',
        passageSnippet: '...not having a righteousness of my own that comes from the law, but that which is through faith in Christ...',
        translationNote: 'Paul renounces self-achieved righteousness for imputed righteousness.',
      },
    ],
    sourceAttribution: "Thayer's Greek-English Lexicon (G1343) & Strong's Exhaustive Concordance",
    relatedEnglishWords: ['Justice', 'Uprightness', 'Justification', 'Tzedakah'],
  },

  // 11. WORSHIP (Proskyneō - Greek)
  {
    id: 'G4352-proskyneo',
    englishWord: 'Worship / Bow Down',
    originalSpelling: 'προσκυνέω',
    language: 'Greek',
    transliteration: 'Proskyneō',
    pronunciation: 'pros-koo-NEH-oh',
    strongsNumber: 'G4352',
    partOfSpeech: 'Verb',
    rootWordAndRelatedForms:
      'From πρός (pros, toward) and κυνέω (kyneō, to kiss); literally to fall down and kiss the hand, feet, or ground before a superior.',
    lexicalDefinition:
      'To prostrate oneself in homage, bow down, worship, revere with utmost submission and adoration.',
    etymologyAndOrigin:
      'An ancient Persian and Greek gesture of prostration (proskynesis) before a monarch. In the New Testament, reserved solely for the one true God, and strikingly offered to and received by Jesus Christ.',
    contextualMeaning:
      'The physical, emotional, and spiritual posture of falling prostrate before God in awe of his majesty (John 4:23–24).',
    biblicalOccurrences: 60,
    relevantReferences: ['John 4:24', 'Matthew 2:11', 'Matthew 28:9', 'Revelation 4:10', 'Revelation 19:10'],
    examplesOfUsage: [
      {
        ref: 'John 4:24',
        passageSnippet: 'God is spirit, and his worshipers must worship [proskynein] in the Spirit and in truth.',
        translationNote: 'Jesus transforms worship from a localized mountain to an inward reality in the Spirit.',
      },
      {
        ref: 'Matthew 2:11',
        passageSnippet: 'On coming to the house, they saw the child with his mother Mary, and they bowed down and worshiped [prosekynēsan] him.',
        translationNote: 'Magi offer royal-divine proskyneō to the toddler Jesus.',
      },
    ],
    sourceAttribution: "Thayer's Greek-English Lexicon (G4352) & Liddell-Scott-Jones",
    relatedEnglishWords: ['Adoration', 'Homage', 'Prostration', 'Shachah'],
  },

  // 12. COVENANT (Diathēkē - Greek)
  {
    id: 'G1242-diatheke',
    englishWord: 'Covenant / Testament',
    originalSpelling: 'διαθήκη',
    language: 'Greek',
    transliteration: 'Diathēkē',
    pronunciation: 'dee-ah-THAY-kay',
    strongsNumber: 'G1242',
    partOfSpeech: 'Noun, Feminine',
    rootWordAndRelatedForms: 'From διατίθημι (diatithēmi, G1303, to arrange, dispose, make a will/compact).',
    lexicalDefinition:
      'A disposition, testament, will, or solemn covenant agreement; in biblical theology, a sovereign relationship initiated by God with solemn promises and obligations.',
    etymologyAndOrigin:
      'Classical Greek used syntheke for agreements between equals and diathēkē for a one-sided will or testament. The biblical translators intentionally chose diathēkē to stress that God’s covenant is not a negotiated contract among equals, but a sovereign divine arrangement.',
    contextualMeaning:
      'The overarching framework of biblical history, climaxing in the New Covenant established by Jesus’ blood (Hebrews 8:6–13; Luke 22:20).',
    biblicalOccurrences: 33,
    relevantReferences: ['Hebrews 8:6', 'Hebrews 9:15', 'Luke 22:20', 'Galatians 3:15', 'Matthew 26:28'],
    examplesOfUsage: [
      {
        ref: 'Luke 22:20',
        passageSnippet: 'This cup is the new covenant [diathēkē] in my blood, which is poured out for you.',
        translationNote: 'Inauguration of the New Covenant foretold in Jeremiah 31:31.',
      },
      {
        ref: 'Hebrews 9:15',
        passageSnippet: 'For this reason Christ is the mediator of a new covenant...',
        translationNote: 'Christ’s death redeems those under the first covenant and secures eternal inheritance.',
      },
    ],
    sourceAttribution: "Thayer's Greek-English Lexicon (G1242) & BDAG",
    relatedEnglishWords: ['Testament', 'Pact', 'Compact', 'Berit'],
  },

  // 12B. COVENANT (Berit - Hebrew)
  {
    id: 'H1285-berit',
    englishWord: 'Covenant',
    originalSpelling: 'בְּרִית',
    language: 'Hebrew',
    transliteration: 'Berit',
    pronunciation: 'beh-REET',
    strongsNumber: 'H1285',
    partOfSpeech: 'Noun, Feminine',
    rootWordAndRelatedForms: 'Likely derived from an Akkadian root meaning "to bind" or related to the Hebrew idiom "to cut a covenant" (karat berit).',
    lexicalDefinition:
      'A binding treaty, compact, covenant, solemn pledge sealed by oath and blood.',
    etymologyAndOrigin:
      'In Ancient Near Eastern culture, covenants were cut (karat) by dividing slaughtered animals, symbolizing the curse invoked if the oath were broken (Genesis 15).',
    contextualMeaning:
      'The architectural spine of the Old Testament: Noahic, Abrahamic, Mosaic, Davidic, and the prophetic promise of the New Covenant (Jeremiah 31:31).',
    biblicalOccurrences: 284,
    relevantReferences: ['Genesis 15:18', 'Genesis 17:7', 'Exodus 24:8', 'Jeremiah 31:31', '2 Samuel 7:12'],
    examplesOfUsage: [
      {
        ref: 'Genesis 15:18',
        passageSnippet: 'On that day the LORD made [cut] a covenant [berit] with Abram...',
        translationNote: 'God alone walks between the animal halves, pledging His life for the promise.',
      },
      {
        ref: 'Jeremiah 31:31',
        passageSnippet: '"The days are coming," declares the LORD, "when I will make a new covenant [berit chadashah] with the people of Israel..."',
        translationNote: 'The prophetic promise of an inward covenant written on human hearts.',
      },
    ],
    sourceAttribution: 'Brown-Driver-Briggs Hebrew and English Lexicon (H1285)',
    relatedEnglishWords: ['Treaty', 'Pledge', 'Alliance', 'Agreement'],
  },

  // 13. KINGDOM (Basileia - Greek)
  {
    id: 'G932-basileia',
    englishWord: 'Kingdom',
    originalSpelling: 'βασιλεία',
    language: 'Greek',
    transliteration: 'Basileia',
    pronunciation: 'bah-sih-LAY-ah',
    strongsNumber: 'G932',
    partOfSpeech: 'Noun, Feminine',
    rootWordAndRelatedForms: 'From βασιλεύς (basileus, G935, king).',
    lexicalDefinition:
      'Sovereignty, royal rule, realm, reign, dominion; the active reign and authority of a monarch.',
    etymologyAndOrigin:
      'Refers primarily to the authority, rule, and reign of a king rather than merely geographic land area. The Kingdom of God (basileia tou theou) is God’s sovereign reign breaking into human history.',
    contextualMeaning:
      'The central theme of Jesus’ preaching: the Kingdom is "already" present in Jesus’ ministry and exorcisms, yet "not yet" fully consummated until his return.',
    biblicalOccurrences: 162,
    relevantReferences: ['Matthew 6:33', 'Mark 1:15', 'Luke 17:21', 'John 18:36', 'Matthew 4:17'],
    examplesOfUsage: [
      {
        ref: 'Mark 1:15',
        passageSnippet: '"The time has come," he said. "The kingdom of God has come near. Repent and believe the good news!"',
        translationNote: 'The thesis statement of Jesus’ public ministry.',
      },
      {
        ref: 'John 18:36',
        passageSnippet: 'Jesus said, "My kingdom is not of this world. If it were, my servants would fight..."',
        translationNote: 'Explaining the otherworldly, non-coercive nature of Christ’s rule before Pilate.',
      },
    ],
    sourceAttribution: "Thayer's Greek-English Lexicon (G932) & Strong's Exhaustive Concordance",
    relatedEnglishWords: ['Reign', 'Dominion', 'Sovereignty', 'Malkhut'],
  },

  // 14. WATER (Hydōr - Greek, Crucial for John 3:5)
  {
    id: 'G5204-hydor',
    englishWord: 'Water',
    originalSpelling: 'ὕδωρ',
    language: 'Greek',
    transliteration: 'Hydōr',
    pronunciation: 'HOO-dohr',
    strongsNumber: 'G5204',
    partOfSpeech: 'Noun, Neuter',
    rootWordAndRelatedForms: 'Primary word; origin of English prefix "hydro-".',
    lexicalDefinition:
      'Water, whether living stream, rainfall, or ritual washing; symbolically representing cleansing, life, and spiritual purification.',
    etymologyAndOrigin:
      'Ancient Indo-European root for moisture/water. Throughout biblical literature, water is both the primordial element over which God’s Spirit hovered (Genesis 1:2) and the prophetic symbol of eschatological cleansing (Ezekiel 36:25).',
    contextualMeaning:
      'In John 3:5 ("born of water and the Spirit"), hydōr evokes Ezekiel 36:25–27 ("I will sprinkle clean water on you, and you will be clean... and I will put my Spirit in you"), baptism of repentance, and cleansing.',
    biblicalOccurrences: 76,
    relevantReferences: ['John 3:5', 'John 4:14', 'John 7:38', 'Ezekiel 36:25', 'Ephesians 5:26', 'Titus 3:5'],
    examplesOfUsage: [
      {
        ref: 'John 3:5',
        passageSnippet: 'Jesus answered, "Very truly I tell you, no one can enter the kingdom of God unless they are born of water and the Spirit."',
        translationNote: 'Pivotal phrase combining Ezekiel’s prophetic cleansing with spiritual regeneration.',
      },
      {
        ref: 'John 4:14',
        passageSnippet: '...but whoever drinks the water I give them will never thirst. Indeed, the water I give them will become in them a spring of water welling up to eternal life.',
        translationNote: 'Water as spiritual life given by Christ.',
      },
    ],
    sourceAttribution: "Thayer's Greek-English Lexicon (G5204) & BDAG",
    relatedEnglishWords: ['Living Water', 'Purification', 'Cleansing'],
  },

  // 15. SPIRIT (Pneuma - Greek / Ruach - Hebrew, Crucial for John 3:5)
  {
    id: 'G4151-pneuma',
    englishWord: 'Spirit / Wind / Breath',
    originalSpelling: 'πνεῦμα',
    language: 'Greek',
    transliteration: 'Pneuma',
    pronunciation: 'PNEH-oo-mah',
    strongsNumber: 'G4151',
    partOfSpeech: 'Noun, Neuter',
    rootWordAndRelatedForms: 'From πνέω (pneō, G4154, to blow, breathe); related to English pneumonia, pneumatic.',
    lexicalDefinition:
      'Wind, breath, life-principle, spirit; specifically the Holy Spirit (Pneuma Hagion), the third Person of the Trinity.',
    etymologyAndOrigin:
      'Reflects the exact semantic range of Hebrew Ruach (H7307): breath, wind, and divine spirit. Jesus plays on this double meaning in John 3:8: "The wind [pneuma] blows wherever it pleases... So it is with everyone born of the Spirit [pneuma]."',
    contextualMeaning:
      'The divine Agent of new birth, regeneration, illumination, and empowering in the Christian life.',
    biblicalOccurrences: 379,
    relevantReferences: ['John 3:5', 'John 3:8', 'Romans 8:9', 'Galatians 5:22', 'Acts 1:8', 'Genesis 1:2'],
    examplesOfUsage: [
      {
        ref: 'John 3:5',
        passageSnippet: '...no one can enter the kingdom of God unless they are born of water and the Spirit [pneuma].',
        translationNote: 'Directly pairs divine cleansing with the supernatural life-giving work of the Holy Spirit.',
      },
      {
        ref: 'John 3:8',
        passageSnippet: 'The wind [pneuma] blows wherever it pleases. You hear its sound, but you cannot tell where it comes from or where it is going.',
        translationNote: 'Intentional wordplay between physical wind and sovereign spiritual regeneration.',
      },
    ],
    sourceAttribution: "Thayer's Greek-English Lexicon (G4151) & BDAG",
    relatedEnglishWords: ['Breath', 'Wind', 'Holy Spirit', 'Ruach'],
  },

  // 16. BORN AGAIN / FROM ABOVE (Anōthen - Greek, Crucial for John 3:3, 3:7)
  {
    id: 'G509-anothen',
    englishWord: 'Born Again / From Above',
    originalSpelling: 'ἄνωθεν',
    language: 'Greek',
    transliteration: 'Anōthen',
    pronunciation: 'AH-no-then',
    strongsNumber: 'G509',
    partOfSpeech: 'Adverb',
    rootWordAndRelatedForms: 'From ἄνω (anō, G507, above, upward).',
    lexicalDefinition:
      'From above, from heaven, from the beginning, anew, again.',
    etymologyAndOrigin:
      'A famous double-entendre in Johannine theology: anōthen can mean both "again" (chronologically a second time) and "from above" (spatially/spiritually from heaven). Nicodemus mistakenly understands it chronologically ("How can someone be born when they are old?"), while Jesus intends spiritual birth from above.',
    contextualMeaning:
      'The supernatural regeneration performed by God from heaven, granting divine lineage to human beings.',
    biblicalOccurrences: 13,
    relevantReferences: ['John 3:3', 'John 3:7', 'John 3:31', 'James 1:17', 'James 3:17'],
    examplesOfUsage: [
      {
        ref: 'John 3:3',
        passageSnippet: 'Jesus replied, "Very truly I tell you, no one can see the kingdom of God unless they are born again [gennēthē anōthen]."',
        translationNote: 'The Johannine double-meaning of birth from heaven / anew.',
      },
      {
        ref: 'James 1:17',
        passageSnippet: 'Every good and perfect gift is from above [anōthen], coming down from the Father of the heavenly lights...',
        translationNote: 'Using anōthen in the spatial/heavenly sense.',
      },
    ],
    sourceAttribution: "Thayer's Greek-English Lexicon (G509) & DA Carson Commentary on John",
    relatedEnglishWords: ['From Above', 'Anew', 'Regeneration'],
  },

  // 17. WORD / REASON (Logos - Greek)
  {
    id: 'G3056-logos',
    englishWord: 'Word / Reason',
    originalSpelling: 'λόγος',
    language: 'Greek',
    transliteration: 'Logos',
    pronunciation: 'LAH-goss',
    strongsNumber: 'G3056',
    partOfSpeech: 'Noun, Masculine',
    rootWordAndRelatedForms: 'From λέγω (legō, G3004, to speak, say, declare).',
    lexicalDefinition:
      'Word, speech, divine communication, message; in John’s Gospel, the eternal Son of God, the divine Agent of creation and revelation.',
    etymologyAndOrigin:
      'Bridged both Jewish and Hellenistic thought: to Greeks, logos was the cosmic rational principle ordering the universe; to Jews, it evoked the creative Word of the Lord ("And God said...", Genesis 1; Psalms 33:6; the Memra in Aramaic Targums). John identifies this Word as a divine Person who became flesh.',
    contextualMeaning:
      'Jesus Christ as the ultimate, eternal self-disclosure and communicative speech of the living God.',
    biblicalOccurrences: 330,
    relevantReferences: ['John 1:1', 'John 1:14', '1 John 1:1', 'Hebrews 4:12', 'Revelation 19:13'],
    examplesOfUsage: [
      {
        ref: 'John 1:1',
        passageSnippet: 'In the beginning was the Word [Logos], and the Word was with God, and the Word was God.',
        translationNote: 'Affirms the eternal pre-existence and full deity of the Logos.',
      },
      {
        ref: 'John 1:14',
        passageSnippet: 'The Word [Logos] became flesh and made his dwelling among us...',
        translationNote: 'The Incarnation: the infinite Creator enters finite human history.',
      },
    ],
    sourceAttribution: "Thayer's Greek-English Lexicon (G3056) & BDAG",
    relatedEnglishWords: ['Communication', 'Reason', 'Christ', 'Davar'],
  },

  // 18. PEACE / WHOLENESS (Shalom - Hebrew / Eirēnē - Greek)
  {
    id: 'H7965-shalom',
    englishWord: 'Peace / Wholeness',
    originalSpelling: 'שָׁלוֹם',
    language: 'Hebrew',
    transliteration: 'Shalom',
    pronunciation: 'shah-LOHM',
    strongsNumber: 'H7965',
    partOfSpeech: 'Noun, Masculine',
    rootWordAndRelatedForms: 'From שָׁלֵם (shalem, H7999, to be complete, sound, whole, make restitution).',
    lexicalDefinition:
      'Completeness, soundness, welfare, health, prosperity, peace, quietness, harmonious relationship with God and community.',
    etymologyAndOrigin:
      'Far richer than the mere absence of conflict; shalom conveys holistic flourishing, flourishing justice, and total well-being resulting from God’s covenant favor.',
    contextualMeaning:
      'The Messianic blessing ("Prince of Peace", Isaiah 9:6) culminating in reconciliation with God through the blood of the cross (Colossians 1:20).',
    biblicalOccurrences: 236,
    relevantReferences: ['Numbers 6:26', 'Isaiah 9:6', 'Isaiah 26:3', 'Jeremiah 29:11', 'Psalms 122:6'],
    examplesOfUsage: [
      {
        ref: 'Numbers 6:26',
        passageSnippet: '...the LORD turn his face toward you and give you peace [shalom].',
        translationNote: 'The climactic blessing of the Aaronic benediction.',
      },
      {
        ref: 'Isaiah 9:6',
        passageSnippet: '...and he will be called Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace [Sar-Shalom].',
        translationNote: 'The Messianic title guaranteeing universal restorative harmony.',
      },
    ],
    sourceAttribution: 'Brown-Driver-Briggs Hebrew and English Lexicon (H7965)',
    relatedEnglishWords: ['Wholeness', 'Completeness', 'Eirēnē', 'Reconciliation'],
  },
];

/**
 * Helper to query the biblical lexicon by keyword, original spelling, transliteration, or Strong's number.
 */
export function searchBiblicalLexicon(query: string): LexiconEntry[] {
  if (!query || !query.trim()) return BIBLICAL_LEXICON;
  const q = query.trim().toLowerCase();
  return BIBLICAL_LEXICON.filter(
    (item) =>
      item.englishWord.toLowerCase().includes(q) ||
      item.originalSpelling.includes(q) ||
      item.transliteration.toLowerCase().includes(q) ||
      (item.strongsNumber && item.strongsNumber.toLowerCase().includes(q)) ||
      item.language.toLowerCase().includes(q) ||
      (item.relatedEnglishWords && item.relatedEnglishWords.some((r) => r.toLowerCase().includes(q))) ||
      item.lexicalDefinition.toLowerCase().includes(q)
  );
}

/**
 * Retrieve a single word by id or Strong's number
 */
export function getLexiconEntryById(id: string): LexiconEntry | undefined {
  const norm = id.trim().toLowerCase();
  return BIBLICAL_LEXICON.find(
    (e) => e.id.toLowerCase() === norm || (e.strongsNumber && e.strongsNumber.toLowerCase() === norm)
  );
}

