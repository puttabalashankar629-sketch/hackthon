/**
 * EduBridge AI - Personalised Recovery Path Generator
 * Builds an adaptive day-by-day learning schedule targeting foundational gaps first.
 */

const RecoveryPath = {
  currentPlan: null,
  topicId: 'math_fractions',
  rootCauseId: 'equal_parts',
  dailyMinutes: 20,

  async init(topicId, rootCauseId) {
    this.topicId = topicId || 'math_fractions';
    this.rootCauseId = rootCauseId || 'equal_parts';
    await this.generatePlan(this.topicId, this.rootCauseId, this.dailyMinutes);
  },

  async generatePlan(topicId, rootCauseId, dailyMinutes) {
    this.topicId = topicId || this.topicId;
    this.rootCauseId = rootCauseId || this.rootCauseId;
    this.dailyMinutes = dailyMinutes || this.dailyMinutes;
    const lang = window.App?.currentLanguage || 'en';

    const container = document.getElementById('recovery-path-container');
    if (container) {
      container.innerHTML = `
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Customizing your personalized recovery roadmap...</p>
        </div>
      `;
    }

    const plan = await window.EduBridgeAPI.getRecoveryPath(this.topicId, this.rootCauseId, this.dailyMinutes, lang);
    this.currentPlan = plan;
    this.renderPlan(plan);
  },

  renderPlan(plan) {
    const container = document.getElementById('recovery-path-container');
    if (!container) return;
    const lang = window.App?.currentLanguage || 'en';
    const completedSteps = window.App?.studentProgress?.completedPlanSteps || {};
    const totalSteps = plan.plan_steps.length;
    const completedCount = plan.plan_steps.filter(s => completedSteps[`step_${s.step}`]).length;
    const progressPercent = Math.round((completedCount / totalSteps) * 100);

    let stepsHtml = plan.plan_steps.map(step => {
      const isDone = !!completedSteps[`step_${step.step}`];
      const isRoot = step.type === 'foundation_repair';
      const isTarget = step.type === 'target_mastery';

      return `
        <div class="recovery-step-card ${isDone ? 'step-completed' : ''} ${isRoot ? 'step-root' : ''}">
          <div class="step-sidebar">
            <div class="step-day-pill">Day ${step.day}</div>
            <div class="step-duration">⏱️ ${step.estimated_minutes} min</div>
            <button type="button" class="btn-check-step ${isDone ? 'checked' : ''}" data-step-id="step_${step.step}">
              ${isDone ? '✓ Completed' : '○ Mark Done'}
            </button>
          </div>

          <div class="step-content">
            <div class="step-tags">
              <span class="badge ${isRoot ? 'badge-root-cause' : (isTarget ? 'badge-target' : 'badge-bridge')}">
                ${step.badge}
              </span>
              <span class="step-grade-tag">${step.grade}</span>
            </div>

            <h3 class="step-title">${step.title}</h3>
            <p class="step-goal">🎯 <strong>Learning Goal:</strong> ${step.goal}</p>

            <div class="step-story-snippet">
              <span class="story-icon">🌾</span>
              <em>"${step.local_story}"</em>
            </div>

            <div class="step-actions">
              <button type="button" class="btn btn-sm btn-primary" onclick="TreeView.highlightRootCause('${step.concept_id}'); window.App.switchTab('tree');">
                🌳 View in Knowledge Tree
              </button>
              <button type="button" class="btn btn-sm btn-secondary" onclick="PracticeEngine.startPracticeForConcept('${this.topicId}', '${step.concept_id}'); window.App.switchTab('practice');">
                ✏️ Practise Questions (+50 XP)
              </button>
              <button type="button" class="btn btn-sm btn-voice" onclick="EduBridgeTutor.speak(\`${step.local_story.replace(/"/g, '&quot;').replace(/`/g, '\\`')}\`, '${lang}')">
                🔊 Audio Story
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="recovery-path-wrapper">
        <div class="recovery-header-card">
          <div class="recovery-header-left">
            <h2>🛣️ Personalised Foundational Recovery Path</h2>
            <p>A science-backed, step-by-step roadmap to repair root knowledge gaps and conquer your class syllabus.</p>
          </div>

          <div class="recovery-customizer">
            <label for="time-slider"><strong>Available Daily Study Time:</strong> <span id="time-val">${this.dailyMinutes} Minutes/Day</span></label>
            <input type="range" id="time-slider" min="10" max="60" step="5" value="${this.dailyMinutes}">
          </div>
        </div>

        <div class="recovery-progress-card">
          <div class="progress-info-row">
            <span><strong>Roadmap Progress:</strong> ${completedCount} of ${totalSteps} milestones finished</span>
            <span class="recovery-xp-badge">⚡ ${completedCount * 50} / ${totalSteps * 50} XP Earned</span>
          </div>
          <div class="recovery-bar">
            <div class="recovery-bar-fill" style="width: ${progressPercent}%;"></div>
          </div>
        </div>

        <div class="recovery-steps-list">
          ${stepsHtml}
        </div>
      </div>
    `;

    // Time slider event
    const slider = container.querySelector('#time-slider');
    if (slider) {
      slider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value);
        container.querySelector('#time-val').textContent = `${val} Minutes/Day`;
      });
      slider.addEventListener('change', (e) => {
        this.dailyMinutes = parseInt(e.target.value);
        this.generatePlan(this.topicId, this.rootCauseId, this.dailyMinutes);
      });
    }

    // Step check buttons
    container.querySelectorAll('.btn-check-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const stepId = btn.getAttribute('data-step-id');
        const completed = window.App?.studentProgress?.completedPlanSteps || {};
        completed[stepId] = !completed[stepId];
        if (window.App) {
          window.App.studentProgress.completedPlanSteps = completed;
          window.App.saveProgress();
        }
        this.renderPlan(this.currentPlan);
      });
    });
  }
};

window.RecoveryPath = RecoveryPath;
