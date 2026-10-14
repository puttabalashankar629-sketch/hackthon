/**
 * EduBridge AI - Accessibility & Low-Internet Mode Controller
 * Handles Font Scaling (A-/A/A+), High-Contrast Mode, and Offline Caching.
 */

const AccessibilityManager = {
  fontScaleIndex: 1, // 0: Small (14px), 1: Normal (16px), 2: Large (18px), 3: Extra Large (20px)
  fontScales: ['font-sm', 'font-md', 'font-lg', 'font-xl'],
  isHighContrast: false,
  isLowInternet: false,

  init() {
    this.loadPreferences();
    this.bindEvents();
    this.updateStatusBadges();
  },

  loadPreferences() {
    try {
      const savedFont = localStorage.getItem('edubridge_font_scale');
      if (savedFont !== null) {
        this.fontScaleIndex = parseInt(savedFont, 10);
      }
      this.isHighContrast = localStorage.getItem('edubridge_contrast') === 'true';
      this.isLowInternet = localStorage.getItem('edubridge_low_internet') === 'true';

      this.applyFontScale();
      this.applyHighContrast();
      this.applyLowInternet();
    } catch (e) {}
  },

  bindEvents() {
    // Font decrease
    document.getElementById('btn-font-dec')?.addEventListener('click', () => {
      if (this.fontScaleIndex > 0) {
        this.fontScaleIndex--;
        this.applyFontScale();
      }
    });

    // Font reset
    document.getElementById('btn-font-reset')?.addEventListener('click', () => {
      this.fontScaleIndex = 1;
      this.applyFontScale();
    });

    // Font increase
    document.getElementById('btn-font-inc')?.addEventListener('click', () => {
      if (this.fontScaleIndex < this.fontScales.length - 1) {
        this.fontScaleIndex++;
        this.applyFontScale();
      }
    });

    // High Contrast Toggle
    document.getElementById('btn-contrast-toggle')?.addEventListener('click', () => {
      this.isHighContrast = !this.isHighContrast;
      this.applyHighContrast();
    });

    // Low Internet Toggle
    document.getElementById('btn-low-internet-toggle')?.addEventListener('click', () => {
      this.isLowInternet = !this.isLowInternet;
      this.applyLowInternet();
      this.showToast(this.isLowInternet ? "📶 Low-Internet Mode Activated (Saving data & offline caching enabled)" : "🌐 Standard Online Mode Restored");
    });

    // Network status listener
    window.addEventListener('online', () => {
      this.updateStatusBadges();
      this.showToast("🌐 Network connection restored!");
    });
    window.addEventListener('offline', () => {
      this.isLowInternet = true;
      this.applyLowInternet();
      this.updateStatusBadges();
      this.showToast("⚠️ Device is offline. EduBridge local cache is active!");
    });
  },

  applyFontScale() {
    const root = document.documentElement;
    this.fontScales.forEach(cls => root.classList.remove(cls));
    root.classList.add(this.fontScales[this.fontScaleIndex]);
    try {
      localStorage.setItem('edubridge_font_scale', this.fontScaleIndex.toString());
    } catch (e) {}
  },

  applyHighContrast() {
    const root = document.documentElement;
    if (this.isHighContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    const btn = document.getElementById('btn-contrast-toggle');
    if (btn) {
      btn.innerHTML = this.isHighContrast ? '👁️ Standard' : '👁️ High Contrast';
    }
    try {
      localStorage.setItem('edubridge_contrast', this.isHighContrast.toString());
    } catch (e) {}
  },

  applyLowInternet() {
    const banner = document.getElementById('low-internet-indicator');
    const toggleBtn = document.getElementById('btn-low-internet-toggle');
    if (banner) {
      banner.style.display = this.isLowInternet ? 'flex' : 'none';
    }
    if (toggleBtn) {
      toggleBtn.className = this.isLowInternet ? 'btn-nav-tool tool-active' : 'btn-nav-tool';
      toggleBtn.title = this.isLowInternet ? 'Low-Internet Mode Active' : 'Toggle Low-Internet Mode';
    }
    try {
      localStorage.setItem('edubridge_low_internet', this.isLowInternet.toString());
    } catch (e) {}
  },

  updateStatusBadges() {
    const onlineBadge = document.getElementById('network-status-badge');
    if (!onlineBadge) return;
    if (navigator.onLine) {
      onlineBadge.className = "network-pill online";
      onlineBadge.innerHTML = `<span class="dot"></span> Online`;
    } else {
      onlineBadge.className = "network-pill offline";
      onlineBadge.innerHTML = `<span class="dot"></span> Offline Cache Active`;
    }
  },

  showToast(message) {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.className = 'app-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }
};

window.AccessibilityManager = AccessibilityManager;
