import { BiblicalTypeAndShadowEntry, TypologyCategory } from '@/types/bible';

/**
 * Authoritative Reference Library of Biblical Types and Shadows
 * Grounded in peer-reviewed biblical theology and historical typology:
 * Geerhardus Vos (Biblical Theology), Leonhard Goppelt (Typos: The Typological Interpretation of the Old Testament in the New),
 * Edmund Clowney (The Unfolding Mystery), and Meredith G. Kline (Kingdom Prologue).
 */
export const TYPES_AND_SHADOWS_LIBRARY: BiblicalTypeAndShadowEntry[] = [
  // ==========================================================================
  // 1. PEOPLE
  // ==========================================================================
  {
    id: 'ts-adam',
    name: 'Adam (The First Head of Humanity)',
    category: 'People',
    biblicalAccount: 'Created in the image and likeness of God as the federal covenant representative of humanity. Disobeyed the divine command in Eden, bringing sin, guilt, and physical and spiritual death upon all his natural descendants (Genesis 2:7, 16–17; 3:1–19).',
    historicalBackground: 'The historical beginning of human redemptive history in the pristine garden sanctuary of Eden before the entrance of the Fall.',
    otReferences: ['Genesis 1:26–28', 'Genesis 2:7', 'Genesis 2:15–17', 'Genesis 3:1–19', 'Hosea 6:7'],
    ntFulfilmentOrConnection: ['Romans 5:12–19', '1 Corinthians 15:21–22', '1 Corinthians 15:45–49'],
    personOrRealityForeshadowed: 'Jesus Christ, the "Last Adam" and "Second Man" who acts as the federal and covenantal representative of the new redeemed humanity.',
    theologicalExplanation: 'Paul explicitly calls Adam a "type of the one who was to come" (typos tou mellontos, Romans 5:14). The parallel is one of correspondence and antithesis: Adam’s disobedience brought condemnation, death, and separation from God; Christ’s obedience, active righteousness, and resurrection bring justification, life, and reconciliation. Where Adam failed the probationary test in a lush garden, Christ triumphed over temptation in a barren wilderness and in Gethsemane.',
    crossReferences: ['Psalm 8:4–8', 'Hebrews 2:6–9'],
    scholarlyInterpretations: 'Reformed and historical covenant theology identify Adam as the federal head in the Covenant of Works, directly answering to Christ as head of the Covenant of Grace (Vos, Clowney, Murray).',
    alternativePositions: 'Some modern critical theologians treat Adam purely as an archetype or mythological symbol, but New Testament apostolic christology treats Adam as a historical individual whose representative action is essential for the logic of substitutionary atonement (Romans 5:18).',
    interpretiveClassification: 'Explicit Biblical Typology',
    sourceAttribution: 'Geerhardus Vos, Biblical Theology; John Murray, The Epistle to the Romans (NICNT).',
  },
  {
    id: 'ts-melchizedek',
    name: 'Melchizedek (The Royal Priest of Salem)',
    category: 'People',
    biblicalAccount: 'Meets Abraham returning from the slaughter of the four Mesopotamian kings with bread and wine, blesses Abraham, and receives a tithe of all the spoils (Genesis 14:18–20). Appears without genealogy, birth record, or death record in the text.',
    historicalBackground: 'A righteous Canaanite king ruling Salem (pre-Israelite Jerusalem) circa 2000 BC as priest of El Elyon ("God Most High").',
    otReferences: ['Genesis 14:18–20', 'Psalm 110:4'],
    ntFulfilmentOrConnection: ['Hebrews 5:5–10', 'Hebrews 6:20', 'Hebrews 7:1–28'],
    personOrRealityForeshadowed: 'Jesus Christ in His combined, eternal offices of King of Righteousness, King of Peace, and Eternal High Priest.',
    theologicalExplanation: 'Under the Mosaic Law, the kingship (Judah) and the priesthood (Levi) were strictly separated. Melchizedek is the divine historical prototype of an older, higher royal priesthood where kingly rule and priestly mediation unite in one person. By receiving tithes from Abraham (in whose loins Levi was present), Melchizedek’s priesthood proved superior to Aaron’s temporary, dying priesthood. Christ’s resurrection ratifies Him as Priest forever according to the order of Melchizedek.',
    crossReferences: ['Zechariah 6:12–13'],
    scholarlyInterpretations: 'Scholars note the literary typology: the Genesis silence regarding Melchizedek’s pedigree was divinely orchestrated so that the text itself mirrors the eternal, indestructible life of the Son of God (Hebrews 7:3).',
    alternativePositions: 'Some ancient Jewish texts (11QMelchizedek) regarded him as an archangel; a few Christian commentators proposed a pre-incarnate appearance of Christ (theophany). The Epistle to the Hebrews, however, states he was "made like unto the Son of God," implying a historical human type rather than Christ Himself.',
    interpretiveClassification: 'Explicit Biblical Typology',
    sourceAttribution: 'F.F. Bruce, The Epistle to the Hebrews; Leonhard Goppelt, Typos (pp. 161–178).',
  },
  {
    id: 'ts-isaac',
    name: 'Isaac (The Only-Begotten Son Offered on the Mountain)',
    category: 'People',
    biblicalAccount: 'The miraculously born son of Abraham whom God commanded to be offered as a burnt offering on Mount Moriah (the Akedah). Isaac carries the sacrificial wood up the mountain and voluntarily submits to his father’s binding (Genesis 22:1–19).',
    historicalBackground: 'Patriarchal period in Canaan circa 2000–1900 BC, testing Abraham’s covenant devotion.',
    otReferences: ['Genesis 21:1–7', 'Genesis 22:1–19'],
    ntFulfilmentOrConnection: ['John 3:16', 'Romans 8:32', 'Hebrews 11:17–19', 'Galatians 3:16'],
    personOrRealityForeshadowed: 'Jesus Christ, the beloved only-begotten Son offered by the Father at Calvary and received back alive through resurrection.',
    theologicalExplanation: 'Isaac prefigures Christ as the beloved, miraculously conceived seed of promise. In Genesis 22, the father leads his only son to the place of sacrifice; the son carries the wood on his back up the mountain; the son yields to the sacrifice; and on the third day, Abraham receives him back "figuratively speaking, from the dead" (Hebrews 11:19). At the critical moment, God provides a ram caught in a thicket by its horns as a substitute, establishing the principle that God will provide the Lamb.',
    crossReferences: ['Genesis 26:1–5', 'John 8:56'],
    scholarlyInterpretations: 'Christian fathers (Tertullian, Origen, Augustine) and modern scholars (Clowney, Goldsworthy) highlight that Mount Moriah is the exact mountain ridge in Jerusalem where Solomon built the temple and near where Christ was crucified.',
    alternativePositions: 'Jewish rabbinic theology developed the Akedah as a source of atoning merit through Isaac’s willingness. Christian theology clarifies that Isaac was spared because a human sinner cannot atone for sin; the ram substituted for Isaac points forward to the sinless Lamb of God.',
    interpretiveClassification: 'Strongly Supported Typological Connection',
    sourceAttribution: 'Edmund Clowney, The Unfolding Mystery (pp. 51–64); Gordon Wenham, Genesis 16–50.',
  },
  {
    id: 'ts-joseph',
    name: 'Joseph (The Suffering and Exalted Deliverer)',
    category: 'People',
    biblicalAccount: 'Beloved son of Jacob given a tunic of many colors; betrayed and sold into slavery by his brothers for silver; falsely accused and imprisoned in Egypt; miraculously elevated to the throne of Pharaoh to preserve life during worldwide famine; reveals himself to his brothers with tears and royal forgiveness (Genesis 37–50).',
    historicalBackground: 'Middle Bronze / Second Intermediate Period in Egypt (circa 1800–1700 BC).',
    otReferences: ['Genesis 37:1–36', 'Genesis 39–45', 'Genesis 50:19–21', 'Psalm 105:16–22'],
    ntFulfilmentOrConnection: ['Acts 7:9–14', 'Philippians 2:8–11', 'Luke 24:26'],
    personOrRealityForeshadowed: 'Jesus Christ: rejected by his own brethren, suffering as a righteous servant, exalted to sovereign authority, and forgiving his repentant persecutors.',
    theologicalExplanation: 'Although the New Testament does not use the specific word typos for Joseph, Stephen’s sermon in Acts 7 explicitly presents Joseph as the prototype of Israel rejecting God’s chosen deliverer the first time, only to be reconciled to him the second time in his exaltation. Joseph’s humiliation followed by sudden universal exaltation exactly matches Christ’s path through the Cross to the right hand of God (Philippians 2:5–11).',
    crossReferences: ['Matthew 26:15', 'Luke 23:34'],
    scholarlyInterpretations: 'Scholars observe over a dozen direct thematic parallels between Joseph and Jesus: favored of the father, sent to seek his brothers, sold for the price of a slave, falsely condemned between two prisoners, given a Gentile bride, and confessing: "God intended it for good to save many lives" (Genesis 50:20).',
    alternativePositions: 'Strict typologists caution against making every minor narrative detail into an allegory; however, the broad redemptive pattern of suffering servant exalted to universal savior is universally affirmed in canonical biblical theology.',
    interpretiveClassification: 'Strongly Supported Typological Connection',
    sourceAttribution: 'Graeme Goldsworthy, According to Plan; F.F. Bruce, The Book of the Acts (NICNT).',
  },
  {
    id: 'ts-moses',
    name: 'Moses (The Prophet and Mediator of the Covenant)',
    category: 'People',
    biblicalAccount: 'Preserved in water as an infant, fled to the wilderness, summoned at the burning bush, sent to confront Pharaoh with plagues, led Israel out of Egypt through the Red Sea, mediated the covenant at Sinai, and interceded for the rebellious nation (Exodus–Deuteronomy).',
    historicalBackground: 'Late Bronze Age (circa 1446 or 1260 BC), during Israel’s exodus from Egyptian bondage.',
    otReferences: ['Exodus 3:1–15', 'Exodus 14:13–31', 'Exodus 32:30–32', 'Deuteronomy 18:15–19', 'Deuteronomy 34:10–12'],
    ntFulfilmentOrConnection: ['John 1:17', 'Acts 3:22–23', 'Acts 7:35–37', 'Hebrews 3:1–6', 'Matthew 17:1–5'],
    personOrRealityForeshadowed: 'Jesus Christ as the ultimate Prophet, Deliverer, Lawgiver, and Mediator of the New Covenant.',
    theologicalExplanation: 'God explicitly promised in Deuteronomy 18:15: "The Lord your God will raise up for you a prophet like me from among you, from your fellow Israelites. You must listen to him." Peter and Stephen cite this directly as fulfilled in Jesus (Acts 3:22; 7:37). Moses mediated with his own face veiled; Christ mediates with unveiled glory. Moses stood in the breach offering his own name to be blotted out for Israel (Exodus 32); Christ actually bore the curse of the Law in His own body on the tree (Galatians 3:13).',
    crossReferences: ['Galatians 3:19–20', '1 Timothy 2:5', 'Hebrews 8:6'],
    scholarlyInterpretations: 'Hebrews 3 contrasts Moses as a faithful servant in all God’s house with Christ who is the divine Son over God’s house, proving the fulfillment exceeds the type.',
    alternativePositions: 'Jewish rabbinic tradition saw Moses as the unsurpassable apex of prophecy. The New Testament boldly demonstrates that Moses himself pointed forward to Jesus as his superior.',
    interpretiveClassification: 'Explicit Biblical Typology',
    sourceAttribution: 'Meredith G. Kline, Treaty of the Great King; Brevard Childs, Old Testament Theology in a Canonical Context.',
  },
  {
    id: 'ts-david',
    name: 'David (The Anointed Shepherd-King)',
    category: 'People',
    biblicalAccount: 'Anointed while a humble shepherd boy, defeated the giant Goliath with faith and a sling, suffered years of unjust persecution from King Saul in the wilderness, ascended the throne in Hebron and Jerusalem, and received the unconditional eternal covenant promise (1 & 2 Samuel).',
    historicalBackground: 'United Monarchy period in ancient Israel (circa 1010–970 BC).',
    otReferences: ['1 Samuel 16:1–13', '1 Samuel 17:32–50', '2 Samuel 7:12–16', 'Psalm 2:6–12', 'Psalm 89:3–4', 'Psalm 110:1'],
    ntFulfilmentOrConnection: ['Matthew 1:1', 'Luke 1:31–33', 'Acts 2:29–36', 'Acts 13:34–37', 'Revelation 5:5'],
    personOrRealityForeshadowed: 'Jesus Christ, the true Son of David, the Good Shepherd, and the King whose reign knows no end.',
    theologicalExplanation: 'David is the royal prototype of the Messiah ("Anointed One"). His suffering in the wilderness before his coronation mirrors Christ’s humiliation before His exaltation. The Psalms of David (e.g., Psalm 22, 69, 110) combine David’s historical anguish with prophetic descriptions of Christ’s crucifixion and session at God’s right hand. In the prophets, the coming Messiah is even called "David my servant" (Ezekiel 34:23–24).',
    crossReferences: ['Isaiah 9:6–7', 'Jeremiah 23:5–6', 'Ezekiel 37:24–25'],
    scholarlyInterpretations: 'Vos and Kline emphasize the Davidic covenant as the historical framework through which the Kingdom of God advances toward eschatological realization.',
    alternativePositions: 'Dispensational theology emphasizes a literal future earthly throne in Jerusalem, whereas Covenant and Reformed theology see the Davidic throne currently occupied by the exalted Christ at the Father’s right hand (Acts 2:30–36) with climactic consummation at His return.',
    interpretiveClassification: 'Explicit Biblical Typology',
    sourceAttribution: 'Geerhardus Vos, The Pauline Eschatology; Bruce K. Waltke, An Old Testament Theology.',
  },

  // ==========================================================================
  // 2. OBJECTS
  // ==========================================================================
  {
    id: 'ts-ark-covenant',
    name: 'The Ark of the Covenant',
    category: 'Objects',
    biblicalAccount: 'An acacia wood chest overlaid inside and out with pure gold, housing the two stone tablets of the Ten Commandments, Aaron’s budding rod, and a golden pot of manna. Topped by the golden Mercy Seat (Kapporeth) with two cherubim facing inward (Exodus 25:10–22).',
    historicalBackground: 'Constructed at Mount Sinai by Bezalel; placed in the Holy of Holies as the earthly footstool of the invisible God.',
    otReferences: ['Exodus 25:10–22', 'Leviticus 16:2', 'Numbers 10:33–36', 'Joshua 3:14–17', '1 Kings 8:1–11'],
    ntFulfilmentOrConnection: ['Romans 3:25', 'Hebrews 9:3–5', 'Hebrews 10:19–22', 'Revelation 11:19'],
    personOrRealityForeshadowed: 'Jesus Christ: His dual natures (wood and gold), His perfect keeping of the Law, and His substitutionary blood satisfying divine justice.',
    theologicalExplanation: 'The Ark represents the throne room of Yahweh on earth. In Romans 3:25, Paul calls Jesus the hilastērion ("mercy seat / propitiation"), which is the exact Greek Septuagint term for the golden cover of the Ark. On the Day of Atonement, the High Priest sprinkled sacrificial blood between the holy Law below and the glory cloud above, transforming the throne of judgment into a throne of grace. Christ is both the mercy seat and the blood sprinkled upon it.',
    crossReferences: ['Leviticus 16:14–15', 'Hebrews 4:16', '1 John 2:2'],
    scholarlyInterpretations: 'Theologians (Warfield, Murray, Carson) demonstrate that hilastērion in Romans 3:25 intentionally recalls the kapporeth/mercy seat where divine wrath is appeased through atoning blood.',
    alternativePositions: 'Some 20th-century scholars (C.H. Dodd) argued hilastērion should be translated purely as "expiation" (cleansing of sin) without propitiation (turning away of wrath). However, Leon Morris and D.A. Carson proved conclusively that the biblical type involves both the removal of sin and the satisfaction of divine holy justice.',
    interpretiveClassification: 'Explicit Biblical Typology',
    sourceAttribution: 'Leon Morris, The Atonement (pp. 125–150); D.A. Carson, Exegetical Fallacies.',
  },
  {
    id: 'ts-tabernacle',
    name: 'The Tabernacle (Mishkan / Tent of Meeting)',
    category: 'Objects',
    biblicalAccount: 'A portable sanctuary built according to the heavenly pattern shown to Moses on the mountain. Structured into the Outer Court, the Holy Place, and the Most Holy Place, enveloped in linen, goat hair, and skins, where God dwelt amidst Israel’s camp (Exodus 25–40).',
    historicalBackground: 'The center of Israel’s religious and communal life during the 40 years of wilderness wandering and the early settlement in Canaan.',
    otReferences: ['Exodus 25:8–9', 'Exodus 40:34–38', 'Leviticus 26:11–12'],
    ntFulfilmentOrConnection: ['John 1:14', 'John 2:19–21', 'Colossians 2:9', 'Hebrews 8:1–2', 'Hebrews 9:11–12', 'Revelation 21:3'],
    personOrRealityForeshadowed: 'The Incarnation of Jesus Christ, the Church as the temple of the Spirit, and the New Jerusalem where God dwells with man forever.',
    theologicalExplanation: 'John 1:14 states: "The Word became flesh and tabernacled [eskēnōsen] among us, and we have seen his glory." The wilderness Tabernacle was a shadowy replica of the true heavenly sanctuary (Hebrews 8:2, 5). Every station—from the bronze altar of sacrifice, to the bronze laver of cleansing, to the golden lampstand, bread of presence, altar of incense, and veil—corresponds to a dimension of Christ’s saving person and work.',
    crossReferences: ['1 Corinthians 3:16', 'Ephesians 2:20–22', 'Hebrews 9:24'],
    scholarlyInterpretations: 'Meredith Kline and G.K. Beale demonstrate that the Tabernacle was designed as an architectural miniature of the cosmos, renewed through Christ into the global dwelling place of God in the church.',
    alternativePositions: 'Excessive allegorization in the Middle Ages assigned arbitrary spiritual meanings to every pin, cord, and hook. Sound hermeneutics focuses on the macro-typology: God dwelling amidst a redeemed people through blood mediation.',
    interpretiveClassification: 'Explicit Biblical Typology',
    sourceAttribution: 'G.K. Beale, The Temple and the Church’s Mission; Meredith G. Kline, Images of the Spirit.',
  },
  {
    id: 'ts-bronze-serpent',
    name: 'The Bronze Serpent on the Pole',
    category: 'Objects',
    biblicalAccount: 'When Israel grumbled in the wilderness, the Lord sent venomous serpents among them. Moses prayed for the people, and God commanded him to make a bronze serpent and set it upon a pole, promising that whoever looked upon it in faith would live (Numbers 21:4–9).',
    historicalBackground: 'Wilderness journey near Edom around 1406 BC.',
    otReferences: ['Numbers 21:4–9', '2 Kings 18:4'],
    ntFulfilmentOrConnection: ['John 3:14–15', '2 Corinthians 5:21', 'Galatians 3:13'],
    personOrRealityForeshadowed: 'Jesus Christ lifted up on the cross, made sin and a curse for us, so that all who look to Him in faith receive eternal life.',
    theologicalExplanation: 'Jesus personally interpreted this event to Nicodemus: "Just as Moses lifted up the snake in the wilderness, so the Son of Man must be lifted up, that everyone who believes may have eternal life in him" (John 3:14–15). The irony is profound: a serpent represented the curse and source of death, yet the bronze emblem of that curse, lifted high, became the vehicle of life. Christ, who knew no sin, was made sin for us (2 Corinthians 5:21) and became a curse in our place (Galatians 3:13). Looking in faith to the crucified Savior brings instant spiritual healing.',
    crossReferences: ['Isaiah 45:22', 'Hebrews 12:2'],
    scholarlyInterpretations: 'D.A. Carson notes that the Greek hypsoō ("lift up") in John carries a dual meaning: physical elevation on the Roman cross and supreme theological glorification and exaltation.',
    alternativePositions: 'In later Israelite history, the bronze serpent became an idol (Nehushtan) and was rightly destroyed by King Hezekiah (2 Kings 18:4). This proves the object possessed no magical virtue; healing came solely through God’s word received through faith.',
    interpretiveClassification: 'Explicit Biblical Typology',
    sourceAttribution: 'D.A. Carson, The Gospel According to John (p. 200–204); Leon Morris, The Gospel According to John.',
  },
  {
    id: 'ts-manna',
    name: 'The Manna (Bread from Heaven)',
    category: 'Objects',
    biblicalAccount: 'Flake-like miraculous bread resembling coriander seed, sweet like wafers made with honey, rained down from heaven every morning around Israel’s camp for 40 years to sustain them in the barren desert (Exodus 16; Numbers 11).',
    historicalBackground: 'The wilderness of Sin between Elim and Mount Sinai, circa 1446 BC.',
    otReferences: ['Exodus 16:1–36', 'Numbers 11:7–9', 'Deuteronomy 8:3', 'Psalm 78:24–25', 'Nehemiah 9:20'],
    ntFulfilmentOrConnection: ['John 6:31–35', 'John 6:48–58', '1 Corinthians 10:3–4', 'Revelation 2:17'],
    personOrRealityForeshadowed: 'Jesus Christ, the True Bread of Life sent down from the Father to give eternal life to the world.',
    theologicalExplanation: 'In John 6, Jesus confronted the crowds seeking physical food: "Our ancestors ate the manna in the wilderness... but it is not Moses who gave you the bread from heaven, but it is my Father who gives you the true bread from heaven... I am the bread of life. Whoever comes to me will never go hungry." Manna could only temporarily stave off physical death; Christ permanently satisfies spiritual hunger and imparts eternal life through His broken body.',
    crossReferences: ['Matthew 4:4', 'Luke 22:19'],
    scholarlyInterpretations: 'Deuteronomy 8:3 establishes that God fed Israel with manna to teach that "man does not live on bread alone but on every word that comes from the mouth of the Lord"—fulfilled in Christ who is the incarnate Logos.',
    alternativePositions: 'Naturalistic commentators claim manna was resin secreted by scale insects feeding on tamarisk trees. Biblical scholarship refutes this: the natural excretion is seasonal, minimal, and does not exhibit the biblical properties (melting in the sun, rotting overnight except on the Sabbath, feeding millions daily).',
    interpretiveClassification: 'Explicit Biblical Typology',
    sourceAttribution: 'Raymond E. Brown, The Gospel According to John; Craig S. Keener, The Gospel of John.',
  },
  {
    id: 'ts-smitten-rock',
    name: 'The Smitten Rock at Horeb',
    category: 'Objects',
    biblicalAccount: 'When Israel had no water at Rephidim, the Lord commanded Moses to take his staff and strike the rock at Horeb before the elders. Moses struck the rock, and water gushed out in streams to quench the thirst of the entire congregation (Exodus 17:1–7; Numbers 20:1–13).',
    historicalBackground: 'At the foot of Mount Sinai/Horeb during the wilderness march.',
    otReferences: ['Exodus 17:1–7', 'Numbers 20:1–13', 'Psalm 78:15–16', 'Psalm 105:41', 'Isaiah 48:21'],
    ntFulfilmentOrConnection: ['1 Corinthians 10:4', 'John 4:13–14', 'John 7:37–39'],
    personOrRealityForeshadowed: 'Jesus Christ, struck by the rod of divine judgment so that the living water of the Holy Spirit flows to all who believe.',
    theologicalExplanation: 'Paul states unequivocally: "They drank from the spiritual rock that accompanied them, and that rock was Christ" (1 Corinthians 10:4). God Himself stood upon the rock at Horeb (Exodus 17:6); the rod of divine judgment struck the rock, and life-giving water burst forth. Later, when Moses struck the rock twice in anger instead of speaking to it (Numbers 20:8–12), he obscured the divine typology: Christ was struck once for all on the cross (Hebrews 9:28); henceforth, the living water is received simply by speaking to Him in prayer.',
    crossReferences: ['Isaiah 53:4–5', 'Zechariah 13:1', 'Revelation 22:17'],
    scholarlyInterpretations: 'Gordon Fee and Richard Hays show that Paul’s identification of Christ as the spiritual rock uses established Second Temple Jewish typological memory (Pseudo-Philo) to demonstrate Christ’s pre-existent presence guiding Israel.',
    alternativePositions: 'Some critical scholars treat the rock story as folklore about finding desert aquifers; apostolic interpretation sees it as a profound redemptive-historical act of God displaying substitutionary atonement.',
    interpretiveClassification: 'Explicit Biblical Typology',
    sourceAttribution: 'Gordon D. Fee, The First Epistle to the Corinthians (NICNT); Richard B. Hays, Echoes of Scripture in the Letters of Paul.',
  },

  // ==========================================================================
  // 3. SACRIFICES
  // ==========================================================================
  {
    id: 'ts-passover-lamb',
    name: 'The Passover Lamb (Corban Pesach)',
    category: 'Sacrifices',
    biblicalAccount: 'On the 10th of Nisan, each Hebrew household selected a yearling male lamb without blemish or defect, kept it until the 14th, slaughtered it at twilight, and applied its blood with hyssop to the doorposts and lintel. The destroying angel passed over houses covered by the blood; not a single bone was to be broken (Exodus 12:1–28).',
    historicalBackground: 'The tenth plague upon Egypt, delivering Israel on the eve of the Exodus (circa 1446 BC).',
    otReferences: ['Exodus 12:1–28', 'Leviticus 23:5', 'Numbers 9:1–14', 'Deuteronomy 16:1–8'],
    ntFulfilmentOrConnection: ['1 Corinthians 5:7', 'John 1:29', 'John 19:36', '1 Peter 1:18–19', 'Revelation 5:6–12'],
    personOrRealityForeshadowed: 'Jesus Christ, the sinless Lamb of God whose applied blood turns away divine wrath and secures eternal redemption.',
    theologicalExplanation: 'Paul writes plainly: "Christ, our Passover lamb, has been sacrificed" (1 Corinthians 5:7). John the Baptist introduced Jesus: "Look, the Lamb of God, who takes away the sin of the world!" (John 1:29). When Roman soldiers broke the legs of the two thieves at Calvary, they saw Jesus was already dead and broke none of His bones, fulfilling Exodus 12:46 (John 19:36). Through the blood of Christ applied to the heart by faith, believers are shielded from eternal condemnation.',
    crossReferences: ['Isaiah 53:7', 'Acts 8:32', 'Revelation 7:14'],
    scholarlyInterpretations: 'Jeremias and Morris highlight that the Last Supper occurred during Passover, transforming the ancient memorial of Egyptian liberation into the New Covenant sacrament of redemption from sin.',
    alternativePositions: 'Some comparative religionists argued Passover originated as an apotropaic nomad ritual to ward off desert demons. Scripture establishes it as a historical covenant act of Yahweh delivering His chosen people from judicial execution.',
    interpretiveClassification: 'Explicit Biblical Typology',
    sourceAttribution: 'Joachim Jeremias, The Eucharistic Words of Jesus; Leon Morris, The Apostolic Preaching of the Cross.',
  },
  {
    id: 'ts-burnt-offering',
    name: 'The Burnt Offering (Olah / Whole Offering)',
    category: 'Sacrifices',
    biblicalAccount: 'The worshiper laid hands on the head of an unblemished male animal, slaughtered it, and the priests splashed the blood against the altar. The entire animal (except the skin) was then consumed by fire on the altar as a soothing aroma to Yahweh (Leviticus 1:1–17).',
    historicalBackground: 'The foundational sacrifice in the Tabernacle and Temple, offered continually every morning and evening (the Tamid).',
    otReferences: ['Genesis 8:20', 'Leviticus 1:1–17', 'Leviticus 6:8–13', 'Numbers 28:1–8'],
    ntFulfilmentOrConnection: ['Ephesians 5:2', 'Hebrews 10:5–10', 'Romans 12:1'],
    personOrRealityForeshadowed: 'Jesus Christ’s complete, total, unreserved consecration and devotion to the Father, ascending as a pleasing aroma.',
    theologicalExplanation: 'The Hebrew word ‘ōlāh means "that which goes up" or "ascends" in smoke to God. Unlike other sacrifices where portions were eaten by priests or worshipers, the burnt offering was wholly given over to God. Paul describes Christ’s sacrifice in Ephesians 5:2: "Christ loved us and gave himself up for us as a fragrant offering and sacrifice to God." It signifies total self-surrender, satisfying God’s holy standard of complete obedience.',
    crossReferences: ['Psalm 40:6–8', 'Hebrews 9:14'],
    scholarlyInterpretations: 'Gordon Wenham and Jacob Milgrom explain that the primary theological significance of the Olah was expiation and total consecration, providing the baseline for covenant fellowship with God.',
    alternativePositions: 'Liberal scholarship often reduced the burnt offering to ancient "food for the gods." Biblical theology demonstrates God needs no food (Psalm 50:12–13); the smoke represents acceptable dedication and substitutionary atonement.',
    interpretiveClassification: 'Strongly Supported Typological Connection',
    sourceAttribution: 'Gordon Wenham, The Book of Leviticus (NICOT); Jacob Milgrom, Leviticus 1–16 (Anchor Bible).',
  },
  {
    id: 'ts-day-atonement-scapegoat',
    name: 'The Two Goats on the Day of Atonement (Yom Kippur & Azazel)',
    category: 'Sacrifices',
    biblicalAccount: 'On the tenth day of the seventh month, the High Priest cast lots over two goats: one goat was slaughtered as a sin offering and its blood taken into the Holy of Holies to cleanse the sanctuary; on the second goat (the scapegoat / Azazel), the High Priest laid both hands, confessed all the sins of Israel, and sent it away into the wilderness bearing their iniquities away (Leviticus 16:7–22).',
    historicalBackground: 'The annual Day of Atonement (Yom Kippur), the most solemn day of the biblical calendar.',
    otReferences: ['Leviticus 16:1–34', 'Leviticus 23:26–32'],
    ntFulfilmentOrConnection: ['Hebrews 9:7–14', 'Hebrews 13:11–13', 'Romans 3:25', '2 Corinthians 5:21'],
    personOrRealityForeshadowed: 'The dual aspects of Christ’s sacrifice: propitiation (satisfying God’s holy wrath by blood) and expiation (carrying our sins completely away into oblivion).',
    theologicalExplanation: 'One animal could not adequately portray both aspects of redemption: one goat died to satisfy divine justice (propitiation), and the other lived to carry the sins far away from God’s presence into the desert (expiation). As Psalm 103:12 proclaims: "As far as the east is from the west, so far has he removed our transgressions from us." Jesus fulfilled both: He shed His blood to atone for our guilt, and suffered outside the camp (Hebrews 13:12) to banish our sins forever.',
    crossReferences: ['Psalm 103:12', 'Micah 7:19', 'Isaiah 53:6'],
    scholarlyInterpretations: 'Geerhardus Vos notes that Yom Kippur represents the structural climax of the entire Levitical system, exhaustively fulfilled when Christ entered the true Heavenly sanctuary once for all.',
    alternativePositions: 'Scholars debate the meaning of the word Azazel: whether it means "the goat that departs" (scapagoat), an arid rocky precipice, or a wilderness demon symbolizing the realm of death. In all readings, the theological point remains: sin is completely deported from God’s camp.',
    interpretiveClassification: 'Explicit Biblical Typology',
    sourceAttribution: 'Geerhardus Vos, Biblical Theology; F.F. Bruce, The Epistle to the Hebrews.',
  },

  // ==========================================================================
  // 4. EVENTS
  // ==========================================================================
  {
    id: 'ts-exodus-red-sea',
    name: 'The Exodus and Crossing of the Red Sea',
    category: 'Events',
    biblicalAccount: 'God redeemed Israel from tyrannical slavery in Egypt with signs and wonders. Trapped between Pharaoh’s pursuing army and the Red Sea, the Lord parted the waters through Moses’ staff; Israel crossed on dry land while the Egyptian cavalry was submerged and destroyed in the returning waters (Exodus 14:1–31).',
    historicalBackground: 'The defining national redemption event of Israel’s history (circa 1446 BC).',
    otReferences: ['Exodus 14:1–31', 'Exodus 15:1–21', 'Psalm 77:16–20', 'Psalm 106:9–12', 'Isaiah 51:9–11'],
    ntFulfilmentOrConnection: ['1 Corinthians 10:1–2', 'Luke 9:31', 'Revelation 15:2–4'],
    personOrRealityForeshadowed: 'The greater New Exodus: liberation of sinners from the bondage of Satan, sin, and death through Christ, and initiation through Christian baptism.',
    theologicalExplanation: 'Paul states in 1 Corinthians 10:1–2: "Our ancestors were all under the cloud and that they all passed through the sea. They were all baptized into Moses in the cloud and in the sea." In Luke 9:31, on the Mount of Transfiguration, Moses and Elijah speak with Jesus about His upcoming death in Jerusalem, literally calling it His "exodus" (exodos). In Revelation 15:3, the redeemed saints standing by the sea of glass sing "the song of God’s servant Moses and of the Lamb."',
    crossReferences: ['Romans 6:3–6', 'Colossians 1:13–14'],
    scholarlyInterpretations: 'N.T. Wright and David Pao demonstrate that the Gospels and Acts are structured around the theme of the "New Exodus" promised by Isaiah, where God brings His people out of cosmic exile.',
    alternativePositions: 'Naturalistic theories attempt to explain the parting through wind setdown in shallow reed marshes. The biblical text presents a miraculous divine intervention where waters stood as walls on the right and left (Exodus 14:22).',
    interpretiveClassification: 'Explicit Biblical Typology',
    sourceAttribution: 'David Pao, Acts and the Isaianic New Exodus; N.T. Wright, Jesus and the Victory of God.',
  },
  {
    id: 'ts-noah-flood-ark',
    name: 'Noah’s Ark and the Great Flood',
    category: 'Events',
    biblicalAccount: 'Universal divine judgment by water upon a corrupt human race. God instructed righteous Noah to construct an enormous gopher-wood ark with a single door. Noah and his family (eight souls) and pairs of every animal were preserved inside while the world outside perished (Genesis 6–9).',
    historicalBackground: 'Antediluvian epoch, terminating the first era of human civilization.',
    otReferences: ['Genesis 6:1–22', 'Genesis 7:1–24', 'Genesis 8:1–22', 'Isaiah 54:9'],
    ntFulfilmentOrConnection: ['1 Peter 3:20–21', '2 Peter 2:5', '2 Peter 3:5–7', 'Matthew 24:37–39', 'Hebrews 11:7'],
    personOrRealityForeshadowed: 'Jesus Christ as the sole sanctuary of salvation from the coming final judgment, and baptism into His death and resurrection.',
    theologicalExplanation: 'Peter explicitly calls this an antitype (antitypon): "In it only a few people, eight in all, were saved through water, and this water symbolizes baptism that now saves you also—not the removal of dirt from the body but the pledge of a clear conscience toward God. It saves you by the resurrection of Jesus Christ" (1 Peter 3:20–21). Just as the ark had one door, took the pounding of judgment waters from above and below, and preserved all within, so Christ is the only door (John 10:9) who bore the storm of God’s wrath to carry believers safely into the new creation.',
    crossReferences: ['John 10:9', 'Romans 8:1'],
    scholarlyInterpretations: 'Scholars note the covenantal recreation motif: the flood was a de-creation and re-creation of the earth; baptism and regeneration in Christ constitute the spiritual recreation of the believer (2 Corinthians 5:17).',
    alternativePositions: 'Debates exist regarding whether the Flood was anthropologically universal or geographically localized. The typological reality remains unchallenged: divine judgment upon ungodliness and sovereign deliverance of the faithful in the divinely provided ark.',
    interpretiveClassification: 'Explicit Biblical Typology',
    sourceAttribution: 'Edmund Clowney, The Unfolding Mystery; J.N.D. Kelly, A Commentary on the Epistles of Peter and Jude.',
  },

  // ==========================================================================
  // 5. INSTITUTIONS
  // ==========================================================================
  {
    id: 'ts-high-priesthood',
    name: 'The Aaronic High Priesthood',
    category: 'Institutions',
    biblicalAccount: 'Consecrated with holy anointing oil, dressed in garments of glory and beauty (turban, breastpiece bearing the names of the 12 tribes over his heart, golden ephod, and bells), mediating between a holy God and sinful Israel (Exodus 28–29; Leviticus 8).',
    historicalBackground: 'Instituted at Mount Sinai for Aaron and his male descendants.',
    otReferences: ['Exodus 28:1–43', 'Exodus 29:1–37', 'Leviticus 8:1–36', 'Leviticus 16:1–34', 'Numbers 20:22–29'],
    ntFulfilmentOrConnection: ['Hebrews 2:17–18', 'Hebrews 4:14–16', 'Hebrews 7:23–28', 'Hebrews 8:1–6', 'Hebrews 9:24–28'],
    personOrRealityForeshadowed: 'Jesus Christ, the great, sinless, sympathetic, and eternal High Priest who ever lives to intercede for His people.',
    theologicalExplanation: 'The entire argument of the Epistle to the Hebrews demonstrates how the Aaronic priesthood was a temporary, shadow institution designed to reveal humanity’s need for an eternal mediator. Aaron’s priests were sinners who had to offer sacrifices for themselves first; they died and had to be replaced; their animal blood could never truly take away sin (Hebrews 10:4). Christ, however, is holy, blameless, unstained, offering Himself once for all, and holding an unchangeable priesthood because He lives forever (Hebrews 7:26–28).',
    crossReferences: ['Psalm 110:4', '1 Timothy 2:5', '1 John 2:1–2'],
    scholarlyInterpretations: 'F.F. Bruce points out that Christ fulfills both the priestly representative role (carrying believers on His heart before God) and the sacrificial role simultaneously.',
    alternativePositions: 'Some ecclesiastical traditions sought to re-institute a sacerdotal caste of human priests offering repetitive unbloody sacrifices. Hebrews demonstrates that the Levitical priesthood ended definitively at the Cross.',
    interpretiveClassification: 'Explicit Biblical Typology',
    sourceAttribution: 'F.F. Bruce, The Epistle to the Hebrews; Philip Edgcumbe Hughes, A Commentary on the Epistle to the Hebrews.',
  },
  {
    id: 'ts-kinsman-redeemer',
    name: 'The Kinsman-Redeemer (Go’el)',
    category: 'Institutions',
    biblicalAccount: 'The ancient covenant law requiring the nearest close relative to buy back land sold during poverty, redeem a relative who sold themselves into slavery, and marry the childless widow of a deceased brother to raise up offspring (Levirate marriage) (Leviticus 25:25–55; Ruth 2–4).',
    historicalBackground: 'Mosaic civil and social legislation protecting family inheritance and vulnerable persons in Israel.',
    otReferences: ['Leviticus 25:25–28', 'Leviticus 25:47–55', 'Numbers 35:19–21', 'Ruth 2:20', 'Ruth 3:9–13', 'Ruth 4:1–12'],
    ntFulfilmentOrConnection: ['Hebrews 2:14–17', 'Galatians 4:4–5', 'Ephesians 1:7', 'Titus 2:14'],
    personOrRealityForeshadowed: 'Jesus Christ, who took on flesh and blood to become our near kinsman, paying the redemption price to set us free from slavery to sin and restore our heavenly inheritance.',
    theologicalExplanation: 'A Go’el had to meet three strict biblical qualifications: 1) He must be a blood relative; 2) He must possess the financial capacity to pay the redemption price; and 3) He must be willing to redeem. In the Book of Ruth, Boaz illustrates this beautifully. Jesus meets every criterion: by the Incarnation, He became our near brother ("he had to be made like them, fully human in every way," Hebrews 2:17); by His sinless divine life, He had the infinite capacity to pay our ransom price; and in love, He was freely willing to lay down His life.',
    crossReferences: ['Job 19:25', 'Isaiah 43:1', 'Mark 10:45'],
    scholarlyInterpretations: 'Scholars link the Go’el to Job’s triumphant cry: "I know that my Redeemer [Go’ali] lives, and that in the end he will stand on the earth" (Job 19:25).',
    alternativePositions: 'Ruth’s nearest kinsman refused to redeem Ruth lest he impair his own inheritance (Ruth 4:6), demonstrating human inability. Christ alone willingly impairs His riches ("became poor for your sake") to redeem His bride.',
    interpretiveClassification: 'Strongly Supported Typological Connection',
    sourceAttribution: 'Daniel I. Block, Judges, Ruth (NAC); Robert L. Hubbard Jr., The Book of Ruth (NICOT).',
  },
  {
    id: 'ts-year-jubilee',
    name: 'The Year of Jubilee (Yovel)',
    category: 'Institutions',
    biblicalAccount: 'Every fiftieth year, following seven cycles of seven sabbatical years (49 years), on the Day of Atonement, the trumpet was sounded throughout the land. All debts were wiped clean, all Hebrew slaves were liberated, and all ancestral lands returned to their original owners (Leviticus 25:8–55).',
    historicalBackground: 'The supreme economic and social reset instituted in the Mosaic Law.',
    otReferences: ['Leviticus 25:8–55', 'Leviticus 27:17–24', 'Isaiah 61:1–3'],
    ntFulfilmentOrConnection: ['Luke 4:16–21', 'Acts 3:19–21', 'Romans 8:19–21'],
    personOrRealityForeshadowed: 'The gospel era of spiritual liberation inaugurated by Jesus, and the final renewal of all creation at His return.',
    theologicalExplanation: 'In the synagogue of Nazareth (Luke 4:18–19), Jesus unrolled the scroll of Isaiah 61 and proclaimed: "The Spirit of the Lord is on me, because he has anointed me to proclaim good news to the poor... to proclaim freedom for the prisoners and recovery of sight for the blind, to set the oppressed free, to proclaim the year of the Lord’s favor." He then declared: "Today this scripture is fulfilled in your hearing." Christ is the true Jubilee who cancels the unpayable debt of sin and restores our lost inheritance.',
    crossReferences: ['Colossians 2:13–14', '1 Peter 1:4'],
    scholarlyInterpretations: 'Christopher Wright and Darrell Bock demonstrate that Luke’s gospel presents Jesus’ kingdom ministry as the eschatological Jubilee fulfilling Israel’s deepest prophetic longings.',
    alternativePositions: 'Liberation theologians sometimes reduce the Jubilee solely to modern socio-political socialist redistribution. While its original civil form had social implications, the New Testament climactically applies it to the supernatural forgiveness of sins, liberation from Satan, and the cosmic renewal of creation.',
    interpretiveClassification: 'Explicit Biblical Typology',
    sourceAttribution: 'Christopher J.H. Wright, An Eye for an Eye; Darrell L. Bock, Luke (BECNT).',
  },
  {
    id: 'ts-sabbath',
    name: 'The Sabbath Day and Sabbatical Rest',
    category: 'Institutions',
    biblicalAccount: 'God rested on the seventh day from all His creative works and sanctified it (Genesis 2:2–3). Enshrined in the Fourth Commandment as a day of complete cessation from labor for all humans and animals, and a sign of the Mosaic covenant (Exodus 20:8–11; Deuteronomy 5:12–15).',
    historicalBackground: 'Creation ordinance codified into Israel’s national covenant law at Sinai.',
    otReferences: ['Genesis 2:2–3', 'Exodus 20:8–11', 'Exodus 31:13–17', 'Deuteronomy 5:12–15', 'Isaiah 58:13–14'],
    ntFulfilmentOrConnection: ['Colossians 2:16–17', 'Hebrews 4:1–11', 'Matthew 11:28–30'],
    personOrRealityForeshadowed: 'Jesus Christ as our true rest from works-righteousness, and the eternal Sabbath rest awaiting the people of God in the new creation.',
    theologicalExplanation: 'Paul states explicitly: "Do not let anyone judge you by what you eat or drink, or with regard to a religious festival, a New Moon celebration or a Sabbath day. These are a shadow [skia] of the things that were to come; the reality [sōma / substance], however, is found in Christ" (Colossians 2:16–17). In Matthew 11:28, Jesus calls: "Come to me, all you who are weary and burdened, and I will give you rest." Hebrews 4 explains that entering faith in Christ is ceasing from one’s own works to earn salvation, resting completely in the finished work of Christ.',
    crossReferences: ['Hebrews 4:9–10', 'Revelation 14:13'],
    scholarlyInterpretations: 'Richard Gaffin and D.A. Carson outline that the Old Covenant weekly Sabbath pointed forward redemptively to the spiritual rest of salvation realized in the New Covenant and consummated in glory.',
    alternativePositions: 'Sabbatarian groups insist on strict literal observance of the seventh day. Reformed theology views Sunday as the "Lord’s Day" (Christian Sabbath) celebrating the resurrection. Paul’s teaching in Colossians 2 and Romans 14 emphasizes that the ceremonial shadow of the seventh day finds its fulfillment in Christ Himself.',
    interpretiveClassification: 'Explicit Biblical Typology',
    sourceAttribution: 'D.A. Carson, From Sabbath to Lord’s Day; Richard B. Gaffin Jr., "A Cessationist View".',
  },

  // ==========================================================================
  // 6. PLACES
  // ==========================================================================
  {
    id: 'ts-cities-refuge',
    name: 'The Cities of Refuge',
    category: 'Places',
    biblicalAccount: 'Six Levitical cities established across the Promised Land (three on each side of the Jordan) where a person who unintentionally killed someone could flee to find asylum from the blood avenger, remaining safe within the city until the death of the High Priest (Numbers 35:9–34; Joshua 20:1–9).',
    historicalBackground: 'Settlement of the tribes of Israel in Canaan under Joshua (circa 1400 BC).',
    otReferences: ['Numbers 35:9–34', 'Deuteronomy 19:1–13', 'Joshua 20:1–9'],
    ntFulfilmentOrConnection: ['Hebrews 6:18', 'Romans 8:1', 'Philippians 3:9'],
    personOrRealityForeshadowed: 'Jesus Christ as the ultimate, open sanctuary for guilty sinners fleeing the judgment of the Law, released and made free by the death of our Great High Priest.',
    theologicalExplanation: 'The author of Hebrews alludes to this refuge in Hebrews 6:18: "we who have fled to take hold of the hope set before us may be greatly encouraged." The sinner condemned under the holy Law of God flees to Christ for refuge. Inside Christ, there is "now no condemnation" (Romans 8:1). Furthermore, the refugee in the ancient city was set completely free to return home upon the death of the High Priest (Numbers 35:28)—typifying how the death of Jesus our High Priest secures our total freedom and restores our lost inheritance.',
    crossReferences: ['Psalm 46:1', 'Psalm 91:1–2'],
    scholarlyInterpretations: 'Puritan and historical commentators (John Owen, Matthew Henry) richly developed the parallels: the roads to the cities had to be kept clear and unobstructed, just as the way of salvation is freely proclaimed to all.',
    alternativePositions: 'Some modern commentators view the cities purely as ancient civil manslaughter jurisprudence. Biblical theology demonstrates civil laws in the theocracy also mirrored spiritual redemptive truths.',
    interpretiveClassification: 'Strongly Supported Typological Connection',
    sourceAttribution: 'John Owen, Exposition of the Epistle to the Hebrews; Tremper Longman III, Reading the Bible with Heart and Mind.',
  },
  {
    id: 'ts-mount-zion-jerusalem',
    name: 'Mount Zion and the Holy City Jerusalem',
    category: 'Places',
    biblicalAccount: 'The Jebusite stronghold captured by David, where the Ark of the Covenant was placed and the Temple built by Solomon. Called the City of God, the place where God chose to cause His Name to dwell (2 Samuel 5; Psalm 48; 132).',
    historicalBackground: 'Capital of the united and southern kingdoms of Israel and Judah.',
    otReferences: ['Psalm 48:1–14', 'Psalm 132:13–14', 'Isaiah 2:2–4', 'Zechariah 8:3'],
    ntFulfilmentOrConnection: ['Galatians 4:25–26', 'Hebrews 12:22–24', 'Revelation 21:1–4', 'Revelation 21:10–27'],
    personOrRealityForeshadowed: 'The Heavenly Jerusalem, the Church of the firstborn enrolled in heaven, and the eternal New Jerusalem.',
    theologicalExplanation: 'Hebrews 12:22 proclaims to believers: "You have not come to a mountain that can be touched and that is burning with fire [Mount Sinai]... But you have come to Mount Zion, to the city of the living God, the heavenly Jerusalem." Earthly Zion was merely the shadowy terrestrial seat of God’s kingdom; the true Zion is the redeemed spiritual community gathered around the throne of the Lamb, descending in Revelation 21 as the bride adorned for her husband.',
    crossReferences: ['Isaiah 60:14', 'Revelation 14:1'],
    scholarlyInterpretations: 'Geerhardus Vos’ seminal work The Teaching of the Epistle to the Hebrews demonstrates how the spatial geography of the Old Testament is transposed into the spiritual-eschatological reality of the New Covenant.',
    alternativePositions: 'Zionist and certain dispensational readings focus on earthly geopolitical restoration in Palestine. New Testament apostolic writing unequivocally points toward the heavenly, eternal Jerusalem that is "free and the mother of us all" (Galatians 4:26).',
    interpretiveClassification: 'Explicit Biblical Typology',
    sourceAttribution: 'Geerhardus Vos, The Teaching of the Epistle to the Hebrews; Richard Bauckham, The Theology of the Book of Revelation.',
  },

  // ==========================================================================
  // 7. CEREMONIES AND FEASTS
  // ==========================================================================
  {
    id: 'ts-feast-firstfruits',
    name: 'The Feast of Firstfruits (Bikkurim)',
    category: 'Ceremonies and Feasts',
    biblicalAccount: 'On the day after the Sabbath following Passover, the priest waved a sheaf of the first grain of the spring barley harvest before Yahweh with a burnt offering and grain offering. No one was permitted to eat the new harvest until the firstfruits had been consecrated to God (Leviticus 23:9–14).',
    historicalBackground: 'The spring agricultural harvest in early Nisan, celebrating the beginning of the crop.',
    otReferences: ['Leviticus 23:9–14', 'Numbers 28:26', 'Proverbs 3:9–10'],
    ntFulfilmentOrConnection: ['1 Corinthians 15:20–23', 'Romans 8:23', 'James 1:18'],
    personOrRealityForeshadowed: 'The bodily resurrection of Jesus Christ on the third day as the guarantee of the coming resurrection harvest of all believers.',
    theologicalExplanation: 'Paul uses this precise biblical festival title in 1 Corinthians 15:20: "Christ has indeed been raised from the dead, the firstfruits [aparchē] of those who have fallen asleep." The day after the Sabbath following Passover was the first day of the week—the exact day Jesus rose from the dead! The presentation of the firstfruits sheaf was not merely a portion; it represented the sanctification and divine pledge that the rest of the harvest was guaranteed to follow. Christ’s resurrection guarantees the resurrection of all who are in Him.',
    crossReferences: ['Romans 11:16', '1 Thessalonians 4:14–17'],
    scholarlyInterpretations: 'Scholars marvel at the chronological precision: Jesus died as the Passover Lamb on the 14th of Nisan, rested in the tomb on the Sabbath (15th), and rose as the Firstfruits on the 16th of Nisan, exactly when the priests were waving the firstfruits sheaf in the Temple.',
    alternativePositions: 'Ancient Sadducees and Pharisees debated the exact calendar reckoning of "the day after the Sabbath." In all interpretations, the New Testament affirms that Christ’s resurrection Sunday fulfills the Firstfruits.',
    interpretiveClassification: 'Explicit Biblical Typology',
    sourceAttribution: 'Anthony C. Thiselton, The First Epistle to the Corinthians (NIGTC); Gordon D. Fee, 1 Corinthians.',
  },
  {
    id: 'ts-feast-pentecost',
    name: 'The Feast of Weeks / Pentecost (Shavuot)',
    category: 'Ceremonies and Feasts',
    biblicalAccount: 'Counted fifty days from the Feast of Firstfruits (seven full weeks). Two loaves of bread baked with leaven were waved before the Lord as a new grain offering from the wheat harvest, accompanied by peace offerings (Leviticus 23:15–22; Deuteronomy 16:9–12).',
    historicalBackground: 'The late spring wheat harvest; also celebrated in Second Temple Judaism as the anniversary of the giving of the Torah at Mount Sinai.',
    otReferences: ['Exodus 34:22', 'Leviticus 23:15–22', 'Numbers 28:26–31', 'Deuteronomy 16:9–12'],
    ntFulfilmentOrConnection: ['Acts 2:1–41', 'Acts 20:16', '1 Corinthians 16:8'],
    personOrRealityForeshadowed: 'The outpouring of the Holy Spirit, the writing of the Law on human hearts, and the gathering of the harvest of Jews and Gentiles into the one body of Christ.',
    theologicalExplanation: 'In Acts 2:1, Luke records: "When the day of Pentecost came, they were all together in one place." Suddenly the sound of a violent wind filled the house and tongues of fire rested on each of them. At Mount Sinai, when the Law was given, 3,000 souls died for idolatry (Exodus 32:28); at Pentecost, when the Spirit was poured out, 3,000 souls were saved and baptized (Acts 2:41). The two wave loaves baked with leaven symbolize Jews and Gentiles—formerly unholy—now sanctified and presented together as one harvest to God.',
    crossReferences: ['Jeremiah 31:31–34', 'Ezekiel 36:26–27', 'Joel 2:28–32'],
    scholarlyInterpretations: 'F.F. Bruce and Craig Keener show how the Jewish tradition linking Pentecost with the Sinai covenant provides the profound theological backdrop for Luke’s account of the New Covenant Spirit-inauguration.',
    alternativePositions: 'Some view the leaven in the two loaves as a sign of lingering sin in the church. The main consensus recognizes that unlike Passover bread, Pentecost bread used leaven to represent ordinary daily human life consecrated by redemption.',
    interpretiveClassification: 'Explicit Biblical Typology',
    sourceAttribution: 'F.F. Bruce, The Book of the Acts; Craig S. Keener, Acts: An Exegetical Commentary.',
  },
  {
    id: 'ts-feast-tabernacles',
    name: 'The Feast of Tabernacles / Booths (Sukkot)',
    category: 'Ceremonies and Feasts',
    biblicalAccount: 'Celebrated for seven days in the seventh month (Tishri), culminating on the eighth day. The people built and lived in temporary booths made of palm branches and leafy trees, commemorating how God made Israel dwell in booths when He brought them out of Egypt, celebrating the final harvest of grapes and olives (Leviticus 23:33–43).',
    historicalBackground: 'The great autumn harvest festival, often called simply "The Feast" (Heorte).',
    otReferences: ['Leviticus 23:33–43', 'Numbers 29:12–38', 'Deuteronomy 16:13–15', 'Nehemiah 8:13–18', 'Zechariah 14:16–19'],
    ntFulfilmentOrConnection: ['John 7:2', 'John 7:37–39', 'John 1:14', 'Revelation 7:9–10', 'Revelation 21:3'],
    personOrRealityForeshadowed: 'God dwelling with humanity in the Incarnation, the river of the Holy Spirit poured out, and the final eschatological ingathering of the nations in the New Jerusalem.',
    theologicalExplanation: 'During the water-libation ceremony on the last great day of the Feast of Tabernacles, golden pitchers of water from the Pool of Siloam were poured out at the Temple altar amidst trumpets and chanting of Isaiah 12:3. At that very moment, Jesus stood and cried out with a loud voice: "Let anyone who is thirsty come to me and drink. Whoever believes in me, as Scripture has said, rivers of living water will flow from within them" (John 7:37–38). In Revelation 7:9, the redeemed multitude stands before the Lamb waving palm branches, celebrating the eternal Sukkot.',
    crossReferences: ['Isaiah 12:3', 'Ezekiel 47:1–12'],
    scholarlyInterpretations: 'D.A. Carson and Raymond Brown explain that Jesus deliberately contextualized His claims around the two central rituals of Sukkot: the water libation (John 7:37–38) and the giant Temple candelabra illumination (John 8:12: "I am the light of the world").',
    alternativePositions: 'Millennial and historicist views debate whether Sukkot will be physically observed during a future thousand-year earthly reign (based on Zechariah 14). All agree its ultimate spiritual fulfillment is Revelation 21:3: "God’s dwelling place is now among the people, and he will dwell with them."',
    interpretiveClassification: 'Explicit Biblical Typology',
    sourceAttribution: 'D.A. Carson, The Gospel According to John; Richard Bauckham, The Climax of Prophecy.',
  },
];

export function searchTypesAndShadows(
  query: string,
  category?: TypologyCategory
): BiblicalTypeAndShadowEntry[] {
  let list = TYPES_AND_SHADOWS_LIBRARY;
  if (category) {
    list = list.filter((item) => item.category === category);
  }

  if (!query || !query.trim()) return list;

  // Clean query: strip search intent prefixes like "meaning of", "type of"
  let q = query.trim().toLowerCase();
  q = q
    .replace(
      /^(meaning\s+of\s+|type\s+of\s+|types\s+and\s+shadows?\s+of\s+|what\s+is\s+|who\s+is\s+)/i,
      ''
    )
    .trim();
  if (!q) q = query.trim().toLowerCase();

  // 1. Exact match on title/name
  const exact = list.filter((item) => item.name.toLowerCase() === q);

  // 2. Strong match on name, foreshadowed reality, or category
  const strong = list.filter((item) => {
    if (exact.some((e) => e.id === item.id)) return false;
    return (
      item.name.toLowerCase().includes(q) ||
      item.personOrRealityForeshadowed.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  // 3. Partial match on narrative description (never purely matching reference citations for unrelated name queries)
  const partial = list.filter((item) => {
    if (exact.some((e) => e.id === item.id) || strong.some((s) => s.id === item.id)) return false;
    return (
      item.theologicalExplanation.toLowerCase().includes(q) ||
      item.biblicalAccount.toLowerCase().includes(q)
    );
  });

  return [...exact, ...strong, ...partial];
}

export function getTypeAndShadowById(
  id: string
): BiblicalTypeAndShadowEntry | undefined {
  return TYPES_AND_SHADOWS_LIBRARY.find((item) => item.id === id);
}

