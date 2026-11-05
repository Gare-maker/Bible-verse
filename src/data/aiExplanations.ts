import { AIExplanationData, TranslationId } from '@/types/bible';
import { getVerseText } from './scriptureDatabase';
import { getCrossReferencesForVerse } from './crossReferences';

interface CuratedConnectionExplanation {
  keys: [string, string];
  title: string;
  summary: string;
  originalContextFirst: string;
  historicalCircumstances: string;
  contextSecond: string;
  whyReferenced: string;
  similaritiesAndDifferences: string;
  theologicalSignificance: string;
  lexicalStudy: {
    term: string;
    transliteration: string;
    language: 'Hebrew' | 'Greek';
    strongs: string;
    meaning: string;
  }[];
  disputedInterpretations: string;
  relatedReferences: string[];
}

export const CURATED_CONNECTION_EXPLANATIONS: CuratedConnectionExplanation[] = [
  {
    keys: ['matthew 1:23', 'isaiah 7:14'],
    title: 'The Virgin Birth & Immanuel Prophecy (Matthew 1:23 ↔ Isaiah 7:14)',
    summary:
      'Matthew cites Isaiah’s eighth-century BC oracle to King Ahaz as the ultimate messianic fulfilment of God dwelling personally with His people ("Immanuel") through the virgin conception of Jesus.',
    originalContextFirst:
      'In Matthew 1:18–25, the Evangelist narrates the conception and birth of Jesus the Messiah. Following the royal genealogy tracing Jesus to Abraham and David (Matthew 1:1–17), Matthew explains that Mary was pledged to Joseph of the house of David when she conceived by the Holy Spirit. Matthew 1:22–23 introduces the first of ten "fulfilment citations" in his Gospel, anchoring the miraculous birth of Jesus directly in prophetic Scripture.',
    historicalCircumstances:
      'Isaiah 7:14 was spoken around 734 BC during the Syro-Ephraimite Crisis. Rezin (King of Aram/Syria) and Pekah (King of the Northern Kingdom of Israel) besieged Jerusalem to force King Ahaz of Judah into an anti-Assyrian coalition and replace the Davidic line. Through Isaiah, God promised that the house of David would not be extinguished and gave the sign of a child named Immanuel ("God with us") before whose maturity both hostile kings would be deposed.',
    contextSecond:
      'In Isaiah 7–12 (often called the "Book of Immanuel"), the sign given to the unbelieving House of David moves from a near-horizon historical assurance in Ahaz’s court to an eschatological royal figure who will be called "Wonderful Counselor, Mighty God, Everlasting Father, Prince of Peace" (Isaiah 9:6) and a shoot from the stump of Jesse (Isaiah 11:1).',
    whyReferenced:
      'Matthew quotes the Septuagint (LXX) rendering of Isaiah 7:14 to demonstrate two foundational truths: (1) Jesus’ conception by the Holy Spirit without a human father was not an unforeseen anomaly, but the divinely ordained sign promised to the House of David; and (2) in Jesus of Nazareth, YHWH Himself has come to dwell among His covenant people ("God with us"), forming an inclusio with Jesus’ final promise in Matthew 28:20 ("I am with you always").',
    similaritiesAndDifferences:
      'Both passages share the exact structure of conception, birth of a son, and the prophetic name Immanuel. Key textual nuance: Isaiah 7:14 reads "she [or the mother] will call his name Immanuel," whereas Matthew 1:23 reads "they will call his name Immanuel," expanding the recognition of Jesus’ divine identity to the whole redeemed community. Furthermore, Isaiah’s Hebrew uses ‘almah (young woman of childbearing age, presumptively unmarried/virgin), while the Septuagint and Matthew use the specific Greek noun parthenos (virgin).',
    theologicalSignificance:
      'This connection unites Old Testament Davidic covenant theology with New Testament Incarnation Christology. Jesus is simultaneously the legal heir to David’s throne through Joseph’s adoption and the divine Son conceived by the Spirit—literally fulfilling the name Immanuel ("God with us").',
    lexicalStudy: [
      {
        term: 'עַלְמָה',
        transliteration: '‘almāh',
        language: 'Hebrew',
        strongs: 'H5959',
        meaning: 'A young woman of marriageable age; in every Old Testament occurrence (Gen 24:43; Exod 2:8; Ps 68:25), it refers to an unmarried young woman of unblemished chastity.',
      },
      {
        term: 'παρθένος',
        transliteration: 'parthenos',
        language: 'Greek',
        strongs: 'G3933',
        meaning: 'Specifically a virgin; chosen by pre-Christian Jewish translators of the Septuagint (c. 200 BC) for Isaiah 7:14 and cited by Matthew under apostolic inspiration.',
      },
      {
        term: 'עִמָּנוּ אֵל',
        transliteration: '‘Immānû ’Ēl',
        language: 'Hebrew',
        strongs: 'H6005',
        meaning: 'Literally "With us is God" (Immanu = with us + El = God), signifying God’s protective and redemptive presence.',
      },
    ],
    disputedInterpretations:
      'Scholars discuss three primary interpretive frameworks for how Isaiah 7:14 relates to Matthew 1:23: (1) Double Reference / Typological Fulfilment, where a child born in Ahaz’s day (such as Maher-Shalal-Hash-Baz in Isa 8:3 or Hezekiah) served as a near-term type pointing forward to the ultimate virgin birth of the Messiah; (2) Single Direct Messianic Prophecy, holding that addressing the entire plural "House of David" (Isa 7:13) lifted the sign directly to the future virgin birth; and (3) Historical-Critical Reading, which focuses solely on the eighth-century Judean crisis while viewing Matthew’s citation as Christological midrash.',
    relatedReferences: ['Isaiah 7:14', 'Matthew 1:23', 'Genesis 3:15', 'Micah 5:2', 'John 1:14', 'Matthew 18:20'],
  },
  {
    keys: ['john 1:1', 'genesis 1:1'],
    title: 'Cosmic Creation & The Eternal Logos (John 1:1 ↔ Genesis 1:1)',
    summary:
      'John intentionally opens his Gospel with the exact Greek words of Genesis 1:1 ("En archē" / "In the beginning") to reveal that the divine Word (Logos) who became flesh in Jesus was present with God before creation and is the personal agent through whom the universe was made.',
    originalContextFirst:
      'John 1:1–18 forms the majestic Prologue to the Fourth Gospel. Rather than beginning with Bethlehem or John the Baptist’s ministry, John steps back into eternity past before the creation of time and matter to identify who Jesus is in His pre-existent divine nature.',
    historicalCircumstances:
      'Written late in the first century AD (likely from Ephesus) to a diverse audience of both Jewish and Gentile readers, John’s prologue bridges Hebrew creation theology (God speaking creation into existence by His Word, "And God said...") with Hellenistic philosophical inquiries into the cosmic Logos (reason/ordering principle of the cosmos).',
    contextSecond:
      'Genesis 1:1–5 opens the Torah and the entire Hebrew Bible by proclaiming YHWH as the transcendent Creator who brings cosmos out of chaos solely through His spoken word ("And God said, ‘Let there be light’").',
    whyReferenced:
      'By echoing "In the beginning" (Genesis 1:1) and immediately linking the Word with Light overcoming Darkness (Genesis 1:3–5; John 1:4–5), John demonstrates that the arrival of Jesus Christ is the dawn of the New Creation, authored by the very same eternal Word who spoke the first creation into existence.',
    similaritiesAndDifferences:
      'Both passages open with the identical phrase "In the beginning" (Hebrew: Bereshit; Greek LXX & John: En archē) and center on God, the spoken Word, Light, Life, and Darkness. However, while Genesis 1:1 moves forward from the moment of creation ("God created"), John 1:1 uses the Greek imperfect verb ēn ("was" / already existed continuously) to look back behind Genesis 1:1 into timeless eternity.',
    theologicalSignificance:
      'John 1:1 preserves both the personal distinction between the Father and the Son ("the Word was with God" — pros ton Theon, face-to-face fellowship) and their shared divine essence ("and the Word was God" — Theos ēn ho Logos). Creation and Redemption are revealed as the unified work of the Triune God.',
    lexicalStudy: [
      {
        term: 'בְּרֵאשִׁית',
        transliteration: 'Bərē’šîṯ',
        language: 'Hebrew',
        strongs: 'H7225',
        meaning: 'In the beginning / at the head of time and cosmic order; the Hebrew title of the book of Genesis.',
      },
      {
        term: 'λόγος',
        transliteration: 'Logos',
        language: 'Greek',
        strongs: 'G3056',
        meaning: 'Word, divine self-expression, decree, and wisdom; corresponds to the Old Testament Memra (Word of the LORD) and Chokmah (Wisdom in Prov 8:22–30).',
      },
    ],
    disputedInterpretations:
      'Grammatical debates occasionally focus on the anarthrous predicate nominative Theos in the third clause of John 1:1c ("and the Word was God"). Mainstream Greek grammarians (Colwell, Wallace) demonstrate that placing Theos before the verb without the article denotes qualitative deity—affirming that the Logos possesses the full nature of God without collapsing the Son into the person of the Father (Sabellianism) or reducing Him to a lesser deity (Arianism).',
    relatedReferences: ['Genesis 1:1', 'Genesis 1:3', 'John 1:1', 'John 1:3', 'John 1:14', 'Colossians 1:16', 'Hebrews 1:2'],
  },
  {
    keys: ['deuteronomy 32:6', 'isaiah 63:16'],
    title: 'The Covenant Father & Creator of Israel (Deuteronomy 32:6 ↔ Isaiah 63:16)',
    summary:
      'Moses’ piercing rhetorical question in the Song of Moses ("Is he not your Father, your Creator / who bought you?") establishes the foundational Old Testament doctrine of God’s covenantal fatherhood, later echoed in Isaiah’s prayer for national redemption.',
    originalContextFirst:
      'In Deuteronomy 32:1–6, Moses summons heaven and earth as covenant witnesses against Israel’s future apostasy. After extolling YHWH as "the Rock, his works are perfect" (v. 4), Moses exposes the tragedy of Israel’s unfaithfulness in verse 6 by reminding them that the LORD is their Father who bought (redeemed) and formed them at the Exodus.',
    historicalCircumstances:
      'Delivered on the Plains of Moab around 1406 BC just before Moses’ death on Mount Nebo, the Song of Moses was commanded to be memorized by every generation of Israel as a prophetic testimony during future exile and restoration.',
    contextSecond:
      'In Isaiah 63:15–16, the prophet intercedes on behalf of a chastened nation, appealing directly to the language of Deuteronomy 32:6: "You, LORD, are our Father, our Redeemer from of old is your name."',
    whyReferenced:
      'Isaiah appeals to Moses’ covenant song because God’s fatherhood over Israel was grounded not in human merit, but in His sovereign act of creating and purchasing (redeeming) His people out of bondage.',
    similaritiesAndDifferences:
      'Both passages unite the rare Old Testament title of God as "Father" (’Āḇ) with His work as Redeemer/Buyer. Notice the footnote in Deuteronomy 32:6 ("Or Father, who bought you"): the Hebrew verb qānāh means both "to create/form" and "to acquire/purchase out of slavery."',
    theologicalSignificance:
      'Prepares the way for the New Testament revelation of God the Father ("one God, the Father, from whom all things came" in 1 Corinthians 8:6) and our adoption as sons and daughters redeemed at a price.',
    lexicalStudy: [
      {
        term: 'קָנָה',
        transliteration: 'qānāh',
        language: 'Hebrew',
        strongs: 'H7069',
        meaning: 'To acquire, purchase, redeem, or create; hence the NIV footnote "32:6 Or Father, who bought you."',
      },
      {
        term: 'צוּר',
        transliteration: 'ṣûr',
        language: 'Hebrew',
        strongs: 'H6697',
        meaning: 'Cliff, boulder, or immutable refuge ("The Rock" in Deut 32:4), applied to Christ in 1 Corinthians 10:4.',
      },
    ],
    disputedInterpretations:
      'Translators weigh whether qānāh in Deuteronomy 32:6 primarily emphasizes cosmic creation ("your Creator," NIV/ESV) or historical redemption at the Exodus ("who bought you," KJV/NKJV/NIV margin). Most Hebrew lexicons conclude it intentionally carries a double entendre of both creation and covenant purchase.',
    relatedReferences: ['Deuteronomy 32:4', 'Deuteronomy 32:6', 'Isaiah 63:16', '1 Corinthians 8:6', '1 Corinthians 10:4'],
  },
  {
    keys: ['matthew 18:16', 'deuteronomy 19:15'],
    title: 'Reconciliation & The Testimony of Two or Three Witnesses (Matthew 18:16 ↔ Deuteronomy 19:15)',
    summary:
      'In His discourse on dealing with a sinning brother (Matthew 18:15–20), Jesus quotes the judicial safeguard of Deuteronomy 19:15, transforming an Old Testament courtroom standard into a pastoral process for restorative reconciliation.',
    originalContextFirst:
      'In Matthew 18:15–20 (the Fourth Discourse of Matthew’s Gospel, focused on life in the Kingdom community), Jesus outlines a three-step restorative path when a fellow believer sins: (1) private one-on-one conversation to "win your brother over" (v. 15, echoing Leviticus 19:17); (2) bringing one or two others (v. 16); and (3) bringing the matter before the assembly/church (v. 17).',
    historicalCircumstances:
      'In ancient Israelite law (Deuteronomy 19:15), no person could be convicted on the word of a single accuser; two or three independent witnesses were required to protect the innocent from malice or misunderstanding.',
    contextSecond:
      'Deuteronomy 19:15–21 regulates judicial testimony in Israel’s courts, ensuring truth, fairness, and accountability in covenant disputes.',
    whyReferenced:
      'Jesus quotes Deuteronomy 19:15 to ensure that interpersonal conflict in the church is handled neither by gossip nor by unverified solo accusation, while also providing loving witnesses who can confirm the reconciliation effort and pray in agreement (Matthew 18:19–20).',
    similaritiesAndDifferences:
      'While Deuteronomy 19:15 functions primarily in a forensic courtroom setting to establish guilt or innocence, Jesus applies the principle redemptively: the "one or two others" in Matthew 18:16 are not merely witnesses of the original offense, but witnesses and mediators of the present restorative conversation.',
    theologicalSignificance:
      'Connects Torah justice with Gospel grace: discipline in Christ’s church is never punitive for its own sake, but always aims at winning back the erring brother or sister in the presence of Christ Himself (Matthew 18:20).',
    lexicalStudy: [
      {
        term: 'κερδαίνω',
        transliteration: 'kerdainō',
        language: 'Greek',
        strongs: 'G2770',
        meaning: 'To gain, win over, or rescue from loss ("you have gained your brother" in Matt 18:15).',
      },
      {
        term: 'ἐκκλησία',
        transliteration: 'ekklēsia',
        language: 'Greek',
        strongs: 'G1577',
        meaning: 'The called-out assembly or congregation; used in the Septuagint for the Qahal (covenant assembly) of Israel.',
      },
    ],
    disputedInterpretations:
      'Textual critics note a minor manuscript variant in Matthew 18:15 ("sins against you" in KJV/NKJV/ESV vs "sins" in some Alexandrian manuscripts), and interpreters discuss whether the "two or three witnesses" must have witnessed the initial transgression or witness the reconciliation meeting.',
    relatedReferences: ['Matthew 18:15', 'Matthew 18:16', 'Matthew 18:20', 'Deuteronomy 19:15', 'Leviticus 19:17'],
  },
];

export function generateAIExplanationForConnection(
  primaryRef: string,
  connectedRef: string,
  translation: TranslationId
): AIExplanationData {
  const normA = primaryRef.trim().toLowerCase();
  const normB = connectedRef.trim().toLowerCase();

  const curated = CURATED_CONNECTION_EXPLANATIONS.find(
    (item) =>
      (item.keys[0] === normA && item.keys[1] === normB) ||
      (item.keys[0] === normB && item.keys[1] === normA)
  );

  const textA = getVerseText(primaryRef, translation) || `Scripture passage ${primaryRef}`;
  const textB = getVerseText(connectedRef, translation) || `Scripture passage ${connectedRef}`;

  if (curated) {
    const isReversed = curated.keys[0] === normB;
    return {
      id: `ai-exp-${Date.now()}`,
      primaryRef,
      connectedRef,
      translation,
      title: curated.title,
      summary: curated.summary,
      originalContextFirst: isReversed ? curated.contextSecond : curated.originalContextFirst,
      historicalCircumstances: curated.historicalCircumstances,
      contextSecond: isReversed ? curated.originalContextFirst : curated.contextSecond,
      whyReferenced: curated.whyReferenced,
      similaritiesAndDifferences: curated.similaritiesAndDifferences,
      theologicalSignificance: curated.theologicalSignificance,
      lexicalStudy: curated.lexicalStudy,
      disputedInterpretations: curated.disputedInterpretations,
      relatedReferences: curated.relatedReferences,
      generatedAt: new Date().toISOString(),
    };
  }

  // Dynamic RAG-based structured synthesis for any other verse pair using retrieved texts
  const refsA = getCrossReferencesForVerse(primaryRef).map((r) => r.connectedRef);
  const refsB = getCrossReferencesForVerse(connectedRef).map((r) => r.connectedRef);
  const combinedRelated = Array.from(
    new Set([primaryRef, connectedRef, ...refsA, ...refsB])
  );

  return {
    id: `ai-exp-${Date.now()}`,
    primaryRef,
    connectedRef,
    translation,
    title: `Biblical Connection Analysis: ${primaryRef} & ${connectedRef}`,
    summary: `Comparative canonical analysis examining how ${primaryRef} ("${textA.slice(0, 90)}${textA.length > 90 ? '...' : ''}") and ${connectedRef} ("${textB.slice(0, 90)}${textB.length > 90 ? '...' : ''}") illuminate one another across redemptive history.`,
    originalContextFirst: `${primaryRef} (${translation}): "${textA}" — Within its literary and canonical setting, this passage establishes a foundational theological witness regarding God’s covenant character, word, and redemptive action.`,
    historicalCircumstances: `Both passages emerge from pivotal moments in biblical history where God’s revelation addressed the covenant faithfulness of His people and pointed toward the ultimate fulfilment of His promises in redemptive history.`,
    contextSecond: `${connectedRef} (${translation}): "${textB}" — In its own canonical horizon, this text either anticipates, quotes, or echoes the theological motif present in ${primaryRef}.`,
    whyReferenced: `The canonical link between ${primaryRef} and ${connectedRef} demonstrates the organic unity of Scripture: later biblical authors drew upon earlier revelation not as isolated proof-texts, but by bringing the entire context of the earlier passage into fuller light.`,
    similaritiesAndDifferences: `Both ${primaryRef} and ${connectedRef} converge on shared vocabulary, covenant themes, and divine attributes in the ${translation} text, while reflecting their distinct historical covenants and literary genres (narrative, poetry, prophecy, or epistle).`,
    theologicalSignificance: `Reading ${primaryRef} and ${connectedRef} together deepens our understanding of progressive revelation—showing how Old Testament promises, types, and Torah principles find their theological telos in the New Testament.`,
    lexicalStudy: [
      {
        term: 'דָּבָר / λόγος',
        transliteration: 'Dāḇār / Logos',
        language: 'Hebrew',
        strongs: 'H1697 / G3056',
        meaning: 'The covenant Word and self-revelation of God uniting Old Testament promise and New Testament fulfilment.',
      },
    ],
    disputedInterpretations:
      'Exegetes distinguish between direct verbal quotations (marked by introductory formulas like "It is written"), conscious authorial allusions, and broader canonical/thematic parallels. AI-assisted thematic insights are kept distinct from verified textual cross-references.',
    relatedReferences: combinedRelated,
    generatedAt: new Date().toISOString(),
  };
}

export function generateAIExplanationForSingleVerse(
  primaryRef: string,
  translation: TranslationId
): AIExplanationData {
  const text = getVerseText(primaryRef, translation) || `Scripture passage ${primaryRef}`;
  const verifiedRefs = getCrossReferencesForVerse(primaryRef);

  if ( verifiedRefs.length > 0 ) {
    const firstConnected = verifiedRefs[0].connectedRef;
    const base = generateAIExplanationForConnection(primaryRef, firstConnected, translation);
    return {
      ...base,
      title: `Exegetical & Cross-Reference Study: ${primaryRef}`,
      summary: `Comprehensive verse study of ${primaryRef} (${translation}) alongside its primary canonical connection in ${firstConnected}.`,
    };
  }

  return {
    id: `ai-verse-${Date.now()}`,
    primaryRef,
    translation,
    title: `Exegetical & Historical Study: ${primaryRef}`,
    summary: `In-depth biblical analysis of ${primaryRef} in the ${translation} translation: "${text}"`,
    originalContextFirst: `${primaryRef} (${translation}): "${text}" — Situated within its chapter and book context, this verse contributes directly to the author’s overarching theological argument.`,
    historicalCircumstances: `Composed within the historical framework of canonical Scripture, this passage addresses the covenant community’s faith, obedience, and reverence before God.`,
    theologicalSignificance: `Reveals the unchanging character of God, the authority of His Word, and its enduring application within the overarching story of creation, fall, redemption, and restoration.`,
    relatedReferences: [primaryRef, ...verifiedRefs.map((r) => r.connectedRef)],
    generatedAt: new Date().toISOString(),
  };
}

export function generateFollowUpResponse(
  question: string,
  primaryRef: string,
  connectedRef: string | undefined,
  translation: TranslationId
): { content: string; citedReferences: string[] } {
  const q = question.toLowerCase();
  const textA = getVerseText(primaryRef, translation);
  const textB = connectedRef ? getVerseText(connectedRef, translation) : '';
  const verifiedRefs = getCrossReferencesForVerse(primaryRef).map((r) => r.connectedRef);
  const cited = Array.from(
    new Set([primaryRef, ...(connectedRef ? [connectedRef] : []), ...verifiedRefs])
  );

  if (q.includes('hebrew') || q.includes('greek') || q.includes('word') || q.includes('original')) {
    return {
      content: `Examining the original languages for **${primaryRef}**${connectedRef ? ` and **${connectedRef}**` : ''}:\n\nIn the Hebrew Masoretic Text (MT), Septuagint (LXX), and Greek New Testament (NA28), the lexical choices intentionally bridge both Testaments. When New Testament writers cite or allude to Old Testament passages, they draw from the Septuagint and Hebrew covenantal vocabulary. Compare how the ${translation} renders ${primaryRef} ("*${textA}*")${connectedRef ? ` alongside ${connectedRef} ("*${textB}*")` : ''}.`,
      citedReferences: cited,
    };
  }

  if (q.includes('context') || q.includes('history') || q.includes('historical')) {
    return {
      content: `Looking closely at the historical and literary context of **${primaryRef}**${connectedRef ? ` and **${connectedRef}**` : ''}:\n\n1. **Immediate Literary Setting:** ${primaryRef} must be read within the flow of its preceding chapter and surrounding verses rather than in isolation.\n2. **Covenantal Horizon:** ${connectedRef ? `The connection to ${connectedRef} bridges two distinct historical eras, showing how God's word spoken in an earlier generation is fulfilled and expounded in canonical Scripture.` : `This passage stands within the historical progression of redemptive history.`}`,
      citedReferences: cited,
    };
  }

  return {
    content: `Based on the canonical texts of **${primaryRef}**${connectedRef ? ` and **${connectedRef}**` : ''} (${translation}):\n\n- **${primaryRef}:** "${textA}"\n${connectedRef ? `- **${connectedRef}:** "${textB}"\n\n` : '\n'}Your question highlights a key dimension of biblical exegesis. Scripture interprets Scripture (*analogia scripturae*) through verified textual and thematic connections.${verifiedRefs.length > 0 ? ` Verified cross-references for ${primaryRef} include ${verifiedRefs.join(', ')}.` : ''}`,
    citedReferences: cited,
  };
}

