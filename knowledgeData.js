/**
 * EduBridge AI - Comprehensive Curricular Knowledge Dependency Graph
 * Maps target grade concepts to foundational prerequisites across earlier grades.
 * Includes local rural/everyday analogies in English, Telugu, and Hindi.
 */

const KNOWLEDGE_BASE = {
  topics: {
    "math_fractions": {
      id: "math_fractions",
      subject: "Mathematics",
      grade: "Class 6",
      category: "math",
      icon: "➗",
      title: {
        en: "Addition of Unlike Fractions",
        te: "భిన్నాల సంకలనం (వేర్వేరు హారాలు ఉన్నవి)",
        hi: "असमान हर वाले भिन्नों का जोड़"
      },
      description: {
        en: "Learn how to add fractions with different denominators (like 1/3 + 1/4) by discovering why common denominators are required.",
        te: "వేర్వేరు హారాలు కలిగిన భిన్నాలను (ఉదాహరణకు 1/3 + 1/4) సమాన హారాలుగా మార్చి ఎలా కూడాలో నేర్చుకోండి.",
        hi: "अलग-अलग हर वाले भिन्नों को (जैसे 1/3 + 1/4) समान हर बनाकर जोड़ने की विधि सीखें।"
      },
      target_concept: "unlike_fractions_addition",
      nodes: [
        {
          id: "equal_parts",
          grade: "Class 4",
          subject: "Mathematics",
          title: {
            en: "Equal Parts & Unit Wholes",
            te: "సమాన భాగాలు మరియు పూర్ణ సంఖ్య భావన",
            hi: "समान हिस्से और इकाई की अवधारणा"
          },
          is_root: true,
          prerequisites: [],
          level: 1,
          description: {
            en: "A fraction only makes sense when an object or quantity is divided into strictly EQUAL pieces.",
            te: "ఒక వస్తువును సరిగ్గా సమాన భాగాలుగా విభజించినప్పుడే భిన్నం సాధ్యమవుతుంది.",
            hi: "भिन्न केवल तभी बनता है जब किसी वस्तु को बिल्कुल बराबर टुकड़ों में बांटा जाए।"
          },
          local_example: {
            en: "Jowar Roti Sharing: If a mother divides 1 Jowar Roti among 4 children, each child gets 1/4. But if one piece is large and three are small, you cannot call it 1/4 because the parts are not equal!",
            te: "జొన్న రొట్టె పంపకం: ఒక తల్లి ఒక రొట్టెను 4 పిల్లలకు సమానంగా పంచితే ప్రతి ఒక్కరికీ 1/4 వస్తుంది. ఒక ముక్క పెద్దదిగా, మిగతావి చిన్నవిగా ఉంటే అది 1/4 కాజాలదు!",
            hi: "ज्वार की रोटी: अगर मां 1 रोटी 4 बच्चों में बराबर बांटे, तो हर बच्चे को 1/4 रोटी मिलती है। यदि टुकड़े छोटे-बड़े हों, तो उसे 1/4 नहीं कह सकते!"
          },
          practice_questions: [
            {
              id: "p_eq_1",
              question: {
                en: "Farmer Ramesh divides a rectangular field into 4 sections, but 2 sections are twice as big as the other two. Can each section be called 1/4 of the field?",
                te: "రమేష్ అనే రైతు తన పొలాన్ని 4 భాగాలుగా విభజించాడు, కానీ అందులో 2 భాగాలు మిగిలిన 2 భాగాల కంటే రెండింతలు పెద్దవి. ప్రతి భాగాన్ని 1/4 అనవచ్చా?",
                hi: "रमेश किसान अपने खेत को 4 भागों में बांटता है, पर 2 भाग बाकी दोनों से दुगुने बड़े हैं। क्या हर भाग को 1/4 कह सकते हैं?"
              },
              options: [
                { id: "a", text: { en: "Yes, because there are 4 pieces", te: "అవును, 4 ముక్కలు ఉన్నాయి కాబట్టి", hi: "हाँ, क्योंकि कुल 4 हिस्से हैं" }, is_correct: false },
                { id: "b", text: { en: "No, fractions strictly require pieces of EQUAL size", te: "కాదు, భిన్నాలు ఎల్లప్పుడూ సమాన పరిమాణాన్ని కోరుకుంటాయి", hi: "नहीं, भिन्नों के लिए सभी हिस्से बराबर आकार के होने चाहिए" }, is_correct: true },
                { id: "c", text: { en: "Only if seeds are planted", te: "విత్తనాలు నాటితేనే", hi: "केवल बीज बोने पर" }, is_correct: false }
              ],
              hints: [
                { en: "Think about whether a small piece is fair compared to a big piece.", te: "చిన్న ముక్క మరియు పెద్ద ముక్క సమాన న్యాయమైనవా అని ఆలోచించండి.", hi: "सोचिए क्या छोटा और बड़ा हिस्सा न्यायसंगत है?" },
                { en: "Fractions represent exact equality in division.", te: "భిన్నం అంటే ఖచ్చితమైన సమాన విభజన.", hi: "भिन्न का मतलब ही बिल्कुल बराबर बंटवारा है।" }
              ],
              explanation: {
                en: "Fractions require equal parts. If the sections are uneven, each section represents a different proportion, not 1/4.",
                te: "భిన్నాలలో భాగాలు సమానంగా ఉండాలి. భాగాలు అసమానంగా ఉంటే దానిని 1/4 అనలేము.",
                hi: "भिन्नों में सभी हिस्से बराबर होने चाहिए। अगर हिस्से असमान हैं, तो उन्हें 1/4 नहीं कहा जा सकता।"
              }
            }
          ]
        },
        {
          id: "factors_multiplication",
          grade: "Class 4",
          subject: "Mathematics",
          title: {
            en: "Multiplication Tables & Multiples",
            te: "గుణకార పట్టికలు మరియు గుణిజాలు",
            hi: "पहाड़े और गुणज (Multiples)"
          },
          is_root: false,
          prerequisites: ["equal_parts"],
          level: 2,
          description: {
            en: "Multiples are numbers obtained by multiplying a number by 1, 2, 3, etc. (Multiples of 3: 3, 6, 9, 12, 15...).",
            te: "ఒక సంఖ్యను 1, 2, 3 లతో గుణించడం ద్వారా వచ్చే సంఖ్యలే గుణిజాలు (3 యొక్క గుణిజాలు: 3, 6, 9, 12, 15...).",
            hi: "किसी संख्या को 1, 2, 3 से गुणा करने पर मिलने वाली संख्याएं गुणज कहलाती हैं।"
          },
          local_example: {
            en: "Chilli Crop Planting: A farmer plants 3 chilli saplings per pit. As he plants pit by pit: 3, 6, 9, 12, 15 saplings. These are multiples of 3!",
            te: "మిరప నారు నాటడం: ఒక రైతు ఒక గుంతకు 3 చొప్పున మిరప నారు నాటుతాడు. గుంతలు పెరిగేకొద్దీ: 3, 6, 9, 12, 15 మొక్కలు. ఇవే 3 యొక్క గుణిజాలు!",
            hi: "मिर्च की रोपाई: एक क्यारी में 3 पौधे लगते हैं। कतार दर कतार: 3, 6, 9, 12, 15 पौधे। ये सब 3 के गुणज हैं!"
          },
          practice_questions: [
            {
              id: "p_fac_1",
              question: {
                en: "Which number is a common multiple of both 3 and 4?",
                te: "3 మరియు 4 రెండింటికీ ఉమ్మడి గుణిజం ఏది?",
                hi: "3 और 4 दोनों का उभयनिष्ठ (कॉमन) गुणज कौन सा है?"
              },
              options: [
                { id: "a", text: { en: "7", te: "7", hi: "7" }, is_correct: false },
                { id: "b", text: { en: "12", te: "12", hi: "12" }, is_correct: true },
                { id: "c", text: { en: "9", te: "9", hi: "9" }, is_correct: false },
                { id: "d", text: { en: "16", te: "16", hi: "16" }, is_correct: false }
              ],
              hints: [
                { en: "List the multiples of 3: 3, 6, 9, 12, 15...", te: "3 యొక్క గుణిజాలు రాయండి: 3, 6, 9, 12...", hi: "3 के गुणज लिखें: 3, 6, 9, 12..." },
                { en: "List the multiples of 4: 4, 8, 12, 16...", te: "4 యొక్క గుణిజాలు రాయండి: 4, 8, 12...", hi: "4 के गुणज लिखें: 4, 8, 12..." }
              ],
              explanation: {
                en: "12 appears in both the 3-times table (3 x 4 = 12) and 4-times table (4 x 3 = 12).",
                te: "12 అనేది 3 ఎక్కంలో (3 x 4 = 12) మరియు 4 ఎక్కంలో (4 x 3 = 12) రెండింటిలోనూ వస్తుంది.",
                hi: "12 संख्या 3 के पहाड़े में भी आती है और 4 के पहाड़े में भी।"
              }
            }
          ]
        },
        {
          id: "lcm_concept",
          grade: "Class 5",
          subject: "Mathematics",
          title: {
            en: "Least Common Multiple (LCM)",
            te: "కనిష్ట సామాన్య గుణిజం (క.సా.గు / LCM)",
            hi: "लघुत्तम समापवर्त्य (ल.स.प. / LCM)"
          },
          is_root: false,
          prerequisites: ["factors_multiplication"],
          level: 3,
          description: {
            en: "The smallest positive number that is divisible by all numbers in the set.",
            te: "ఇచ్చిన సంఖ్యలు అన్నింటిచే నిశ్శేషంగా భాగించబడే అతి చిన్న ధన సంఖ్య.",
            hi: "दी गई संख्याओं से पूरी तरह विभाजित होने वाली सबसे छोटी संख्या।"
          },
          local_example: {
            en: "Village Borewell Motors: Motor A runs every 4 hours. Motor B runs every 6 hours. They both start at the same time at hour 12! 12 is the LCM of 4 and 6.",
            te: "పొలం మోటారు పంపులు: మోటారు A ప్రతి 4 గంటలకు, మోటారు B ప్రతి 6 గంటలకు తిరుగుతాయి. రెండు మోటార్లు 12 గంటల వద్ద ఒకేసారి నడుస్తాయి! 4, 6 ల క.సా.గు 12.",
            hi: "ट्यूबवेल की मोटर: मोटर 'अ' हर 4 घंटे बाद और मोटर 'ब' हर 6 घंटे बाद चलती है। दोनों 12वें घंटे पर एक साथ चलेंगी! 4 और 6 का LCM 12 है।"
          },
          practice_questions: [
            {
              id: "p_lcm_1",
              question: {
                en: "What is the LCM of 2 and 5?",
                te: "2 మరియు 5 సంఖ్యల క.సా.గు (LCM) ఎంత?",
                hi: "2 और 5 का लघुत्तम समापवर्त्य (LCM) क्या है?"
              },
              options: [
                { id: "a", text: { en: "7", te: "7", hi: "7" }, is_correct: false },
                { id: "b", text: { en: "10", te: "10", hi: "10" }, is_correct: true },
                { id: "c", text: { en: "15", te: "15", hi: "15" }, is_correct: false },
                { id: "d", text: { en: "1", te: "1", hi: "1" }, is_correct: false }
              ],
              hints: [
                { en: "Multiples of 2 are 2, 4, 6, 8, 10...", te: "2 యొక్క గుణిజాలు 2, 4, 6, 8, 10...", hi: "2 के गुणज 2, 4, 6, 8, 10..." },
                { en: "Multiples of 5 are 5, 10, 15...", te: "5 యొక్క గుణిజాలు 5, 10, 15...", hi: "5 के गुणज 5, 10, 15..." }
              ],
              explanation: {
                en: "10 is the smallest multiple shared by 2 and 5.",
                te: "2 మరియు 5 లలో ఉమ్మడిగా వచ్చే అతి చిన్న గుణిజం 10.",
                hi: "10 वह सबसे छोटी संख्या है जो 2 और 5 दोनों से कटती है।"
              }
            }
          ]
        },
        {
          id: "equivalent_fractions",
          grade: "Class 5",
          subject: "Mathematics",
          title: {
            en: "Equivalent Fractions",
            te: "సమాన భిన్నాలు",
            hi: "समतुल्य भिन्न"
          },
          is_root: false,
          prerequisites: ["equal_parts", "factors_multiplication"],
          level: 3,
          description: {
            en: "Fractions that look different but have the exact same value (e.g. 1/2 = 2/4 = 3/6 = 6/12).",
            te: "రూపంలో వేరుగా కనిపించినా సమాన విలువను కలిగి ఉండే భిన్నాలు (ఉదా. 1/2 = 2/4 = 3/6).",
            hi: "भिन्न जो देखने में अलग हों पर जिनका मान बिल्कुल बराबर हो (जैसे 1/2 = 2/4 = 3/6)।"
          },
          local_example: {
            en: "Sugarcane Length: Drinking juice from 1/2 of a sugarcane is the exact same amount as drinking juice from 2 slices out of 4 slices (2/4) of that same cane!",
            te: "చెరకు గడ రసం: సగం చెరకు గడ (1/2) రసం తాగినా, లేదా అదే గడను 4 ముక్కలు చేసి 2 ముక్కల (2/4) రసం తాగినా రెండూ సరిగ్గా సమానం!",
            hi: "गन्ने का रस: आधे गन्ने (1/2) का रस निकालें या उसी गन्ने के 4 टुकड़ों में से 2 टुकड़ों (2/4) का, दोनों की मिठास और मात्रा बराबर होगी!"
          },
          practice_questions: [
            {
              id: "p_eqf_1",
              question: {
                en: "Convert 1/3 into an equivalent fraction with a denominator of 12:",
                te: "1/3 భిన్నాన్ని 12 హారంగా కలిగిన సమాన భిన్నంగా మార్చండి:",
                hi: "1/3 को 12 हर वाले समतुल्य भिन्न में बदलिए:"
              },
              options: [
                { id: "a", text: { en: "1/12", te: "1/12", hi: "1/12" }, is_correct: false },
                { id: "b", text: { en: "4/12", te: "4/12", hi: "4/12" }, is_correct: true },
                { id: "c", text: { en: "3/12", te: "3/12", hi: "3/12" }, is_correct: false },
                { id: "d", text: { en: "6/12", te: "6/12", hi: "6/12" }, is_correct: false }
              ],
              hints: [
                { en: "Multiply both the numerator (top) and denominator (bottom) by 4.", te: "లవం మరియు హారం రెండింటినీ 4 తో గుణించండి.", hi: "अंश और हर दोनों को 4 से गुणा करें।" }
              ],
              explanation: {
                en: "(1 x 4) / (3 x 4) = 4/12. Both represent the exact same proportion.",
                te: "(1 x 4) / (3 x 4) = 4/12. రెండూ ఒకే పరిమాణాన్ని సూచిస్తాయి.",
                hi: "(1 x 4) / (3 x 4) = 4/12. दोनों का मान बिल्कुल एक जैसा है।"
              }
            }
          ]
        },
        {
          id: "unlike_fractions_addition",
          grade: "Class 6",
          subject: "Mathematics",
          title: {
            en: "Adding Unlike Denominators (Target)",
            te: "వేర్వేరు హారాల భిన్నాల కూడిక (ప్రధాన లక్ష్యం)",
            hi: "असमान हर वाले भिन्नों का जोड़ (मुख्य पाठ)"
          },
          is_root: false,
          prerequisites: ["lcm_concept", "equivalent_fractions"],
          level: 4,
          description: {
            en: "To add unlike fractions: 1) Find the LCM of denominators, 2) Convert both to equivalent fractions, 3) Add the numerators.",
            te: "వేర్వేరు హారాలు ఉన్న భిన్నాలను కూడడానికి: 1) హారాల క.సా.గు కనుక్కోండి, 2) సమాన భిన్నాలుగా మార్చండి, 3) లవాలను కూడండి.",
            hi: "असमान भिन्नों को जोड़ने के चरण: 1) हरों का LCM निकालें, 2) समतुल्य भिन्न बनाएं, 3) अंशों को जोड़ें।"
          },
          local_example: {
            en: "Grain Sacks at Mandi: You have 1/3 sack of wheat and 1/4 sack of wheat. You cannot say '2/7 sacks' because the measuring bowls are different sizes! Convert both to 12-liter bowls: 4/12 + 3/12 = 7/12 sack.",
            te: "ధాన్యం మార్కెట్ కొలత: మీ వద్ద 1/3 బస్తా మరియు 1/4 బస్తా గోధుమలు ఉన్నాయి. కొలిచే పాత్రలు వేరైనందున నేరుగా కలపలేము! రెండింటినీ 12వ వంతు పాత్రలుగా మారిస్తే: 4/12 + 3/12 = 7/12 బస్తా.",
            hi: "अनाज मंडी का हिसाब: 1/3 बोरी गेहूं और 1/4 बोरी गेहूं। नापने का बर्तन अलग होने से '2/7' नहीं कह सकते! दोनों को 12वें हिस्से के डिब्बे में नापें: 4/12 + 3/12 = 7/12 बोरी।"
          },
          practice_questions: [
            {
              id: "p_add_1",
              question: {
                en: "What is 1/4 + 1/2?",
                te: "1/4 + 1/2 విలువ ఎంత?",
                hi: "1/4 + 1/2 का मान क्या है?"
              },
              options: [
                { id: "a", text: { en: "2/6", te: "2/6", hi: "2/6" }, is_correct: false },
                { id: "b", text: { en: "3/4", te: "3/4", hi: "3/4" }, is_correct: true },
                { id: "c", text: { en: "2/4", te: "2/4", hi: "2/4" }, is_correct: false },
                { id: "d", text: { en: "1/6", te: "1/6", hi: "1/6" }, is_correct: false }
              ],
              hints: [
                { en: "Common denominator is 4. Convert 1/2 into fourths: 1/2 = 2/4.", te: "ఉమ్మడి హారం 4. 1/2 ని 2/4 గా మార్చండి.", hi: "समान हर 4 है। 1/2 को 2/4 बनाएं।" },
                { en: "Now add 1/4 + 2/4.", te: "ఇప్పుడు 1/4 + 2/4 కూడండి.", hi: "अब 1/4 + 2/4 को जोड़ें।" }
              ],
              explanation: {
                en: "1/4 + 2/4 = 3/4. Never add denominators together!",
                te: "1/4 + 2/4 = 3/4. హారాలను ఎప్పుడూ నేరుగా కూడకూడదు!",
                hi: "1/4 + 2/4 = 3/4. हर को कभी सीधे नहीं जोड़ा जाता!"
              }
            }
          ]
        }
      ],
      diagnostic_quiz: [
        {
          id: "q1",
          question: {
            en: "A chappati is cut into 3 pieces: one big piece and two tiny slivers. A child eats the big piece. Did they eat 1/3 of the chappati?",
            te: "ఒక చపాతీని 3 ముక్కలుగా కత్తిరించారు: ఒకటి చాలా పెద్ద ముక్క, రెండు చిన్న ముక్కలు. ఒక పిల్లవాడు పెద్ద ముక్క తిన్నాడు. అతను 1/3 చపాతీ తిన్నట్లేనా?",
            hi: "एक चपाती को 3 टुकड़ों में काटा गया: एक बहुत बड़ा टुकड़ा और दो बहुत छोटे। एक बच्चे ने बड़ा टुकड़ा खाया। क्या उसने 1/3 चपाती खाई?"
          },
          options: [
            { id: "a", text: { en: "Yes, because there were 3 pieces in total.", te: "అవును, ఎందుకంటే మొత్తం 3 ముక్కలు ఉన్నాయి.", hi: "हाँ, क्योंकि कुल 3 टुकड़े थे।" }, concept_gap: "equal_parts" },
            { id: "b", text: { en: "No, because the 3 pieces are not equal in size.", te: "కాదు, ఎందుకంటే ఆ 3 ముక్కలు సమాన పరిమాణంలో లేవు.", hi: "नहीं, क्योंकि तीनों टुकड़े बराबर आकार के नहीं हैं।" }, is_correct: true },
            { id: "c", text: { en: "Yes, any piece from 3 pieces is always 1/3.", te: "అవును, 3 ముక్కల్లో ఏ ముక్క అయినా 1/3 అవుతుంది.", hi: "हाँ, 3 में से कोई भी टुकड़ा 1/3 ही होता है।" }, concept_gap: "equal_parts" },
            { id: "d", text: { en: "Cannot be determined.", te: "చెప్పలేము.", hi: "तय नहीं किया जा सकता।" }, concept_gap: "equal_parts" }
          ],
          tests_concept: "equal_parts"
        },
        {
          id: "q2",
          question: {
            en: "Which fraction is equivalent to (exact same value as) 2/3?",
            te: "క్రింది వాటిలో 2/3 కి సమానమైన భిన్నం (సమాన విలువ గలది) ఏది?",
            hi: "निम्नलिखित में से कौन सा भिन्न 2/3 के समतुल्य (बिल्कुल बराबर मान वाला) है?"
          },
          options: [
            { id: "a", text: { en: "3/4", te: "3/4", hi: "3/4" }, concept_gap: "equivalent_fractions" },
            { id: "b", text: { en: "4/6", te: "4/6", hi: "4/6" }, is_correct: true },
            { id: "c", text: { en: "3/2", te: "3/2", hi: "3/2" }, concept_gap: "equivalent_fractions" },
            { id: "d", text: { en: "4/9", te: "4/9", hi: "4/9" }, concept_gap: "factors_multiplication" }
          ],
          tests_concept: "equivalent_fractions"
        },
        {
          id: "q3",
          question: {
            en: "What is the Least Common Multiple (LCM) of 4 and 6?",
            te: "4 మరియు 6 సంఖ్యల కనిష్ట సామాన్య గుణిజం (LCM / క.సా.గు) ఎంత?",
            hi: "4 और 6 का लघुत्तम समापवर्त्य (LCM / ल.स.प.) क्या है?"
          },
          options: [
            { id: "a", text: { en: "24", te: "24", hi: "24" }, concept_gap: "lcm_concept", misconception: "Multiplied numbers directly instead of finding smallest common multiple" },
            { id: "b", text: { en: "12", te: "12", hi: "12" }, is_correct: true },
            { id: "c", text: { en: "10", te: "10", hi: "10" }, concept_gap: "factors_multiplication", misconception: "Added numbers instead of multiplying" },
            { id: "d", text: { en: "2", te: "2", hi: "2" }, concept_gap: "lcm_concept", misconception: "Confused LCM with HCF/GCD" }
          ],
          tests_concept: "lcm_concept"
        },
        {
          id: "q4",
          question: {
            en: "Solve: 1/2 + 1/3 = ?",
            te: "సాధించండి: 1/2 + 1/3 = ఎంత?",
            hi: "हल कीजिए: 1/2 + 1/3 = ?"
          },
          options: [
            { id: "a", text: { en: "2/5", te: "2/5", hi: "2/5" }, concept_gap: "unlike_fractions_addition", root_trigger: "equal_parts", misconception: "Added numerators (1+1=2) and denominators (2+3=5) directly without common denominator" },
            { id: "b", text: { en: "5/6", te: "5/6", hi: "5/6" }, is_correct: true },
            { id: "c", text: { en: "1/5", te: "1/5", hi: "1/5" }, concept_gap: "unlike_fractions_addition" },
            { id: "d", text: { en: "2/6", te: "2/6", hi: "2/6" }, concept_gap: "equivalent_fractions" }
          ],
          tests_concept: "unlike_fractions_addition"
        }
      ]
    },

    "math_algebra": {
      id: "math_algebra",
      subject: "Mathematics",
      grade: "Class 7",
      category: "math",
      icon: "⚖️",
      title: {
        en: "Linear Equations in One Variable",
        te: "ఏకచరరాశిలో సరళ సమీకరణాలు",
        hi: "एक चर वाले रैखिक समीकरण"
      },
      description: {
        en: "Solve for missing values (like 2x + 5 = 15) using the balance scale method.",
        te: "త్రాసు బ్యాలెన్స్ సూత్రాన్ని ఉపయోగించి తెలియని విలువను (ఉదా. 2x + 5 = 15) కనుగొనండి.",
        hi: "तराजू के संतुलन नियम का उपयोग करके अज्ञात मान (जैसे 2x + 5 = 15) ज्ञात करना सीखें।"
      },
      target_concept: "linear_solve",
      nodes: [
        {
          id: "unknown_concept",
          grade: "Class 5",
          subject: "Mathematics",
          title: {
            en: "Concept of Unknowns / Mystery Sack",
            te: "తెలియని సంఖ్య / రహస్య సంచి భావన",
            hi: "अज्ञात संख्या / बंद थैले की अवधारणा"
          },
          is_root: true,
          prerequisites: [],
          level: 1,
          description: {
            en: "Understanding that a variable like 'x' is just a placeholder for a hidden number, like a sealed pot with tamarind seeds.",
            te: "'x' అనేది ఒక దాచిన సంఖ్యకు గుర్తు మాత్రమే, మూసి ఉన్న కుండలోని చింతగింజల లాంటిది.",
            hi: "'x' केवल किसी छुपे हुए मान का प्रतीक है, जैसे किसी घड़े में बंद इमली के बीज।"
          },
          local_example: {
            en: "Tamarind Seed Pot: A child has a sealed clay pot with mystery seeds ('x') plus 4 loose seeds. Total seeds are 10. The sealed pot must contain 6 seeds!",
            te: "చింతగింజల కుండ: ఒక పిల్లవాడి దగ్గర మూసి ఉన్న కుండలో కొన్ని గింజలు ('x'), మరియు విడిగా 4 గింజలు ఉన్నాయి. మొత్తం 10 గింజలు ఉంటే, కుండలో 6 గింజలు ఉన్నట్లే!",
            hi: "इमली के बीजों का घड़ा: बच्चे के पास एक बंद मटकी में कुछ बीज ('x') और 4 खुले बीज हैं। कुल 10 बीज हैं, तो मटकी में 6 बीज ही होंगे!"
          },
          practice_questions: [
            {
              id: "p_unk_1",
              question: {
                en: "If a closed box of mangoes + 3 loose mangoes = 11 mangoes, how many mangoes are inside the box?",
                te: "ఒక మూసి ఉన్న పెట్టెలోని మామిడి పండ్లు + 3 విడి పండ్లు = 11 పండ్లు అయితే, పెట్టెలో ఎన్ని మామిడి పండ్లు ఉన్నాయి?",
                hi: "यदि आम का एक बंद डिब्बा + 3 खुले आम = 11 आम हैं, तो डिब्बे में कितने आम हैं?"
              },
              options: [
                { id: "a", text: { en: "14", te: "14", hi: "14" }, is_correct: false },
                { id: "b", text: { en: "8", te: "8", hi: "8" }, is_correct: true },
                { id: "c", text: { en: "33", te: "33", hi: "33" }, is_correct: false }
              ],
              hints: [
                { en: "Take away the 3 loose mangoes from both sides.", te: "రెండు వైపుల నుండి 3 విడి పండ్లను తీసివేయండి.", hi: "दोनों तरफ से 3 खुले आम हटा दें।" }
              ],
              explanation: {
                en: "11 - 3 = 8 mangoes inside the box.",
                te: "11 - 3 = 8 పండ్లు పెట్టెలో ఉన్నాయి.",
                hi: "11 - 3 = 8 आम डिब्बे के अंदर हैं।"
              }
            }
          ]
        },
        {
          id: "scale_balance",
          grade: "Class 6",
          subject: "Mathematics",
          title: {
            en: "Scale Balancing Rule (Equality)",
            te: "త్రాసు బ్యాలెన్స్ సూత్రం (సమానత్వం)",
            hi: "तराजू का संतुलन नियम (समानता)"
          },
          is_root: false,
          prerequisites: ["unknown_concept"],
          level: 2,
          description: {
            en: "An equation is a balanced weighing scale. Whatever you do to one side, you must do to the other.",
            te: "సమీకరణం అంటే బ్యాలెన్స్ అయిన త్రాసు. ఒక వైపు ఏమి చేస్తే రెండవ వైపు కూడా ఖచ్చితంగా అదే చేయాలి.",
            hi: "समीकरण संतुलित तराजू जैसा है। एक तरफ जो करेंगे, वही दूसरी तरफ भी करना होगा।"
          },
          local_example: {
            en: "Vegetable Vendor Tarazu: Vendor balances 2 bags of potatoes + 2kg weight on left pan with 10kg iron weight on right pan. Take 2kg off both pans to find the potatoes' weight!",
            te: "కూరగాయల త్రాసు: ఎడమ పళ్ళెంలో 2 సంచుల బంగాళాదుంపలు + 2 కేజీల రాయి, కుడి పళ్ళెంలో 10 కేజీల రాయి ఉన్నాయి. దుంపల బరువు తెలియడానికి రెండు వైపుల నుండి 2 కేజీల రాయిని తీసివేయాలి!",
            hi: "सब्जी वाले का तराजू: बाईं तरफ 2 थैली आलू + 2 किलो का बांट, दाईं तरफ 10 किलो का बांट है। दोनों तरफ से 2 किलो हटाने पर संतुलन बना रहेगा!"
          },
          practice_questions: [
            {
              id: "p_sc_1",
              question: {
                en: "In the equation x + 9 = 20, what operation should you perform on both sides to find x?",
                te: "x + 9 = 20 సమీకరణంలో x విలువ కనుగొనడానికి రెండు వైపులా ఏమి చేయాలి?",
                hi: "समीकरण x + 9 = 20 में x जानने के लिए दोनों तरफ क्या करना चाहिए?"
              },
              options: [
                { id: "a", text: { en: "Add 9 to both sides", te: "రెండు వైపులా 9 కూడాలి", hi: "दोनों तरफ 9 जोड़ें" }, is_correct: false },
                { id: "b", text: { en: "Subtract 9 from both sides", te: "రెండు వైపుల నుండి 9 తీసివేయాలి", hi: "दोनों तरफ से 9 घटाएं" }, is_correct: true },
                { id: "c", text: { en: "Multiply by 9", te: "9 తో గుణించాలి", hi: "9 से गुणा करें" }, is_correct: false }
              ],
              hints: [
                { en: "Undo the addition (+9) by doing its opposite.", te: "కూడిక (+9) ని రద్దు చేయడానికి దానికి వ్యతిరేకమైన తీసివేత చేయండి.", hi: "जोड़ (+9) को हटाने के लिए उसका उल्टा यानी घटाव करें।" }
              ],
              explanation: {
                en: "x + 9 - 9 = 20 - 9, so x = 11.",
                te: "x + 9 - 9 = 20 - 9, కాబట్టి x = 11.",
                hi: "x + 9 - 9 = 20 - 9, इसलिए x = 11।"
              }
            }
          ]
        },
        {
          id: "linear_solve",
          grade: "Class 7",
          subject: "Mathematics",
          title: {
            en: "Solving Two-Step Linear Equations (Target)",
            te: "రెండు దశల సరళ సమీకరణాల సాధన (లక్ష్యం)",
            hi: "दो चरणों वाले रैखिक समीकरण हल करना (मुख्य लक्ष्य)"
          },
          is_root: false,
          prerequisites: ["scale_balance"],
          level: 3,
          description: {
            en: "Isolate x: First eliminate addition/subtraction, then eliminate multiplication/division.",
            te: "x ను ఒంటరిగా చేయడం: మొదట కూడిక/తీసివేతను తొలగించండి, ఆపై గుణకారం/భాగహారాన్ని తొలగించండి.",
            hi: "x को अकेला करना: पहले जोड़/घटाव को हटाएं, फिर गुणा/भाग को हल करें।"
          },
          local_example: {
            en: "Cotton Harvest Payment: 2 sacks of cotton + Rs 50 transport allowance = Rs 450. Step 1: Subtract Rs 50 from both sides (2 sacks = Rs 400). Step 2: Divide by 2 (1 sack = Rs 200).",
            te: "పత్తి బస్తాల ధర: 2 బస్తాల పత్తి + రూ.50 రవాణా = రూ.450. దశ 1: రెండు వైపుల నుండి రూ.50 తీసివేయండి (2 బస్తాలు = రూ.400). దశ 2: 2 తో భాగించండి (1 బస్తా = రూ.200).",
            hi: "कपास की बोरियां: 2 बोरी कपास + 50 रु भाड़ा = 450 रु। कदम 1: दोनों तरफ से 50 रु घटाएं (2 बोरी = 400 रु)। कदम 2: 2 से भाग दें (1 बोरी = 200 रु)।"
          },
          practice_questions: [
            {
              id: "p_lin_1",
              question: {
                en: "Solve for x: 3x + 4 = 19",
                te: "3x + 4 = 19 సమీకరణాన్ని సాధించండి:",
                hi: "हल कीजिए: 3x + 4 = 19"
              },
              options: [
                { id: "a", text: { en: "x = 5", te: "x = 5", hi: "x = 5" }, is_correct: true },
                { id: "b", text: { en: "x = 15", te: "x = 15", hi: "x = 15" }, is_correct: false },
                { id: "c", text: { en: "x = 23", te: "x = 23", hi: "x = 23" }, is_correct: false }
              ],
              hints: [
                { en: "Step 1: Subtract 4 from 19 (3x = 15).", te: "దశ 1: 19 నుండి 4 తీసివేయండి (3x = 15).", hi: "कदम 1: 19 में से 4 घटाएं (3x = 15)।" },
                { en: "Step 2: Divide 15 by 3.", te: "దశ 2: 15 ని 3 తో భాగించండి.", hi: "कदम 2: 15 को 3 से भाग दें।" }
              ],
              explanation: {
                en: "3x = 19 - 4 = 15. Then x = 15 / 3 = 5.",
                te: "3x = 19 - 4 = 15. అప్పుడు x = 15 / 3 = 5.",
                hi: "3x = 19 - 4 = 15. फिर x = 15 / 3 = 5।"
              }
            }
          ]
        }
      ],
      diagnostic_quiz: [
        {
          id: "q1",
          question: {
            en: "In a grocery store, a mystery tin has rice in it. If the tin + 2 kg weight balances exactly with a 5 kg weight, how much rice is in the tin?",
            te: "ఒక దుకాణంలో మూసి ఉన్న డబ్బాలో బియ్యం ఉంది. ఆ డబ్బా + 2 కేజీల రాయి, కుడివైపు 5 కేజీల రాయితో సరిగ్గా తూగితే, డబ్బాలో ఎన్ని కేజీల బియ్యం ఉంది?",
            hi: "एक दुकान में बंद डिब्बे में चावल है। यदि डिब्बा + 2 किलो का बांट, दूसरी तरफ के 5 किलो के बांट के बराबर है, तो डिब्बे में कितना चावल है?"
          },
          options: [
            { id: "a", text: { en: "7 kg", te: "7 కేజీలు", hi: "7 किलो" }, concept_gap: "scale_balance" },
            { id: "b", text: { en: "3 kg", te: "3 కేజీలు", hi: "3 किलो" }, is_correct: true },
            { id: "c", text: { en: "10 kg", te: "10 కేజీలు", hi: "10 किलो" }, concept_gap: "unknown_concept" }
          ],
          tests_concept: "scale_balance"
        },
        {
          id: "q2",
          question: {
            en: "Solve for x: 3x = 18. What is the value of x?",
            te: "3x = 18 అయితే, x విలువ ఎంత?",
            hi: "यदि 3x = 18 है, तो x का मान क्या है?"
          },
          options: [
            { id: "a", text: { en: "15", te: "15", hi: "15" }, concept_gap: "scale_balance" },
            { id: "b", text: { en: "6", te: "6", hi: "6" }, is_correct: true },
            { id: "c", text: { en: "54", te: "54", hi: "54" }, concept_gap: "unknown_concept" }
          ],
          tests_concept: "scale_balance"
        },
        {
          id: "q3",
          question: {
            en: "Solve: 2x + 7 = 19. What is x?",
            te: "సాధించండి: 2x + 7 = 19 అయితే x విలువ ఎంత?",
            hi: "हल करें: 2x + 7 = 19, x का मान क्या होगा?"
          },
          options: [
            { id: "a", text: { en: "x = 13", te: "x = 13", hi: "x = 13" }, concept_gap: "scale_balance" },
            { id: "b", text: { en: "x = 6", te: "x = 6", hi: "x = 6" }, is_correct: true },
            { id: "c", text: { en: "x = 12", te: "x = 12", hi: "x = 12" }, concept_gap: "linear_solve", misconception: "Forgot to divide by 2 after subtracting 7" }
          ],
          tests_concept: "linear_solve"
        }
      ]
    },

    "science_photosynthesis": {
      id: "science_photosynthesis",
      subject: "Science",
      grade: "Class 7",
      category: "science",
      icon: "🌱",
      title: {
        en: "Photosynthesis — Plant Food Factory",
        te: "కిరణజన్య సంయోగక్రియ — మొక్కల ఆహార తయారీ",
        hi: "प्रकाश संश्लेषण — पौधों की रसोई"
      },
      description: {
        en: "Discover how green plants convert water, sunlight, and air into glucose food and life-giving oxygen.",
        te: "ఆకుపచ్చని మొక్కలు నీరు, సూర్యరశ్మి, మరియు గాలిని ఉపయోగించి ఆహారం మరియు ఆక్సిజన్‌ను ఎలా తయారు చేస్తాయో తెలుసుకోండి.",
        hi: "जानिए कैसे हरे पौधे पानी, धूप और हवा का उपयोग करके अपना भोजन और जीवनदायिनी ऑक्सीजन बनाते हैं।"
      },
      target_concept: "photosynthesis_equation",
      nodes: [
        {
          id: "plant_parts_functions",
          grade: "Class 4",
          subject: "Science",
          title: {
            en: "Plant Parts: Roots, Leaves & Stems",
            te: "మొక్క భాగాలు: వేర్లు, ఆకులు మరియు కాండం",
            hi: "पौधे के अंग: जड़, तना और पत्तियां"
          },
          is_root: true,
          prerequisites: [],
          level: 1,
          description: {
            en: "Roots absorb water from soil; stem transports water upward; leaves act as food factories.",
            te: "వేర్లు నేల నుండి నీటిని పీల్చుకుంటాయి; కాండం దానిని పైకి చేరుస్తుంది; ఆకులు ఆహారాన్ని తయారుచేస్తాయి.",
            hi: "जड़ें मिट्टी से पानी खींचती हैं; तना पानी ऊपर पहुंचाता है; पत्तियां रसोई का काम करती हैं।"
          },
          local_example: {
            en: "Neem Tree Straw: Just like drinking sugarcane juice through a straw, a neem tree's roots suck water and minerals deep from the soil.",
            te: "వేప చెట్టు వేర్లు: గడ్డిపరకతో చెరకు రసం పీల్చుకున్నట్లే, వేప చెట్టు వేర్లు భూమి లోపలి నీటిని పైకి పీల్చుకుంటాయి.",
            hi: "नीम के पेड़ की जड़ें: जैसे स्ट्रॉ से गन्ने का रस पीते हैं, वैसे ही नीम की जड़ें मिट्टी से पानी खींचती हैं।"
          },
          practice_questions: [
            {
              id: "p_pp_1",
              question: {
                en: "Which part of the plant absorbs water and minerals from the soil?",
                te: "మొక్కలో నేల నుండి నీరు మరియు ఖనిజాలను పీల్చుకునే భాగం ఏది?",
                hi: "पौधे का कौन सा अंग मिट्टी से पानी और खनिज लवण सोखता है?"
              },
              options: [
                { id: "a", text: { en: "Roots", te: "వేర్లు", hi: "जड़ें" }, is_correct: true },
                { id: "b", text: { en: "Flowers", te: "పూలు", hi: "फूल" }, is_correct: false },
                { id: "c", text: { en: "Leaves", te: "ఆకులు", hi: "पत्तियां" }, is_correct: false }
              ],
              hints: [
                { en: "Think about which part grows underground.", te: "భూమి లోపల ఉండే భాగం గురించి ఆలోచించండి.", hi: "सोचिए कौन सा भाग जमीन के नीचे रहता है।" }
              ],
              explanation: {
                en: "Roots anchor the plant and absorb moisture from soil.",
                te: "వేర్లు మొక్కను నిలబెట్టి నేల నుండి నీటిని పీల్చుకుంటాయి.",
                hi: "जड़ें पौधे को सहारा देती हैं और पानी सोखती हैं।"
              }
            }
          ]
        },
        {
          id: "gases_air",
          grade: "Class 5",
          subject: "Science",
          title: {
            en: "Gases in Air (Oxygen vs Carbon Dioxide)",
            te: "గాలిలోని వాయువులు (ఆక్సిజన్ మరియు కార్బన్ డైయాక్సైడ్)",
            hi: "हवा में मौजूद गैसें (ऑक्सीजन और कार्बन डाइऑक्साइड)"
          },
          is_root: false,
          prerequisites: ["plant_parts_functions"],
          level: 2,
          description: {
            en: "Humans breathe in oxygen and exhale carbon dioxide. Plants absorb carbon dioxide and release oxygen during the day.",
            te: "మనుషులు ఆక్సిజన్ పీల్చుకుని కార్బన్ డైయాక్సైడ్ వదులుతారు. మొక్కలు కార్బన్ డైయాక్సైడ్ తీసుకుని ఆక్సిజన్ విడుదల చేస్తాయి.",
            hi: "इंसान ऑक्सीजन लेते हैं और CO2 छोड़ते हैं। पौधे दिन में CO2 लेते हैं और ऑक्सीजन छोड़ते हैं।"
          },
          local_example: {
            en: "Sitting under a Banyan Tree: The breeze under a big leafy tree feels so refreshing because the leaves are constantly releasing pure oxygen in sunlight!",
            te: "మర్రి చెట్టు కింద చల్లదనం: ఎండలో పెద్ద చెట్టు కింద కూర్చుంటే ఎంతో హాయిగా ఉంటుంది, ఎందుకంటే ఆకులు నిరంతరం స్వచ్ఛమైన ఆక్సిజన్‌ను విడుదల చేస్తుంటాయి!",
            hi: "बरगद की ठंडी छांव: बड़े पेड़ के नीचे बैठना सुकून देता है क्योंकि पत्तियां धूप में लगातार ताजी ऑक्सीजन छोड़ती हैं!"
          },
          practice_questions: [
            {
              id: "p_gas_1",
              question: {
                en: "Which gas is released by green plants into the air during photosynthesis?",
                te: "కిరణజన్య సంయోగక్రియ సమయంలో ఆకుపచ్చని మొక్కలు గాలిలోకి ఏ వాయువును విడుదల చేస్తాయి?",
                hi: "प्रकाश संश्लेषण के दौरान हरे पौधे हवा में कौन सी गैस छोड़ते हैं?"
              },
              options: [
                { id: "a", text: { en: "Oxygen", te: "ఆక్సిజన్ (ప్రాణవాయువు)", hi: "ऑक्सीजन" }, is_correct: true },
                { id: "b", text: { en: "Carbon Dioxide", te: "కార్బన్ డైయాక్సైడ్", hi: "कार्बन डाइऑक्साइड" }, is_correct: false },
                { id: "c", text: { en: "Nitrogen", te: "నత్రజని", hi: "नाइट्रोजन" }, is_correct: false }
              ],
              hints: [
                { en: "It is the gas all animals and humans need to breathe.", te: "ఇది జంతువులు మరియు మనుషులు శ్వాసించడానికి అవసరమైన వాయువు.", hi: "यह वही गैस है जो हम सांस लेने में इस्तेमाल करते हैं।" }
              ],
              explanation: {
                en: "Plants release Oxygen as a byproduct of food production.",
                te: "ఆహార తయారీ ప్రక్రియలో మొక్కలు ఆక్సిజన్‌ను ఉప-ఉత్పత్తిగా విడుదల చేస్తాయి.",
                hi: "पौधे भोजन बनाते समय ऑक्सीजन बाहर निकालते हैं।"
              }
            }
          ]
        },
        {
          id: "photosynthesis_equation",
          grade: "Class 7",
          subject: "Science",
          title: {
            en: "Photosynthesis Equation (Target)",
            te: "కిరణజన్య సంయోగక్రియ సమీకరణం (లక్ష్యం)",
            hi: "प्रकाश संश्लेषण का पूरा समीकरण (मुख्य लक्ष्य)"
          },
          is_root: false,
          prerequisites: ["gases_air"],
          level: 3,
          description: {
            en: "CO2 + Water + Sunlight (absorbed by Chlorophyll) = Glucose (Food) + Oxygen.",
            te: "కార్బన్ డైయాక్సైడ్ + నీరు + సూర్యరశ్మి (పత్రహరితం ద్వారా) = గ్లూకోజ్ (ఆహారం) + ఆక్సిజన్.",
            hi: "कार्बन डाइऑक्साइड + पानी + धूप (क्लोरोफिल द्वारा) = ग्लूकोज (भोजन) + ऑक्सीजन।"
          },
          local_example: {
            en: "Village Kitchen Chulha: Sunlight is the firewood heat, water from roots is the water, CO2 from air is the grain flour, chlorophyll is the cooking pot, and sweet fruit is the prepared meal!",
            te: "గ్రామీణ వంటిల్లు: సూర్యరశ్మి పొయ్యి మంట, వేర్ల నీరు వంట నీరు, గాలిలోని CO2 పిండి, ఆకులోని పత్రహరితం వండే పాత్ర, తియ్యని పండు తయారైన ఆహారం!",
            hi: "गांव की रसोई: धूप चूल्हे की आग है, जड़ों का पानी रसोई का पानी, हवा की CO2 आटा, क्लोरोफिल कड़ाही, और मीठा फल बना हुआ भोजन है!"
          },
          practice_questions: [
            {
              id: "p_ps_1",
              question: {
                en: "What provides the energy required for photosynthesis to take place?",
                te: "కిరణజన్య సంయోగక్రియ జరగడానికి అవసరమైన శక్తిని ఏది అందిస్తుంది?",
                hi: "प्रकाश संश्लेषण होने के लिए जरूरी ऊर्जा कौन प्रदान करता है?"
              },
              options: [
                { id: "a", text: { en: "Sunlight", te: "సూర్యరశ్మి", hi: "सूर्य का प्रकाश" }, is_correct: true },
                { id: "b", text: { en: "Wind", te: "గాలి", hi: "हवा" }, is_correct: false },
                { id: "c", text: { en: "Moonlight", te: "వెన్నెల", hi: "चांदनी" }, is_correct: false }
              ],
              hints: [
                { en: "Think about why photosynthesis stops at night.", te: "రాత్రివేళ కిరణజన్య సంయోగక్రియ ఎందుకు ఆగిపోతుందో ఆలోచించండి.", hi: "सोचिए रात में यह क्रिया क्यों रुक जाती है।" }
              ],
              explanation: {
                en: "Sunlight is absorbed by chlorophyll to power the chemical synthesis.",
                te: "పత్రహరితం సూర్యరశ్మిని గ్రహించి రసాయన చర్యకు శక్తినిస్తుంది.",
                hi: "क्लोरोफिल धूप को सोखकर रासायनिक क्रिया को ऊर्जा देता है।"
              }
            }
          ]
        }
      ],
      diagnostic_quiz: [
        {
          id: "q1",
          question: {
            en: "Which part of a mango tree is primarily responsible for absorbing water and mineral salts from the soil?",
            te: "మామిడి చెట్టులో నేల నుండి నీరు మరియు ఖనిజ లవణాలను పీల్చుకోవడానికి ప్రధానంగా ఏ భాగం బాధ్యత వహిస్తుంది?",
            hi: "मिट्टी से पानी और खनिज लवण सोखने के लिए आम के पेड़ का कौन सा अंग जिम्मेदार है?"
          },
          options: [
            { id: "a", text: { en: "Roots", te: "వేర్లు", hi: "जड़ें" }, is_correct: true },
            { id: "b", text: { en: "Leaves", te: "ఆకులు", hi: "पत्तियां" }, concept_gap: "plant_parts_functions" },
            { id: "c", text: { en: "Flowers", te: "పూలు", hi: "फूल" }, concept_gap: "plant_parts_functions" }
          ],
          tests_concept: "plant_parts_functions"
        },
        {
          id: "q2",
          question: {
            en: "What gas do green plants absorb from the air during the daytime to prepare their food?",
            te: "పగటిపూట ఆహారాన్ని తయారు చేసుకోవడానికి ఆకుపచ్చని మొక్కలు గాలి నుండి ఏ వాయువును పీల్చుకుంటాయి?",
            hi: "दिन के समय भोजन बनाने के लिए हरे पौधे हवा से कौन सी गैस सोखते हैं?"
          },
          options: [
            { id: "a", text: { en: "Oxygen", te: "ఆక్సిజన్", hi: "ऑक्सीजन" }, concept_gap: "gases_air", misconception: "Confused gas taken in with gas released" },
            { id: "b", text: { en: "Carbon Dioxide (CO2)", te: "కార్బన్ డైయాక్సైడ్ (CO2)", hi: "कार्बन डाइऑक्साइड (CO2)" }, is_correct: true },
            { id: "c", text: { en: "Nitrogen", te: "నత్రజని", hi: "नाइट्रोजन" }, concept_gap: "gases_air" }
          ],
          tests_concept: "gases_air"
        },
        {
          id: "q3",
          question: {
            en: "Why do plants kept completely in a dark closed box for two weeks turn pale and stop growing?",
            te: "రెండు వారాల పాటు చీకటి మూసి ఉన్న పెట్టెలో ఉంచిన మొక్కలు పాలిపోయి ఎందుకు ఎదగడం ఆగిపోతాయి?",
            hi: "दो हफ्तों तक बिल्कुल अंधेरे डिब्बे में बंद रखे पौधे पीले पड़कर बढ़ना क्यों बंद कर देते हैं?"
          },
          options: [
            { id: "a", text: { en: "They cannot make food because they lack sunlight energy for photosynthesis.", te: "సూర్యకాంతి లేకపోవడంతో కిరణజన్య సంయోగక్రియ జరగక ఆహారాన్ని తయారు చేసుకోలేవు.", hi: "धूप न मिलने से प्रकाश संश्लेषण रुक जाता है और वे भोजन नहीं बना पाते।" }, is_correct: true },
            { id: "b", text: { en: "Darkness puts plants to sleep permanently.", te: "చీకటి వల్ల మొక్కలు శాశ్వతంగా నిద్రపోతాయి.", hi: "अंधेरे से पौधे हमेशा के लिए सो जाते हैं।" }, concept_gap: "photosynthesis_equation" }
          ],
          tests_concept: "photosynthesis_equation"
        }
      ]
    }
  }
};

// Export to window
if (typeof window !== 'undefined') {
  window.KNOWLEDGE_BASE = KNOWLEDGE_BASE;
}
