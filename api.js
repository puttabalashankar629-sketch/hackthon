/**
 * EduBridge AI - API Client with Hybrid Online/Offline Resilience
 * Connects to Python server endpoints or executes transparently in-browser
 * when offline or in standalone low-internet mode.
 */

const EduBridgeAPI = {
  isOnline: true,
  serverAvailable: false,
  apiMode: 'smart_simulator', // 'live_gemini' | 'smart_simulator'
  baseUrl: '',

  async init() {
    try {
      const res = await fetch('/api/status', { method: 'GET', cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        this.serverAvailable = true;
        this.apiMode = data.mode;
        console.log('Connected to EduBridge Backend. Mode:', data.mode);
        return data;
      }
    } catch (err) {
      console.warn('Backend server not directly reachable; operating in Client-Engine Offline Mode.');
      this.serverAvailable = false;
      this.apiMode = 'smart_simulator';
    }
    return {
      status: 'offline_ready',
      mode: 'smart_simulator',
      has_gemini_key: false
    };
  },

  async getTopics() {
    if (this.serverAvailable) {
      try {
        const res = await fetch('/api/topics');
        if (res.ok) {
          const data = await res.json();
          return data.topics;
        }
      } catch (e) {
        console.warn('Network error fetching topics, falling back to local dataset');
      }
    }
    // Local fallback
    const list = [];
    for (const [id, t] of Object.entries(window.KNOWLEDGE_BASE.topics)) {
      list.push({
        id: t.id,
        subject: t.subject,
        grade: t.grade,
        title: t.title,
        description: t.description,
        icon: t.icon,
        node_count: t.nodes.length
      });
    }
    return list;
  },

  async getTopic(topicId) {
    if (this.serverAvailable) {
      try {
        const res = await fetch(`/api/topic/${topicId}`);
        if (res.ok) {
          const data = await res.json();
          return data.topic;
        }
      } catch (e) {
        console.warn('Network error fetching topic, falling back to local dataset');
      }
    }
    return window.KNOWLEDGE_BASE.topics[topicId] || null;
  },

  async diagnose(topicId, answers) {
    if (this.serverAvailable) {
      try {
        const res = await fetch('/api/diagnose', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic_id: topicId, answers })
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('Diagnose network error, falling back to local evaluator');
      }
    }

    // Local in-browser evaluation algorithm
    const topic = window.KNOWLEDGE_BASE.topics[topicId] || window.KNOWLEDGE_BASE.topics["math_fractions"];
    const quiz = topic.diagnostic_quiz;
    let correctCount = 0;
    const gaps = [];
    const misconceptions = [];
    const answeredDetails = [];

    quiz.forEach(q => {
      const userChoiceId = answers[q.id];
      const selectedOpt = q.options.find(o => o.id === userChoiceId);
      const correctOpt = q.options.find(o => o.is_correct);
      const isCorrect = !!(selectedOpt && selectedOpt.is_correct);

      if (isCorrect) {
        correctCount++;
      } else {
        const gap = selectedOpt?.concept_gap || q.tests_concept;
        if (gap && !gaps.includes(gap)) {
          gaps.push(gap);
        }
        if (selectedOpt?.misconception) {
          misconceptions.push({
            question_id: q.id,
            misconception: selectedOpt.misconception
          });
        }
      }

      answeredDetails.push({
        question_id: q.id,
        user_answer: userChoiceId,
        is_correct: isCorrect,
        tested_concept: q.tests_concept,
        correct_option_id: correctOpt?.id
      });
    });

    // Determine Root Cause (earliest broken prerequisite node)
    let rootCauseConcept = null;
    const nodesById = {};
    topic.nodes.forEach(n => { nodesById[n.id] = n; });

    for (const node of topic.nodes) {
      if (gaps.includes(node.id)) {
        rootCauseConcept = node.id;
        break;
      }
    }
    if (!rootCauseConcept && gaps.length > 0) {
      rootCauseConcept = gaps[0];
    }

    const score = Math.round((correctCount / quiz.length) * 100);
    return {
      topic_id: topicId,
      score: score,
      correct_count: correctCount,
      total_questions: quiz.length,
      gaps_detected: gaps,
      root_cause_concept: rootCauseConcept,
      root_node_info: nodesById[rootCauseConcept] || null,
      misconceptions: misconceptions,
      answered_details: answeredDetails,
      status: score === 100 ? 'mastered' : (score >= 66 ? 'mild_gap' : 'critical_gap')
    };
  },

  async getRecoveryPath(topicId, rootCause, dailyMinutes, language) {
    if (this.serverAvailable) {
      try {
        const res = await fetch('/api/recovery-path', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic_id: topicId,
            root_cause: rootCause,
            daily_minutes: dailyMinutes,
            language: language
          })
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('Recovery path network error, using local planner');
      }
    }

    // Local plan builder
    const topic = window.KNOWLEDGE_BASE.topics[topicId] || window.KNOWLEDGE_BASE.topics["math_fractions"];
    const nodesById = {};
    topic.nodes.forEach(n => { nodesById[n.id] = n; });
    const planSteps = [];

    // Step 1: Root Cause Foundational Repair
    const rootNode = nodesById[rootCause] || topic.nodes[0];
    planSteps.append ? null : planSteps.push({
      step: 1,
      day: 1,
      type: "foundation_repair",
      badge: "Root Cause Priority",
      concept_id: rootNode.id,
      grade: rootNode.grade,
      title: rootNode.title[language] || rootNode.title.en,
      estimated_minutes: Math.min(dailyMinutes, 15),
      goal: "Rebuild the missing core understanding using everyday rural examples.",
      local_story: rootNode.local_example[language] || rootNode.local_example.en
    });

    let dayCounter = 2;
    topic.nodes.forEach(node => {
      if (node.id !== rootCause && node.id !== topic.target_concept) {
        planSteps.push({
          step: planSteps.length + 1,
          day: dayCounter,
          type: "bridge_concept",
          badge: "Connecting Bridge",
          concept_id: node.id,
          grade: node.grade,
          title: node.title[language] || node.title.en,
          estimated_minutes: dailyMinutes,
          goal: "Connect foundational knowledge to grade-level problem solving.",
          local_story: node.local_example[language] || node.local_example.en
        });
        dayCounter++;
      }
    });

    const targetNode = nodesById[topic.target_concept] || topic.nodes[topic.nodes.length - 1];
    planSteps.push({
      step: planSteps.length + 1,
      day: dayCounter,
      type: "target_mastery",
      badge: "Grade Level Goal",
      concept_id: targetNode.id,
      grade: targetNode.grade,
      title: targetNode.title[language] || targetNode.title.en,
      estimated_minutes: dailyMinutes,
      goal: "Solve target chapter problems with speed, accuracy, and confidence.",
      local_story: targetNode.local_example[language] || targetNode.local_example.en
    });

    return {
      topic_id: topicId,
      daily_minutes: dailyMinutes,
      total_days: planSteps.length,
      plan_steps: planSteps
    };
  },

  async askTutor(query, topicId, language, conceptId) {
    if (this.serverAvailable) {
      try {
        const res = await fetch('/api/tutor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, topic_id: topicId, language, concept_id: conceptId })
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('Tutor network error, falling back to local tutor simulator');
      }
    }

    // Client-side local smart response
    return this.generateLocalTutorReply(query, language, conceptId);
  },

  generateLocalTutorReply(query, language, conceptId) {
    const q = (query || '').toLowerCase();
    let reply = "";

    if (language === 'te') {
      if (q.includes('రొట్టె') || q.includes('సమాన') || conceptId === 'equal_parts') {
        reply = "నమస్కారం! భిన్నాలలో అత్యంత ముఖ్యమైన సూత్రం 'సమాన భాగాలు'. ఒక జొన్న రొట్టెను 4 సమాన భాగాలు చేస్తేనే ప్రతి భాగం 1/4 అవుతుంది. భాగాలు సమానం కాకపోతే దానిని భిన్నం అనలేము!";
      } else if (q.includes('lcm') || q.includes('క.సా.గు') || conceptId === 'lcm_concept') {
        reply = "క.సా.గు అంటే ఉమ్మడిగా వచ్చే అతి చిన్న సంఖ్య! పొలంలో 4 గంటలకు ఒకసారి, 6 గంటలకు ఒకసారి నడిచే రెండు మోటార్లు 12వ గంట వద్ద ఒకేసారి కలుస్తాయి. అందుకే 4, 6 ల క.సా.గు 12.";
      } else if (q.includes('త్రాసు') || q.includes('x') || conceptId === 'scale_balance') {
        reply = "సమీకరణం అంటే కూరగాయల త్రాసు లాంటిది! ఎడమ వైపు ఏమి తీసివేస్తే, కుడి వైపు కూడా ఖచ్చితంగా అదే తీసివేయాలి. అప్పుడే త్రాసు సమానంగా ఉంటుంది!";
      } else {
        reply = "చాలా మంచి ప్రశ్న! లెక్కలు కష్టంగా అనిపించినప్పుడు పాత తరగతిలోని మూల సూత్రాలను గుర్తుచేసుకోవడం ద్వారా సులభంగా అర్థం చేసుకోవచ్చు. మీరు అడిగిన విషయానికి సంబంధించి మన నిజజీవిత ఉదాహరణలతో నేర్చుకుందాం!";
      }
    } else if (language === 'hi') {
      if (q.includes('रोटी') || q.includes('बराबर') || conceptId === 'equal_parts') {
        reply = "नमस्ते! भिन्नों का सबसे पहला नियम है 'बराबर हिस्से'। अगर एक रोटी को 4 बच्चों में बराबर बांटें तो ही वह 1/4 कहलाएगी। टुकड़े छोटे-बड़े होने पर उसे भिन्न नहीं कहा जा सकता!";
      } else if (q.includes('lcm') || q.includes('ल.स.प') || conceptId === 'lcm_concept') {
        reply = "LCM (ल.स.प.) का अर्थ है वह सबसे छोटी संख्या जो दोनों पहाड़ों में आए। 4 और 6 का LCM 12 है, क्योंकि 12 दोनों से विभाजित होता है!";
      } else if (q.includes('तराजू') || q.includes('x') || conceptId === 'scale_balance') {
        reply = "समीकरण बिल्कुल तराजू जैसा होता है! दोनों पलड़ों को बराबर रखने के लिए जो संख्या बाईं तरफ जोड़ें या घटाएं, वही दाईं तरफ भी करनी होगी।";
      } else {
        reply = "बहुत अच्छा सवाल! जब हम पिछली कक्षाओं की बुनियादी बातों को मजबूत कर लेते हैं, तो कठिन सवाल भी आसान लगने लगते हैं। आइए इसे गांव और दैनिक जीवन के उदाहरणों से समझें!";
      }
    } else {
      if (q.includes('roti') || q.includes('equal') || conceptId === 'equal_parts') {
        reply = "Hello! The golden rule of fractions is 'EXACTLY EQUAL PARTS'. If a roti is divided unequally, none of the pieces can be called 1/3 or 1/4. We must always have identical units before calculating!";
      } else if (q.includes('lcm') || conceptId === 'lcm_concept') {
        reply = "LCM is simply finding the first time two repeating cycles meet! If water pump A runs every 4 hours and pump B runs every 6 hours, both run together at 12 hours. 12 is their LCM!";
      } else if (q.includes('scale') || q.includes('x') || conceptId === 'scale_balance') {
        reply = "An equation is just like a balanced grocer's scale! If you take 5kg off the left pan, you MUST take 5kg off the right pan to keep the balance level. That is how we isolate 'x'!";
      } else {
        reply = "Great question! Whenever a problem seems hard, it is usually because an earlier foundational concept needs a quick brush-up. EduBridge AI traces it back to the roots!";
      }
    }

    return {
      reply: reply,
      engine: "smart_simulator_offline",
      language: language
    };
  },

  async getTeacherAnalytics() {
    if (this.serverAvailable) {
      try {
        const res = await fetch('/api/teacher/analytics');
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {}
    }
    // Static local mock for teacher
    return {
      class_name: "Class 6 - Section A (ZPHS Rural High School)",
      total_students: 38,
      tested_students: 34,
      mastery_rate: 41,
      gap_breakdown: [
        { concept_id: "equal_parts", concept_name: "Equal Parts & Wholes (Class 4 Prerequisite)", students_affected: 21, percent: 62, severity: "critical", root_cause: true },
        { concept_id: "lcm_concept", concept_name: "LCM Concept (Class 5 Prerequisite)", students_affected: 18, percent: 53, severity: "high", root_cause: false },
        { concept_id: "equivalent_fractions", concept_name: "Equivalent Fractions (Class 5 Prerequisite)", students_affected: 14, percent: 41, severity: "medium", root_cause: false },
        { concept_id: "unlike_fractions_addition", concept_name: "Target: Adding Unlike Fractions (Class 6)", students_affected: 24, percent: 71, severity: "high", root_cause: false }
      ],
      top_misconception: "68% of struggling students directly add numerators and denominators (1/2 + 1/3 = 2/5) because they don't understand the equal unit size concept from Class 4.",
      recommended_activity: {
        title: "Chappati / Paper Folding Activity (15 mins)",
        description: "Have students take rectangular notebook paper and fold one paper into 3 equal parts, and another into 4 equal parts. Show why 1 strip of thirds and 1 strip of fourths cannot simply be counted as '2 strips of fifths'. Fold both into 12 grid blocks to visually discover 7/12.",
        materials_needed: "Scrap notebook paper, pencil, ruler"
      },
      student_roster: [
        { name: "Ananya R.", status: "Mastered", score: 100, root_gap: "None", recovery_progress: 100 },
        { name: "Raju K.", status: "Needs Foundational Support", score: 25, root_gap: "Equal Parts & Wholes (Class 4)", recovery_progress: 40 },
        { name: "Pooja M.", status: "Needs Practice", score: 50, root_gap: "LCM Concept (Class 5)", recovery_progress: 65 },
        { name: "Suresh B.", status: "Needs Foundational Support", score: 25, root_gap: "Equal Parts & Wholes (Class 4)", recovery_progress: 20 },
        { name: "Divya T.", status: "Mastered", score: 100, root_gap: "None", recovery_progress: 100 },
        { name: "Venkatesh P.", status: "Needs Practice", score: 50, root_gap: "Equivalent Fractions (Class 5)", recovery_progress: 80 }
      ]
    };
  },

  saveProgressLocally(data) {
    try {
      localStorage.setItem('edubridge_student_progress', JSON.stringify(data));
      if (this.serverAvailable) {
        fetch('/api/progress/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  },

  loadProgressLocally() {
    try {
      const saved = localStorage.getItem('edubridge_student_progress');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return null;
  }
};

window.EduBridgeAPI = EduBridgeAPI;
