/**
 * EduBridge AI - Diagnostic Quiz & Learning Gap Detector Engine
 * Evaluates student answers, uncovers root cause foundational gaps,
 * and presents empowering, non-judgmental feedback.
 */

const DiagnosticEngine = {
  currentTopic: null,
  currentQuestionIndex: 0,
  answers: {},
  quizContainer: null,
  resultContainer: null,

  init(topicId) {
    const topic = window.KNOWLEDGE_BASE.topics[topicId] || window.KNOWLEDGE_BASE.topics["math_fractions"];
    this.currentTopic = topic;
    this.currentQuestionIndex = 0;
    this.answers = {};
    this.renderQuiz();
  },

  renderQuiz() {
    const container = document.getElementById('diagnostic-container');
    if (!container) return;
    const lang = window.App?.currentLanguage || 'en';
    const quiz = this.currentTopic.diagnostic_quiz;
    const q = quiz[this.currentQuestionIndex];
    const totalQ = quiz.length;
    const progressPercent = Math.round(((this.currentQuestionIndex + 1) / totalQ) * 100);

    const qText = q.question[lang] || q.question.en;
    const optionsHtml = q.options.map(opt => {
      const isSelected = this.answers[q.id] === opt.id;
      const optText = opt.text[lang] || opt.text.en;
      return `
        <button type="button" class="option-btn ${isSelected ? 'selected' : ''}" data-opt-id="${opt.id}">
          <span class="opt-indicator">${opt.id.toUpperCase()}</span>
          <span class="opt-text">${optText}</span>
        </button>
      `;
    }).join('');

    container.innerHTML = `
      <div class="diagnostic-card">
        <div class="quiz-header">
          <div class="quiz-meta">
            <span class="badge badge-accent">⚡ Diagnostic Assessment</span>
            <span class="topic-tag">${this.currentTopic.subject} • ${this.currentTopic.grade}</span>
          </div>
          <div class="quiz-progress-bar">
            <div class="quiz-progress-fill" style="width: ${progressPercent}%;"></div>
          </div>
          <div class="quiz-step-info">
            <span>Question ${this.currentQuestionIndex + 1} of ${totalQ}</span>
            <span class="quiz-hint-note">🎯 Diagnostic for: <strong>${this.currentTopic.title[lang] || this.currentTopic.title.en}</strong></span>
          </div>
        </div>

        <div class="quiz-body">
          <div class="question-row">
            <h3 class="question-text" id="current-q-text">${qText}</h3>
            <button type="button" class="btn-voice-read" id="btn-read-question" title="Listen to question">
              🔊 Listen
            </button>
          </div>

          <div class="options-grid">
            ${optionsHtml}
          </div>
        </div>

        <div class="quiz-footer">
          <button type="button" class="btn btn-secondary" id="btn-prev-q" ${this.currentQuestionIndex === 0 ? 'disabled' : ''}>
            ← Previous
          </button>
          ${this.currentQuestionIndex < totalQ - 1 ? `
            <button type="button" class="btn btn-primary" id="btn-next-q" ${!this.answers[q.id] ? 'disabled' : ''}>
              Next Question →
            </button>
          ` : `
            <button type="button" class="btn btn-success" id="btn-submit-diag" ${!this.answers[q.id] ? 'disabled' : ''}>
              🔍 Analyze My Learning Gaps →
            </button>
          `}
        </div>
      </div>
    `;

    // Bind option clicks
    container.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const optId = btn.getAttribute('data-opt-id');
        this.answers[q.id] = optId;
        this.renderQuiz();
      });
    });

    // Voice button
    const readBtn = container.querySelector('#btn-read-question');
    if (readBtn) {
      readBtn.addEventListener('click', () => {
        window.EduBridgeTutor?.speak(qText, lang);
      });
    }

    // Prev / Next / Submit
    const prevBtn = container.querySelector('#btn-prev-q');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (this.currentQuestionIndex > 0) {
          this.currentQuestionIndex--;
          this.renderQuiz();
        }
      });
    }

    const nextBtn = container.querySelector('#btn-next-q');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (this.answers[q.id] && this.currentQuestionIndex < totalQ - 1) {
          this.currentQuestionIndex++;
          this.renderQuiz();
        }
      });
    }

    const submitBtn = container.querySelector('#btn-submit-diag');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        this.submitAssessment();
      });
    }
  },

  async submitAssessment() {
    const container = document.getElementById('diagnostic-container');
    if (container) {
      container.innerHTML = `
        <div class="loading-state">
          <div class="spinner"></div>
          <h3>Connecting to Learning Dependency Graph...</h3>
          <p>Analyzing root causes across earlier classes. Please wait a moment.</p>
        </div>
      `;
    }

    try {
      const result = await window.EduBridgeAPI.diagnose(this.currentTopic.id, this.answers);
      this.renderDiagnosticReport(result);
    } catch (err) {
      console.error('Diagnostic submission error:', err);
      container.innerHTML = `<p class="error-msg">Error analyzing gaps. Please try again.</p>`;
    }
  },

  renderDiagnosticReport(report) {
    const container = document.getElementById('diagnostic-container');
    if (!container) return;
    const lang = window.App?.currentLanguage || 'en';

    // Store diagnostic result in App state
    if (window.App) {
      window.App.lastDiagnosticResult = report;
      window.App.updateMasteryStatus(report.topic_id, report);
    }

    const rootNode = report.root_node_info;
    const rootTitle = rootNode ? (rootNode.title[lang] || rootNode.title.en) : "Foundational Concept";
    const rootGrade = rootNode ? rootNode.grade : "Previous Class";
    const localStory = rootNode ? (rootNode.local_example[lang] || rootNode.local_example.en) : "";

    let statusHeader = "";
    if (report.status === 'mastered') {
      statusHeader = `
        <div class="report-badge mastered">
          <span class="icon">🌟</span>
          <div>
            <h3>All Prerequisites Mastered!</h3>
            <p>You have a rock-solid foundation. You are ready to tackle advanced problems with confidence!</p>
          </div>
        </div>
      `;
    } else {
      statusHeader = `
        <div class="report-badge gap-found pulse-border">
          <span class="icon">🔍</span>
          <div>
            <div class="tag-alert">ROOT CAUSE IDENTIFIED</div>
            <h3>Foundational Learning Gap Discovered in: <strong>${rootTitle} (${rootGrade})</strong></h3>
            <p>You are having trouble with this topic not because it is hard, but because an earlier concept from ${rootGrade} needs a quick brush-up!</p>
          </div>
        </div>
      `;
    }

    let misconceptionsHtml = "";
    if (report.misconceptions && report.misconceptions.length > 0) {
      misconceptionsHtml = `
        <div class="misconception-card">
          <h4>💡 Why did this happen? (Identified Misconception)</h4>
          <ul>
            ${report.misconceptions.map(m => `<li>${m.misconception}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="diagnostic-report-card">
        <div class="report-header">
          <h2>Diagnostic Results: ${this.currentTopic.title[lang] || this.currentTopic.title.en}</h2>
          <div class="score-pill">Conceptual Clarity: <strong>${report.score}%</strong> (${report.correct_count}/${report.total_questions} Questions)</div>
        </div>

        ${statusHeader}

        ${misconceptionsHtml}

        ${rootNode ? `
          <div class="root-remedy-card">
            <div class="card-title-row">
              <h4>🌾 Learn It Through a Relatable Daily Life Example:</h4>
              <button type="button" class="btn-voice-read" id="btn-read-root-story">🔊 Listen</button>
            </div>
            <p class="story-text" id="root-story-content">"${localStory}"</p>
          </div>
        ` : ''}

        <div class="report-actions">
          <button type="button" class="btn btn-primary" id="btn-view-tree-action">
            🌳 View in Root Cause Tree →
          </button>
          <button type="button" class="btn btn-secondary" id="btn-view-path-action">
            🛣️ Open My Personalized Recovery Path →
          </button>
          <button type="button" class="btn btn-outline" id="btn-retake-diag">
            🔄 Retake Diagnostic
          </button>
        </div>
      </div>
    `;

    // Voice button for story
    const storyBtn = container.querySelector('#btn-read-root-story');
    if (storyBtn && localStory) {
      storyBtn.addEventListener('click', () => {
        window.EduBridgeTutor?.speak(localStory, lang);
      });
    }

    // Actions
    container.querySelector('#btn-view-tree-action')?.addEventListener('click', () => {
      window.App?.switchTab('tree');
      window.TreeView?.highlightRootCause(report.root_cause_concept);
    });

    container.querySelector('#btn-view-path-action')?.addEventListener('click', () => {
      window.App?.switchTab('recovery');
      window.RecoveryPath?.generatePlan(report.topic_id, report.root_cause_concept);
    });

    container.querySelector('#btn-retake-diag')?.addEventListener('click', () => {
      this.init(this.currentTopic.id);
    });
  }
};

window.DiagnosticEngine = DiagnosticEngine;
