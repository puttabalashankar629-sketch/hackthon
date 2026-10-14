/**
 * EduBridge AI - Multilingual AI Tutor with Speech Recognition & Speech Synthesis
 * Supports Telugu (తెలుగు), Hindi (हिन्दी), and English.
 * Speaks answers aloud and listens to student voice input.
 */

const EduBridgeTutor = {
  isListening: false,
  isSpeaking: false,
  recognition: null,
  synth: null,
  chatContainer: null,
  chatMessages: [],
  selectedConceptId: 'equal_parts',
  selectedTopicId: 'math_fractions',

  init() {
    this.chatContainer = document.getElementById('tutor-messages');
    this.initSpeechServices();
    this.renderChatUI();
  },

  initSpeechServices() {
    // Web Speech API - Synthesis
    if ('speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }

    // Web Speech API - Recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;

        this.recognition.onstart = () => {
          this.isListening = true;
          this.updateMicButtonState(true);
        };

        this.recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          const inputEl = document.getElementById('tutor-input-text');
          if (inputEl) {
            inputEl.value = transcript;
            this.handleSend();
          }
        };

        this.recognition.onerror = (event) => {
          console.warn('Speech recognition event:', event.error);
          this.isListening = false;
          this.updateMicButtonState(false);
        };

        this.recognition.onend = () => {
          this.isListening = false;
          this.updateMicButtonState(false);
        };
      } catch (e) {
        console.warn('SpeechRecognition initialization error:', e);
      }
    }
  },

  updateMicButtonState(active) {
    const micBtn = document.getElementById('btn-mic-toggle');
    if (!micBtn) return;
    if (active) {
      micBtn.classList.add('mic-active');
      micBtn.innerHTML = `🎙️ <span class="pulse-ring"></span> Listening...`;
    } else {
      micBtn.classList.remove('mic-active');
      micBtn.innerHTML = `🎙️ Speak Doubt`;
    }
  },

  toggleVoiceRecognition() {
    if (!this.recognition) {
      alert("Speech Recognition is not supported by your browser or microphone access is restricted. You can type your doubt in the box!");
      return;
    }
    const lang = window.App?.currentLanguage || 'en';
    const langCodes = { 'en': 'en-IN', 'te': 'te-IN', 'hi': 'hi-IN' };
    this.recognition.lang = langCodes[lang] || 'en-IN';

    if (this.isListening) {
      this.recognition.stop();
    } else {
      try {
        this.recognition.start();
      } catch (e) {
        console.warn('Could not start recognition:', e);
      }
    }
  },

  speak(text, lang) {
    if (!this.synth) return;
    this.synth.cancel(); // Stop any ongoing speech

    const langCodes = { 'en': 'en-IN', 'te': 'te-IN', 'hi': 'hi-IN' };
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCodes[lang] || 'en-IN';
    utterance.rate = 0.9; // Slightly slower and clearer for young learners
    utterance.pitch = 1.0;

    // Pick a matching voice if available
    const voices = this.synth.getVoices();
    const voiceMatch = voices.find(v => v.lang.startsWith(utterance.lang) || v.lang.includes(lang));
    if (voiceMatch) {
      utterance.voice = voiceMatch;
    }

    utterance.onstart = () => { this.isSpeaking = true; };
    utterance.onend = () => { this.isSpeaking = false; };
    utterance.onerror = () => { this.isSpeaking = false; };

    this.synth.speak(utterance);
  },

  stopSpeaking() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  },

  promptConcept(node) {
    const lang = window.App?.currentLanguage || 'en';
    const title = node.title[lang] || node.title.en;
    this.selectedConceptId = node.id;
    const prompts = {
      en: `Can you explain ${title} with a village or farming example?`,
      te: `దయచేసి ${title} గురించి మన పల్లెటూరి లేదా వ్యవసాయ ఉదాహరణతో వివరించగలరా?`,
      hi: `कृपया मुझे ${title} के बारे में गांव या खेती से जुड़ा कोई आसान उदाहरण देकर समझाइए?`
    };
    const inputEl = document.getElementById('tutor-input-text');
    if (inputEl) {
      inputEl.value = prompts[lang] || prompts.en;
      this.handleSend();
    }
  },

  renderChatUI() {
    const container = document.getElementById('tutor-messages');
    if (!container) return;
    const lang = window.App?.currentLanguage || 'en';

    if (this.chatMessages.length === 0) {
      // Welcome message
      const welcomes = {
        en: "Namaste! I am your EduBridge AI Learning Companion. Ask me any doubt in English, Telugu, or Hindi. I love explaining math and science through village stories, rotis, farming, and cricket! You can also click the microphone to speak.",
        te: "నమస్కారం! నేను మీ EduBridge AI సహాయకురాలిని. మీకు గణితం లేదా సైన్స్‌లో ఎలాంటి సందేహం ఉన్నా తెలుగులో నన్ను అడగండి. జొన్న రొట్టెలు, పంట పొలాలు, మరియు నిజజీవిత ఉదాహరణలతో సులభంగా వివరిస్తాను! మైక్ బటన్ నొక్కి కూడా మాట్లాడవచ్చు.",
        hi: "नमस्ते! मैं आपका EduBridge AI साथी हूँ। गणित या विज्ञान में कोई भी उलझन हो, बेझिझक पूछिए। मैं रोटी, खेती, तराजू और गांव के मजेदार उदाहरणों से समझाऊंगा! आप माइक बटन दबाकर बोल भी सकते हैं।"
      };
      this.chatMessages.push({
        sender: 'ai',
        text: welcomes[lang] || welcomes.en,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    container.innerHTML = this.chatMessages.map(msg => `
      <div class="chat-bubble ${msg.sender === 'user' ? 'bubble-user' : 'bubble-ai'}">
        <div class="bubble-meta">
          <span class="bubble-sender">${msg.sender === 'user' ? '👤 Student' : '🤖 EduBridge Tutor'}</span>
          <span class="bubble-time">${msg.time}</span>
        </div>
        <div class="bubble-content">
          ${msg.text}
        </div>
        ${msg.sender === 'ai' ? `
          <div class="bubble-actions">
            <button type="button" class="btn-voice-small" onclick="EduBridgeTutor.speak(\`${msg.text.replace(/"/g, '&quot;').replace(/`/g, '\\`')}\`, '${lang}')">
              🔊 Read Aloud
            </button>
          </div>
        ` : ''}
      </div>
    `).join('');

    container.scrollTop = container.scrollHeight;
  },

  async handleSend() {
    const inputEl = document.getElementById('tutor-input-text');
    if (!inputEl) return;
    const query = inputEl.value.trim();
    if (!query) return;

    const lang = window.App?.currentLanguage || 'en';
    const topicId = window.App?.currentTopicId || 'math_fractions';

    // Add user message to log
    this.chatMessages.push({
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    inputEl.value = '';
    this.renderChatUI();

    // Show AI typing indicator
    const container = document.getElementById('tutor-messages');
    const typingId = `typing-${Date.now()}`;
    const typingEl = document.createElement('div');
    typingEl.id = typingId;
    typingEl.className = 'chat-bubble bubble-ai bubble-typing';
    typingEl.innerHTML = `
      <div class="bubble-meta"><span>🤖 EduBridge AI</span></div>
      <div class="typing-dots"><span></span><span></span><span></span></div>
    `;
    container.appendChild(typingEl);
    container.scrollTop = container.scrollHeight;

    try {
      const response = await window.EduBridgeAPI.askTutor(query, topicId, lang, this.selectedConceptId);
      const replyText = response.reply || "I am thinking through this concept...";

      // Remove typing indicator
      const typingNode = document.getElementById(typingId);
      if (typingNode) typingNode.remove();

      this.chatMessages.push({
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.renderChatUI();

      // Automatically speak the response
      this.speak(replyText, lang);
    } catch (err) {
      console.error('Tutor error:', err);
      const typingNode = document.getElementById(typingId);
      if (typingNode) typingNode.remove();

      this.chatMessages.push({
        sender: 'ai',
        text: "I'm having a brief connection pause, but remember: learning is all about building strong foundations step by step!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      this.renderChatUI();
    }
  }
};

window.EduBridgeTutor = EduBridgeTutor;
