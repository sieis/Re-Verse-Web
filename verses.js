/* ============================================================
   Progress & Perfection — Scripture Memory
   Shared verse data. One array, one source of truth — the
   library page reads it for the list, the study page reads it
   for passage text and prev/next navigation.

   `words` is the tokenized ESV text: each entry is exactly
   what appears between spaces in the verse, punctuation
   included. The study page splits each token into
   lead / core / trail so punctuation stays visible while the
   letters blank out.
   ============================================================ */

const VERSES = [
  {
    slug: "psalm-119-11", date: "Jan 05", section: "Foundation",
    ref: "Psalm 119:11", anchor: "Why", translation: "ESV",
    words: ["I","have","stored","up","your","word","in","my","heart,","that","I","might","not","sin","against","you."]
  },
  {
    slug: "psalm-19-14", date: "Jan 12", section: "Foundation",
    ref: "Psalm 19:14", anchor: "How", translation: "ESV",
    words: ["Let","the","words","of","my","mouth","and","the","meditation","of","my","heart","be","acceptable","in","your","sight,","O","LORD,","my","rock","and","my","redeemer."]
  },
  {
    slug: "colossians-3-12-14", date: "Jan 19", section: "Foundation",
    ref: "Colossians 3:12-14", anchor: "Armor", translation: "ESV",
    words: ["Put","on","then,","as","God's","chosen","ones,","holy","and","beloved,","compassionate","hearts,","kindness,","humility,","meekness,","and","patience,","bearing","with","one","another","and,","if","one","has","a","complaint","against","another,","forgiving","each","other;","as","the","Lord","has","forgiven","you,","so","you","also","must","forgive.","And","above","all","these","put","on","love,","which","binds","everything","together","in","perfect","harmony."]
  },
  {
    slug: "2-corinthians-5-17", date: "Jan 26", section: "Foundation",
    ref: "2 Corinthians 5:17", anchor: "Assurance", translation: "ESV",
    words: ["Therefore,","if","anyone","is","in","Christ,","he","is","a","new","creation.","The","old","has","passed","away;","behold,","the","new","has","come."]
  },
  {
    slug: "1-john-4-4", date: "Feb 02", section: "Foundation",
    ref: "1 John 4:4", anchor: "Resilience", translation: "ESV",
    words: ["Little","children,","you","are","from","God","and","have","overcome","them,","for","he","who","is","in","you","is","greater","than","he","who","is","in","the","world."]
  },
  {
    slug: "psalm-27-1", date: "Feb 09", section: "Foundation",
    ref: "Psalm 27:1", anchor: "Dauntless", translation: "ESV",
    words: ["The","LORD","is","my","light","and","my","salvation;","whom","shall","I","fear?","The","LORD","is","the","stronghold","of","my","life;","of","whom","shall","I","be","afraid?"]
  },
  {
    slug: "isaiah-41-10", date: "Feb 16", section: "Foundation",
    ref: "Isaiah 41:10", anchor: "Confidence", translation: "ESV",
    words: ["Fear","not,","for","I","am","with","you;","be","not","dismayed,","for","I","am","your","God;","I","will","strengthen","you,","I","will","help","you,","I","will","uphold","you","with","my","righteous","right","hand."]
  },
  {
    slug: "jeremiah-29-11", date: "Feb 23", section: "Foundation",
    ref: "Jeremiah 29:11", anchor: "Hope", translation: "ESV",
    words: ["For","I","know","the","plans","I","have","for","you,","declares","the","LORD,","plans","for","welfare","and","not","for","evil,","to","give","you","a","future","and","a","hope."]
  },
  {
    slug: "romans-6-6", date: "Mar 02", section: "Freedom",
    ref: "Romans 6:6", anchor: "Release", translation: "ESV",
    words: ["We","know","that","our","old","self","was","crucified","with","him","in","order","that","the","body","of","sin","might","be","brought","to","nothing,","so","that","we","would","no","longer","be","enslaved","to","sin."]
  },
  {
    slug: "romans-8-1", date: "Mar 09", section: "Freedom",
    ref: "Romans 8:1", anchor: "Relief", translation: "ESV",
    words: ["There","is","therefore","now","no","condemnation","for","those","who","are","in","Christ","Jesus."]
  },
  {
    slug: "galatians-5-1", date: "Mar 16", section: "Freedom",
    ref: "Galatians 5:1", anchor: "Parole", translation: "ESV",
    words: ["For","freedom","Christ","has","set","us","free;","stand","firm","therefore,","and","do","not","submit","again","to","a","yoke","of","slavery."]
  },
  {
    slug: "1-peter-2-1-3", date: "Mar 23", section: "Freedom",
    ref: "1 Peter 2:1-3", anchor: "Renew", translation: "ESV",
    words: ["So","put","away","all","malice","and","all","deceit","and","hypocrisy","and","envy","and","all","slander.","Like","newborn","infants,","long","for","the","pure","spiritual","milk,","that","by","it","you","may","grow","up","into","salvation—","if","indeed","you","have","tasted","that","the","Lord","is","good."]
  },
  {
    slug: "john-8-36", date: "Mar 30", section: "Freedom",
    ref: "John 8:36", anchor: "Finality", translation: "ESV",
    words: ["So","if","the","Son","sets","you","free,","you","will","be","free","indeed."]
  },
  {
    slug: "colossians-1-13-14", date: "Apr 06", section: "Freedom",
    ref: "Colossians 1:13-14", anchor: "Deliverance", translation: "ESV",
    words: ["He","has","delivered","us","from","the","domain","of","darkness","and","transferred","us","to","the","kingdom","of","his","beloved","Son,","in","whom","we","have","redemption,","the","forgiveness","of","sins."]
  },
  {
    slug: "psalm-37-30-31", date: "Apr 13", section: "Freedom",
    ref: "Psalm 37:30-31", anchor: "Utterance", translation: "ESV",
    words: ["The","mouth","of","the","righteous","utters","wisdom,","and","his","tongue","speaks","justice.","The","law","of","his","God","is","in","his","heart;","his","steps","do","not","slip."]
  },
  {
    slug: "2-timothy-1-6-7", date: "Apr 20", section: "Freedom",
    ref: "2 Timothy 1:6-7", anchor: "Spirit", translation: "ESV",
    words: ["For","this","reason","I","remind","you","to","fan","into","flame","the","gift","of","God,","which","is","in","you","through","the","laying","on","of","my","hands,","for","God","gave","us","a","spirit","not","of","fear","but","of","power","and","love","and","self-control."]
  },
  {
    slug: "psalm-23-4", date: "Apr 27", section: "God's Presence",
    ref: "Psalm 23:4", anchor: "Beam", translation: "ESV",
    words: ["Even","though","I","walk","through","the","valley","of","the","shadow","of","death,","I","will","fear","no","evil,","for","you","are","with","me;","your","rod","and","your","staff,","they","comfort","me."]
  },
  {
    slug: "john-8-31-32", date: "May 04", section: "God's Presence",
    ref: "John 8:31-32", anchor: "Truth", translation: "ESV",
    words: ["So","Jesus","said","to","the","Jews","who","had","believed","him,","“If","you","abide","in","my","word,","you","are","truly","my","disciples,","and","you","will","know","the","truth,","and","the","truth","will","set","you","free.”"]
  },
  {
    slug: "philippians-1-6", date: "May 11", section: "God's Presence",
    ref: "Philippians 1:6", anchor: "Completion", translation: "ESV",
    words: ["And","I","am","sure","of","this,","that","he","who","began","a","good","work","in","you","will","bring","it","to","completion","at","the","day","of","Jesus","Christ."]
  },
  {
    slug: "1-thessalonians-5-16-18", date: "May 18", section: "God's Presence",
    ref: "1 Thessalonians 5:16-18", anchor: "Will", translation: "ESV",
    words: ["Rejoice","always,","pray","without","ceasing,","give","thanks","in","all","circumstances;","for","this","is","the","will","of","God","in","Christ","Jesus","for","you."]
  },
  {
    slug: "1-corinthians-9-24-25", date: "May 25", section: "God's Presence",
    ref: "1 Corinthians 9:24-25", anchor: "Prize", translation: "ESV",
    words: ["Do","you","not","know","that","in","a","race","all","the","runners","run,","but","only","one","receives","the","prize?","So","run","that","you","may","obtain","it.","Every","athlete","exercises","self-control","in","all","things.","They","do","it","to","receive","a","perishable","wreath,","but","we","an","imperishable."]
  },
  {
    slug: "1-corinthians-9-26-27", date: "Jun 01", section: "God's Presence",
    ref: "1 Corinthians 9:26-27", anchor: "Discipline", translation: "ESV",
    words: ["So","I","do","not","run","aimlessly;","I","do","not","box","as","one","beating","the","air.","But","I","discipline","my","body","and","keep","it","under","control,","lest","after","preaching","to","others","I","myself","should","be","disqualified."]
  },
  {
    slug: "isaiah-43-2", date: "Jun 08", section: "God's Presence",
    ref: "Isaiah 43:2", anchor: "Reliance", translation: "ESV",
    words: ["When","you","pass","through","the","waters,","I","will","be","with","you;","and","through","the","rivers,","they","shall","not","overwhelm","you;","when","you","walk","through","fire","you","shall","not","be","burned,","and","the","flame","shall","not","consume","you."]
  },
  {
    slug: "hebrews-13-5-6", date: "Jun 15", section: "God's Presence",
    ref: "Hebrews 13:5-6", anchor: "Contentment", translation: "ESV",
    words: ["Keep","your","life","free","from","love","of","money,","and","be","content","with","what","you","have,","for","he","has","said,","“I","will","never","leave","you","nor","forsake","you.”","So","we","can","confidently","say,","“The","Lord","is","my","helper;","I","will","not","fear;","what","can","man","do","to","me?”"]
  },
  {
    slug: "2-corinthians-12-9", date: "Jun 22", section: "Strength in Weakness",
    ref: "2 Corinthians 12:9", anchor: "Perfection", translation: "ESV",
    words: ["But","he","said","to","me,","“My","grace","is","sufficient","for","you,","for","my","power","is","made","perfect","in","weakness.”","Therefore","I","will","boast","all","the","more","gladly","of","my","weaknesses,","so","that","the","power","of","Christ","may","rest","upon","me."]
  },
  {
    slug: "philippians-4-8-9", date: "Jun 29", section: "Strength in Weakness",
    ref: "Philippians 4:8-9", anchor: "Excellence", translation: "ESV",
    words: ["Finally,","brothers,","whatever","is","true,","whatever","is","honorable,","whatever","is","just,","whatever","is","pure,","whatever","is","lovely,","whatever","is","commendable,","if","there","is","any","excellence,","if","there","is","anything","worthy","of","praise,","think","about","these","things.","What","you","have","learned","and","received","and","heard","and","seen","in","me—","practice","these","things,","and","the","God","of","peace","will","be","with","you."]
  },
  {
    slug: "james-1-22-24", date: "Jul 06", section: "Strength in Weakness",
    ref: "James 1:22-24", anchor: "Doers", translation: "ESV",
    words: ["But","be","doers","of","the","word,","and","not","hearers","only,","deceiving","yourselves.","For","if","anyone","is","a","hearer","of","the","word","and","not","a","doer,","he","is","like","a","man","who","looks","intently","at","his","natural","face","in","a","mirror.","For","he","looks","at","himself","and","goes","away","and","at","once","forgets","what","he","was","like."]
  },
  {
    slug: "james-1-25", date: "Jul 13", section: "Strength in Weakness",
    ref: "James 1:25", anchor: "Action", translation: "ESV",
    words: ["But","the","one","who","looks","into","the","perfect","law,","the","law","of","liberty,","and","perseveres,","being","no","hearer","who","forgets","but","a","doer","who","acts,","he","will","be","blessed","in","his","doing."]
  },
  {
    slug: "1-corinthians-15-56-57", date: "Jul 20", section: "Strength in Weakness",
    ref: "1 Corinthians 15:56-57", anchor: "Sting", translation: "ESV",
    words: ["The","sting","of","death","is","sin,","and","the","power","of","sin","is","the","law.","But","thanks","be","to","God,","who","gives","us","the","victory","through","our","Lord","Jesus","Christ."]
  },
  {
    slug: "hebrews-4-12-13", date: "Jul 27", section: "Strength in Weakness",
    ref: "Hebrews 4:12-13", anchor: "Activate", translation: "ESV",
    words: ["For","the","word","of","God","is","living","and","active,","sharper","than","any","two-edged","sword,","piercing","to","the","division","of","soul","and","of","spirit,","of","joints","and","of","marrow,","and","discerning","the","thoughts","and","intentions","of","the","heart.","And","no","creature","is","hidden","from","his","sight,","but","all","are","naked","and","exposed","to","the","eyes","of","him","to","whom","we","must","give","account."]
  }
];
