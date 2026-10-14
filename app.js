/**
 * EduBridge AI - Main Application Controller
 * Orchestrates navigation, state, language localization, topics, and gamification.
 */

const App = {
  currentTab: 'home',
  currentLanguage: 'en', // 'en' | 'te' | 'hi'
  currentGrade: 'Class 6',
  currentSubject: 'Mathematics',
  currentTopicId: 'math_fractions',
  lastDiagnosticResult: null,

  studentProgress: {
    xp: 140,
    streak: 3,
    masteredCount: 2,
    mastery: {
      "equal_parts": false,
      "factors_multiplication": true,
      "plant_parts_functions": true
    },
    completedPlanSteps: {
      "step_1": false
    },
    badges: [
      { id: "root_detective", name: "Root Detective", icon: "🔍", desc: "Discovered an earlier grade learning gap" },
      { id: "village_explorer", name: "Village Explorer", icon: "🌾", desc: "Learned math using rural life examples" }
    ]
  },

  translations: {
    en: {
      app_title: "EduBridge AI",
      tagline: "The Learning Gap Detector",
      hero_title: "Discover WHY you struggle with a topic, not just what marks you got.",
      hero_desc: "EduBridge AI traces missing concepts from earlier classes, explains lessons through village & daily life examples, and builds your personalized recovery roadmap in your mother tongue.",
      nav_home: "🏠 Home",
      nav_diagnostic: "⚡ Diagnostic",
      nav_tree: "🌳 Root Cause Tree",
      nav_recovery: "🛣️ Recovery Path",
      nav_practice: "✏️ Practice",
      nav_tutor: "🤖 AI Tutor",
      nav_teacher: "👩‍🏫 Teacher View",
      nav_progress: "🏆 Progress",
      start_diag: "Start Diagnostic Quiz →",
      select_class: "Select Class:",
      select_subject: "Subject:",
      btn_speak: "🎙️ Speak Doubt",
      btn_listen: "🔊 Listen"
    },
    te: {
      app_title: "ఎడ్యుబ్రిడ్జ్ AI",
      tagline: "మూల కారణాన్ని కనుగొనే లెర్నింగ్ గ్యాప్ డిటెక్టర్",
      hero_title: "మీకు మార్కులు ఎన్ని వచ్చాయో కాదు, ఏ పాఠంలో ఎందుకు ఇబ్బంది పడుతున్నారో కనుగొనండి.",
      hero_desc: "మునుపటి తరగతులలో మిగిలిపోయిన ప్రాథమిక భావనలను గుర్తించి, మన ఊరు, వ్యవసాయం మరియు నిత్యజీవిత ఉదాహరణలతో సులభంగా నేర్చుకోండి.",
      nav_home: "🏠 హోమ్",
      nav_diagnostic: "⚡ పరీక్ష",
      nav_tree: "🌳 రూట్ కాజ్ ట్రీ",
      nav_recovery: "🛣️ రికవరీ ప్రణాళిక",
      nav_practice: "✏️ సాధన",
      nav_tutor: "🤖 AI టీచర్",
      nav_teacher: "👩‍🏫 ఉపాధ్యాయులు",
      nav_progress: "🏆 ప్రగతి",
      start_diag: "డయాగ్నోస్టిక్ పరీక్ష ప్రారంభించండి →",
      select_class: "తరగతిని ఎంచుకోండి:",
      select_subject: "విషయం:",
      btn_speak: "🎙️ సందేహం అడగండి",
      btn_listen: "🔊 వినండి"
    },
    hi: {
      app_title: "एड्युब्रिज AI",
      tagline: "लर्निंग गैप डिटेक्टर — सीखने की कमियों की जड़ खोजें",
      hero_title: "केवल नंबर नहीं, यह जानिए कि किसी टॉपिक में कठिनाई क्यों आ रही है।",
      hero_desc: "पिछली कक्षाओं की छूटी हुई बुनियादी बातों की पहचान करें, गांव और दैनिक जीवन के आसान उदाहरणों से सीखें और अपनी भाषा में आगे बढ़ें।",
      nav_home: "🏠 होम",
      nav_diagnostic: "⚡ जांच परीक्षा",
      nav_tree: "🌳 ज्ञान का पेड़",
      nav_recovery: "🛣️ रिकवरी प्लान",
      nav_practice: "✏️ अभ्यास",
      nav_tutor: "🤖 AI ट्यूटर",
      nav_teacher: "👩‍🏫 शिक्षक डैशबोर्ड",
      nav_progress: "🏆 प्रगति",
      start_diag: "जांच परीक्षा शुरू करें →",
      select_class: "कक्षा चुनें:",
      select_subject: "विषय:",
      btn_speak: "🎙️ बोलकर पूछें",
      btn_listen: "🔊 सुनें"
    }
  },

  async init() {
    this.loadState();
    await window.EduBridgeAPI.init();
    window.AccessibilityManager?.init();
    window.EduBridgeTutor?.init();

    this.bindEvents();
    this.updateLanguageUI();
    this.renderSubjectExplorer();
    this.updateStatsUI();

    // Check if user came via query params or default
    this.switchTab('home');

    // Display AI mode badge
    this.updateAiEngineBadge();
  },

  updateAiEngineBadge() {
    const badge = document.getElementById('ai-engine-status-badge');
    if (!badge) return;
    if (window.EduBridgeAPI.serverAvailable && window.EduBridgeAPI.apiMode === 'live_gemini') {
      badge.className = "engine-pill engine-live";
      badge.innerHTML = `✨ Google Gemini AI Connected`;
    } else {
      badge.className = "engine-pill engine-sim";
      badge.innerHTML = `🧠 Smart Interactive Knowledge Engine`;
      badge.title = "Built-in curriculum inference engine. Connect GEMINI_API_KEY in .env for live Gemini calls.";
    }
  },

  bindEvents() {
    // Nav tabs
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    // Language dropdown
    const langSelect = document.getElementById('select-language');
    if (langSelect) {
      langSelect.value = this.currentLanguage;
      langSelect.addEventListener('change', (e) => {
        this.setLanguage(e.target.value);
      });
    }

    // Class selection
    const classSelect = document.getElementById('select-class');
    if (classSelect) {
      classSelect.addEventListener('change', (e) => {
        this.currentGrade = e.target.value;
        this.renderSubjectExplorer();
      });
    }

    // Voice assistant floating button
    document.getElementById('floating-voice-btn')?.addEventListener('click', () => {
      this.switchTab('tutor');
      window.EduBridgeTutor?.toggleVoiceRecognition();
    });

    // Tutor Send Button
    document.getElementById('btn-tutor-send')?.addEventListener('click', () => {
      window.EduBridgeTutor?.handleSend();
    });

    // Tutor Input Enter Key
    document.getElementById('tutor-input-text')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        window.EduBridgeTutor?.handleSend();
      }
    });

    // Tutor Mic Button
    document.getElementById('btn-mic-toggle')?.addEventListener('click', () => {
      window.EduBridgeTutor?.toggleVoiceRecognition();
    });

    // Hero diagnostic button
    document.getElementById('btn-hero-start-diag')?.addEventListener('click', () => {
      this.startDiagnosticForTopic(this.currentTopicId);
    });

    // Hero tree button
    document.getElementById('btn-hero-view-tree')?.addEventListener('click', () => {
      this.switchTab('tree');
      window.TreeView?.init(this.currentTopicId);
    });
  },

  switchTab(tabName) {
    this.currentTab = tabName;

    // Update nav active states
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(sec => {
      sec.style.display = 'none';
    });

    // Show active view section
    const targetSec = document.getElementById(`view-${tabName}`);
    if (targetSec) {
      targetSec.style.display = 'block';
    }

    // Trigger tab specific initializers
    if (tabName === 'diagnostic') {
      window.DiagnosticEngine?.init(this.currentTopicId);
    } else if (tabName === 'tree') {
      window.TreeView?.init(this.currentTopicId);
    } else if (tabName === 'recovery') {
      const rootCause = this.lastDiagnosticResult?.root_cause_concept || 'equal_parts';
      window.RecoveryPath?.init(this.currentTopicId, rootCause);
    } else if (tabName === 'practice') {
      const rootCause = this.lastDiagnosticResult?.root_cause_concept || 'equal_parts';
      window.PracticeEngine?.init(this.currentTopicId, rootCause);
    } else if (tabName === 'teacher') {
      window.TeacherDashboard?.init();
    } else if (tabName === 'progress') {
      this.renderProgressView();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  setLanguage(langCode) {
    this.currentLanguage = langCode;
    try {
      localStorage.setItem('edubridge_lang', langCode);
    } catch (e) {}

    this.updateLanguageUI();
    this.renderSubjectExplorer();

    // Refresh current view if open
    if (this.currentTab === 'diagnostic') {
      window.DiagnosticEngine?.renderQuiz();
    } else if (this.currentTab === 'tree') {
      window.TreeView?.render();
    } else if (this.currentTab === 'recovery') {
      window.RecoveryPath?.generatePlan(this.currentTopicId, this.lastDiagnosticResult?.root_cause_concept || 'equal_parts');
    } else if (this.currentTab === 'practice') {
      window.PracticeEngine?.render();
    }

    window.AccessibilityManager?.showToast(`Language switched to ${langCode.toUpperCase()}`);
  },

  updateLanguageUI() {
    const t = this.translations[this.currentLanguage] || this.translations.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        el.textContent = t[key];
      }
    });
  },

  renderSubjectExplorer() {
    const container = document.getElementById('topic-cards-grid');
    if (!container) return;
    const lang = this.currentLanguage;

    const topics = Object.values(window.KNOWLEDGE_BASE.topics);
    container.innerHTML = topics.map(t => `
      <div class="topic-card ${this.currentTopicId === t.id ? 'active-topic' : ''}" data-topic-id="${t.id}">
        <div class="topic-card-header">
          <span class="topic-icon">${t.icon || '📚'}</span>
          <span class="topic-grade-pill">${t.grade} • ${t.subject}</span>
        </div>
        <h3 class="topic-title">${t.title[lang] || t.title.en}</h3>
        <p class="topic-desc">${t.description[lang] || t.description.en}</p>
        <div class="topic-stats-row">
          <span>🌿 ${t.nodes.length} Foundational Concepts in Tree</span>
        </div>
        <div class="topic-actions">
          <button type="button" class="btn btn-sm btn-primary" onclick="App.startDiagnosticForTopic('${t.id}')">
            ⚡ Take Diagnostic
          </button>
          <button type="button" class="btn btn-sm btn-outline" onclick="App.viewTreeForTopic('${t.id}')">
            🌳 View Tree
          </button>
        </div>
      </div>
    `).join('');
  },

  startDiagnosticForTopic(topicId) {
    this.currentTopicId = topicId;
    this.renderSubjectExplorer();
    this.switchTab('diagnostic');
  },

  viewTreeForTopic(topicId) {
    this.currentTopicId = topicId;
    this.renderSubjectExplorer();
    this.switchTab('tree');
  },

  addXP(amount) {
    this.studentProgress.xp += amount;
    this.saveProgress();
    this.updateStatsUI();
  },

  markConceptMastered(conceptId) {
    if (!this.studentProgress.mastery[conceptId]) {
      this.studentProgress.mastery[conceptId] = true;
      this.studentProgress.masteredCount = Object.values(this.studentProgress.mastery).filter(Boolean).length;
      this.saveProgress();
      this.updateStatsUI();
    }
  },

  updateMasteryStatus(topicId, diagnosticReport) {
    if (diagnosticReport.score === 100) {
      diagnosticReport.gaps_detected = [];
    }
    this.saveProgress();
    this.updateStatsUI();
  },

  updateStatsUI() {
    const xpEl = document.getElementById('stat-user-xp');
    const masteredEl = document.getElementById('stat-user-mastered');
    const streakEl = document.getElementById('stat-user-streak');

    if (xpEl) xpEl.textContent = `${this.studentProgress.xp} XP`;
    if (masteredEl) masteredEl.textContent = `${this.studentProgress.masteredCount} Mastered`;
    if (streakEl) streakEl.textContent = `🔥 ${this.studentProgress.streak} Day Streak`;
  },

  renderProgressView() {
    const container = document.getElementById('progress-container');
    if (!container) return;
    const p = this.studentProgress;

    const badgesHtml = p.badges.map(b => `
      <div class="badge-card">
        <div class="badge-icon">${b.icon}</div>
        <div class="badge-name">${b.name}</div>
        <div class="badge-desc">${b.desc}</div>
      </div>
    `).join('');

    const masteredList = Object.entries(p.mastery).map(([k, v]) => `
      <div class="mastery-item ${v ? 'item-mastered' : 'item-repair'}">
        <span class="status-icon">${v ? '✅' : '🌱'}</span>
        <div class="mastery-info">
          <strong>${k.replace(/_/g, ' ').toUpperCase()}</strong>
          <span>${v ? 'Solid Foundation Established' : 'Currently Building Root Strength'}</span>
        </div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="progress-dashboard-view">
        <div class="progress-hero-banner">
          <div class="progress-hero-text">
            <h2>🏆 Your Learning Foundation Journey</h2>
            <p>Every tree grows tall only when its roots run deep. Track your mastered prerequisites!</p>
          </div>
          <div class="progress-hero-xp">
            <span class="xp-number">${p.xp}</span>
            <span class="xp-label">Total Experience Points</span>
          </div>
        </div>

        <div class="progress-grid">
          <div class="progress-card">
            <h3>🌱 Foundation Strength Tracker</h3>
            <div class="mastery-items-list">
              ${masteredList}
            </div>
          </div>

          <div class="progress-card">
            <h3>🎖️ Growth Mindset Badges</h3>
            <div class="badges-grid">
              ${badgesHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  saveProgress() {
    window.EduBridgeAPI.saveProgressLocally(this.studentProgress);
  },

  loadState() {
    try {
      const savedLang = localStorage.getItem('edubridge_lang');
      if (savedLang) this.currentLanguage = savedLang;

      const loaded = window.EduBridgeAPI.loadProgressLocally();
      if (loaded) {
        this.studentProgress = Object.assign(this.studentProgress, loaded);
      }
    } catch (e) {}
  }
};

window.App = App;

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();

  // Register Service Worker for offline capability
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.warn('SW registration failed:', err);
    });
  }
});
