"""
EduBridge AI - The Learning Gap Detector
Lightweight HTTP & REST API Server with Gemini AI Proxy and Smart Simulator
Zero external dependencies (Pure Python 3 Standard Library)
"""

import http.server
import socketserver
import json
import os
import sys
import urllib.request
import urllib.error
import urllib.parse
from pathlib import Path

# Base Paths
BASE_DIR = Path(__file__).resolve().parent
PUBLIC_DIR = BASE_DIR / "public"
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)
PROGRESS_FILE = DATA_DIR / "student_progress.json"

# Load .env manually if exists
ENV_FILE = BASE_DIR / ".env"
if ENV_FILE.exists():
    with open(ENV_FILE, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip().strip('"').strip("'")

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
DEFAULT_PORT = int(os.environ.get("PORT", "8000"))

# Pre-defined Knowledge Base Topics (Loaded also in client for 100% offline support)
TOPICS_DATA = {
    "math_fractions": {
        "id": "math_fractions",
        "subject": "Mathematics",
        "grade": "Class 6",
        "title": {
            "en": "Addition of Unlike Fractions",
            "te": "భిన్నాల సంకలనం (వేర్వేరు హారాలు ఉన్నవి)",
            "hi": "असमान हर वाले भिन्नों का जोड़"
        },
        "description": {
            "en": "Learn how to add fractions that have different denominators (like 1/3 + 1/4) using common denominators.",
            "te": "వేర్వేరు హారాలు కలిగిన భిన్నాలను (ఉదాహరణకు 1/3 + 1/4) సమాన హారాలుగా మార్చి ఎలా కూడాలో నేర్చుకోండి.",
            "hi": "अलग-अलग हर वाले भिन्नों को (जैसे 1/3 + 1/4) समान हर बनाकर जोड़ने की विधि सीखें।"
        },
        "target_concept": "unlike_fractions_addition",
        "nodes": [
            {
                "id": "equal_parts",
                "grade": "Class 4",
                "title": {"en": "Equal Parts & Unit Wholes", "te": "సమాన భాగాలు మరియు పూర్ణ సంఖ్య భావన", "hi": "समान हिस्से और इकाई की अवधारणा"},
                "is_root": True,
                "description": {"en": "Understanding that a fraction only makes sense when an object is divided into EXACTLY EQUAL pieces.", "te": "ఒక వస్తువును సరిగ్గా సమాన భాగాలుగా విభజించినప్పుడే భిన్నం సాధ్యమవుతుందని అర్థం చేసుకోవడం.", "hi": "यह समझना कि भिन्न तभी बनता है जब किसी वस्तु को बिल्कुल बराबर भागों में बांटा जाए।"},
                "local_example": {
                    "en": "Roti Sharing: If a mother divides 1 Jowar Roti among 4 children, each child gets 1/4. But if one piece is large and three are small, you cannot call it 1/4 because the parts are not equal!",
                    "te": "రొట్టె పంపకం: ఒక తల్లి ఒక జొన్న రొట్టెను 4 పిల్లలకు సమానంగా పంచితే, ప్రతి బిడ్డకు 1/4 వస్తుంది. ఒక ముక్క పెద్దదిగా, మిగతావి చిన్నవిగా ఉంటే అది 1/4 కాజాలదు!",
                    "hi": "रोटी का बंटवारा: अगर मां 1 ज्वार की रोटी 4 बच्चों में बराबर बांटे, तो हर बच्चे को 1/4 रोटी मिलती है। लेकिन अगर एक टुकड़ा बड़ा और बाकी छोटे हों, तो उसे 1/4 नहीं कह सकते क्योंकि हिस्से बराबर नहीं हैं!"
                }
            },
            {
                "id": "factors_multiplication",
                "grade": "Class 4",
                "title": {"en": "Multiplication Tables & Multiples", "te": "గుణకార పట్టికలు మరియు గుణిజాలు", "hi": "पहाड़े और गुणज (Multiples)"},
                "is_root": False,
                "prerequisites": ["equal_parts"],
                "description": {"en": "Finding multiples of numbers (e.g. multiples of 3 are 3, 6, 9, 12, 15...).", "te": "సంఖ్యల గుణిజాలను కనుగొనడం (ఉదా. 3 యొక్క గుణిజాలు 3, 6, 9, 12, 15...).", "hi": "संख्याओं के गुणज निकालना (जैसे 3 के गुणज 3, 6, 9, 12, 15... हैं)।"},
                "local_example": {
                    "en": "Planting Chilli Seedlings: A farmer plants chillies in rows of 3. Row 1 has 3 plants, Row 2 has 6 plants, Row 3 has 9 plants. These step counts are multiples!",
                    "te": "మిరప నారు నాటడం: రైతు మిరప మొక్కలను వరుసకు 3 చొప్పున నాటాడు. 1వ వరుసలో 3, 2వ వరుసలో 6, 3వ వరుసలో 9 మొక్కలు ఉంటాయి. ఇవే గుణిజాలు!",
                    "hi": "मिर्च की रोपाई: एक किसान एक कतार में 3 पौधे लगाता है। पहली कतार में 3, दूसरी में 6, तीसरी में 9 पौधे होते हैं। यही गुणज हैं!"
                }
            },
            {
                "id": "lcm_concept",
                "grade": "Class 5",
                "title": {"en": "Least Common Multiple (LCM)", "te": "కనిష్ట సామాన్య గుణిజం (క.సా.గు / LCM)", "hi": "लघुत्तम समापवर्त्य (ल.स.प. / LCM)"},
                "is_root": False,
                "prerequisites": ["factors_multiplication"],
                "description": {"en": "Finding the smallest number that is a common multiple of two or more numbers.", "te": "రెండు లేదా అంతకంటే ఎక్కువ సంఖ్యలకు ఉమ్మడిగా ఉండే అతి చిన్న గుణిజాన్ని గుర్తించడం.", "hi": "दो या अधिक संख्याओं का सबसे छोटा उभयनिष्ठ (कॉमन) गुणज खोजना।"},
                "local_example": {
                    "en": "Village Borewell Pumps: Pump A runs every 4 hours. Pump B runs every 6 hours. When do both pumps turn on together? At 12 hours! 12 is the LCM of 4 and 6.",
                    "te": "పొలం మోటారు పంపులు: పంపు A ప్రతి 4 గంటలకు, పంపు B ప్రతి 6 గంటలకు తిరుగుతాయి. రెండు పంపులు ఒకేసారి ఎప్పుడు నడుస్తాయి? సరిగ్గా 12 గంటల వద్ద! 4 మరియు 6 ల క.సా.గు 12.",
                    "hi": "खेत के ट्यूबवेल का समय: पंप 'अ' हर 4 घंटे में चलता है और पंप 'ब' हर 6 घंटे में। दोनों एक साथ कब चलेंगे? ठीक 12 घंटे बाद! 4 और 6 का LCM 12 है।"
                }
            },
            {
                "id": "equivalent_fractions",
                "grade": "Class 5",
                "title": {"en": "Equivalent Fractions", "te": "సమాన భిన్నాలు", "hi": "समतुल्य भिन्न"},
                "is_root": False,
                "prerequisites": ["equal_parts", "factors_multiplication"],
                "description": {"en": "Recognizing that 1/2 is the exact same amount as 2/4, 3/6, or 6/12.", "te": "1/2 మరియు 2/4 లేదా 3/6 ఒకే పరిమాణాన్ని సూచిస్తాయని గ్రహించడం.", "hi": "यह पहचानना कि 1/2 और 2/4 या 3/6 बिल्कुल बराबर मात्रा दर्शाते हैं।"},
                "local_example": {
                    "en": "Sugarcane Sweetness: Taking half of a sugarcane (1/2) is exactly identical to cutting that same sugarcane into 4 pieces and taking 2 pieces (2/4).",
                    "te": "చెరకు గడ భాగం: సగం చెరకు గడ (1/2) తీసుకోవడం, లేదా అదే గడను 4 సమాన ముక్కలు చేసి 2 ముక్కలు (2/4) తీసుకోవడం రెండూ ఒక్కటే!",
                    "hi": "गन्ने का बंटवारा: आधा गन्ना (1/2) लेना, या उसी गन्ने के 4 बराबर टुकड़े करके 2 टुकड़े (2/4) लेना, दोनों बिल्कुल बराबर हैं!"
                }
            },
            {
                "id": "unlike_fractions_addition",
                "grade": "Class 6",
                "title": {"en": "Adding Unlike Fractions (Target)", "te": "వేర్వేరు హారాల భిన్నాల కూడిక (లక్ష్యం)", "hi": "असमान हर वाले भिन्नों का जोड़ (मुख्य लक्ष्य)"},
                "is_root": False,
                "prerequisites": ["lcm_concept", "equivalent_fractions"],
                "description": {"en": "Converting unlike denominators to common denominators using LCM, then adding numerators.", "te": "క.సా.గు ఉపయోగించి వేర్వేరు హారాలను సమాన హారాలుగా మార్చి, లవాలను కూడడం.", "hi": "LCM की मदद से हर को समान बनाकर अंशों को जोड़ना।"},
                "local_example": {
                    "en": "Grain Measurement in Kirana Store: You have 1/3 bag of rice and 1/4 bag of rice. You cannot add them directly because bags are measured in different cup sizes! Convert both to 12th parts (4/12 + 3/12 = 7/12).",
                    "te": "కిరాణా కొట్టులో ధాన్యం కొలత: మీ దగ్గర 1/3 బస్తా మరియు 1/4 బస్తా బియ్యం ఉన్నాయి. గిన్నె పరిమాణం వేరైనందున నేరుగా కలపలేము! రెండింటినీ 12వ భాగాలుగా మార్చితే (4/12 + 3/12 = 7/12).",
                    "hi": "किराना दुकान में अनाज की तौल: आपके पास 1/3 बोरी चावल और 1/4 बोरी चावल है। माप का बर्तन अलग होने से सीधे नहीं जोड़ सकते! दोनों को 12वें हिस्से में बदलें: (4/12 + 3/12 = 7/12)।"
                }
            }
        ],
        "diagnostic_quiz": [
            {
                "id": "q1",
                "question": {
                    "en": "A chappati is cut into 3 pieces: one big piece and two tiny slivers. A child eats the big piece. Did they eat 1/3 of the chappati?",
                    "te": "ఒక చపాతీని 3 ముక్కలుగా కత్తిరించారు: ఒకటి చాలా పెద్ద ముక్క, రెండు చిన్న ముక్కలు. ఒక పిల్లవాడు పెద్ద ముక్క తిన్నాడు. అతను 1/3 చపాతీ తిన్నట్లేనా?",
                    "hi": "एक चपाती को 3 टुकड़ों में काटा गया: एक बहुत बड़ा टुकड़ा और दो बहुत छोटे। एक बच्चे ने बड़ा टुकड़ा खाया। क्या उसने 1/3 चपाती खाई?"
                },
                "options": [
                    {"id": "a", "text": {"en": "Yes, because there were 3 pieces in total.", "te": "అవును, ఎందుకంటే మొత్తం 3 ముక్కలు ఉన్నాయి.", "hi": "हाँ, क्योंकि कुल 3 टुकड़े थे।"}, "concept_gap": "equal_parts"},
                    {"id": "b", "text": {"en": "No, because the 3 pieces are not equal in size.", "te": "కాదు, ఎందుకంటే ఆ 3 ముక్కలు సమాన పరిమాణంలో లేవు.", "hi": "नहीं, क्योंकि तीनों टुकड़े बराबर आकार के नहीं हैं।"}, "is_correct": True},
                    {"id": "c", "text": {"en": "Yes, any piece from 3 pieces is always 1/3.", "te": "అవును, 3 ముక్కల్లో ఏ ముక్క అయినా 1/3 అవుతుంది.", "hi": "हाँ, 3 में से कोई भी टुकड़ा 1/3 ही होता है।"}, "concept_gap": "equal_parts"},
                    {"id": "d", "text": {"en": "Cannot be determined.", "te": "చెప్పలేము.", "hi": "तय नहीं किया जा सकता।"}, "concept_gap": "equal_parts"}
                ],
                "tests_concept": "equal_parts"
            },
            {
                "id": "q2",
                "question": {
                    "en": "Which of the following fractions is equivalent to (represents the exact same amount as) 2/3?",
                    "te": "క్రింది వాటిలో 2/3 కి సమానమైన భిన్నం (సమాన విలువ గలది) ఏది?",
                    "hi": "निम्नलिखित में से कौन सा भिन्न 2/3 के समतुल्य (बिल्कुल बराबर मान वाला) है?"
                },
                "options": [
                    {"id": "a", "text": {"en": "3/4", "te": "3/4", "hi": "3/4"}, "concept_gap": "equivalent_fractions"},
                    {"id": "b", "text": {"en": "4/6", "te": "4/6", "hi": "4/6"}, "is_correct": True},
                    {"id": "c", "text": {"en": "3/2", "te": "3/2", "hi": "3/2"}, "concept_gap": "equivalent_fractions"},
                    {"id": "d", "text": {"en": "4/9", "te": "4/9", "hi": "4/9"}, "concept_gap": "factors_multiplication"}
                ],
                "tests_concept": "equivalent_fractions"
            },
            {
                "id": "q3",
                "question": {
                    "en": "What is the Least Common Multiple (LCM) of 4 and 6?",
                    "te": "4 మరియు 6 సంఖ్యల కనిష్ట సామాన్య గుణిజం (LCM / క.సా.గు) ఎంత?",
                    "hi": "4 और 6 का लघुत्तम समापवर्त्य (LCM / ल.स.प.) क्या है?"
                },
                "options": [
                    {"id": "a", "text": {"en": "24", "te": "24", "hi": "24"}, "concept_gap": "lcm_concept", "misconception": "Multiplied the numbers together instead of finding smallest common multiple"},
                    {"id": "b", "text": {"en": "12", "te": "12", "hi": "12"}, "is_correct": True},
                    {"id": "c", "text": {"en": "10", "te": "10", "hi": "10"}, "concept_gap": "factors_multiplication", "misconception": "Added numbers instead of multiplying multiples"},
                    {"id": "d", "text": {"en": "2", "te": "2", "hi": "2"}, "concept_gap": "lcm_concept", "misconception": "Confused LCM with HCF/GCD"}
                ],
                "tests_concept": "lcm_concept"
            },
            {
                "id": "q4",
                "question": {
                    "en": "Solve: 1/2 + 1/3 = ?",
                    "te": "సాధించండి: 1/2 + 1/3 = ఎంత?",
                    "hi": "हल कीजिए: 1/2 + 1/3 = ?"
                },
                "options": [
                    {"id": "a", "text": {"en": "2/5", "te": "2/5", "hi": "2/5"}, "concept_gap": "unlike_fractions_addition", "root_trigger": "lcm_concept", "misconception": "Added top numbers (1+1=2) and bottom numbers (2+3=5) directly without common denominator!"},
                    {"id": "b", "text": {"en": "5/6", "te": "5/6", "hi": "5/6"}, "is_correct": True},
                    {"id": "c", "text": {"en": "1/5", "te": "1/5", "hi": "1/5"}, "concept_gap": "unlike_fractions_addition"},
                    {"id": "d", "text": {"en": "2/6", "te": "2/6", "hi": "2/6"}, "concept_gap": "equivalent_fractions"}
                ],
                "tests_concept": "unlike_fractions_addition"
            }
        ]
    },
    "math_algebra": {
        "id": "math_algebra",
        "subject": "Mathematics",
        "grade": "Class 7",
        "title": {
            "en": "Linear Equations in One Variable",
            "te": "ఏకచరరాశిలో సరళ సమీకరణాలు",
            "hi": "एक चर वाले रैखिक समीकरण"
        },
        "description": {
            "en": "Solve for missing values (like 2x + 5 = 15) using the balance scale method.",
            "te": "త్రాసు బ్యాలెన్స్ సూత్రాన్ని ఉపయోగించి తెలియని విలువను (ఉదా. 2x + 5 = 15) కనుగొనండి.",
            "hi": "तराजू के संतुलन नियम का उपयोग करके अज्ञात मान (जैसे 2x + 5 = 15) ज्ञात करना सीखें।"
        },
        "target_concept": "linear_solve",
        "nodes": [
            {
                "id": "unknown_concept",
                "grade": "Class 5",
                "title": {"en": "Concept of Unknowns / Mystery Box", "te": "తెలియని సంఖ్య / రహస్య పెట్టె భావన", "hi": "अज्ञात संख्या / रहस्यमयी डिब्बे की अवधारणा"},
                "is_root": True,
                "description": {"en": "Understanding that 'x' is just a placeholder for a hidden number, like a closed sack of grain.", "te": "'x' అనేది ఒక దాచిన సంఖ్యకు గుర్తు మాత్రమే, మూసి ఉన్న ధాన్యం బస్తా లాంటిది.", "hi": "'x' केवल किसी छुपे हुए अंक का नाम है, जैसे अनाज की बंद बोरी।"},
                "local_example": {
                    "en": "Clay Piggy Bank: A child has a sealed clay piggy bank with some coins ('x') plus 5 loose coins. If total coins are 12, the clay piggy bank holds 7 coins!",
                    "te": "మట్టి హుండీ: ఒక పిల్లవాడి దగ్గర మూసి ఉన్న మట్టి హుండీలో కొన్ని నాణేలు ('x') మరియు విడిగా 5 నాణేలు ఉన్నాయి. మొత్తం 12 నాణేలు ఉంటే, హుండీలో 7 నాణేలు ఉన్నట్లు!",
                    "hi": "मिट्टी की गुल्लक: बच्चे के पास एक बंद गुल्लक में कुछ सिक्के ('x') और 5 खुले सिक्के हैं। अगर कुल 12 सिक्के हैं, तो गुल्लक में 7 सिक्के हैं!"
                }
            },
            {
                "id": "negative_numbers",
                "grade": "Class 6",
                "title": {"en": "Negative Integers & Udhar (Credit)", "te": "రుణ పూర్ణసంఖ్యలు మరియు అప్పుల లెక్క", "hi": "ऋणात्मक पूर्णांक और उधार का हिसाब"},
                "is_root": False,
                "prerequisites": ["unknown_concept"],
                "description": {"en": "Understanding numbers less than zero, opposites, and balancing credits and debits.", "te": "సున్నా కంటే తక్కువ సంఖ్యలు, వ్యతిరేక దిశలు మరియు అప్పు-జమ లెక్కలు అర్థం చేసుకోవడం.", "hi": "शून्य से छोटी संख्याएं और जमा-उधार का संतुलन समझना।"},
                "local_example": {
                    "en": "Kirana Shop Khata: If you have Rs 100 and buy goods for Rs 140, your ledger shows -40 (udhar/debt). When you deposit Rs 40, your balance becomes zero.",
                    "te": "కిరాణా దుకాణం ఖాటా: మీ దగ్గర రూ.100 ఉండి రూ.140 సరుకులు తీసుకుంటే, మీ ఖాతాలో -40 (అప్పు) నమోదు అవుతుంది. మీరు రూ.40 చెల్లించినప్పుడు ఖాతా సున్నా అవుతుంది.",
                    "hi": "किराना दुकान का बहीखाता: आपके पास 100 रु हैं और आपने 140 रु का सामान लिया, तो बहीखाते में -40 (उधार) दर्ज होगा। 40 रु चुकाने पर खाता शून्य हो जाएगा।"
                }
            },
            {
                "id": "scale_balance",
                "grade": "Class 6",
                "title": {"en": "Scale Balancing Rule (Equality)", "te": "త్రాసు బ్యాలెన్స్ సూత్రం (సమానత్వం)", "hi": "तराजू का संतुलन नियम (समानता)"},
                "is_root": False,
                "prerequisites": ["unknown_concept"],
                "description": {"en": "Whatever operation you perform on the left side of '=', you MUST perform on the right side to keep the balance level.", "te": "'=' కు ఎడమ వైపున ఏ పని చేస్తే, త్రాసు సమతుల్యత కోసం కుడి వైపున కూడా ఖచ్చితంగా అదే చేయాలి.", "hi": "'=' के बाईं तरफ जो बदलाव करें, तराजू बराबर रखने के लिए दाईं तरफ भी बिल्कुल वही करना होगा।"},
                "local_example": {
                    "en": "Vegetable Market Tarazu: A vendor has 2 bags of onions + 1 kg weight on left, and 7 kg weight on right. To find weight of bags, remove 1 kg from BOTH pans equally!",
                    "te": "కూరగాయల మార్కెట్ త్రాసు: ఎడమ పళ్ళెంలో 2 ఉల్లిపాయల సంచులు + 1 కేజీ రాయి, కుడి పళ్ళెంలో 7 కేజీల రాయి ఉంది. సంచుల బరువు తెలుసుకోవడానికి రెండు పళ్ళేల నుండి 1 కేజీని సమానంగా తీసివేయాలి!",
                    "hi": "सब्जी मंडी का तराजू: बाईं तरफ 2 थैली प्याज + 1 किलो का बांट है, दाईं तरफ 7 किलो का बांट। थैलियों का वजन जानने के लिए दोनों पलड़ों से 1-1 किलो हटाना होगा!"
                }
            },
            {
                "id": "linear_solve",
                "grade": "Class 7",
                "title": {"en": "Solving Two-Step Linear Equations (Target)", "te": "రెండు దశల సరళ సమీకరణాల సాధన (లక్ష్యం)", "hi": "दो चरणों वाले रैखिक समीकरण हल करना (मुख्य लक्ष्य)"},
                "is_root": False,
                "prerequisites": ["scale_balance", "negative_numbers"],
                "description": {"en": "Isolating the variable step-by-step: undo addition/subtraction, then undo multiplication/division.", "te": "చరరాశిని ఒంటరిగా చేయడం: మొదట కూడిక/తీసివేతను రద్దు చేసి, ఆపై గుణకారం/భాగహారాన్ని రద్దు చేయడం.", "hi": "चर (x) को अलग करना: पहले जोड़/घटाव को हटाएं, फिर गुणा/भाग को हल करें।"},
                "local_example": {
                    "en": "Cotton Harvest Payment: 2 bags of cotton + Rs 50 transport allowance = Rs 450 total. Step 1: Deduct Rs 50 allowance from both sides (2 bags = Rs 400). Step 2: Divide by 2 (1 bag = Rs 200).",
                    "te": "పత్తి బస్తాల ధర: 2 బస్తాల పత్తి + రూ.50 రవాణా ఖర్చు = మొత్తం రూ.450. మొదటి దశ: రెండు వైపుల నుండి రూ.50 తీసివేయండి (2 బస్తాలు = రూ.400). రెండవ దశ: 2 తో భాగించండి (1 బస్తా = రూ.200).",
                    "hi": "कपास की बोरियों की कीमत: 2 बोरी कपास + 50 रु भाड़ा = 450 रु। पहला कदम: दोनों तरफ से 50 रु भाड़ा घटाएं (2 बोरी = 400 रु)। दूसरा कदम: 2 से भाग दें (1 बोरी = 200 रु)।"
                }
            }
        ],
        "diagnostic_quiz": [
            {
                "id": "q1",
                "question": {
                    "en": "In a grocery store, a mystery tin has rice in it. If the tin + 2 kg weight balances exactly with a 5 kg weight, how much rice is in the tin?",
                    "te": "ఒక దుకాణంలో మూసి ఉన్న డబ్బాలో బియ్యం ఉంది. ఆ డబ్బా + 2 కేజీల రాయి, కుడివైపు 5 కేజీల రాయితో సరిగ్గా తూగితే, డబ్బాలో ఎన్ని కేజీల బియ్యం ఉంది?",
                    "hi": "एक दुकान में बंद डिब्बे में चावल है। यदि डिब्बा + 2 किलो का बांट, दूसरी तरफ के 5 किलो के बांट के बराबर है, तो डिब्बे में कितना चावल है?"
                },
                "options": [
                    {"id": "a", "text": {"en": "7 kg", "te": "7 కేజీలు", "hi": "7 किलो"}, "concept_gap": "scale_balance", "misconception": "Added both weights instead of subtracting"},
                    {"id": "b", "text": {"en": "3 kg", "te": "3 కేజీలు", "hi": "3 किलो"}, "is_correct": True},
                    {"id": "c", "text": {"en": "10 kg", "te": "10 కేజీలు", "hi": "10 किलो"}, "concept_gap": "unknown_concept"},
                    {"id": "d", "text": {"en": "2.5 kg", "te": "2.5 కేజీలు", "hi": "2.5 किलो"}, "concept_gap": "scale_balance"}
                ],
                "tests_concept": "scale_balance"
            },
            {
                "id": "q2",
                "question": {
                    "en": "Solve for x: 3x = 18. What is the value of x?",
                    "te": "3x = 18 అయితే, x విలువ ఎంత?",
                    "hi": "यदि 3x = 18 है, तो x का मान क्या है?"
                },
                "options": [
                    {"id": "a", "text": {"en": "15", "te": "15", "hi": "15"}, "concept_gap": "scale_balance", "misconception": "Subtracted 3 from 18 instead of dividing"},
                    {"id": "b", "text": {"en": "6", "te": "6", "hi": "6"}, "is_correct": True},
                    {"id": "c", "text": {"en": "54", "te": "54", "hi": "54"}, "concept_gap": "unknown_concept"},
                    {"id": "d", "text": {"en": "21", "te": "21", "hi": "21"}, "concept_gap": "scale_balance"}
                ],
                "tests_concept": "scale_balance"
            },
            {
                "id": "q3",
                "question": {
                    "en": "Solve: 2x + 7 = 19. What is x?",
                    "te": "సాధించండి: 2x + 7 = 19 అయితే x విలువ ఎంత?",
                    "hi": "हल करें: 2x + 7 = 19, x का मान क्या होगा?"
                },
                "options": [
                    {"id": "a", "text": {"en": "x = 13", "te": "x = 13", "hi": "x = 13"}, "concept_gap": "scale_balance"},
                    {"id": "b", "text": {"en": "x = 6", "te": "x = 6", "hi": "x = 6"}, "is_correct": True},
                    {"id": "c", "text": {"en": "x = 12", "te": "x = 12", "hi": "x = 12"}, "concept_gap": "linear_solve", "misconception": "Forgot to divide by 2 after subtracting 7"},
                    {"id": "d", "text": {"en": "x = 26", "te": "x = 26", "hi": "x = 26"}, "concept_gap": "linear_solve"}
                ],
                "tests_concept": "linear_solve"
            }
        ]
    },
    "science_photosynthesis": {
        "id": "science_photosynthesis",
        "subject": "Science",
        "grade": "Class 7",
        "title": {
            "en": "Photosynthesis — Plant Food Factory",
            "te": "కిరణజన్య సంయోగక్రియ — మొక్కల ఆహార తయారీ",
            "hi": "प्रकाश संश्लेषण — पौधों की रसोई"
        },
        "description": {
            "en": "Discover how green plants convert water, sunlight, and air into glucose food and life-giving oxygen.",
            "te": "ఆకుపచ్చని మొక్కలు నీరు, సూర్యరశ్మి, మరియు గాలిని ఉపయోగించి ఆహారం (గ్లూకోజ్) మరియు ఆక్సిజన్‌ను ఎలా తయారు చేస్తాయో తెలుసుకోండి.",
            "hi": "जानिए कैसे हरे पौधे पानी, धूप और हवा का उपयोग करके अपना भोजन (ग्लूकोज) और जीवनदायिनी ऑक्सीजन बनाते हैं।"
        },
        "target_concept": "photosynthesis_equation",
        "nodes": [
            {
                "id": "plant_parts_functions",
                "grade": "Class 4",
                "title": {"en": "Plant Parts: Roots, Leaves & Stems", "te": "మొక్క భాగాలు: వేర్లు, ఆకులు మరియు కాండం", "hi": "पौधे के अंग: जड़, तना और पत्तियां"},
                "is_root": True,
                "description": {"en": "Roots absorb water from soil; stem transports it up; leaves act as the cooking stove.", "te": "వేర్లు నేల నుండి నీటిని పీల్చుకుంటాయి; కాండం దానిని పైకి చేరుస్తుంది; ఆకులు వంటగదిలా పనిచేస్తాయి.", "hi": "जड़ें मिट्टी से पानी सोखती हैं; तना पानी ऊपर ले जाता है; पत्तियां रसोई की तरह काम करती हैं।"},
                "local_example": {
                    "en": "Neem Tree Root Straw: Just like sucking tender coconut water through a straw, a neem tree's roots suck water deep from the underground soil.",
                    "te": "వేప చెట్టు వేర్ల స్ట్రా: కొబ్బరి బొండం నీటిని స్ట్రాతో పీల్చుకున్నట్లే, వేప చెట్టు వేర్లు భూమి లోపలి నీటిని పైకి పీల్చుకుంటాయి.",
                    "hi": "नीम की जड़ों का स्ट्रॉ: जैसे हम स्ट्रॉ से नारियल पानी पीते हैं, वैसे ही नीम के पेड़ की जड़ें जमीन की गहराई से पानी सोखती हैं।"
                }
            },
            {
                "id": "gases_air",
                "grade": "Class 5",
                "title": {"en": "Gases in Air (Oxygen vs Carbon Dioxide)", "te": "గాలిలోని వాయువులు (ఆక్సిజన్ మరియు కార్బన్ డైయాక్సైడ్)", "hi": "हवा में मौजूद गैसें (ऑक्सीजन और कार्बन डाइऑक्साइड)"},
                "is_root": False,
                "prerequisites": ["plant_parts_functions"],
                "description": {"en": "Humans breathe in Oxygen and breathe out Carbon Dioxide. Plants take in Carbon Dioxide and release Oxygen.", "te": "మనుషులు ఆక్సిజన్ పీల్చుకుని కార్బన్ డైయాక్సైడ్ వదులుతారు. మొక్కలు కార్బన్ డైయాక్సైడ్ తీసుకుని ఆక్సిజన్ విడుదల చేస్తాయి.", "hi": "हम ऑक्सीजन लेते हैं और कार्बन डाइऑक्साइड छोड़ते हैं। पौधे कार्बन डाइऑक्साइड लेते हैं और ऑक्सीजन छोड़ते हैं।"},
                "local_example": {
                    "en": "Village Village Chulha & Fresh Breeze: Sitting near a smoky wood stove makes breathing hard because of smoke. But sitting under the peepal tree gives cool, refreshing air rich in oxygen!",
                    "te": "పొయ్యి పొగ మరియు చెట్టు చల్లని గాలి: పొగ వచ్చే కట్టెల పొయ్యి దగ్గర ఊపిరి ఆడదు. కానీ రావి చెట్టు కింద కూర్చుంటే చల్లని స్వచ్ఛమైన ఆక్సిజన్ లభిస్తుంది!",
                    "hi": "चूल्हे का धुआं और पीपल की छांव: चूल्हे के धुएं के पास सांस लेना मुश्किल होता है। लेकिन पीपल के पेड़ के नीचे बैठने पर ताजी, ऑक्सीजन से भरी ठंडी हवा मिलती है!"
                }
            },
            {
                "id": "chlorophyll_stomata",
                "grade": "Class 6",
                "title": {"en": "Chlorophyll & Stomata (Leaf Kitchen)", "te": "పత్రహరితం మరియు పత్రరంధ్రాలు (ఆకు వంటగది)", "hi": "क्लोरोफिल और रंध्र (पत्तियों के सूक्ष्म छिद्र)"},
                "is_root": False,
                "prerequisites": ["plant_parts_functions"],
                "description": {"en": "Chlorophyll is the green pigment trapping sunlight; stomata are tiny microscopic breathing pores on leaf surfaces.", "te": "పత్రహరితం సూర్యరశ్మిని గ్రహించే ఆకుపచ్చ వర్ణద్రవ్యం; పత్రరంధ్రాలు ఆకులపై ఉండే సూక్ష్మ రంధ్రాలు.", "hi": "क्लोरोफिल धूप पकड़ने वाला हरा रंग है; रंध्र (स्टोमेटा) पत्तियों की सतह पर सांस लेने वाले छोटे छेद हैं।"},
                "local_example": {
                    "en": "Betel Leaf Pores: If you apply a little oil on the underside of a betel leaf and dip in warm water, tiny bubbles appear from the microscopic stomata pores!",
                    "te": "తమలపాకు రంధ్రాలు: తమలపాకు వెనుక భాగాన్ని పరిశీలిస్తే, కంటికి కనిపించని సూక్ష్మ రంధ్రాల (పత్రరంధ్రాలు) ద్వారా ఆకు గాలి పీల్చుకుంటుంది!",
                    "hi": "पान के पत्ते के छिद्र: पान के पत्ते की निचली सतह पर छोटे सूक्ष्म छिद्र होते हैं जिनके जरिए पत्ती हवा अंदर-बाहर करती है!"
                }
            },
            {
                "id": "photosynthesis_equation",
                "grade": "Class 7",
                "title": {"en": "Photosynthesis Equation (Target)", "te": "కిరణజన్య సంయోగక్రియ సమీకరణం (లక్ష్యం)", "hi": "प्रकाश संश्लेषण का समीकरण (मुख्य लक्ष्य)"},
                "is_root": False,
                "prerequisites": ["gases_air", "chlorophyll_stomata"],
                "description": {"en": "Carbon Dioxide + Water + Sunlight (with Chlorophyll) -> Glucose (Food) + Oxygen.", "te": "కార్బన్ డైయాక్సైడ్ + నీరు + సూర్యరశ్మి (పత్రహరితం సమక్షంలో) -> గ్లూకోజ్ (ఆహారం) + ఆక్సిజన్.", "hi": "कार्बन डाइऑक्साइड + पानी + सूर्य का प्रकाश (क्लोरोफिल) -> ग्लूकोज (भोजन) + ऑक्सीजन।"},
                "local_example": {
                    "en": "Grandmother's Cooking Recipe: Sunlight is the fire/flame, water from roots is the water, CO2 is the flour, chlorophyll is the cooking pot, and sweet mango fruit is the prepared food!",
                    "te": "బామ్మగారి వంట విధానం: సూర్యకాంతి పొయ్యి మంట, వేర్ల నీరు వంట నీరు, గాలిలోని CO2 పిండి, పత్రహరితం వండే పాత్ర, తియ్యని మామిడి పండు తయారైన ఆహారం!",
                    "hi": "दादी की रसोई का नुस्खा: धूप चूल्हे की आग है, जड़ों का पानी रसोई का पानी है, हवा की CO2 आटा है, क्लोरोफिल खाना पकाने की कड़ाही है, और मीठा आम बना हुआ भोजन है!"
                }
            }
        ],
        "diagnostic_quiz": [
            {
                "id": "q1",
                "question": {
                    "en": "Which part of a mango tree is primarily responsible for absorbing water and mineral salts from the soil?",
                    "te": "మామిడి చెట్టులో నేల నుండి నీరు మరియు ఖనిజ లవణాలను పీల్చుకోవడానికి ప్రధానంగా ఏ భాగం బాధ్యత వహిస్తుంది?",
                    "hi": "मिट्टी से पानी और खनिज लवण सोखने के लिए आम के पेड़ का कौन सा अंग जिम्मेदार है?"
                },
                "options": [
                    {"id": "a", "text": {"en": "Roots", "te": "వేర్లు", "hi": "जड़ें"}, "is_correct": True},
                    {"id": "b", "text": {"en": "Leaves", "te": "ఆకులు", "hi": "पत्तियां"}, "concept_gap": "plant_parts_functions"},
                    {"id": "c", "text": {"en": "Flowers", "te": "పూలు", "hi": "फूल"}, "concept_gap": "plant_parts_functions"},
                    {"id": "d", "text": {"en": "Bark", "te": "బెరడు", "hi": "छाल"}, "concept_gap": "plant_parts_functions"}
                ],
                "tests_concept": "plant_parts_functions"
            },
            {
                "id": "q2",
                "question": {
                    "en": "What gas do green plants absorb from the air during the daytime to prepare their food?",
                    "te": "పగటిపూట ఆహారాన్ని తయారు చేసుకోవడానికి ఆకుపచ్చని మొక్కలు గాలి నుండి ఏ వాయువును పీల్చుకుంటాయి?",
                    "hi": "दिन के समय भोजन बनाने के लिए हरे पौधे हवा से कौन सी गैस सोखते हैं?"
                },
                "options": [
                    {"id": "a", "text": {"en": "Oxygen", "te": "ఆక్సిజన్ (ప్రాణవాయువు)", "hi": "ऑक्सीजन"}, "concept_gap": "gases_air", "misconception": "Confused gas taken in during photosynthesis with gas released"},
                    {"id": "b", "text": {"en": "Carbon Dioxide (CO2)", "te": "కార్బన్ డైయాక్సైడ్ (బొగ్గుపులుసు వాయువు)", "hi": "कार्बन डाइऑक्साइड (CO2)"}, "is_correct": True},
                    {"id": "c", "text": {"en": "Nitrogen", "te": "నత్రజని", "hi": "नाइट्रोजन"}, "concept_gap": "gases_air"},
                    {"id": "d", "text": {"en": "Hydrogen", "te": "హైడ్రోజన్", "hi": "हाइड्रोजन"}, "concept_gap": "gases_air"}
                ],
                "tests_concept": "gases_air"
            },
            {
                "id": "q3",
                "question": {
                    "en": "Why do plants kept completely in a dark closed box for two weeks turn pale and stop growing?",
                    "te": "రెండు వారాల పాటు చీకటి మూసి ఉన్న పెట్టెలో ఉంచిన మొక్కలు పాలిపోయి ఎందుకు ఎదగడం ఆగిపోతాయి?",
                    "hi": "दो हफ्तों तक बिल्कुल अंधेरे डिब्बे में बंद रखे पौधे पीले पड़कर बढ़ना क्यों बंद कर देते हैं?"
                },
                "options": [
                    {"id": "a", "text": {"en": "They cannot make food because they lack sunlight energy for photosynthesis.", "te": "కిరణజన్య సంయోగక్రియకు అవసరమైన సూర్యకాంతి లేకపోవడంతో అవి ఆహారాన్ని తయారు చేసుకోలేవు.", "hi": "धूप न मिलने से प्रकाश संश्लेषण रुक जाता है और वे भोजन नहीं बना पाते।"}, "is_correct": True},
                    {"id": "b", "text": {"en": "Darkness causes plants to sleep permanently.", "te": "చీకటి వల్ల మొక్కలు శాశ్వతంగా నిద్రపోతాయి.", "hi": "अंधेरे से पौधे हमेशा के लिए सो जाते हैं।"}, "concept_gap": "chlorophyll_stomata"},
                    {"id": "c", "text": {"en": "Soil turns poisonous in darkness.", "te": "చీకటిలో మట్టి విషపూరితం అవుతుంది.", "hi": "अंधेरे में मिट्टी जहरीली हो जाती है।"}, "concept_gap": "plant_parts_functions"},
                    {"id": "d", "text": {"en": "Roots freeze without sunlight.", "te": "సూర్యరశ్మి లేకపోతే వేర్లు గడ్డకట్టుకుపోతాయి.", "hi": "धूप के बिना जड़ें जम जाती हैं।"}, "concept_gap": "photosynthesis_equation"}
                ],
                "tests_concept": "photosynthesis_equation"
            }
        ]
    }
}

# Teacher Analytics Initial Mock Data
TEACHER_CLASS_DATA = {
    "class_6a": {
        "class_name": "Class 6 - Section A (ZPHS Village School)",
        "total_students": 38,
        "subject": "Mathematics",
        "topic": "math_fractions",
        "tested_students": 34,
        "mastery_rate": 41, # 41% mastered
        "gap_breakdown": [
            {"concept_id": "equal_parts", "concept_name": "Equal Parts & Unit Wholes (Class 4)", "students_affected": 21, "percent": 62, "severity": "critical", "root_cause": True},
            {"concept_id": "lcm_concept", "concept_name": "Least Common Multiple / LCM (Class 5)", "students_affected": 18, "percent": 53, "severity": "high", "root_cause": False},
            {"concept_id": "equivalent_fractions", "concept_name": "Equivalent Fractions (Class 5)", "students_affected": 14, "percent": 41, "severity": "medium", "root_cause": False},
            {"concept_id": "unlike_fractions_addition", "concept_name": "Adding Unlike Fractions (Class 6)", "students_affected": 24, "percent": 71, "severity": "high", "root_cause": False}
        ],
        "top_misconception": "68% of struggling students directly add numerators and denominators (1/2 + 1/3 = 2/5) because they don't understand the equal unit size concept from Class 4.",
        "recommended_activity": {
            "title": "Chappati / Paper Folding Activity (15 mins)",
            "description": "Have students take rectangular notebook paper and fold into 3 equal parts, and another into 4 equal parts. Show why 1 strip of thirds and 1 strip of fourths cannot simply be counted as '2 strips of fifths'. Fold both into 12 grid blocks to visually discover 7/12.",
            "materials_needed": "Scrap notebook paper, pencil, ruler"
        },
        "student_roster": [
            {"name": "Ananya R.", "status": "Mastered", "score": 100, "root_gap": "None", "recovery_progress": 100},
            {"name": "Raju K.", "status": "Needs Foundational Support", "score": 25, "root_gap": "Equal Parts & Wholes (Class 4)", "recovery_progress": 40},
            {"name": "Pooja M.", "status": "Needs Practice", "score": 50, "root_gap": "LCM Concept (Class 5)", "recovery_progress": 65},
            {"name": "Suresh B.", "status": "Needs Foundational Support", "score": 25, "root_gap": "Equal Parts & Wholes (Class 4)", "recovery_progress": 20},
            {"name": "Divya T.", "status": "Mastered", "score": 100, "root_gap": "None", "recovery_progress": 100},
            {"name": "Venkatesh P.", "status": "Needs Practice", "score": 50, "root_gap": "Equivalent Fractions (Class 5)", "recovery_progress": 80}
        ]
    }
}

class EduBridgeHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def send_json(self, data, status_code=200):
        response_bytes = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Length", str(len(response_bytes)))
        self.end_headers()
        self.wfile.write(response_bytes)

    def parse_json_body(self):
        content_length = int(self.headers.get("Content-Length", 0))
        if content_length == 0:
            return {}
        body = self.rfile.read(content_length).decode("utf-8")
        try:
            return json.loads(body)
        except Exception:
            return {}

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path

        if path == "/api/status":
            self.send_json({
                "status": "online",
                "app_name": "EduBridge AI — The Learning Gap Detector",
                "mode": "live_gemini" if GEMINI_API_KEY else "smart_simulator",
                "has_gemini_key": bool(GEMINI_API_KEY),
                "supported_languages": [
                    {"code": "en", "name": "English"},
                    {"code": "te", "name": "తెలుగు (Telugu)"},
                    {"code": "hi", "name": "हिन्दी (Hindi)"}
                ],
                "topics_available": len(TOPICS_DATA)
            })
            return

        elif path == "/api/topics":
            topics_summary = []
            for tid, t in TOPICS_DATA.items():
                topics_summary.append({
                    "id": tid,
                    "subject": t["subject"],
                    "grade": t["grade"],
                    "title": t["title"],
                    "description": t["description"],
                    "node_count": len(t["nodes"])
                })
            self.send_json({"topics": topics_summary})
            return

        elif path.startswith("/api/topic/"):
            topic_id = path.replace("/api/topic/", "").strip()
            if topic_id in TOPICS_DATA:
                self.send_json({"topic": TOPICS_DATA[topic_id]})
            else:
                self.send_json({"error": "Topic not found"}, 404)
            return

        elif path == "/api/teacher/analytics":
            self.send_json(TEACHER_CLASS_DATA["class_6a"])
            return

        elif path == "/api/progress":
            if PROGRESS_FILE.exists():
                try:
                    with open(PROGRESS_FILE, "r", encoding="utf-8") as f:
                        data = json.load(f)
                    self.send_json({"progress": data})
                    return
                except Exception:
                    pass
            self.send_json({"progress": {}})
            return

        # Otherwise serve static files from public/
        return super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self.parse_json_body()

        if path == "/api/diagnose":
            topic_id = body.get("topic_id", "math_fractions")
            answers = body.get("answers", {})  # {q1: "a", q2: "b", ...}
            topic = TOPICS_DATA.get(topic_id)
            if not topic:
                self.send_json({"error": "Unknown topic"}, 400)
                return

            quiz = topic["diagnostic_quiz"]
            total_questions = len(quiz)
            correct_count = 0
            gaps_detected = []
            misconceptions = []
            answered_details = []

            for q in quiz:
                qid = q["id"]
                user_choice_id = answers.get(qid)
                selected_option = next((opt for opt in q["options"] if opt["id"] == user_choice_id), None)
                correct_option = next((opt for opt in q["options"] if opt.get("is_correct")), None)

                is_correct = bool(selected_option and selected_option.get("is_correct"))
                if is_correct:
                    correct_count += 1
                else:
                    gap_concept = selected_option.get("concept_gap") if selected_option else q.get("tests_concept")
                    if gap_concept and gap_concept not in gaps_detected:
                        gaps_detected.append(gap_concept)
                    if selected_option and selected_option.get("misconception"):
                        misconceptions.append({
                            "question_id": qid,
                            "misconception": selected_option["misconception"]
                        })

                answered_details.append({
                    "question_id": qid,
                    "user_answer": user_choice_id,
                    "is_correct": is_correct,
                    "tested_concept": q.get("tests_concept"),
                    "correct_option_id": correct_option["id"] if correct_option else None
                })

            # Identify ROOT CAUSE: Lowest prerequisite in the dependency order that failed
            root_cause_concept = None
            nodes_by_id = {n["id"]: n for n in topic["nodes"]}
            for node in topic["nodes"]:
                if node["id"] in gaps_detected:
                    root_cause_concept = node["id"]
                    break

            if not root_cause_concept and gaps_detected:
                root_cause_concept = gaps_detected[0]

            score_percent = int((correct_count / total_questions) * 100) if total_questions > 0 else 0

            root_node_info = nodes_by_id.get(root_cause_concept) if root_cause_concept else None

            result = {
                "topic_id": topic_id,
                "score": score_percent,
                "correct_count": correct_count,
                "total_questions": total_questions,
                "gaps_detected": gaps_detected,
                "root_cause_concept": root_cause_concept,
                "root_node_info": root_node_info,
                "misconceptions": misconceptions,
                "answered_details": answered_details,
                "status": "mastered" if score_percent == 100 else ("mild_gap" if score_percent >= 66 else "critical_gap")
            }
            self.send_json(result)
            return

        elif path == "/api/recovery-path":
            topic_id = body.get("topic_id", "math_fractions")
            root_cause = body.get("root_cause", "equal_parts")
            daily_minutes = int(body.get("daily_minutes", 20))
            language = body.get("language", "en")
            topic = TOPICS_DATA.get(topic_id, TOPICS_DATA["math_fractions"])

            nodes_by_id = {n["id"]: n for n in topic["nodes"]}
            plan_steps = []

            # Step 1: Root Cause Foundational Repair
            root_node = nodes_by_id.get(root_cause, topic["nodes"][0])
            plan_steps.append({
                "step": 1,
                "day": 1,
                "type": "foundation_repair",
                "badge": "Root Cause Priority",
                "concept_id": root_node["id"],
                "grade": root_node["grade"],
                "title": root_node["title"].get(language, root_node["title"]["en"]),
                "estimated_minutes": min(daily_minutes, 15),
                "goal": "Rebuild the missing core understanding using everyday rural examples.",
                "local_story": root_node["local_example"].get(language, root_node["local_example"]["en"])
            })

            # Intermediate bridges
            day_counter = 2
            for node in topic["nodes"]:
                if node["id"] != root_cause and node["id"] != topic["target_concept"]:
                    plan_steps.append({
                        "step": len(plan_steps) + 1,
                        "day": day_counter,
                        "type": "bridge_concept",
                        "badge": "Connecting Bridge",
                        "concept_id": node["id"],
                        "grade": node["grade"],
                        "title": node["title"].get(language, node["title"]["en"]),
                        "estimated_minutes": daily_minutes,
                        "goal": "Connect foundational knowledge to grade-level problem solving.",
                        "local_story": node["local_example"].get(language, node["local_example"]["en"])
                    })
                    day_counter += 1

            # Final Target Step
            target_node = nodes_by_id.get(topic["target_concept"], topic["nodes"][-1])
            plan_steps.append({
                "step": len(plan_steps) + 1,
                "day": day_counter,
                "type": "target_mastery",
                "badge": "Grade Level Goal",
                "concept_id": target_node["id"],
                "grade": target_node["grade"],
                "title": target_node["title"].get(language, target_node["title"]["en"]),
                "estimated_minutes": daily_minutes,
                "goal": "Solve target chapter problems with speed, accuracy, and confidence.",
                "local_story": target_node["local_example"].get(language, target_node["local_example"]["en"])
            })

            self.send_json({
                "topic_id": topic_id,
                "daily_minutes": daily_minutes,
                "total_days": len(plan_steps),
                "plan_steps": plan_steps
            })
            return

        elif path == "/api/tutor":
            query = body.get("query", "").strip()
            topic_id = body.get("topic_id", "math_fractions")
            language = body.get("language", "en")
            active_concept = body.get("concept_id", "equal_parts")

            # Check if Gemini API key exists
            if GEMINI_API_KEY:
                try:
                    ai_reply = self.call_gemini_api(query, topic_id, language, active_concept)
                    self.send_json({
                        "reply": ai_reply,
                        "engine": "gemini_live",
                        "language": language
                    })
                    return
                except Exception as e:
                    # Fallback to smart simulator if external request fails
                    fallback_reply = self.generate_smart_simulation_response(query, topic_id, language, active_concept, error_note=str(e))
                    self.send_json({
                        "reply": fallback_reply,
                        "engine": "smart_simulator_fallback",
                        "language": language
                    })
                    return
            else:
                sim_reply = self.generate_smart_simulation_response(query, topic_id, language, active_concept)
                self.send_json({
                    "reply": sim_reply,
                    "engine": "smart_simulator",
                    "language": language
                })
                return

        elif path == "/api/progress/save":
            try:
                with open(PROGRESS_FILE, "w", encoding="utf-8") as f:
                    json.dump(body, f, indent=2, ensure_ascii=False)
                self.send_json({"success": True, "saved_at": "local_storage"})
            except Exception as e:
                self.send_json({"error": str(e)}, 500)
            return

        else:
            self.send_json({"error": "Endpoint not found"}, 404)

    def call_gemini_api(self, query, topic_id, language, concept_id):
        lang_names = {"en": "English", "te": "Telugu (తెలుగు)", "hi": "Hindi (हिन्दी)"}
        target_lang = lang_names.get(language, "English")

        system_instruction = (
            f"You are EduBridge AI, a warm, patient, and culturally relatable teacher for rural and government school students in India. "
            f"Explain concepts using simple language and vivid local analogies (farming, rotis/chapatis, kirana shops, village festivals, well water, cricket). "
            f"Always explain the underlying 'WHY' and root cause prerequisite concepts if the student is confused. "
            f"Respond strictly in {target_lang}. Keep explanations concise, encouraging, and easy to understand for young learners."
        )

        prompt_text = f"Student Question: {query}\nCurrent Topic: {topic_id}, Concept: {concept_id}"

        # Gemini 1.5 Flash endpoint
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={GEMINI_API_KEY}"
        payload = {
            "contents": [
                {"role": "user", "parts": [{"text": f"{system_instruction}\n\n{prompt_text}"}]}
            ],
            "generationConfig": {
                "temperature": 0.5,
                "maxOutputTokens": 600
            }
        }

        req = urllib.request.Request(
            url,
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=12) as response:
            result = json.loads(response.read().decode("utf-8"))
            candidate = result.get("candidates", [{}])[0]
            text = candidate.get("content", {}).get("parts", [{}])[0].get("text", "")
            return text.strip()

    def generate_smart_simulation_response(self, query, topic_id, language, concept_id, error_note=None):
        q_lower = query.lower()

        # Telugu responses
        if language == "te":
            if "roti" in q_lower or "చపాతీ" in q_lower or "రొట్టె" in q_lower or "సమాన" in q_lower or concept_id == "equal_parts":
                return (
                    "నమస్కారం! భిన్నాలలో అత్యంత ముఖ్యమైన రహస్యం 'సమాన భాగాలు'. "
                    "ఉదాహరణకు మీ అమ్మ ఒక జొన్న రొట్టెను మీకు మరియు మీ తమ్ముడికి సమానంగా సగం సగం చేస్తేనే అది 1/2 అవుతుంది. "
                    "ఒకరికి పెద్ద ముక్క, ఇంకొకరికి చిన్న ముక్క ఇస్తే అది భిన్నం కాదు! అందుకే వేర్వేరు భిన్నాలను కూడేటప్పుడు ముందుగా వాటిని సమాన భాగాలుగా (సమాన హారాలు) మార్చుకోవాలి."
                )
            elif "lcm" in q_lower or "క.సా.గు" in q_lower or concept_id == "lcm_concept":
                return (
                    "క.సా.గు (LCM) అంటే అతి చిన్న ఉమ్మడి గుణిజం! "
                    "పొలంలో రెండు మోటారు పంపులు ఉన్నాయి అనుకోండి: పంపు 'A' ప్రతి 4 గంటలకు, పంపు 'B' ప్రతి 6 గంటలకు నీరు తోడుతాయి. "
                    "రెండు పంపులు ఒకే సమయంలో ఎప్పుడు నీరు తోడుతాయి? సరిగ్గా 12 గంటల వద్ద! (4, 8, 12... మరియు 6, 12, 18...). "
                    "ఈ 12 సంఖ్యే 4 మరియు 6 ల క.సా.గు! భిన్నాలలో హారాలు సమానం చేయడానికి మనం ఈ టెక్నిక్ వాడతాం."
                )
            elif "equation" in q_lower or "సమీకరణం" in q_lower or "త్రాసు" in q_lower or "x" in q_lower:
                return (
                    "సమీకరణం అంటే కూరగాయల దుకాణంలోని త్రాసు లాంటిది! "
                    "ఎడమ వైపు 2 బస్తాల ధాన్యం + 5 కిలోల రాయి ఉండి, కుడి వైపు 15 కిలోల రాయి ఉంటే... "
                    "రెండు వైపుల నుండి 5 కిలోలు తీసేయాలి (2x = 10), ఆ తర్వాత రెండు వైపుల సగం చేయాలి (x = 5). "
                    "సమీకరణంలో సమానత్వం (=) ఎప్పుడూ బ్యాలెన్స్‌గా ఉండాలి!"
                )
            elif "మొక్క" in q_lower or "ఆకు" in q_lower or "కిరణజన్య" in q_lower:
                return (
                    "మొక్కలు తమ ఆహారాన్ని వంటగది లేకుండానే తయారు చేసుకుంటాయి! "
                    "వేర్లు భూమి నుండి నీటిని తీసుకుంటాయి, ఆకులలోని పచ్చని పత్రహరితం సూర్యరశ్మిని పట్టుకుంటుంది, "
                    "మరియు గాలి నుండి కార్బన్ డైయాక్సైడ్ తీసుకుని తియ్యని పిండి పదార్థం (గ్లూకోజ్) మరియు మనకు అవసరమైన స్వచ్ఛమైన ప్రాణవాయువు (ఆక్సిజన్) అందిస్తాయి!"
                )
            else:
                return (
                    "మీ ప్రశ్న చాలా బాగుంది! ప్రాథమిక భావనలను నేర్చుకోవడం ద్వారా ఎంత పెద్ద లెక్కనైనా సులభంగా చేయవచ్చు. "
                    "మీరు అడిగిన విషయానికి సంబంధించి: మొదట మనం అడుగు భాగంలోని మూల కారణాన్ని (Root Cause) సరిచేసుకోవాలి. "
                    "మీకు మరింత వివరణ కావాలంటే నిర్దిష్టమైన ఉదాహరణ అడగండి!"
                )

        # Hindi responses
        elif language == "hi":
            if "roti" in q_lower or "रोटी" in q_lower or "बराबर" in q_lower or concept_id == "equal_parts":
                return (
                    "नमस्ते! भिन्नों को समझने का सबसे बड़ा रहस्य है 'बराबर हिस्से'। "
                    "जैसे अगर मां एक रोटी को 4 बच्चों में बराबर बांटे तो हर बच्चे को 1/4 रोटी मिलेगी। "
                    "लेकिन अगर एक टुकड़ा बड़ा और बाकी छोटे हों, तो उसे 1/4 नहीं कहा जा सकता! "
                    "यही कारण है कि अलग-अलग हर वाले भिन्नों को जोड़ने से पहले हम उनके टुकड़ों का आकार (हर) एक जैसा बनाते हैं।"
                )
            elif "lcm" in q_lower or "ल.स.प" in q_lower or concept_id == "lcm_concept":
                return (
                    "LCM (ल.स.प.) को एक मजेदार गांव के उदाहरण से समझिए: "
                    "मान लीजिए गांव के मंदिर का बड़ा घंटा हर 4 मिनट पर बजता है और छोटा घंटा हर 6 मिनट पर। "
                    "दोनों एक साथ कब बजेंगे? 12 मिनट बाद! (4, 8, 12... और 6, 12, 18...)। "
                    "यही 12 इन दोनों का सबसे छोटा उभयनिष्ठ गुणज (LCM) है। इसका उपयोग हम भिन्नों का हर समान करने में करते हैं।"
                )
            elif "equation" in q_lower or "समीकरण" in q_lower or "तराजू" in q_lower or "x" in q_lower:
                return (
                    "समीकरण का मतलब है सब्जी मंडी का तराजू! "
                    "यदि बाईं तरफ 2 बोरी प्याज और 5 किलो का बांट है, और दाईं तरफ 15 किलो का बांट है, "
                    "तो तराजू बराबर रखने के लिए दोनों तरफ से 5 किलो घटाएं: 2x = 10. "
                    "फिर दोनों तरफ 2 से भाग दें: x = 5 किलो! यही संतुलन का मूल नियम है।"
                )
            elif "पौध" in q_lower or "पत्ती" in q_lower or "प्रकाश संश्लेषण" in q_lower:
                return (
                    "पौधे प्रकृति की अद्भुत रसोई हैं! "
                    "जड़ें मिट्टी से पानी खींचती हैं, पत्तियां धूप और हवा से कार्बन डाइऑक्साइड लेकर ग्लूकोज (भोजन) बनाती हैं "
                    "और हम सभी के सांस लेने के लिए ताजा ऑक्सीजन छोड़ती हैं। क्लोरोफिल इसमें खाना पकाने की कड़ाही जैसा काम करता है।"
                )
            else:
                return (
                    "आपका प्रश्न बहुत अच्छा है! जब तक हम पुरानी नींव को मजबूत नहीं करेंगे, तब तक आगे के पाठ कठिन लगेंगे। "
                    "हमने आपके लिए आसान स्थानीय उदाहरण तैयार किए हैं। आप किसी भी स्टेप या सवाल पर बेझिझक पूछ सकते हैं!"
                )

        # English responses
        else:
            if "roti" in q_lower or "chappati" in q_lower or "equal" in q_lower or concept_id == "equal_parts":
                return (
                    "Hello! The foundational secret to fractions is 'EXACTLY EQUAL PARTS'. "
                    "If a mother breaks a chapati into 3 pieces, but one piece is huge and two are tiny crumbs, "
                    "the child holding the big piece cannot claim they have 1/3! A fraction represents strictly equal slices. "
                    "That's why when adding 1/2 and 1/3, we first slice them into equal 6th parts (3/6 + 2/6 = 5/6)!"
                )
            elif "lcm" in q_lower or concept_id == "lcm_concept":
                return (
                    "LCM (Least Common Multiple) is simply finding the first time two repeating cycles match up! "
                    "Imagine two farmers: Farmer Ramu's water pump cycles every 4 hours, and Farmer Somu's pump cycles every 6 hours. "
                    "When do both pumps start at the exact same hour? At 12 hours! (4, 8, 12... and 6, 12, 18...). "
                    "12 is the LCM. We use this exact number to convert unlike fraction denominators to a shared size."
                )
            elif "equation" in q_lower or "balance" in q_lower or "x" in q_lower or concept_id == "scale_balance":
                return (
                    "Think of an equation as a traditional grocer's two-pan weighing scale! "
                    "If you have 2 bags of onions plus a 5kg weight on the left pan, balancing 15kg on the right pan (2x + 5 = 15): "
                    "To find what one bag weighs, remove 5kg from BOTH pans so it stays balanced (2x = 10). "
                    "Then divide both pans in half (x = 5kg per bag). Equality must always stay level!"
                )
            elif "photo" in q_lower or "plant" in q_lower or "leaf" in q_lower:
                return (
                    "Plants are nature's solar kitchen! "
                    "Roots act like straws sucking water from deep underground. Leaves catch sunlight using green chlorophyll (the stove flame). "
                    "Microscopic stomata pores breathe in Carbon Dioxide from the air. Together, they cook nutritious glucose food and release fresh Oxygen for us to breathe!"
                )
            else:
                return (
                    f"That's a fantastic question about {concept_id.replace('_', ' ').title()}! "
                    "In EduBridge AI, we look at why concepts get tricky. When you struggle with a formula, "
                    "it is usually because of a small prerequisite from an earlier grade that wasn't clear. "
                    "Let's trace it back to the root cause using everyday examples from our community!"
                )

def run_server(port=DEFAULT_PORT):
    # Ensure stdout/stderr handle UTF-8 safely on Windows
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

    # Try preferred port, or fall back to an open one
    for p in [port, 8080, 8888, 3000, 5000]:
        try:
            with socketserver.TCPServer(("", p), EduBridgeHTTPHandler) as httpd:
                print("================================================================")
                print("[*] EduBridge AI -- The Learning Gap Detector Server is RUNNING!")
                print(f"[*] Access Website: http://localhost:{p}")
                print(f"[*] Static Root: {PUBLIC_DIR}")
                print(f"[*] AI Engine Mode: {'Live Google Gemini API' if GEMINI_API_KEY else 'Smart Simulator / Built-in Engine'}")
                if not GEMINI_API_KEY:
                    print("[*] Tip: Add GEMINI_API_KEY=your_key in .env to enable live Gemini AI.")
                print("================================================================")
                httpd.serve_forever()
                break
        except OSError as e:
            if p == 5000:
                print(f"Could not bind to ports. Error: {e}")
                sys.exit(1)
            continue

if __name__ == "__main__":
    port_arg = int(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PORT
    run_server(port_arg)

