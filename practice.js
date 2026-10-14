/**
 * EduBridge AI - Adaptive Practice Engine
 * Beginner-friendly questions with 3-tier progressive hints, mistake breakdowns,
 * and culturally relatable village/rural analogies.
 */

const PracticeEngine = {
  currentTopicId: 'math_fractions',
  currentConceptId: 'equal_parts',
  currentQuestionIndex: 0,
  revealedHintsCount: 0,
  questionsList: [],

  init(topicId, conceptId) {
    this.currentTopicId = topicId || 'math_fractions';
    this.currentConceptId = conceptId || 'equal_parts';
    this.startPracticeForConcept(this.currentTopicId, this.currentConceptId);
  },

  startPracticeForConcept(topicId, conceptId) {
    this.currentTopicId = topicId;
    this.currentConceptId = conceptId;
    this.currentQuestionIndex = 0;
    this.revealedHintsCount = 0;

    const topic = window.KNOWLEDGE_BASE.topics[topicId] || window.KNOWLEDGE_BASE.topics["math_fractions"];
    const node = topic.nodes.find(n => n.id === conceptId) || topic.nodes[0];
    this.questionsList = node.practice_questions || [];

    this.render();
  },

  render() {
    const container = document.getElementById('practice-container');
    if (!container) return;
    const lang = window.App?.currentLanguage || 'en';
    const topic = window.KNOWLEDGE_BASE.topics[this.currentTopicId];
    const node = topic.nodes.find(n => n.id === this.currentConceptId) || topic.nodes[0];
    const q = this.questionsList[this.currentQuestionIndex];

    if (!q) {
      container.innerHTML = `
        <div class="practice-empty-card">
          <h3>🎉 Concept Practice Complete!</h3>
          <p>You have practiced all questions for <strong>${node.title[lang] || node.title.en}</strong>.</p>
          <button type="button" class="btn btn-primary" onclick="TreeView.highlightRootCause('${node.id}'); window.App.switchTab('tree');">
            🌳 Back to Knowledge Tree
          </button>
        </div>
      `;
      return;
    }

    const qText = q.question[lang] || q.question.en;
    const hints = q.hints || [];

    const optionsHtml = q.options.map(opt => `
      <button type="button" class="practice-opt-btn" data-opt-id="${opt.id}" data-correct="${opt.is_correct}">
        <span class="opt-indicator">${opt.id.toUpperCase()}</span>
        <span class="opt-label">${opt.text[lang] || opt.text.en}</span>
      </button>
    `).join('');

    let hintsHtml = "";
    if (this.revealedHintsCount > 0) {
      hintsHtml = `
        <div class="revealed-hints-box">
          <h4>💡 Progressive Clues:</h4>
          ${hints.slice(0, this.revealedHintsCount).map((h, i) => `
            <div class="hint-pill">
              <strong>Clue ${i + 1}:</strong> ${h[lang] || h.en}
            </div>
          `).join('')}
        </div>
      `;
    }

    container.innerHTML = `
      <div class="practice-card">
        <div class="practice-header">
          <div class="practice-concept-info">
            <span class="badge badge-concept">${node.grade} Concept</span>
            <h3>${node.title[lang] || node.title.en}</h3>
          </div>
          <div class="practice-stats">
            <span class="stat-pill">Question ${this.currentQuestionIndex + 1} of ${this.questionsList.length}</span>
            <span class="stat-xp">⚡ +20 XP on Mastery</span>
          </div>
        </div>

        <div class="practice-body">
          <div class="practice-q-row">
            <p class="practice-question">${qText}</p>
            <button type="button" class="btn-voice-read" id="btn-read-practice-q">🔊 Read Question</button>
          </div>

          <div class="practice-options-grid">
            ${optionsHtml}
          </div>

          <div class="practice-feedback-box" id="practice-feedback" style="display: none;"></div>

          ${hintsHtml}

          <div class="practice-controls-row">
            <button type="button" class="btn btn-hint" id="btn-request-hint" ${this.revealedHintsCount >= hints.length ? 'disabled' : ''}>
              💡 ${this.revealedHintsCount === 0 ? 'Need a Hint?' : `Show Next Clue (${this.revealedHintsCount}/${hints.length})`}
            </button>
            <button type="button" class="btn btn-primary" id="btn-next-practice-q" style="display: none;">
              Next Practice Question →
            </button>
          </div>
        </div>

        <div class="practice-local-reminder">
          <span class="reminder-icon">🌾</span>
          <div>
            <strong>Village Context Reminder:</strong>
            <p>${node.local_example[lang] || node.local_example.en}</p>
          </div>
        </div>
      </div>
    `;

    // Voice
    container.querySelector('#btn-read-practice-q')?.addEventListener('click', () => {
      window.EduBridgeTutor?.speak(qText, lang);
    });

    // Hints
    container.querySelector('#btn-request-hint')?.addEventListener('click', () => {
      if (this.revealedHintsCount < hints.length) {
        this.revealedHintsCount++;
        this.render();
      }
    });

    // Answer click
    container.querySelectorAll('.practice-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const isCorrect = btn.getAttribute('data-correct') === 'true';
        this.handleAnswer(btn, isCorrect, q, lang);
      });
    });

    // Next button
    container.querySelector('#btn-next-practice-q')?.addEventListener('click', () => {
      this.currentQuestionIndex++;
      this.revealedHintsCount = 0;
      this.render();
    });
  },

  handleAnswer(clickedBtn, isCorrect, question, lang) {
    const feedbackBox = document.getElementById('practice-feedback');
    const nextBtn = document.getElementById('btn-next-practice-q');
    if (!feedbackBox) return;

    // Disable all options
    document.querySelectorAll('.practice-opt-btn').forEach(btn => {
      btn.disabled = true;
      if (btn.getAttribute('data-correct') === 'true') {
        btn.classList.add('btn-is-correct');
      }
    });

    if (isCorrect) {
      clickedBtn.classList.add('btn-user-correct');
      feedbackBox.className = 'practice-feedback-box feedback-correct';
      feedbackBox.style.display = 'block';
      feedbackBox.innerHTML = `
        <div class="feedback-title">🎉 Brilliant! That is Correct (+20 XP)</div>
        <p>${question.explanation[lang] || question.explanation.en}</p>
      `;

      // Award XP & Mastery
      if (window.App) {
        window.App.addXP(20);
        window.App.markConceptMastered(this.currentConceptId);
      }
    } else {
      clickedBtn.classList.add('btn-user-wrong');
      feedbackBox.className = 'practice-feedback-box feedback-wrong';
      feedbackBox.style.display = 'block';
      feedbackBox.innerHTML = `
        <div class="feedback-title">⚠️ Let's Learn From This Mistake (No Shaming!)</div>
        <p><strong>Explanation:</strong> ${question.explanation[lang] || question.explanation.en}</p>
        <p class="mistake-encourage">Mistakes are the stepping stones of learning. Notice how the units or equal parts apply here!</p>
      `;
    }

    if (nextBtn) {
      nextBtn.style.display = 'inline-block';
    }
  }
};

window.PracticeEngine = PracticeEngine;
