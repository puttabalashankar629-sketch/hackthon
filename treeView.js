/**
 * EduBridge AI - Root Cause Learning Tree (Special Hackathon Feature)
 * Visually renders concept dependencies from earlier grades to current lesson.
 * Traces and highlights the exact root prerequisite that caused the learning gap.
 */

const TreeView = {
  currentTopic: null,
  activeNodeId: null,
  highlightedRootId: null,
  container: null,

  init(topicId) {
    const topic = window.KNOWLEDGE_BASE.topics[topicId] || window.KNOWLEDGE_BASE.topics["math_fractions"];
    this.currentTopic = topic;
    this.render();
  },

  highlightRootCause(nodeId) {
    this.highlightedRootId = nodeId;
    this.activeNodeId = nodeId;
    this.render();
    setTimeout(() => {
      this.openNodeDrawer(nodeId);
      const el = document.getElementById(`tree-node-${nodeId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 200);
  },

  render() {
    this.container = document.getElementById('tree-view-container');
    if (!this.container) return;
    const lang = window.App?.currentLanguage || 'en';
    const topic = this.currentTopic;
    const nodes = topic.nodes;
    const masteryState = window.App?.studentProgress?.mastery || {};

    // Group nodes by level or prerequisite depth
    const levels = {};
    nodes.forEach(n => {
      const lvl = n.level || (n.is_root ? 1 : 2);
      if (!levels[lvl]) levels[lvl] = [];
      levels[lvl].push(n);
    });

    const sortedLevels = Object.keys(levels).sort((a, b) => parseInt(a) - parseInt(b));

    let html = `
      <div class="tree-wrapper">
        <div class="tree-controls-bar">
          <div class="tree-title-group">
            <h3>🌳 Root Cause Knowledge Tree</h3>
            <span class="topic-subtitle">${topic.title[lang] || topic.title.en}</span>
          </div>

          <div class="tree-legend">
            <span class="legend-item"><span class="legend-dot root-gap"></span> Root Cause Gap</span>
            <span class="legend-item"><span class="legend-dot mastered"></span> Mastered</span>
            <span class="legend-item"><span class="legend-dot in-progress"></span> Current Focus</span>
            <span class="legend-item"><span class="legend-dot target"></span> Chapter Goal</span>
          </div>
        </div>

        <div class="tree-viewport" id="tree-viewport">
          <div class="tree-levels-column">
    `;

    sortedLevels.forEach(lvl => {
      const lvlNodes = levels[lvl];
      const isRootLevel = (lvl === "1");
      const isTargetLevel = (lvl === sortedLevels[sortedLevels.length - 1]);

      let levelLabel = `Class ${isRootLevel ? '4 (Foundational)' : (isTargetLevel ? '6/7 (Target Goal)' : '5 (Bridge)')}`;

      html += `
        <div class="tree-tier">
          <div class="tier-badge">
            <span class="tier-num">Level ${lvl}</span>
            <span class="tier-desc">${levelLabel}</span>
          </div>

          <div class="tier-nodes-row">
      `;

      lvlNodes.forEach(node => {
        const isRootCause = (this.highlightedRootId === node.id);
        const isMastered = !!masteryState[node.id];
        const isTarget = (node.id === topic.target_concept);

        let statusClass = "node-normal";
        let statusBadge = node.grade;

        if (isRootCause) {
          statusClass = "node-root-cause-gap pulse-root";
          statusBadge = "⚠️ ROOT CAUSE GAP";
        } else if (isMastered) {
          statusClass = "node-mastered";
          statusBadge = "✓ Mastered";
        } else if (isTarget) {
          statusClass = "node-target";
          statusBadge = "🎯 Chapter Goal";
        }

        html += `
          <div class="tree-node-card ${statusClass}" id="tree-node-${node.id}" data-node-id="${node.id}">
            <div class="node-card-top">
              <span class="node-grade-tag">${statusBadge}</span>
              <span class="node-icon">${node.is_root ? '🌱' : (isTarget ? '🏆' : '🔗')}</span>
            </div>
            <h4 class="node-title">${node.title[lang] || node.title.en}</h4>
            <p class="node-summary">${(node.description[lang] || node.description.en).substring(0, 85)}...</p>
            <div class="node-click-prompt">
              <span>👉 Click to Inspect & Learn</span>
            </div>
          </div>
        `;
      });

      html += `
          </div>
        </div>
      `;

      // Draw downward connection connector if not the last level
      if (!isTargetLevel) {
        html += `
          <div class="tree-connector-row">
            <div class="connector-arrow">
              <span class="arrow-down">⬇️ Builds into</span>
            </div>
          </div>
        `;
      }
    });

    html += `
          </div>
        </div>

        <!-- Node Inspection Drawer -->
        <div class="node-drawer" id="node-drawer">
          <div class="drawer-header">
            <div class="drawer-header-left">
              <span class="drawer-grade-pill" id="drawer-grade">Class 4</span>
              <h3 id="drawer-title">Concept Inspection</h3>
            </div>
            <button type="button" class="btn-close-drawer" id="btn-close-drawer">✕</button>
          </div>

          <div class="drawer-body">
            <div class="drawer-status-box" id="drawer-status-box"></div>

            <div class="drawer-section">
              <h4>📖 Core Explanation:</h4>
              <p id="drawer-desc"></p>
            </div>

            <div class="drawer-section local-story-box">
              <div class="story-header">
                <h4>🌾 Everyday Village / Rural Analogy:</h4>
                <button type="button" class="btn-voice-read" id="btn-read-drawer-story">🔊 Listen</button>
              </div>
              <p class="drawer-story-text" id="drawer-story"></p>
            </div>

            <div class="drawer-actions">
              <button type="button" class="btn btn-primary" id="btn-drawer-practice">
                ✏️ Practise This Concept Now
              </button>
              <button type="button" class="btn btn-secondary" id="btn-drawer-ask-tutor">
                🤖 Ask AI Tutor About This
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.innerHTML = html;

    // Attach click events on nodes
    this.container.querySelectorAll('.tree-node-card').forEach(card => {
      card.addEventListener('click', () => {
        const nodeId = card.getAttribute('data-node-id');
        this.openNodeDrawer(nodeId);
      });
    });

    // Close drawer
    this.container.querySelector('#btn-close-drawer')?.addEventListener('click', () => {
      this.closeNodeDrawer();
    });
  },

  openNodeDrawer(nodeId) {
    this.activeNodeId = nodeId;
    const lang = window.App?.currentLanguage || 'en';
    const node = this.currentTopic.nodes.find(n => n.id === nodeId);
    if (!node) return;

    const drawer = document.getElementById('node-drawer');
    if (!drawer) return;

    const titleEl = document.getElementById('drawer-title');
    const gradeEl = document.getElementById('drawer-grade');
    const descEl = document.getElementById('drawer-desc');
    const storyEl = document.getElementById('drawer-story');
    const statusBox = document.getElementById('drawer-status-box');

    const nodeTitle = node.title[lang] || node.title.en;
    const nodeDesc = node.description[lang] || node.description.en;
    const nodeStory = node.local_example[lang] || node.local_example.en;

    titleEl.textContent = nodeTitle;
    gradeEl.textContent = `${node.grade} • ${this.currentTopic.subject}`;
    descEl.textContent = nodeDesc;
    storyEl.textContent = `"${nodeStory}"`;

    const isRootGap = (this.highlightedRootId === node.id);
    const isMastered = !!window.App?.studentProgress?.mastery?.[node.id];

    if (isRootGap) {
      statusBox.className = "drawer-status-box status-root-gap";
      statusBox.innerHTML = `
        <span class="status-icon">⚠️</span>
        <div>
          <strong>Identified as Root Cause Learning Gap!</strong>
          <p>Mastering this single concept will immediately unlock the rest of the chapter.</p>
        </div>
      `;
    } else if (isMastered) {
      statusBox.className = "drawer-status-box status-mastered";
      statusBox.innerHTML = `
        <span class="status-icon">✅</span>
        <div>
          <strong>Concept Mastered!</strong>
          <p>Great job! You have already proven your mastery on this foundation.</p>
        </div>
      `;
    } else {
      statusBox.className = "drawer-status-box status-ready";
      statusBox.innerHTML = `
        <span class="status-icon">ℹ️</span>
        <div>
          <strong>Curricular Dependency Step</strong>
          <p>Essential stepping stone towards ${this.currentTopic.title[lang] || this.currentTopic.title.en}.</p>
        </div>
      `;
    }

    // Voice Narration
    const readBtn = document.getElementById('btn-read-drawer-story');
    if (readBtn) {
      readBtn.onclick = () => {
        window.EduBridgeTutor?.speak(nodeStory, lang);
      };
    }

    // Drawer Practice button
    const practiceBtn = document.getElementById('btn-drawer-practice');
    if (practiceBtn) {
      practiceBtn.onclick = () => {
        window.App?.switchTab('practice');
        window.PracticeEngine?.startPracticeForConcept(this.currentTopic.id, node.id);
      };
    }

    // Ask AI Tutor button
    const tutorBtn = document.getElementById('btn-drawer-ask-tutor');
    if (tutorBtn) {
      tutorBtn.onclick = () => {
        window.App?.switchTab('tutor');
        window.EduBridgeTutor?.promptConcept(node);
      };
    }

    drawer.classList.add('active');
  },

  closeNodeDrawer() {
    const drawer = document.getElementById('node-drawer');
    if (drawer) {
      drawer.classList.remove('active');
    }
  }
};

window.TreeView = TreeView;
