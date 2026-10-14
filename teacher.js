/**
 * EduBridge AI - Teacher Dashboard & Remedial Planning Engine
 * Aggregates classroom learning gaps, highlights common root causes across the batch,
 * and suggests tangible, low-cost remedial classroom activities for rural teachers.
 */

const TeacherDashboard = {
  currentData: null,

  async init() {
    const container = document.getElementById('teacher-container');
    if (container) {
      container.innerHTML = `
        <div class="loading-state">
          <div class="spinner"></div>
          <p>Loading classroom diagnostics and gap analytics...</p>
        </div>
      `;
    }

    const data = await window.EduBridgeAPI.getTeacherAnalytics();
    this.currentData = data;
    this.render();
  },

  render() {
    const container = document.getElementById('teacher-container');
    if (!container || !this.currentData) return;
    const d = this.currentData;

    let gapsHtml = d.gap_breakdown.map(g => {
      const isRoot = g.root_cause;
      const barColor = g.severity === 'critical' ? 'var(--color-danger)' : (g.severity === 'high' ? 'var(--color-warning)' : 'var(--color-primary)');

      return `
        <div class="teacher-gap-row ${isRoot ? 'gap-row-root' : ''}">
          <div class="gap-info">
            <div class="gap-title-group">
              <strong>${g.concept_name}</strong>
              ${isRoot ? '<span class="badge badge-root-cause">🔴 CLASS ROOT CAUSE</span>' : ''}
            </div>
            <span class="gap-subtext">${g.students_affected} of ${d.tested_students} students (${g.percent}%) struggle here</span>
          </div>

          <div class="gap-bar-wrap">
            <div class="gap-bar-fill" style="width: ${g.percent}%; background-color: ${barColor};"></div>
          </div>
        </div>
      `;
    }).join('');

    let studentsHtml = d.student_roster.map(s => {
      let statusBadge = "badge-mastered";
      if (s.status.includes('Foundational')) statusBadge = "badge-danger";
      else if (s.status.includes('Practice')) statusBadge = "badge-warning";

      return `
        <tr>
          <td><strong>${s.name}</strong></td>
          <td><span class="badge ${statusBadge}">${s.status}</span></td>
          <td><strong>${s.score}%</strong></td>
          <td><span class="gap-code">${s.root_gap}</span></td>
          <td>
            <div class="roster-progress-wrap">
              <div class="roster-progress-bar" style="width: ${s.recovery_progress}%;"></div>
              <span>${s.recovery_progress}%</span>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    container.innerHTML = `
      <div class="teacher-dashboard-wrapper">
        <div class="teacher-header-banner">
          <div class="teacher-header-title">
            <h2>👩‍🏫 Teacher Diagnostic Intelligence Hub</h2>
            <p>${d.class_name} • Subject: ${d.subject}</p>
          </div>
          <div class="teacher-header-actions">
            <button type="button" class="btn btn-outline" onclick="window.print()">
              🖨️ Print Remedial Plan
            </button>
          </div>
        </div>

        <!-- Metric KPI Cards -->
        <div class="teacher-kpi-grid">
          <div class="kpi-card">
            <span class="kpi-label">Tested Students</span>
            <span class="kpi-value">${d.tested_students} <small>/ ${d.total_students}</small></span>
            <span class="kpi-trend">89% diagnostic participation</span>
          </div>
          <div class="kpi-card">
            <span class="kpi-label">Batch Chapter Mastery</span>
            <span class="kpi-value ${d.mastery_rate < 50 ? 'val-danger' : 'val-good'}">${d.mastery_rate}%</span>
            <span class="kpi-trend">Needs foundational repair</span>
          </div>
          <div class="kpi-card highlight-card">
            <span class="kpi-label">Primary Root Cause Identified</span>
            <span class="kpi-value-sm">Equal Parts & Wholes (Class 4)</span>
            <span class="kpi-trend">Affects 62% of struggling students</span>
          </div>
        </div>

        <!-- Class Learning Gap Breakdown -->
        <div class="teacher-card">
          <div class="teacher-card-header">
            <h3>📊 Classroom Foundational Gap Breakdown</h3>
            <span class="card-caption">Traced through knowledge dependency graph</span>
          </div>
          <div class="gap-breakdown-list">
            ${gapsHtml}
          </div>
        </div>

        <!-- Actionable Remedial Activity Plan -->
        <div class="remedial-activity-box">
          <div class="activity-box-header">
            <div class="activity-icon">💡</div>
            <div>
              <h3>Suggested 15-Minute Classroom Remedial Activity</h3>
              <p>Designed for government & rural classrooms with zero expensive materials needed</p>
            </div>
          </div>

          <div class="activity-details">
            <h4>${d.recommended_activity.title}</h4>
            <p>${d.recommended_activity.description}</p>
            <div class="activity-materials">
              <strong>📦 Materials Needed:</strong> ${d.recommended_activity.materials_needed}
            </div>
          </div>
        </div>

        <!-- Student Roster Table -->
        <div class="teacher-card">
          <div class="teacher-card-header">
            <h3>📋 Student-by-Student Root Gap Roster</h3>
            <span class="card-caption">Shows exact prerequisite where each student is blocked</span>
          </div>

          <div class="table-responsive">
            <table class="roster-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Diagnostic Status</th>
                  <th>Assessment Score</th>
                  <th>Identified Root Gap</th>
                  <th>Recovery Progress</th>
                </tr>
              </thead>
              <tbody>
                ${studentsHtml}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  }
};

window.TeacherDashboard = TeacherDashboard;
