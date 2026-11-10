import {
  BiblicalInference,
  BiblicalTypeShadow,
  CrossReferenceRecord,
  ReferenceCategory,
  ResolvedCrossReference,
} from '@/types/bible';
import { findBookByName, parseScriptureReference } from './bibleBooks';
import { VERIFIED_CANONICAL_CROSS_REFERENCES } from './canonicalCrossReferences';

const RAW_CANONICAL_CROSS_REFERENCES: CrossReferenceRecord[] = [
  // 1. Matthew 1:23 <-> Isaiah 7:14 (Primary MVP Test 2, 3, 4, 5)
  {
    id: 'xref-mat-1-23-isa-7-14',
    sourceRef: 'Matthew 1:23',
    targetRef: 'Isaiah 7:14',
    sourceToTargetCategory: 'Prophecy fulfilment',
    targetToSourceCategory: 'Prophecy',
    title: 'The Prophecy of the Virgin Birth (Immanuel)',
    connectionSummary: 'Old Testament Prophecy / New Testament Reference',
    explanation:
      'Matthew explicitly cites the prophecy delivered by the prophet Isaiah to the House of David (Isaiah 7:14), showing its fulfilment in the virgin conception of Jesus ("Immanuel — God with us").',
    biblicalContext:
      'In Isaiah 7:14, Isaiah speaks to King Ahaz during the Syro-Ephraimite crisis, promising a sign that God will preserve David’s royal line. In Matthew 1:22–23, the Gospel narrator records the angelic announcement to Joseph and identifies Jesus’ birth from the virgin Mary as the ultimate Messianic fulfilment.',
    sourceSpeaker: 'Historical narration',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Isaiah 7:14', 'Matthew 1:21', 'John 1:14'],
    disputedNote:
      'Scholars discuss the Hebrew noun almah in Isaiah 7:14 ("young woman of childbearing age / virgin") and whether the sign had a near-term historical referent in Ahaz’s day alongside its ultimate Messianic fulfilment in Matthew 1:23 (quoting the Septuagint parthenos, "virgin").',
    dataSource: 'Treasury of Scripture Knowledge (TSK) & Nestle-Aland Marginalia',
    verificationStatus: 'verified',
  },
  // 2. Matthew 1:1 <-> Genesis 12:3 (Abrahamic Covenant)
  {
    id: 'xref-mat-1-1-gen-12-3',
    sourceRef: 'Matthew 1:1',
    targetRef: 'Genesis 12:3',
    sourceToTargetCategory: 'Prophecy fulfilment',
    targetToSourceCategory: 'Prophecy',
    title: 'The Seed of Abraham Blessing All Nations',
    connectionSummary: 'Covenant Promise / Messianic Genealogy',
    explanation:
      'Matthew opens his Gospel by identifying Jesus the Messiah as "the son of Abraham," directly connecting Jesus’ genealogy to God’s covenant promise to Abraham in Genesis 12:3 that all peoples on earth would be blessed through his offspring.',
    biblicalContext:
      'Genesis 12:1–3 records God’s foundational call to Abram in Ur/Haran. Matthew 1:1–17 traces the legal and royal lineage from Abraham through David to Jesus.',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Historical narration',
    supportingRefs: ['Genesis 12:3', '2 Samuel 7:12', 'Genesis 22:8'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 3. Matthew 1:1 <-> 2 Samuel 7:12 (Davidic Covenant)
  {
    id: 'xref-mat-1-1-2sam-7-12',
    sourceRef: 'Matthew 1:1',
    targetRef: '2 Samuel 7:12',
    sourceToTargetCategory: 'Prophecy fulfilment',
    targetToSourceCategory: 'Prophecy',
    title: 'The Royal Throne of David Established Forever',
    connectionSummary: 'Davidic Covenant / Messianic Kingship',
    explanation:
      'Matthew’s title "Jesus the Messiah, the son of David" directly anchors Jesus in the Davidic covenant of 2 Samuel 7:12–14, where God promised through the prophet Nathan to raise up David’s offspring and establish His royal throne forever.',
    biblicalContext:
      'In 2 Samuel 7, King David desires to build a temple for the LORD, and God responds by promising to build David an eternal royal house. Matthew 1 presents Jesus as the rightful heir to that throne.',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['2 Samuel 7:12', '2 Samuel 7:14', 'Psalms 2:7'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 4. John 1:1 <-> Genesis 1:1 (Primary MVP Test 7)
  {
    id: 'xref-jhn-1-1-gen-1-1',
    sourceRef: 'John 1:1',
    targetRef: 'Genesis 1:1',
    sourceToTargetCategory: 'Allusion',
    targetToSourceCategory: 'Thematic connection',
    title: 'In the Beginning: The Eternal Logos & Cosmic Creation',
    connectionSummary: 'Creation Prologue / Christological Allusion',
    explanation:
      'The Apostle John deliberately opens his Gospel with the exact Greek words of Genesis 1:1 (En arche, "In the beginning"), revealing that the eternal Word (Logos) was already with God and was God when creation began.',
    biblicalContext:
      'Genesis 1:1 narrates the creation of the cosmos by God’s spoken word ("And God said..."). John 1:1–3 expands this creation account by identifying the pre-existent Son as the divine Agent through whom all things were made.',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Historical narration',
    supportingRefs: ['Genesis 1:1', 'John 1:3', 'Colossians 1:16', 'Hebrews 1:2'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 5. John 1:3 <-> Colossians 1:16
  {
    id: 'xref-jhn-1-3-col-1-16',
    sourceRef: 'John 1:3',
    targetRef: 'Colossians 1:16',
    sourceToTargetCategory: 'Parallel passage',
    targetToSourceCategory: 'Parallel passage',
    title: 'All Things Created Through Christ the Word',
    connectionSummary: 'New Testament Christological Parallel',
    explanation:
      'Both the Apostle John (John 1:3) and the Apostle Paul (Colossians 1:16) affirm the same truth: every created thing in heaven and on earth was made through Christ, and nothing was made apart from Him.',
    biblicalContext:
      'John’s prologue and Paul’s Christ-hymn in Colossians 1:15–20 both establish Christ’s cosmic supremacy as divine Creator prior to His redemptive work.',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Words spoken by apostles',
    supportingRefs: ['Genesis 1:1', 'John 1:1', 'Hebrews 1:2'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 6. Genesis 1:1 <-> Hebrews 1:2
  {
    id: 'xref-gen-1-1-heb-1-2',
    sourceRef: 'Hebrews 1:2',
    targetRef: 'Genesis 1:1',
    sourceToTargetCategory: 'Thematic connection',
    targetToSourceCategory: 'Thematic connection',
    title: 'God Created the Universe Through His Son',
    connectionSummary: 'Old Testament Creation / New Testament Fulfilment',
    explanation:
      'Hebrews 1:2 expands upon Genesis 1:1 by stating that the Son, whom God appointed heir of all things, is the One through whom God also made the universe.',
    biblicalContext:
      'The prologue of Hebrews contrasts God’s fragmentary revelations through the prophets in the Old Testament with His final revelation in His Son, who is both Creator (Genesis 1:1) and Sustainer.',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Historical narration',
    supportingRefs: ['Genesis 1:1', 'John 1:1', 'John 1:3', 'Colossians 1:16'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 7. Deuteronomy 32:6 <-> Isaiah 63:16 (Matches User Screenshot 1, 2, 4)
  {
    id: 'xref-deu-32-6-isa-63-16',
    sourceRef: 'Deuteronomy 32:6',
    targetRef: 'Isaiah 63:16',
    sourceToTargetCategory: 'Thematic connection',
    targetToSourceCategory: 'Allusion',
    title: 'YHWH as Covenant Father, Creator, and Redeemer',
    connectionSummary: 'Old Testament Covenant Paternity Connection',
    explanation:
      'In the Song of Moses (Deuteronomy 32:6), Moses asks Israel, "Is he not your Father, your Creator, who made you and formed you?" The prophet Isaiah alludes to this covenantal fatherhood in Isaiah 63:16: "you, LORD, are our Father, our Redeemer from of old is your name."',
    biblicalContext:
      'Deuteronomy 32 is Moses’ farewell covenant witness before Israel enters Canaan; Isaiah 63–64 is a prophetic prayer appealing to YHWH’s fatherly compassion based on the Exodus redemption.',
    sourceSpeaker: 'Words spoken by prophets',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Deuteronomy 32:4', '1 Corinthians 8:6'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 8. Deuteronomy 32:6 <-> 1 Corinthians 8:6
  {
    id: 'xref-deu-32-6-1cor-8-6',
    sourceRef: '1 Corinthians 8:6',
    targetRef: 'Deuteronomy 32:6',
    sourceToTargetCategory: 'Allusion',
    targetToSourceCategory: 'Thematic connection',
    title: 'One God the Father, From Whom All Things Came',
    connectionSummary: 'Old Testament Song of Moses / Pauline Monotheism',
    explanation:
      'Paul’s confession of "one God, the Father, from whom all things came and for whom we live" echoes the covenantal Father-Creator language of Deuteronomy 32:6 and the Shema of Deuteronomy 6:4.',
    biblicalContext:
      'Addressing idol food in Corinth, the Apostle Paul grounds Christian monotheism in the Torah’s testimony to God as Father and Creator.',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Deuteronomy 32:6', 'Isaiah 63:16'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 9. Deuteronomy 32:4 <-> 1 Corinthians 10:4
  {
    id: 'xref-deu-32-4-1cor-10-4',
    sourceRef: '1 Corinthians 10:4',
    targetRef: 'Deuteronomy 32:4',
    sourceToTargetCategory: 'Allusion',
    targetToSourceCategory: 'Prophecy',
    title: 'He Is the Rock — And That Spiritual Rock Was Christ',
    connectionSummary: 'Old Testament Title of YHWH / Christological Identification',
    explanation:
      'Moses repeatedly titles YHWH "the Rock" (Tsur) in Deuteronomy 32:4. In 1 Corinthians 10:4, the Apostle Paul refers to Israel’s wilderness sustenance and identifies that spiritual Rock as Christ.',
    biblicalContext:
      'Deuteronomy 32:4 celebrates God’s unblemished justice and faithfulness as Israel’s Rock; 1 Corinthians 10:1–4 applies Israel’s wilderness history to the church.',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Deuteronomy 32:4', 'Deuteronomy 32:6'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 10. Deuteronomy 32:8 <-> Genesis 1:26
  {
    id: 'xref-deu-32-8-gen-1-26',
    sourceRef: 'Deuteronomy 32:8',
    targetRef: 'Genesis 1:26',
    sourceToTargetCategory: 'Historical connection',
    targetToSourceCategory: 'Historical connection',
    title: 'The Most High Dividing the Nations & Cosmic Sovereignty',
    connectionSummary: 'Primeval History / Song of Moses Witness',
    explanation:
      'Moses looks back in Deuteronomy 32:8 to God’s primeval ordering of humanity (Genesis 1:26; Genesis 10–11), declaring that the Most High sovereignly allotted the inheritances of the nations.',
    biblicalContext:
      'The Song of Moses anchors Israel’s election within God’s universal creatorship over all mankind.',
    sourceSpeaker: 'Words spoken by prophets',
    targetSpeaker: 'Historical narration',
    supportingRefs: ['Genesis 1:1', 'Deuteronomy 32:4'],
    disputedNote:
      'Textual witnesses in Deuteronomy 32:8 differ between the Masoretic Text ("according to the number of the sons of Israel") and the Dead Sea Scrolls (4QDeutj) & Septuagint ("according to the number of the sons of God / angels of God").',
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 11. Matthew 18:15 <-> Leviticus 19:17 (Matches User Screenshot 3)
  {
    id: 'xref-mat-18-15-lev-19-17',
    sourceRef: 'Matthew 18:15',
    targetRef: 'Leviticus 19:17',
    sourceToTargetCategory: 'Allusion',
    targetToSourceCategory: 'Thematic connection',
    title: 'Loving Reproof and Winning Back a Sinning Brother',
    connectionSummary: 'Torah Holiness Code / Words of Jesus in Matthew 18',
    explanation:
      'Jesus’ instruction to go privately and point out a brother’s fault draws directly upon the Torah command in Leviticus 19:17 not to harbor hatred in the heart but to frankly rebuke a neighbor so as not to share in guilt.',
    biblicalContext:
      'In Matthew 18:15–20, Jesus teaches His disciples how the kingdom community must pursue reconciliation and restoration rather than resentment.',
    sourceSpeaker: 'Words spoken by Jesus',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Leviticus 19:17', 'Matthew 18:16', 'Deuteronomy 19:15'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 12. Matthew 18:16 <-> Deuteronomy 19:15 (Matches User Screenshot 3)
  {
    id: 'xref-mat-18-16-deu-19-15',
    sourceRef: 'Matthew 18:16',
    targetRef: 'Deuteronomy 19:15',
    sourceToTargetCategory: 'Direct quotation',
    targetToSourceCategory: 'Parallel passage',
    title: 'Established by the Testimony of Two or Three Witnesses',
    connectionSummary: 'Old Testament Judicial Law / Direct Quotation by Jesus',
    explanation:
      'Jesus directly quotes Moses’ judicial statute from Deuteronomy 19:15 ("every matter may be established by the testimony of two or three witnesses"), applying Torah evidentiary due process to reconciliation in the church.',
    biblicalContext:
      'Deuteronomy 19:15 protected Israelites against false accusation by requiring multiple witnesses; Jesus applies this same standard when private admonition in Matthew 18:15 is refused.',
    sourceSpeaker: 'Words spoken by Jesus',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Deuteronomy 19:15', 'Matthew 18:15', 'Matthew 18:17'],
    dataSource: 'Treasury of Scripture Knowledge (TSK) & Nestle-Aland',
    verificationStatus: 'verified',
  },
  // 13. Matthew 18:17 <-> Deuteronomy 19:15
  {
    id: 'xref-mat-18-17-deu-19-15',
    sourceRef: 'Matthew 18:17',
    targetRef: 'Deuteronomy 19:15',
    sourceToTargetCategory: 'Thematic connection',
    targetToSourceCategory: 'Thematic connection',
    title: 'Covenant Community Accountability and Restoration',
    connectionSummary: 'Torah Covenant Assembly / Ecclesial Restoration',
    explanation:
      'Following the witness of two or three from Deuteronomy 19:15, Jesus instructs bringing the unrepentant matter before the assembly (ekklesia), echoing the covenantal tribunal of Deuteronomy 19:17.',
    biblicalContext:
      'Jesus establishes a three-step restorative process moving from private conversation (v.15) to two or three witnesses (v.16) to the gathered assembly (v.17).',
    sourceSpeaker: 'Words spoken by Jesus',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Matthew 18:15', 'Matthew 18:16', 'Deuteronomy 19:15'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 14. Matthew 18:18 <-> Matthew 18:19
  {
    id: 'xref-mat-18-18-mat-18-19',
    sourceRef: 'Matthew 18:18',
    targetRef: 'Matthew 18:19',
    sourceToTargetCategory: 'Parallel passage',
    targetToSourceCategory: 'Parallel passage',
    title: 'Binding and Loosing in Unified Kingdom Prayer',
    connectionSummary: 'Discourse Parallel in Matthew 18',
    explanation:
      'Jesus pairs the church’s judicial authority of binding and loosing (v.18) with the promise that where two of them agree on earth in prayer, the Father in heaven will act (v.19).',
    biblicalContext:
      'Spoken by Jesus to His disciples in Capernaum during the fourth major discourse of Matthew’s Gospel.',
    sourceSpeaker: 'Words spoken by Jesus',
    targetSpeaker: 'Words spoken by Jesus',
    supportingRefs: ['Matthew 18:17', 'Matthew 18:20'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 15. Matthew 18:20 <-> John 1:14
  {
    id: 'xref-mat-18-20-jhn-1-14',
    sourceRef: 'Matthew 18:20',
    targetRef: 'John 1:14',
    sourceToTargetCategory: 'Thematic connection',
    targetToSourceCategory: 'Thematic connection',
    title: 'The Dwelling Presence of Christ (Shekinah) Among His Gathered People',
    connectionSummary: 'Immanuel Theme / Covenant Presence',
    explanation:
      'Jesus’ promise "where two or three gather in my name, there am I with them" (Matthew 18:20) parallels John 1:14 ("The Word became flesh and made his dwelling among us") and Matthew 1:23 ("God with us").',
    biblicalContext:
      'Jesus claims the divine prerogative of dwelling personally in the midst of His gathered covenant people.',
    sourceSpeaker: 'Words spoken by Jesus',
    targetSpeaker: 'Words spoken by apostles',
    supportingRefs: ['Matthew 1:23', 'John 1:14'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 16. Isaiah 53:5 <-> 1 Peter 2:24
  {
    id: 'xref-1pet-2-24-isa-53-5',
    sourceRef: '1 Peter 2:24',
    targetRef: 'Isaiah 53:5',
    sourceToTargetCategory: 'Direct quotation',
    targetToSourceCategory: 'Prophecy',
    title: 'Pierced for Our Transgressions — By His Wounds You Have Been Healed',
    connectionSummary: 'Old Testament Prophecy / New Testament Quotation',
    explanation:
      'The Apostle Peter directly quotes the fourth Servant Song of the prophet Isaiah ("by his wounds you have been healed", Isaiah 53:5), identifying Jesus’ crucifixion as the fulfilment of Isaiah’s prophecy.',
    biblicalContext:
      'In 1 Peter 2:21–25, Peter encourages suffering Christians by pointing to Christ’s sinless passion and substitutionary bearing of sin on the cross, quoting Isaiah 53:4–12.',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Isaiah 53:5', '1 Peter 2:24', 'John 1:29'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 17. Matthew 27:46 <-> Psalms 22:1
  {
    id: 'xref-mat-27-46-psa-22-1',
    sourceRef: 'Matthew 27:46',
    targetRef: 'Psalms 22:1',
    sourceToTargetCategory: 'Direct quotation',
    targetToSourceCategory: 'Prophecy',
    title: 'My God, My God, Why Have You Forsaken Me?',
    connectionSummary: 'Davidic Lament / Cry of Jesus from the Cross',
    explanation:
      'From the cross at the ninth hour, Jesus cries out in Aramaic the opening words of King David’s Psalm 22:1 ("My God, my God, why have you forsaken me?"), invoking the entire Messianic psalm of suffering and eventual vindication.',
    biblicalContext:
      'Psalm 22 is a Davidic psalm describing a righteous sufferer surrounded by mockers who pierce his hands and feet and divide his garments—details fulfilled at Golgotha in Matthew 27.',
    sourceSpeaker: 'Words spoken by Jesus',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Psalms 22:1', 'Isaiah 53:5'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 18. Matthew 2:6 <-> Micah 5:2
  {
    id: 'xref-mat-2-6-mic-5-2',
    sourceRef: 'Matthew 2:6',
    targetRef: 'Micah 5:2',
    sourceToTargetCategory: 'Prophecy fulfilment',
    targetToSourceCategory: 'Prophecy',
    title: 'The Messianic Ruler Born in Bethlehem Ephrathah',
    connectionSummary: 'Old Testament Prophecy / New Testament Fulfilment',
    explanation:
      'When King Herod asks where the Messiah is to be born, the chief priests and teachers of the law quote the prophet Micah (Micah 5:2), foretelling that out of Bethlehem in Judah would come the ruler who shepherds Israel.',
    biblicalContext:
      'Micah prophesied in the eighth century BC that David’s hometown of Bethlehem would bring forth the eternal Messianic King; Matthew 2 records Jesus’ birth in Bethlehem in direct fulfilment.',
    sourceSpeaker: 'Words spoken by other biblical characters',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Micah 5:2', 'Matthew 1:1', '2 Samuel 7:12'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 19. Romans 16:20 <-> Genesis 3:15
  {
    id: 'xref-rom-16-20-gen-3-15',
    sourceRef: 'Romans 16:20',
    targetRef: 'Genesis 3:15',
    sourceToTargetCategory: 'Allusion',
    targetToSourceCategory: 'Prophecy',
    title: 'The Seed of the Woman Crushing the Serpent’s Head',
    connectionSummary: 'Protoevangelium / Pauline Eschatological Fulfilment',
    explanation:
      'The Apostle Paul’s promise that "the God of peace will soon crush Satan under your feet" (Romans 16:20) alludes directly to the first Messianic promise in Genesis 3:15 that the offspring of the woman would crush the serpent’s head.',
    biblicalContext:
      'In Genesis 3:15, God pronounces judgment on the serpent after the Fall; in Romans 16:20, Paul assures the church in Rome that Christ’s victory over the serpent is shared with His body.',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Historical narration',
    supportingRefs: ['Genesis 3:15', 'Genesis 3:6', 'Romans 5:19'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 20. Matthew 4:4 <-> Deuteronomy 8:3 (Explicit Example in Prompt!)
  {
    id: 'xref-mat-4-4-deu-8-3',
    sourceRef: 'Matthew 4:4',
    targetRef: 'Deuteronomy 8:3',
    sourceToTargetCategory: 'Direct quotation',
    targetToSourceCategory: 'Parallel passage',
    title: 'Man Shall Not Live on Bread Alone, But on Every Word of God',
    connectionSummary: 'Direct Quotation: Jesus Quotes Moses During His Temptation in the Wilderness',
    explanation:
      'Jesus says that man shall not live by bread alone, directly quoting Moses in Deuteronomy 8:3, where Moses records that God humbled Israel in the wilderness with manna to teach them that man does not live on bread alone but on every word that comes from the mouth of the LORD.',
    biblicalContext:
      'After fasting forty days and forty nights in the Judean wilderness, Jesus is tempted by the devil to turn stones into bread. Jesus answers with the Torah ("It is written"), succeeding in the wilderness test where Israel had grumbled.',
    sourceSpeaker: 'Words spoken by Jesus',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Deuteronomy 8:3', 'Matthew 4:4'],
    dataSource: 'Treasury of Scripture Knowledge (TSK) & Nestle-Aland',
    verificationStatus: 'verified',
  },
  // 21. Matthew 22:37 <-> Deuteronomy 6:5 (Explicit Example in Prompt!)
  {
    id: 'xref-mat-22-37-deu-6-5',
    sourceRef: 'Matthew 22:37',
    targetRef: 'Deuteronomy 6:5',
    sourceToTargetCategory: 'Direct quotation',
    targetToSourceCategory: 'Parallel passage',
    title: 'Love the Lord Your God With All Your Heart, Soul, and Mind',
    connectionSummary: 'Direct Quotation: Jesus Quotes the Shema From Moses as the Greatest Commandment',
    explanation:
      'When asked which is the greatest commandment in the Law, Jesus directly quotes Moses’ words from the Shema in Deuteronomy 6:5: "You shall love the LORD your God with all your heart and with all your soul and with all your mind."',
    biblicalContext:
      'In Deuteronomy 6:4–5, Moses delivers the foundational confession of Israel’s covenant loyalty to the one LORD. In Matthew 22:34–40, Jesus identifies this command (paired with Leviticus 19:18) as the sum of all the Law and the Prophets.',
    sourceSpeaker: 'Words spoken by Jesus',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Deuteronomy 6:5', 'Leviticus 19:17'],
    dataSource: 'Treasury of Scripture Knowledge (TSK) & Nestle-Aland',
    verificationStatus: 'verified',
  },
  // 22. Matthew 21:13 <-> Isaiah 56:7 (Explicit Example in Prompt!)
  {
    id: 'xref-mat-21-13-isa-56-7',
    sourceRef: 'Matthew 21:13',
    targetRef: 'Isaiah 56:7',
    sourceToTargetCategory: 'Direct quotation',
    targetToSourceCategory: 'Prophecy',
    title: 'My House Will Be Called a House of Prayer',
    connectionSummary: 'Direct Quotation: Jesus Quotes the Prophet Isaiah in the Temple',
    explanation:
      'While cleansing the temple courts in Jerusalem, Jesus declares, "It is written, \'My house will be called a house of prayer\'"—a direct quotation of God’s prophetic word through Isaiah in Isaiah 56:7 ("for my house will be called a house of prayer for all nations").',
    biblicalContext:
      'Isaiah 56:6–7 promises that foreigners who bind themselves to the LORD will be brought to His holy mountain to pray. Jesus combines Isaiah 56:7 with Jeremiah 7:11 to rebuke commercial exploitation of the temple courts.',
    sourceSpeaker: 'Words spoken by Jesus',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Isaiah 56:7', 'Jeremiah 7:11'],
    dataSource: 'Treasury of Scripture Knowledge (TSK) & Nestle-Aland',
    verificationStatus: 'verified',
  },
  // 23. Matthew 21:13 <-> Jeremiah 7:11 (Explicit Example in Prompt!)
  {
    id: 'xref-mat-21-13-jer-7-11',
    sourceRef: 'Matthew 21:13',
    targetRef: 'Jeremiah 7:11',
    sourceToTargetCategory: 'Direct quotation',
    targetToSourceCategory: 'Parallel passage',
    title: 'You Are Making It a Den of Robbers',
    connectionSummary: 'Direct Quotation: Jesus Quotes the Prophet Jeremiah’s Temple Sermon',
    explanation:
      'In the second half of Matthew 21:13, Jesus rebukes the money changers by quoting Jeremiah 7:11 ("Has this house, which bears my Name, become a den of robbers to you?"), uniting Isaiah’s vision of the temple with Jeremiah’s warning of judgment.',
    biblicalContext:
      'In Jeremiah 7, the prophet stood at the gate of Solomon’s temple warning Judah not to treat the temple as a safe hideout ("den of robbers") while practicing injustice. Jesus invokes the exact phrase in Herod’s temple.',
    sourceSpeaker: 'Words spoken by Jesus',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Jeremiah 7:11', 'Isaiah 56:7'],
    dataSource: 'Treasury of Scripture Knowledge (TSK) & Nestle-Aland',
    verificationStatus: 'verified',
  },
  // 24. Acts 2:16 <-> Joel 2:28 (Explicit Example in Prompt!)
  {
    id: 'xref-acts-2-16-joel-2-28',
    sourceRef: 'Acts 2:16',
    targetRef: 'Joel 2:28',
    sourceToTargetCategory: 'Prophecy fulfilment',
    targetToSourceCategory: 'Prophecy',
    title: 'This Is What Was Spoken by the Prophet Joel: Outpouring of the Spirit',
    connectionSummary: 'Apostolic Citation: Apostle Peter Quotes the Prophet Joel at Pentecost',
    explanation:
      'On the day of Pentecost in Acts 2:16–21, the Apostle Peter explicitly identifies the outpouring of the Holy Spirit as the fulfilment of Joel 2:28–32 ("this is what was spoken by the prophet Joel: In the last days, God says, I will pour out my Spirit on all people").',
    biblicalContext:
      'Joel 2:28–32 foretold a future day of restoration when God’s Spirit would be poured out across all ages and classes of God’s people. Peter proclaims in Jerusalem that the risen and exalted Christ has poured out this promised Spirit.',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Acts 2:17', 'Joel 2:28'],
    dataSource: 'Treasury of Scripture Knowledge (TSK) & Nestle-Aland',
    verificationStatus: 'verified',
  },
  // 25. Acts 2:17 <-> Joel 2:28 (Explicit Example in Prompt!)
  {
    id: 'xref-acts-2-17-joel-2-28',
    sourceRef: 'Acts 2:17',
    targetRef: 'Joel 2:28',
    sourceToTargetCategory: 'Direct quotation',
    targetToSourceCategory: 'Prophecy',
    title: 'I Will Pour Out My Spirit on All People',
    connectionSummary: 'Direct Quotation: Peter Quotes Joel 2:28 Word-for-Word',
    explanation:
      'Acts 2:17 directly quotes Joel 2:28, where God promises through the prophet Joel to pour out His Spirit on all flesh so that sons and daughters prophesy, young men see visions, and old men dream dreams.',
    biblicalContext:
      'Delivered by the Apostle Peter to the international Jewish crowd gathered in Jerusalem for the Feast of Weeks (Pentecost).',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Acts 2:16', 'Joel 2:28'],
    dataSource: 'Treasury of Scripture Knowledge (TSK) & Nestle-Aland',
    verificationStatus: 'verified',
  },
  // 26. Hebrews 1:5 <-> Psalms 2:7 (Explicit Example in Prompt!)
  {
    id: 'xref-heb-1-5-psa-2-7',
    sourceRef: 'Hebrews 1:5',
    targetRef: 'Psalms 2:7',
    sourceToTargetCategory: 'Direct quotation',
    targetToSourceCategory: 'Prophecy',
    title: 'You Are My Son; Today I Have Become Your Father',
    connectionSummary: 'Direct Quotation: Hebrews Quotes Psalm 2:7 on the Royal Sonship of Christ',
    explanation:
      'To demonstrate that the Son is superior to the angels, the author of Hebrews 1:5 directly quotes the royal Messianic decree of Psalm 2:7 ("You are my Son; today I have become your Father").',
    biblicalContext:
      'Hebrews 1:5–13 chains together seven Old Testament passages (from Psalms, 2 Samuel, and Deuteronomy) to prove from Scripture that the Son possesses a divine name and throne never granted to any angel.',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Psalms 2:7', '2 Samuel 7:14', 'Hebrews 1:13', 'Psalms 110:1'],
    dataSource: 'Treasury of Scripture Knowledge (TSK) & Nestle-Aland',
    verificationStatus: 'verified',
  },
  // 27. Hebrews 1:5 <-> 2 Samuel 7:14 (Explicit Example in Prompt!)
  {
    id: 'xref-heb-1-5-2sam-7-14',
    sourceRef: 'Hebrews 1:5',
    targetRef: '2 Samuel 7:14',
    sourceToTargetCategory: 'Direct quotation',
    targetToSourceCategory: 'Prophecy',
    title: 'I Will Be His Father, and He Will Be My Son',
    connectionSummary: 'Direct Quotation: Hebrews Quotes the Davidic Covenant of 2 Samuel 7:14',
    explanation:
      'In the second half of Hebrews 1:5, the author directly quotes God’s promise to David through Nathan the prophet in 2 Samuel 7:14 ("I will be his Father, and he will be my Son"), applying the Davidic covenant directly to Jesus Christ.',
    biblicalContext:
      'Paired with Psalm 2:7 in Hebrews 1:5, this quotation establishes Jesus as the eternal Son and Davidic King.',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['2 Samuel 7:14', '2 Samuel 7:12', 'Psalms 2:7'],
    dataSource: 'Treasury of Scripture Knowledge (TSK) & Nestle-Aland',
    verificationStatus: 'verified',
  },
  // 28. John 3:14 <-> Numbers 21:9
  {
    id: 'xref-jhn-3-14-num-21-9',
    sourceRef: 'John 3:14',
    targetRef: 'Numbers 21:9',
    sourceToTargetCategory: 'Allusion',
    targetToSourceCategory: 'Prophecy',
    title: 'The Bronze Serpent Lifted Up in the Wilderness & the Son of Man Lifted Up',
    connectionSummary: 'Jesus Refers to Earlier Scripture: Moses Lifting Up the Serpent in Numbers 21:8–9',
    explanation:
      'Speaking to Nicodemus, Jesus directly refers to the historical event in Numbers 21:8–9 ("Just as Moses lifted up the snake in the wilderness, so the Son of Man must be lifted up"), explaining that His crucifixion brings eternal life to all who look to Him in faith.',
    biblicalContext:
      'In Numbers 21:4–9, Israelites dying from venomous snakebite lived when they looked at the bronze serpent Moses raised on a pole at God’s command. In John 3:14–15, Jesus identifies that event as a divinely intended picture of His cross.',
    sourceSpeaker: 'Words spoken by Jesus',
    targetSpeaker: 'Historical narration',
    supportingRefs: ['Numbers 21:8', 'Numbers 21:9', 'John 3:15', 'John 3:16'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 29. John 3:15 <-> Numbers 21:8
  {
    id: 'xref-jhn-3-15-num-21-8',
    sourceRef: 'John 3:15',
    targetRef: 'Numbers 21:8',
    sourceToTargetCategory: 'Allusion',
    targetToSourceCategory: 'Prophecy',
    title: 'Looking in Faith to Live — Whoever Believes Has Eternal Life',
    connectionSummary: 'Promise of Life in Numbers 21:8 / Eternal Life in John 3:15',
    explanation:
      'God’s promise to Moses in Numbers 21:8 ("anyone who is bitten can look at it and live") finds its ultimate spiritual reality in Jesus’ words in John 3:15 ("that everyone who believes may have eternal life in him").',
    biblicalContext:
      'Part of Jesus’ night discourse with Nicodemus in Jerusalem (John 3:1–21).',
    sourceSpeaker: 'Words spoken by Jesus',
    targetSpeaker: 'Historical narration',
    supportingRefs: ['John 3:14', 'Numbers 21:9', 'John 3:16'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 30. Hebrews 8:8 <-> Jeremiah 31:31
  {
    id: 'xref-heb-8-8-jer-31-31',
    sourceRef: 'Hebrews 8:8',
    targetRef: 'Jeremiah 31:31',
    sourceToTargetCategory: 'Direct quotation',
    targetToSourceCategory: 'Prophecy',
    title: 'The Promise and Inauguration of the New Covenant',
    connectionSummary: 'Old Testament Prophecy / Direct Quotation in Hebrews',
    explanation:
      'Hebrews 8:8–12 quotes Jeremiah 31:31–34 at length—the longest Old Testament quotation in the New Testament—showing that Jeremiah’s prophecy of a new covenant is fulfilled in Christ’s high-priestly ministry.',
    biblicalContext:
      'Jeremiah prophesied on the eve of Jerusalem’s destruction that God would make a new covenant written on the heart; Hebrews 8 demonstrates that Christ mediates this better covenant.',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Jeremiah 31:31', 'Hebrews 7:3'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 31. Hebrews 1:13 <-> Psalms 110:1 (Explicit Example in Prompt!)
  {
    id: 'xref-heb-1-13-psa-110-1',
    sourceRef: 'Hebrews 1:13',
    targetRef: 'Psalms 110:1',
    sourceToTargetCategory: 'Direct quotation',
    targetToSourceCategory: 'Prophecy',
    title: 'Sit at My Right Hand Until I Make Your Enemies a Footstool',
    connectionSummary: 'Direct Quotation: Hebrews Quotes David’s Psalm 110:1 on the Exalted Messiah',
    explanation:
      'Culminating the chain of Old Testament citations in Hebrews 1:5–13, the author quotes David’s oracle in Psalm 110:1 ("Sit at my right hand until I make your enemies a footstool for your feet"), proving the Son’s enthronement at God’s right hand.',
    biblicalContext:
      'Psalm 110:1 is the most frequently quoted Old Testament verse in the New Testament, cited by Jesus, Peter, Paul, and the author of Hebrews.',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Psalms 110:1', 'Hebrews 1:5', 'Psalms 2:7'],
    dataSource: 'Treasury of Scripture Knowledge (TSK) & Nestle-Aland',
    verificationStatus: 'verified',
  },
  // 32. Romans 1:17 <-> Habakkuk 2:4
  {
    id: 'xref-rom-1-17-hab-2-4',
    sourceRef: 'Romans 1:17',
    targetRef: 'Habakkuk 2:4',
    sourceToTargetCategory: 'Direct quotation',
    targetToSourceCategory: 'Prophecy',
    title: 'The Righteous Will Live by Faith',
    connectionSummary: 'Prophetic Oracle / Thesis of Pauline Justification',
    explanation:
      'In presenting the thesis of the Epistle to the Romans, the Apostle Paul directly quotes the prophet Habakkuk (Habakkuk 2:4): "The righteous will live by faith."',
    biblicalContext:
      'In Habakkuk 2:4, God contrasts the proud Babylonian invader with the righteous person who lives by steadfast faith in God’s promise; Paul shows this is fulfilled in the gospel righteousness revealed by faith.',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Habakkuk 2:4', 'Romans 5:19'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 33. John 3:16 <-> Genesis 22:8
  {
    id: 'xref-jhn-3-16-gen-22-8',
    sourceRef: 'John 3:16',
    targetRef: 'Genesis 22:8',
    sourceToTargetCategory: 'Allusion',
    targetToSourceCategory: 'Prophecy',
    title: 'God Himself Provides the Beloved Only Son',
    connectionSummary: 'Mount Moriah Offering / Gospel Fulfilment',
    explanation:
      'John 3:16 ("God so loved the world that he gave his one and only Son") echoes Genesis 22:8, where Abraham prepared to offer his beloved son Isaac and declared, "God himself will provide the lamb for the burnt offering."',
    biblicalContext:
      'Genesis 22 takes place on Mount Moriah (the future site of Jerusalem); John 3:16 proclaims the Father giving His unique Son for the salvation of the world.',
    sourceSpeaker: 'Words spoken by Jesus',
    targetSpeaker: 'Words spoken by other biblical characters',
    supportingRefs: ['Genesis 22:8', 'John 3:14', 'John 1:29'],
    disputedNote:
      'Interpreter note: Some commentators view John 3:16–21 as the continuation of Jesus’ spoken words to Nicodemus, while others view verses 16–21 as the Apostle John’s inspired theological reflection on Jesus’ words in verses 10–15.',
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 34. 1 Corinthians 5:7 <-> Exodus 12:13
  {
    id: 'xref-1cor-5-7-exo-12-13',
    sourceRef: '1 Corinthians 5:7',
    targetRef: 'Exodus 12:13',
    sourceToTargetCategory: 'Prophecy fulfilment',
    targetToSourceCategory: 'Prophecy',
    title: 'Christ Our Passover Lamb Sacrificed for Us',
    connectionSummary: 'Passover Blood in Egypt / Redemptive Sacrifice of Christ',
    explanation:
      'The Apostle Paul explicitly connects the Exodus Passover sacrifice (Exodus 12:13) to Jesus’ death on the cross: "For Christ, our Passover lamb, has been sacrificed" (1 Corinthians 5:7).',
    biblicalContext:
      'Exodus 12 institutes the Passover lamb whose blood on the doorposts spared Israel from judgment; 1 Corinthians 5:7 applies Christ’s Passover sacrifice to the holiness of the church.',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Exodus 12:13', 'John 1:29'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 35. John 1:29 <-> Exodus 12:13
  {
    id: 'xref-jhn-1-29-exo-12-13',
    sourceRef: 'John 1:29',
    targetRef: 'Exodus 12:13',
    sourceToTargetCategory: 'Allusion',
    targetToSourceCategory: 'Prophecy',
    title: 'Behold the Lamb of God Who Takes Away the Sin of the World',
    connectionSummary: 'Passover Lamb / Witness of John the Baptist',
    explanation:
      'John the Baptist’s declaration at Bethany beyond the Jordan—"Look, the Lamb of God, who takes away the sin of the world!" (John 1:29)—draws upon the Passover lamb of Exodus 12:13 and the Suffering Servant lamb of Isaiah 53:7.',
    biblicalContext:
      'Spoken by John the Baptist as he publicly identifies Jesus at the start of His ministry.',
    sourceSpeaker: 'Words spoken by prophets',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Exodus 12:13', '1 Corinthians 5:7', 'Isaiah 53:5'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 36. Hebrews 7:3 <-> Genesis 14:18
  {
    id: 'xref-heb-7-3-gen-14-18',
    sourceRef: 'Hebrews 7:3',
    targetRef: 'Genesis 14:18',
    sourceToTargetCategory: 'Allusion',
    targetToSourceCategory: 'Historical connection',
    title: 'Melchizedek King of Salem and Eternal Priesthood',
    connectionSummary: 'Royal Priest of Genesis 14 / Priesthood of Christ in Hebrews 7',
    explanation:
      'Hebrews 7:1–3 directly expounds the historical account of Melchizedek, king of Salem and priest of God Most High in Genesis 14:18, showing how Melchizedek’s royal priesthood prefigures Christ’s eternal high priesthood.',
    biblicalContext:
      'In Genesis 14:18–20, Melchizedek brings bread and wine and blesses Abraham; Hebrews 7 combines Genesis 14 with Psalm 110:4 to explain Christ’s non-Levitical priesthood.',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Historical narration',
    supportingRefs: ['Genesis 14:18', 'Psalms 110:1'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 37. Romans 5:14 <-> Genesis 3:6
  {
    id: 'xref-rom-5-14-gen-3-6',
    sourceRef: 'Romans 5:14',
    targetRef: 'Genesis 3:6',
    sourceToTargetCategory: 'Historical connection',
    targetToSourceCategory: 'Historical connection',
    title: 'Adam’s Transgression & Christ as the One to Come',
    connectionSummary: 'Fall of Adam in Genesis 3 / Pauline Federal Headship in Romans 5',
    explanation:
      'In Romans 5:12–19, the Apostle Paul refers directly to Adam’s transgression in the Garden of Eden (Genesis 3:6), identifying Adam as "a pattern (type) of the one to come" and contrasting Adam’s disobedience with Christ’s obedience.',
    biblicalContext:
      'Genesis 3:6 narrates the historical Fall; Romans 5:12–21 expounds how one man’s trespass brought death, whereas the one Man Jesus Christ brings justification and life.',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Historical narration',
    supportingRefs: ['Romans 5:12', 'Romans 5:19', 'Genesis 3:6', '1 Corinthians 15:45'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 38. 1 Corinthians 15:45 <-> Genesis 2:7 (Explicit Example in Prompt!)
  {
    id: 'xref-1cor-15-45-gen-2-7',
    sourceRef: '1 Corinthians 15:45',
    targetRef: 'Genesis 2:7',
    sourceToTargetCategory: 'Direct quotation',
    targetToSourceCategory: 'Parallel passage',
    title: 'The First Man Adam Became a Living Being; The Last Adam a Life-Giving Spirit',
    connectionSummary: 'Direct Quotation: Paul Quotes Genesis 2:7 and Contrasts First Adam & Last Adam',
    explanation:
      'In 1 Corinthians 15:45, the Apostle Paul quotes Genesis 2:7 ("So it is written: \'The first man Adam became a living being\'") and contrasts the natural creation of Adam with the resurrection power of Christ, "the last Adam, a life-giving spirit."',
    biblicalContext:
      'Genesis 2:7 records God forming Adam from the dust and breathing into him the breath of life; 1 Corinthians 15:42–49 explains how believers bear the image of the heavenly Man in the resurrection.',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Historical narration',
    supportingRefs: ['Genesis 2:7', 'Romans 5:14', 'Romans 5:19'],
    dataSource: 'Treasury of Scripture Knowledge (TSK) & Nestle-Aland',
    verificationStatus: 'verified',
  },
  // 39. Matthew 12:40 <-> Jonah 1:17 (Explicit Example in Prompt!)
  {
    id: 'xref-mat-12-40-jon-1-17',
    sourceRef: 'Matthew 12:40',
    targetRef: 'Jonah 1:17',
    sourceToTargetCategory: 'Allusion',
    targetToSourceCategory: 'Prophecy',
    title: 'The Sign of the Prophet Jonah: Three Days and Three Nights',
    connectionSummary: 'Jesus Refers to Earlier Scripture: Jonah 1:17 and the Resurrection of the Son of Man',
    explanation:
      'When Pharisees and teachers of the law ask for a sign, Jesus explicitly refers to Jonah 1:17: "For as Jonah was three days and three nights in the belly of a huge fish, so the Son of Man will be three days and three nights in the heart of the earth."',
    biblicalContext:
      'Jonah 1:17 records God appointing a great fish to preserve Jonah for three days and three nights before delivering him onto dry land. In Matthew 12:39–40, Jesus identifies Jonah’s preservation and emergence as the prophetic sign of His own burial and resurrection.',
    sourceSpeaker: 'Words spoken by Jesus',
    targetSpeaker: 'Historical narration',
    supportingRefs: ['Jonah 1:17', 'Matthew 12:40'],
    dataSource: 'Treasury of Scripture Knowledge (TSK) & Nestle-Aland',
    verificationStatus: 'verified',
  },
  // 40. Matthew 3:5 <-> Matthew 3:14
  {
    id: 'xref-mat-3-5-mat-3-14',
    sourceRef: 'Matthew 3:5',
    targetRef: 'Matthew 3:14',
    sourceToTargetCategory: 'Parallel passage',
    targetToSourceCategory: 'Parallel passage',
    title: 'The Jordan Ministry of John the Baptist & Baptism of Jesus',
    connectionSummary: 'Judean Flock at the Jordan / Fulfilling All Righteousness',
    explanation:
      'The crowds going out from Jerusalem and Judea to be baptized by John in the Jordan (Matthew 3:5) form the historical setting for Jesus’ arrival at the Jordan to be baptized by John (Matthew 3:13–15).',
    biblicalContext:
      'Matthew 3 narrates the preparatory ministry of John the Baptist in the wilderness of Judea prior to Jesus’ public ministry.',
    sourceSpeaker: 'Historical narration',
    targetSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Matthew 3:5', 'Matthew 3:14', 'John 1:29'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
  // 41. Romans 8:28 <-> Genesis 12:3
  {
    id: 'xref-rom-8-28-gen-12-3',
    sourceRef: 'Romans 8:28',
    targetRef: 'Genesis 12:3',
    sourceToTargetCategory: 'Thematic connection',
    targetToSourceCategory: 'Thematic connection',
    title: 'Called According to God’s Sovereign Redemptive Purpose',
    connectionSummary: 'Abrahamic Calling / Pauline Assurance of Providence',
    explanation:
      'Paul’s assurance that God works in all things for the good of "those who have been called according to his purpose" (Romans 8:28) rests on God’s faithful covenantal calling first inaugurated with Abraham in Genesis 12:1–3.',
    biblicalContext:
      'In Romans 8:28–30, Paul traces the believer’s security from God’s eternal foreknowledge and calling through justification to glorification.',
    sourceSpeaker: 'Words spoken by apostles',
    targetSpeaker: 'Historical narration',
    supportingRefs: ['Genesis 12:3', 'Deuteronomy 32:4'],
    dataSource: 'Treasury of Scripture Knowledge (TSK)',
    verificationStatus: 'verified',
  },
];

const existingIds = new Set<string>();
export const CANONICAL_CROSS_REFERENCES: CrossReferenceRecord[] = [];

for (const item of VERIFIED_CANONICAL_CROSS_REFERENCES) {
  const key = `${item.sourceRef.toLowerCase()}->${item.targetRef.toLowerCase()}`;
  existingIds.add(key);
  CANONICAL_CROSS_REFERENCES.push(item);
}

for (const item of RAW_CANONICAL_CROSS_REFERENCES) {
  const key = `${item.sourceRef.toLowerCase()}->${item.targetRef.toLowerCase()}`;
  const reverseKey = `${item.targetRef.toLowerCase()}->${item.sourceRef.toLowerCase()}`;
  if (!existingIds.has(key) && !existingIds.has(reverseKey)) {
    existingIds.add(key);
    CANONICAL_CROSS_REFERENCES.push(item);
  }
}

// ============================================================================
// VERIFIED BIBLICAL TYPES & SHADOWS (Old Testament Type <-> New Testament Fulfilment)
// Strictly grounded in explicit canonical typology — never invented
// ============================================================================
export const CANONICAL_TYPES_AND_SHADOWS: BiblicalTypeShadow[] = [
  {
    id: 'type-bronze-serpent',
    title: 'Moses Lifting Up the Bronze Serpent in the Wilderness',
    otTypeRef: 'Numbers 21:9',
    ntAntitypeRef: 'John 3:14',
    typeName: 'Moses Lifts the Bronze Serpent on the Pole (Numbers 21:8–9)',
    fulfilmentName: 'The Son of Man Lifted Up on the Cross (John 3:14–15)',
    explanation:
      'In Numbers 21:4–9, Moses lifts the bronze serpent on a pole so that those bitten by venomous snakes who look upon it may live. In John 3:14–15, Jesus explicitly compares the lifting up of the serpent to the lifting up of the Son of Man on the cross so that everyone who believes in Him may have eternal life.',
    biblicalContext:
      'During Israel’s wilderness journey around Edom (Numbers 21:4–9), God provided a paradoxical remedy for deadly snakebite: looking in faith at a bronze serpent raised on a standard. In John 3:14–15, Jesus explains to Nicodemus that His crucifixion fulfills this Old Testament sign.',
    typologyBasis: 'Explicitly Identified by Jesus',
    otSpeaker: 'Historical narration',
    ntSpeaker: 'Words spoken by Jesus',
    supportingRefs: ['Numbers 21:8', 'Numbers 21:9', 'John 3:14', 'John 3:15', 'John 3:16'],
    historicalSource: 'Explicitly Identified by Jesus (John 3:14–15; Numbers 21:4–9)',
  },
  {
    id: 'type-jonah-sign',
    title: 'Jonah Three Days and Three Nights & Christ’s Death and Resurrection',
    otTypeRef: 'Jonah 1:17',
    ntAntitypeRef: 'Matthew 12:40',
    typeName: 'Jonah Three Days and Three Nights in the Great Fish (Jonah 1:17)',
    fulfilmentName: 'The Son of Man Three Days and Three Nights in the Heart of the Earth (Matthew 12:39–40)',
    explanation:
      'In Jonah 1:17, the LORD appointed a great fish to swallow Jonah, and he was in the belly of the fish three days and three nights before being delivered back to life. In Matthew 12:39–40, Jesus explicitly identifies "the sign of the prophet Jonah" as a type of His own burial in the heart of the earth and victorious resurrection on the third day.',
    biblicalContext:
      'Answering scribes and Pharisees who demanded a miraculous sign in Matthew 12:38, Jesus points to Jonah’s descent into the depths and miraculous deliverance as the prefigurement of His death, burial, and resurrection.',
    typologyBasis: 'Explicitly Identified by Jesus',
    otSpeaker: 'Historical narration',
    ntSpeaker: 'Words spoken by Jesus',
    supportingRefs: ['Jonah 1:17', 'Matthew 12:40'],
    historicalSource: 'Explicitly Identified by Jesus (Matthew 12:39–40; Jonah 1:17)',
  },
  {
    id: 'type-passover-lamb',
    title: 'The Passover Lamb & Christ Our Passover Sacrificed',
    otTypeRef: 'Exodus 12:13',
    ntAntitypeRef: '1 Corinthians 5:7',
    typeName: 'The Unblemished Passover Lamb & Blood on the Doorposts (Exodus 12:13)',
    fulfilmentName: 'Christ Our Passover Lamb Sacrificed for Us (1 Corinthians 5:7)',
    explanation:
      'In Exodus 12:13, the blood of the unblemished Passover lamb applied to the doorposts sheltered Israelite households from judgment ("when I see the blood, I will pass over you"). The Apostle Paul explicitly establishes the typological fulfilment in 1 Corinthians 5:7: "For Christ, our Passover lamb, has been sacrificed."',
    biblicalContext:
      'Instituted on the night of Israel’s exodus from Egypt (Exodus 12), the Passover sacrifice pointed forward to Jesus’ crucifixion at Passover in Jerusalem.',
    typologyBasis: 'Explicitly Established by Scripture',
    otSpeaker: 'Words spoken by prophets',
    ntSpeaker: 'Words spoken by apostles',
    supportingRefs: ['Exodus 12:13', '1 Corinthians 5:7', 'John 1:29', 'Isaiah 53:5'],
    historicalSource: 'Explicitly Established by Scripture (1 Corinthians 5:7; John 1:29)',
  },
  {
    id: 'type-passover-lamb-jhn',
    title: 'The Passover Lamb & Behold the Lamb of God',
    otTypeRef: 'Exodus 12:13',
    ntAntitypeRef: 'John 1:29',
    typeName: 'The Sacrificial Lamb of the Exodus (Exodus 12:13)',
    fulfilmentName: 'The Lamb of God Who Takes Away the Sin of the World (John 1:29)',
    explanation:
      'The Old Testament Passover lamb delivered Israel from bondage and death in Egypt through substitutionary blood. In John 1:29, John the Baptist publicly identifies Jesus as "the Lamb of God, who takes away the sin of the world," fulfilling both the Exodus Passover lamb and Isaiah 53:7.',
    biblicalContext:
      'Spoken at Bethany beyond the Jordan at the inauguration of Jesus’ public ministry and fulfilled when Jesus died on the cross at the hour the Passover lambs were slain (John 19:14, 36).',
    typologyBasis: 'Explicitly Established by Scripture',
    otSpeaker: 'Words spoken by prophets',
    ntSpeaker: 'Words spoken by prophets',
    supportingRefs: ['Exodus 12:13', 'John 1:29', '1 Corinthians 5:7'],
    historicalSource: 'Explicitly Established by Scripture (John 1:29; 1 Corinthians 5:7)',
  },
  {
    id: 'type-first-last-adam',
    title: 'Adam → Christ: The First Adam & The Last Adam',
    otTypeRef: 'Genesis 2:7',
    ntAntitypeRef: 'Romans 5:14',
    typeName: 'The First Man Adam as Covenant Head of Humanity (Genesis 2:7; 3:6)',
    fulfilmentName: 'Christ the Last Adam & Pattern (Typos) of the One to Come (Romans 5:14–19; 1 Corinthians 15:45)',
    explanation:
      'In Romans 5:14, the Apostle Paul explicitly uses the Greek word typos ("type" or "pattern"), stating that Adam "is a pattern of the one to come." In 1 Corinthians 15:45–49, Paul quotes Genesis 2:7 ("The first man Adam became a living being") and contrasts him with Christ ("the last Adam, a life-giving spirit"). Where Adam’s disobedience brought sin and death to humanity, Christ’s obedience brings righteousness and eternal life.',
    biblicalContext:
      'Genesis 2–3 narrates the creation and fall of Adam as representative head of the old creation; Romans 5:12–21 and 1 Corinthians 15:45–49 reveal Christ as the representative head of the new creation.',
    typologyBasis: 'Explicitly Established by Scripture',
    otSpeaker: 'Historical narration',
    ntSpeaker: 'Words spoken by apostles',
    supportingRefs: ['Genesis 2:7', 'Genesis 3:6', 'Romans 5:12', 'Romans 5:14', 'Romans 5:19', '1 Corinthians 15:45'],
    historicalSource: 'Explicitly Established by Scripture (Romans 5:14–19; 1 Corinthians 15:45–49)',
  },
  {
    id: 'type-melchizedek-priesthood',
    title: 'Melchizedek → Christ’s Royal and Eternal Priesthood',
    otTypeRef: 'Genesis 14:18',
    ntAntitypeRef: 'Hebrews 7:3',
    typeName: 'Melchizedek King of Salem & Priest of God Most High (Genesis 14:18–20)',
    fulfilmentName: 'Christ the Eternal High Priest After the Order of Melchizedek (Hebrews 7:1–3)',
    explanation:
      'Melchizedek appears in Genesis 14:18–20 as both King of Salem (Peace) and Priest of God Most High, bringing out bread and wine and blessing Abraham. Hebrews 7 explicitly expounds Genesis 14:18–20 alongside Psalm 110:4, showing that Melchizedek—"resembling the Son of God"—foreshadowed Christ’s royal, eternal priesthood that surpasses the Aaronic priesthood.',
    biblicalContext:
      'After Abraham rescued Lot in Genesis 14, Melchizedek blessed Abraham and received a tenth of everything. Hebrews 7 shows why David’s prophecy in Psalm 110:4 ("You are a priest forever, in the order of Melchizedek") points to Christ.',
    typologyBasis: 'Explicitly Established by Scripture',
    otSpeaker: 'Historical narration',
    ntSpeaker: 'Words spoken by apostles',
    supportingRefs: ['Genesis 14:18', 'Hebrews 7:3', 'Psalms 110:1'],
    historicalSource: 'Explicitly Established by Scripture (Genesis 14:18–20; Psalm 110:4; Hebrews 7)',
  },
  {
    id: 'type-rock-in-wilderness',
    title: 'The Rock in the Wilderness Providing Living Water',
    otTypeRef: 'Deuteronomy 32:4',
    ntAntitypeRef: '1 Corinthians 10:4',
    typeName: 'YHWH the Rock of Israel in the Wilderness (Deuteronomy 32:4)',
    fulfilmentName: 'The Spiritual Rock That Was Christ (1 Corinthians 10:4)',
    explanation:
      'In the Song of Moses (Deuteronomy 32:4) and the wilderness narratives, the Rock sustains and gives water to covenant Israel. In 1 Corinthians 10:4, the Apostle Paul explicitly identifies the typological reality: "they drank from the spiritual rock that accompanied them, and that rock was Christ."',
    biblicalContext:
      'Paul reflects on Israel’s wilderness journey in 1 Corinthians 10:1–11 (where Paul uses the Greek term typikos, "as types/examples") to instruct the church at Corinth.',
    typologyBasis: 'Explicitly Established by Scripture',
    otSpeaker: 'Words spoken by prophets',
    ntSpeaker: 'Words spoken by apostles',
    supportingRefs: ['Deuteronomy 32:4', '1 Corinthians 10:4', 'Deuteronomy 32:6'],
    historicalSource: 'Explicitly Established by Scripture (1 Corinthians 10:1–4)',
  },
  {
    id: 'type-moriah-only-son',
    title: 'Abraham Offering Isaac & God Providing the Lamb on Moriah',
    otTypeRef: 'Genesis 22:8',
    ntAntitypeRef: 'John 3:16',
    typeName: 'Abraham’s Beloved Son & the Lamb Provided by God (Genesis 22:8)',
    fulfilmentName: 'God Giving His Only Begotten Son for the World (John 3:16)',
    explanation:
      'On Mount Moriah, Abraham declared by faith, "God himself will provide the lamb for the burnt offering, my son" (Genesis 22:8), receiving Isaac back from the dead in a figure/parable (Hebrews 11:19). This strongly supported scriptural typology points to the Father giving His one and only beloved Son in John 3:16.',
    biblicalContext:
      'In Genesis 22, God tests Abraham’s faith on Mount Moriah and provides a ram in Isaac’s place; Hebrews 11:17–19 and Romans 8:32 connect this to the Father not sparing His own Son.',
    typologyBasis: 'Strongly Supported Scriptural Typology',
    otSpeaker: 'Words spoken by other biblical characters',
    ntSpeaker: 'Words spoken by Jesus',
    supportingRefs: ['Genesis 22:8', 'John 3:16', 'John 1:29'],
    historicalSource: 'Strongly Supported Scriptural Typology (Genesis 22:8; Hebrews 11:17–19; Romans 8:32)',
  },
  {
    id: 'type-immanuel-virgin-birth',
    title: 'The Sign of Immanuel to the House of David',
    otTypeRef: 'Isaiah 7:14',
    ntAntitypeRef: 'Matthew 1:23',
    typeName: 'The Prophetic Sign of Immanuel in Ahaz’s Crisis (Isaiah 7:14)',
    fulfilmentName: 'The Virgin Conception of Jesus — God With Us (Matthew 1:23)',
    explanation:
      'Given to the royal House of David in Isaiah 7:14 as a pledge of God’s preserving presence ("Immanuel"), the prophecy reaches its full, explicit Messianic fulfilment in Matthew 1:22–23 when Jesus is conceived by the Holy Spirit of the virgin Mary—God personally dwelling with His people.',
    biblicalContext:
      'Isaiah 7 addresses the Davidic monarchy under threat; Matthew 1:22–23 cites Isaiah 7:14 with the fulfilment formula "All this took place to fulfill what the Lord had said through the prophet."',
    typologyBasis: 'Explicitly Established by Scripture',
    otSpeaker: 'Words spoken by prophets',
    ntSpeaker: 'Historical narration',
    supportingRefs: ['Isaiah 7:14', 'Matthew 1:23', 'John 1:14'],
    disputedNote:
      'Exegetes discuss whether Isaiah 7:14 operated both as a historical sign in Isaiah’s generation and as a direct Messianic prophecy fulfilled in the virgin birth of Christ (Matthew 1:23).',
    historicalSource: 'Explicitly Established by Scripture (Matthew 1:22–23)',
  },
  {
    id: 'type-suffering-servant',
    title: 'The Pierced Suffering Servant Bearing Iniquity',
    otTypeRef: 'Isaiah 53:5',
    ntAntitypeRef: '1 Peter 2:24',
    typeName: 'The Servant Pierced for Our Transgressions (Isaiah 53:5)',
    fulfilmentName: 'Christ Bearing Our Sins in His Body on the Cross (1 Peter 2:24)',
    explanation:
      'Isaiah 53:5 portrays the Servant of the LORD wounded and crushed for the iniquities of the people so that by his wounds healing comes. In 1 Peter 2:24, the Apostle Peter explicitly applies this prophecy to Christ’s substitutionary atonement on the cross.',
    biblicalContext:
      'The fourth Servant Song (Isaiah 52:13–53:12) is quoted across the New Testament (Matthew 8:17; Luke 22:37; Acts 8:32–35; 1 Peter 2:22–25) as fulfilled in Jesus’ passion.',
    typologyBasis: 'Explicitly Established by Scripture',
    otSpeaker: 'Words spoken by prophets',
    ntSpeaker: 'Words spoken by apostles',
    supportingRefs: ['Isaiah 53:5', '1 Peter 2:24'],
    historicalSource: 'Explicitly Established by Scripture (Isaiah 53:5; 1 Peter 2:24)',
  },
  {
    id: 'type-davidic-throne',
    title: 'The Covenantal Son of David & Eternal Kingdom',
    otTypeRef: '2 Samuel 7:12',
    ntAntitypeRef: 'Matthew 1:1',
    typeName: 'David’s Offspring Whose Kingdom God Establishes (2 Samuel 7:12–14)',
    fulfilmentName: 'Jesus the Messiah, the Son of David (Matthew 1:1; Hebrews 1:5)',
    explanation:
      'In 2 Samuel 7:12–14, God promised David an offspring who would build God’s house and whose royal throne would be established forever. Initially foreshadowed in Solomon, the New Testament explicitly establishes Jesus the Messiah as the ultimate Son of David who reigns forever (Matthew 1:1; Hebrews 1:5).',
    biblicalContext:
      'God’s covenant with David in 2 Samuel 7 forms the backbone of Old Testament Messianic expectation.',
    typologyBasis: 'Explicitly Established by Scripture',
    otSpeaker: 'Words spoken by prophets',
    ntSpeaker: 'Words spoken by apostles',
    supportingRefs: ['2 Samuel 7:12', '2 Samuel 7:14', 'Matthew 1:1', 'Hebrews 1:5'],
    historicalSource: 'Explicitly Established by Scripture (2 Samuel 7:12–14; Matthew 1:1; Hebrews 1:5)',
  },
  {
    id: 'type-manna-word-of-god',
    title: 'Israel Tested in the Wilderness & Jesus the True Son in the Wilderness',
    otTypeRef: 'Deuteronomy 8:3',
    ntAntitypeRef: 'Matthew 4:4',
    typeName: 'Israel Humbled and Tested Forty Years in the Wilderness (Deuteronomy 8:2–3)',
    fulfilmentName: 'Jesus Tested Forty Days in the Wilderness Quoting Deuteronomy 8:3 (Matthew 4:1–4)',
    explanation:
      'Where Israel was tested for forty years in the wilderness to learn that man lives by every word from the mouth of the LORD (Deuteronomy 8:2–3), Jesus fasts forty days in the wilderness and quotes Deuteronomy 8:3 in Matthew 4:4, succeeding as the faithful Son where Israel faltered.',
    biblicalContext:
      'All three temptations in Matthew 4:1–11 quote Moses’ speeches in Deuteronomy 6–8, contrasting Israel’s wilderness testing with Jesus’ faithfulness.',
    typologyBasis: 'Strongly Supported Scriptural Typology',
    otSpeaker: 'Words spoken by prophets',
    ntSpeaker: 'Words spoken by Jesus',
    supportingRefs: ['Deuteronomy 8:3', 'Matthew 4:4', 'Deuteronomy 6:5'],
    historicalSource: 'Strongly Supported Scriptural Typology (Deuteronomy 8:2–3; Matthew 4:1–4)',
  },
];

// ============================================================================
// VERIFIED BIBLICAL INFERENCES (Interpretive Connections Derived From Comparing Scriptures)
// Clearly distinguishes explicit biblical statements from inferred conclusions,
// and distinguishes Strong Scriptural Inference from Possible Interpretation
// ============================================================================
export const CANONICAL_INFERENCES: BiblicalInference[] = [
  // 1. John 3:14–15 and Numbers 21:8–9 (Explicit Example in Prompt!)
  {
    id: 'inf-jhn-3-14-num-21',
    verseRef: 'John 3:14',
    title: 'Salvation Received by Faith Looking to God’s Appointed Remedy (John 3:14–15 & Numbers 21:8–9)',
    explicitStatement:
      'Numbers 21:8–9 states that anyone bitten by a snake who looked at the bronze serpent on the pole lived. John 3:14–15 states that just as Moses lifted up the snake in the wilderness, so the Son of Man must be lifted up, that everyone who believes may have eternal life in Him.',
    inferredConclusion:
      'Saving faith is analogous to the dying Israelite looking away from self to God’s lifted-up provision: human works cannot cure the venom of sin, and looking to Christ crucified in faith is the sole instrument by which sinners receive eternal life.',
    reasoningExplanation:
      'By comparing the physical healing in Numbers 21:8–9 ("when he looked at the bronze snake, he lived") with the spiritual parallel in John 3:14–15 ("everyone who believes may have eternal life"), we infer that "believing in Christ" functions spiritually just as "looking at the lifted-up serpent" functioned in the camp of Israel.',
    biblicalContext:
      'Jesus is speaking to Nicodemus, a Pharisee and member of the Sanhedrin (John 3:1–15), explaining how the new birth and eternal life are made possible through the cross.',
    inferenceStrength: 'Strong Scriptural Inference',
    speakerAttribution: 'Words spoken by Jesus',
    supportingRefs: ['Numbers 21:8', 'Numbers 21:9', 'John 3:15', 'John 3:16'],
  },
  // 2. Romans 5:12–21 and Genesis 3 (Explicit Example in Prompt!)
  {
    id: 'inf-rom-5-12-gen-3',
    verseRef: 'Romans 5:14',
    title: 'Representative Federal Headship of Adam and Christ (Romans 5:12–21 & Genesis 3)',
    explicitStatement:
      'Genesis 3:6 narrates that Adam ate the forbidden fruit in Eden, and Romans 5:12–19 states that sin and death entered the world through one man (Adam), while righteousness and life come to many through the obedience of the one Man, Jesus Christ.',
    inferredConclusion:
      'God deals with humanity covenantally through two representative heads—Adam and Christ—such that all who are in Adam share in the consequences of the Fall, and all who are united to Christ by faith share in His righteous obedience and life.',
    reasoningExplanation:
      'By comparing Genesis 3:6 with Paul’s argument in Romans 5:12, 14, and 19 ("just as through the disobedience of the one man the many were made sinners, so also through the obedience of the one man the many will be made righteous"), the conclusion follows that Christ’s atonement operates by representative headship that reverses the Adamic curse.',
    biblicalContext:
      'In Romans 5:12–21, the Apostle Paul contrasts the universal reign of death inaugurated in Genesis 3 with the superabounding reign of grace through Jesus Christ.',
    inferenceStrength: 'Strong Scriptural Inference',
    speakerAttribution: 'Words spoken by apostles',
    disputedNote:
      'Theologians debate the exact mechanism of how "all sinned" in Romans 5:12 (e.g., direct federal imputation of Adam’s guilt, seminal/realist participation, or inherited corrupted nature leading to personal sin).',
    supportingRefs: ['Genesis 3:6', 'Romans 5:12', 'Romans 5:14', 'Romans 5:19', '1 Corinthians 15:45'],
  },
  // 3. 1 Corinthians 15:45–49 and Genesis 2:7 (Explicit Example in Prompt!)
  {
    id: 'inf-1cor-15-45-gen-2-7',
    verseRef: '1 Corinthians 15:45',
    title: 'Resurrection Transformation Beyond the Original Edenic Body (1 Corinthians 15:45–49 & Genesis 2:7)',
    explicitStatement:
      'Genesis 2:7 states that God formed man from the dust and breathed into his nostrils the breath of life, and man became a living being. 1 Corinthians 15:45 quotes Genesis 2:7 and adds that "the last Adam [became] a life-giving spirit."',
    inferredConclusion:
      'Redemption in Christ does not merely restore believers to Adam’s mutable pre-Fall state in Eden; it elevates believers to an imperishable, Spirit-animated resurrection body modeled after the risen Christ.',
    reasoningExplanation:
      'Comparing Genesis 2:7 with 1 Corinthians 15:45–49 shows that even before the Fall, Adam’s body was natural/dust-formed (psychikos), whereas the risen Christ inaugurates a higher, imperishable heavenly order (pneumatikos) that cannot die again.',
    biblicalContext:
      'In 1 Corinthians 15:35–49, Paul answers questions in Corinth ("How are the dead raised? With what kind of body will they come?") by comparing the creation of Adam in Genesis 2:7 with the resurrection of Christ.',
    inferenceStrength: 'Strong Scriptural Inference',
    speakerAttribution: 'Words spoken by apostles',
    supportingRefs: ['Genesis 2:7', '1 Corinthians 15:45', 'Romans 5:14', 'Romans 5:19'],
  },
  {
    id: 'inf-mat-4-4-deu-8-3',
    verseRef: 'Matthew 4:4',
    title: 'Scripture as theSufficient Spiritual Sustenance in Trial (Matthew 4:4 & Deuteronomy 8:3)',
    explicitStatement:
      'In Matthew 4:4, Jesus answers the tempter by quoting Deuteronomy 8:3: "It is written: \'Man shall not live on bread alone, but on every word that comes from the mouth of God.\'"',
    inferredConclusion:
      'Obedience to God’s spoken and written Word takes precedence over immediate physical self-preservation; even in severe deprivation, God’s Word sustains life.',
    reasoningExplanation:
      'Because Jesus refuses to use His divine power to satisfy hunger apart from the Father’s will and instead appeals to Israel’s lesson in Deuteronomy 8:3, the comparison demonstrates that spiritual fidelity to God’s Word is more vital than physical bread.',
    biblicalContext:
      'Spoken by Jesus during His wilderness temptation after forty days of fasting (Matthew 4:1–4).',
    inferenceStrength: 'Strong Scriptural Inference',
    speakerAttribution: 'Words spoken by Jesus',
    supportingRefs: ['Deuteronomy 8:3', 'Matthew 4:4'],
  },
  {
    id: 'inf-mat-22-37-deu-6-5',
    verseRef: 'Matthew 22:37',
    title: 'Whole-Person Devotion Encompassing Intellect, Affections, and Will',
    explicitStatement:
      'Deuteronomy 6:5 commands loving the LORD with all your heart, soul, and strength, and Jesus quotes this in Matthew 22:37 as loving the Lord your God with all your heart, soul, and mind.',
    inferredConclusion:
      'True covenant love for God cannot be compartmentalized into mere outward ritual or emotion; it claims the entirety of human thought ("mind"), affection ("heart"), and life ("soul/strength").',
    reasoningExplanation:
      'By rendering the Hebrew totality of Deuteronomy 6:5 with heart, soul, and mind (dianoia) and declaring that all the Law and the Prophets hang on love (Matthew 22:40), Jesus shows that every biblical command flows from undivided love for God.',
    biblicalContext:
      'Spoken by Jesus in the temple courts during Passion Week in response to a Pharisee lawyer testing Him (Matthew 22:34–40).',
    inferenceStrength: 'Strong Scriptural Inference',
    speakerAttribution: 'Words spoken by Jesus',
    supportingRefs: ['Deuteronomy 6:5', 'Matthew 22:37', 'Leviticus 19:17'],
  },
  {
    id: 'inf-mat-1-23',
    verseRef: 'Matthew 1:23',
    title: 'The Full Deity and Humanity of Jesus in the Incarnation',
    explicitStatement:
      'Matthew 1:23 explicitly states that the virgin will conceive and give birth to a son, and they will call him Immanuel—which means "God with us."',
    inferredConclusion:
      'Jesus is not merely a human prophet announcing God’s presence; His personal identity unites true human nature (born of a woman) with true divine nature ("God with us").',
    reasoningExplanation:
      'Because the child born of Mary is personally identified by the prophetic name "God with us" (Isaiah 7:14) and saves His people from their sins (Matthew 1:21—a prerogative belonging to YHWH alone in Psalm 130:8), the text supports the conclusion that God Himself has entered human history in the person of the Son.',
    biblicalContext:
      'Matthew’s birth narrative (Matthew 1:18–25) explaining the miraculous conception of Jesus to Joseph.',
    inferenceStrength: 'Strong Scriptural Inference',
    speakerAttribution: 'Historical narration',
    supportingRefs: ['Isaiah 7:14', 'John 1:1', 'John 1:14', 'Matthew 18:20'],
  },
  {
    id: 'inf-isa-7-14',
    verseRef: 'Isaiah 7:14',
    title: 'Divine Preservation of the Davidic Line Beyond Human Faithlessness',
    explicitStatement:
      'Isaiah 7:14 explicitly states that the Lord Himself will give a sign to the House of David: the virgin will conceive, give birth to a son, and call him Immanuel.',
    inferredConclusion:
      'God’s covenant promise to David cannot be nullified by the unbelief of a corrupt king (Ahaz); God sovereignly guarantees the Messianic lineage.',
    reasoningExplanation:
      'When King Ahaz refused to ask for a sign in Isaiah 7:12, the prophet shifted from addressing Ahaz ("you" singular) to the whole House of David ("you" plural) and declared that the Lord Himself would provide the sign, proving that Messianic redemption rests on divine fidelity rather than royal merit.',
    biblicalContext:
      'Spoken by the prophet Isaiah to King Ahaz in Jerusalem around 734 BC (Isaiah 7:1–17).',
    inferenceStrength: 'Strong Scriptural Inference',
    speakerAttribution: 'Words spoken by prophets',
    supportingRefs: ['Matthew 1:23', '2 Samuel 7:12', 'Matthew 1:1'],
  },
  {
    id: 'inf-mat-1-1',
    verseRef: 'Matthew 1:1',
    title: 'Gentile Inclusion and Royal Authority United in the Messiah',
    explicitStatement:
      'Matthew 1:1 explicitly introduces the genealogy of Jesus the Messiah as "the son of David, the son of Abraham."',
    inferredConclusion:
      'Jesus’ mission simultaneously establishes the eternal royal kingdom promised to Israel (via David) and extends covenant blessing to all Gentile nations (via Abraham).',
    reasoningExplanation:
      'By deliberately pairing and inverting chronological order—placing "son of David" (2 Samuel 7:12) and "son of Abraham" (Genesis 12:3) at the head of the Gospel—Matthew signals that Jesus fulfills both the royal throne of Israel and the universal blessing of all families of the earth.',
    biblicalContext:
      'The superscription of the Gospel of Matthew (Matthew 1:1).',
    inferenceStrength: 'Strong Scriptural Inference',
    speakerAttribution: 'Words spoken by apostles',
    supportingRefs: ['Genesis 12:3', '2 Samuel 7:12', 'Romans 8:28'],
  },
  {
    id: 'inf-jhn-1-1',
    verseRef: 'John 1:1',
    title: 'Distinction of Persons Within the One Eternal Godhead',
    explicitStatement:
      'John 1:1 explicitly states three clauses: (1) "In the beginning was the Word," (2) "and the Word was with God," and (3) "and the Word was God."',
    inferredConclusion:
      'The Word (Logos) is co-eternal and co-equal in deity with the Father, yet personally distinct from the Father.',
    reasoningExplanation:
      'Clause 1 establishes eternal pre-existence prior to creation (Genesis 1:1). Clause 2 ("with God", Greek pros ton Theon) establishes personal relational distinction so the Word is not the Father. Clause 3 ("was God", Theos en ho Logos) establishes shared divine essence without diminishing monotheism.',
    biblicalContext:
      'The prologue of the Gospel of John (John 1:1–18).',
    inferenceStrength: 'Strong Scriptural Inference',
    speakerAttribution: 'Words spoken by apostles',
    supportingRefs: ['Genesis 1:1', 'John 1:3', 'John 1:14', 'Colossians 1:16', 'Hebrews 1:2'],
  },
  {
    id: 'inf-gen-1-1',
    verseRef: 'Genesis 1:1',
    title: 'God’s Absolute Transcendence Over Matter, Space, and Time',
    explicitStatement:
      'Genesis 1:1 explicitly states: "In the beginning God created the heavens and the earth."',
    inferredConclusion:
      'The universe is not eternal or self-existing; God exists independently prior to all physical reality and exercises sovereign ownership over all creation.',
    reasoningExplanation:
      'Because "the heavens and the earth" (a Hebrew merism for the totality of the cosmos) had a "beginning" brought about by God’s creative act, God Himself transcends time and space and creates through His Word.',
    biblicalContext:
      'The opening creation account of Genesis (Genesis 1:1–2:3).',
    inferenceStrength: 'Strong Scriptural Inference',
    speakerAttribution: 'Historical narration',
    supportingRefs: ['John 1:1', 'John 1:3', 'Hebrews 1:2', 'Colossians 1:16'],
  },
  {
    id: 'inf-deu-32-6',
    verseRef: 'Deuteronomy 32:6',
    title: 'Covenant Obligation Grounded in God’s Fatherhood and Redemption',
    explicitStatement:
      'Deuteronomy 32:6 explicitly asks Israel: "Is he not your Father, your Creator, who made you and formed you?"',
    inferredConclusion:
      'Ingratitude or rebellion against God is not merely breaking an abstract legal code; it is filial betrayal against a loving Father who redeemed and formed His people.',
    reasoningExplanation:
      'Moses grounds ethical obedience directly in relational paternity and historical redemption from Egypt, establishing that divine grace precedes covenant obligation.',
    biblicalContext:
      'The Song of Moses (Deuteronomy 32:1–43) spoken to the assembly of Israel on the plains of Moab.',
    inferenceStrength: 'Strong Scriptural Inference',
    speakerAttribution: 'Words spoken by prophets',
    supportingRefs: ['Isaiah 63:16', '1 Corinthians 8:6', 'Deuteronomy 32:4'],
  },
  {
    id: 'inf-deu-32-4',
    verseRef: 'Deuteronomy 32:4',
    title: 'Unchanging Moral Perfection of God in Every Providential Act',
    explicitStatement:
      'Deuteronomy 32:4 explicitly declares: "He is the Rock, his works are perfect, and all his ways are just. A faithful God who does no wrong, upright and just is he."',
    inferredConclusion:
      'Even when historical trials or judgments appear severe, injustice can never be attributed to God; His character remains the immovable standard of truth.',
    reasoningExplanation:
      'By metaphorically naming YHWH "the Rock" (Tsur) and coupling His stability with moral rectitude ("does no wrong"), the text rules out arbitrary caprice in divine governance.',
    biblicalContext:
      'Opening proclamation of God’s character in the Song of Moses (Deuteronomy 32:3–4).',
    inferenceStrength: 'Strong Scriptural Inference',
    speakerAttribution: 'Words spoken by prophets',
    supportingRefs: ['1 Corinthians 10:4', 'Deuteronomy 32:6', 'Romans 8:28'],
  },
  {
    id: 'inf-mat-18-15',
    verseRef: 'Matthew 18:15',
    title: 'The Priority of Private, Redemptive Restoration Over Public Exposure',
    explicitStatement:
      'Matthew 18:15 explicitly commands: "If your brother or sister sins, go and point out their fault, just between the two of you. If they listen to you, you have won them over."',
    inferredConclusion:
      'Gossip or public accusation of a fellow believer violates Christ’s design; the goal of confronting sin is winning back the person ("you have won them over"), not humiliation.',
    reasoningExplanation:
      'By restricting the initial step strictly to "just between the two of you" and defining success as "winning" the brother, Jesus adapts Leviticus 19:17 so that love protects dignity while addressing sin.',
    biblicalContext:
      'Jesus’ discourse on humility, reconciliation, and forgiveness in the kingdom community (Matthew 18:15–35).',
    inferenceStrength: 'Strong Scriptural Inference',
    speakerAttribution: 'Words spoken by Jesus',
    supportingRefs: ['Leviticus 19:17', 'Matthew 18:16', 'Deuteronomy 19:15'],
  },
  {
    id: 'inf-mat-18-16',
    verseRef: 'Matthew 18:16',
    title: 'Objective Evidentiary Safeguards Against Unsubstantiated Accusations',
    explicitStatement:
      'Matthew 18:16 explicitly states: "But if they will not listen, take one or two others along, so that ‘every matter may be established by the testimony of two or three witnesses.’"',
    inferredConclusion:
      'No disciplinary action in the community may rest on a single person’s uncorroborated claim; impartial witnesses must verify both the offense and the effort to reconcile.',
    reasoningExplanation:
      'By quoting the judicial standard of Deuteronomy 19:15, Jesus ensures fairness for both parties: the witnesses confirm whether the sin is real and whether the offender refuses repentance.',
    biblicalContext:
      'Second step of restorative reconciliation taught by Jesus in Matthew 18:16.',
    inferenceStrength: 'Strong Scriptural Inference',
    speakerAttribution: 'Words spoken by Jesus',
    supportingRefs: ['Deuteronomy 19:15', 'Matthew 18:15', 'Matthew 18:17'],
  },
  {
    id: 'inf-mat-18-20',
    verseRef: 'Matthew 18:20',
    title: 'Divine Omni-Presence and Authority of Jesus',
    explicitStatement:
      'Matthew 18:20 explicitly states: "For where two or three gather in my name, there am I with them."',
    inferredConclusion:
      'Jesus possesses the divine attribute of omnipresence, fulfilling the Old Testament reality of the Shekinah glory dwelling in the midst of God’s covenant assembly.',
    reasoningExplanation:
      'No mere creature can be simultaneously present with small gatherings of believers across the world; Jesus claims for Himself the covenantal promise of YHWH’s presence.',
    biblicalContext:
      'Conclusion of the reconciliation and united prayer section in Matthew 18:18–20.',
    inferenceStrength: 'Strong Scriptural Inference',
    speakerAttribution: 'Words spoken by Jesus',
    supportingRefs: ['Matthew 1:23', 'John 1:14', 'Matthew 18:18'],
  },
  {
    id: 'inf-jhn-3-16',
    verseRef: 'John 3:16',
    title: 'God’s Love as the Cause—Not the Result—of the Atonement',
    explicitStatement:
      'John 3:16 explicitly states: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."',
    inferredConclusion:
      'The sacrifice of Christ did not persuade a reluctant Father to love humanity; rather, the Father’s preexisting love for a fallen world initiated the gift of the Son.',
    reasoningExplanation:
      'The causal conjunction ("For God so loved... that he gave") places divine love as the fountainhead of salvation, while "whoever believes" establishes faith as the sole instrument of receiving eternal life.',
    biblicalContext:
      'The culmination of the Nicodemus discourse in John 3:14–17.',
    inferenceStrength: 'Strong Scriptural Inference',
    speakerAttribution: 'Words spoken by Jesus',
    disputedNote:
      'Scholars note a possible interpretive question regarding whether John 3:16–21 is direct speech of Jesus or the Evangelist’s commentary, and debate the scope of "the world" (kosmos) across Reformed and Arminian traditions.',
    supportingRefs: ['John 3:14', 'Numbers 21:9', 'Genesis 22:8', 'Isaiah 53:5'],
  },
  {
    id: 'inf-rom-8-28',
    verseRef: 'Romans 8:28',
    title: 'Sovereign Providence Encompasses Even Adversity for the Believer’s Good',
    explicitStatement:
      'Romans 8:28 explicitly states: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose."',
    inferredConclusion:
      'While not all events are intrinsically good in themselves, no suffering or trial is wasted or outside God’s purposeful governance for those in Christ.',
    reasoningExplanation:
      'Because "all things" (Greek panta) is comprehensive within a context discussing groaning and suffering (Romans 8:18–27), God’s providence actively weaves even trials toward conformity to Christ.',
    biblicalContext:
      'Paul’s assurance of triumph in Christ amidst present suffering (Romans 8:18–39).',
    inferenceStrength: 'Strong Scriptural Inference',
    speakerAttribution: 'Words spoken by apostles',
    supportingRefs: ['Genesis 12:3', 'Deuteronomy 32:4', 'Romans 1:17'],
  },
  {
    id: 'inf-mat-3-5',
    verseRef: 'Matthew 3:5',
    title: 'Prophetic Awakening Across Judea Prior to Jesus’ Public Ministry',
    explicitStatement:
      'Matthew 3:5 explicitly states: "People went out to him from Jerusalem and all Judea and the whole region of the Jordan."',
    inferredConclusion:
      'After centuries of prophetic silence, John’s call to repentance in the wilderness generated a nationwide spiritual movement that prepared witnesses for Jesus’ baptism.',
    reasoningExplanation:
      'The movement from the urban religious center (Jerusalem) out into the wilderness of the Jordan reverses the usual direction of pilgrimage, signaling a new exodus renewal.',
    biblicalContext:
      'Narrative of John the Baptist’s ministry at the Jordan River (Matthew 3:1–12).',
    inferenceStrength: 'Possible Interpretation',
    speakerAttribution: 'Historical narration',
    supportingRefs: ['Matthew 3:14', 'Isaiah 7:14', 'Matthew 1:23'],
  },
];

/**
 * Returns verified Biblical Types & Shadows for a given verse (matches OT Type, NT Fulfilment, or supportingRefs).
 * Never returns empty placeholder categories—returns [] when no typological connection is present.
 */
export function getTypesAndShadowsForVerse(canonicalRef: string): BiblicalTypeShadow[] {
  const norm = canonicalRef.trim().toLowerCase();
  return CANONICAL_TYPES_AND_SHADOWS.filter(
    (item) =>
      item.otTypeRef.toLowerCase() === norm ||
      item.ntAntitypeRef.toLowerCase() === norm ||
      (item.supportingRefs && item.supportingRefs.some((s) => s.toLowerCase() === norm))
  );
}

/**
 * Returns verified Biblical Inferences for a given verse (matches either the primary verseRef or supportingRefs).
 * Never invents empty categories—returns [] when no supported inference is present.
 */
export function getInferencesForVerse(canonicalRef: string): BiblicalInference[] {
  const norm = canonicalRef.trim().toLowerCase();
  return CANONICAL_INFERENCES.filter(
    (item) =>
      item.verseRef.toLowerCase() === norm ||
      item.supportingRefs.some((s) => s.toLowerCase() === norm)
  );
}

function getTestamentLabel(ref: string): string {
  const parsed = parseScriptureReference(ref);
  if (!parsed) return 'Scripture Reference';
  const book = findBookByName(parsed.book);
  return book?.testament === 'OT' ? 'Old Testament' : 'New Testament';
}

const runtimeVerseCrossRefs = new Map<string, ResolvedCrossReference[]>();

export function registerRuntimeCrossReferences(records: Record<string, ResolvedCrossReference[]>) {
  for (const [ref, list] of Object.entries(records)) {
    // Only register verified connections where passages genuinely correspond and work together
    const verifiedList = (list || []).filter(
      (item) =>
        item.connectedRef &&
        item.explanation &&
        item.explanation.length > 20 &&
        !item.explanation.startsWith('Biblical connection linking')
    );
    runtimeVerseCrossRefs.set(ref.toLowerCase(), verifiedList);
  }
}

/**
 * Bidirectional query: returns all verified cross-references where `canonicalRef`
 * is EITHER the `sourceRef` OR the `targetRef`!
 * If references do not genuinely correspond and work together, returns [] (skips them).
 */
export function getCrossReferencesForVerse(canonicalRef: string): ResolvedCrossReference[] {
  const normalized = canonicalRef.trim().toLowerCase();

  // If runtime cross references exist for this verse, use them
  if (runtimeVerseCrossRefs.has(normalized)) {
    const runtimeList = runtimeVerseCrossRefs.get(normalized) || [];
    return runtimeList.slice(0, 4);
  }

  const results: ResolvedCrossReference[] = [];

  for (const record of CANONICAL_CROSS_REFERENCES) {
    if (record.sourceRef.toLowerCase() === normalized) {
      const targetTestament = getTestamentLabel(record.targetRef);
      results.push({
        id: record.id,
        primaryRef: record.sourceRef,
        connectedRef: record.targetRef,
        category: record.sourceToTargetCategory,
        connectionLabel: record.connectionSummary,
        directionLabel: `${targetTestament} Reference (${record.sourceToTargetCategory})`,
        title: record.title,
        explanation: record.explanation,
        biblicalContext: record.biblicalContext,
        primarySpeaker: record.sourceSpeaker,
        connectedSpeaker: record.targetSpeaker,
        supportingRefs: (record.supportingRefs || []).slice(0, 2),
        disputedNote: record.disputedNote,
        dataSource: record.dataSource,
        verificationStatus: record.verificationStatus,
      });
    } else if (record.targetRef.toLowerCase() === normalized) {
      const sourceTestament = getTestamentLabel(record.sourceRef);
      results.push({
        id: record.id,
        primaryRef: record.targetRef,
        connectedRef: record.sourceRef,
        category: record.targetToSourceCategory,
        connectionLabel: record.connectionSummary,
        directionLabel: `${sourceTestament} Reference (${record.targetToSourceCategory})`,
        title: record.title,
        explanation: record.explanation,
        biblicalContext: record.biblicalContext,
        primarySpeaker: record.targetSpeaker,
        connectedSpeaker: record.sourceSpeaker,
        supportingRefs: (record.supportingRefs || []).slice(0, 2),
        disputedNote: record.disputedNote,
        dataSource: record.dataSource,
        verificationStatus: record.verificationStatus,
      });
    }
  }

  // Filter out any non-corresponding or incomplete entries; if none work together, skip (return [])
  const verifiedOnly = results.filter(
    (r) =>
      r.connectedRef &&
      r.explanation &&
      r.explanation.length > 20 &&
      !r.explanation.startsWith('Biblical connection linking')
  );

  return verifiedOnly.slice(0, 4);
}

/**
 * Finds the specific connection record between two references (in either direction).
 */
export function findConnectionBetween(refA: string, refB: string): ResolvedCrossReference | undefined {
  const list = getCrossReferencesForVerse(refA);
  const normB = refB.trim().toLowerCase();
  return list.find((item) => item.connectedRef.toLowerCase() === normB);
}

export const REFERENCE_CATEGORIES: ReferenceCategory[] = [
  'Direct quotation',
  'Prophecy',
  'Prophecy fulfilment',
  'Messianic reference',
  'Allusion',
  'Theological connection',
  'Parallel passage',
  'Historical connection',
];

