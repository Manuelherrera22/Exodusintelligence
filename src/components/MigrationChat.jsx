import React, { useState, useRef, useEffect, useCallback, memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Zap, Mic, MicOff, Paperclip, X, Image as ImageIcon, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { chatWithKAI } from '@/lib/kaiAgent';
import { createEmptyProfile } from '@/lib/migrationEngine';

// ── Profile completion tracker ───────────────────────────────────────────────
const PROFILE_FIELDS = ['country', 'age', 'education', 'field', 'englishLevel', 'workYears'];

function getProfileCompletion(profile) {
  const filled = PROFILE_FIELDS.filter(f => {
    const v = profile[f];
    return v !== null && v !== undefined && v !== '' && v !== 0;
  });
  return Math.round((filled.length / PROFILE_FIELDS.length) * 100);
}

// ── Bold markdown renderer ───────────────────────────────────────────────────
function renderText(text) {
  if (!text) return null;
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

// ── Typing Orb (Soul) ────────────────────────────────────────────────────────
const TypingDots = memo(({ label }) => (
  <div className="flex items-center gap-4 mb-4 mt-2">
    <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
      <motion.div
        className="absolute inset-0 rounded-full bg-purple-500/30 blur-md"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-1.5 rounded-full bg-gradient-to-br from-purple-400 to-cyan-400 blur-sm mix-blend-screen"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      <div className="w-8 h-8 rounded-full bg-[#0a0a0d] border border-white/10 shadow-[inset_0_0_15px_rgba(168,85,247,0.4)] flex items-center justify-center relative z-10">
        <Bot className="w-4 h-4 text-white/80" />
      </div>
    </div>
    <div className="flex items-center h-10 overflow-hidden">
      <motion.span 
        initial={{ opacity: 0, x: -10 }} 
        animate={{ opacity: 1, x: 0 }} 
        className="text-[11px] text-purple-200/50 italic tracking-wide"
      >
        {label}
      </motion.span>
    </div>
  </div>
));

// ── Message bubble ───────────────────────────────────────────────────────────
const Message = memo(({ msg }) => {
  const isKai = msg.role === 'assistant';
  if (msg.role === 'system' || msg.role === 'tool') return null;
  if (!msg.content && msg.tool_calls) return null;

  // Handle multimodal content (text + image)
  const textContent = typeof msg.content === 'string'
    ? msg.content
    : Array.isArray(msg.content)
      ? msg.content.find(c => c.type === 'text')?.text || ''
      : '';
  const imageContent = Array.isArray(msg.content)
    ? msg.content.find(c => c.type === 'image_url')?.image_url?.url
    : null;

  if (!textContent && !imageContent && !msg.attachmentPreview) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`flex ${isKai ? 'items-start' : 'justify-end'} mb-4`}
    >
      {isKai && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shrink-0 mr-3 shadow-[0_0_12px_rgba(168,85,247,0.3)]">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={`max-w-[80%] rounded-2xl text-sm leading-relaxed ${isKai
          ? 'bg-white/[0.05] border border-white/[0.06] text-white/80 rounded-tl-sm'
          : 'bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white rounded-tr-sm shadow-[0_0_20px_rgba(139,92,246,0.12)]'
      }`}>
        {msg.attachmentPreview && (
          <div className="p-2 pb-0">
            <img src={msg.attachmentPreview} alt="" className="rounded-xl max-h-40 w-auto" />
          </div>
        )}
        {textContent && <div className="px-4 py-3">{isKai ? renderText(textContent) : textContent}</div>}
      </div>
      {!isKai && (
        <div className="w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center shrink-0 ml-2.5">
          <User className="w-3.5 h-3.5 text-white/40" />
        </div>
      )}
    </motion.div>
  );
});

// ── Profile Progress ─────────────────────────────────────────────────────────
const ProfileProgress = memo(({ percent, milestones }) => {
  const current = milestones.filter(m => percent >= m.at).pop();

  return (
    <div className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.04]">
      <Zap className="w-3.5 h-3.5 text-purple-400/60 shrink-0" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-white/40">{current?.label}</span>
          <span className="text-[10px] text-purple-300/50 font-semibold tabular-nums">{percent}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
            initial={{ width: 0 }}
            animate={{ width: percent + '%' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </div>
  );
});

// ── Voice Recording Hook ─────────────────────────────────────────────────────
function useVoiceInput(lang, onUpdate) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const finalTranscriptRef = useRef('');
  const manualStopRef = useRef(false);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = lang?.startsWith('en') ? 'en-US' : 'es-ES';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      if (manualStopRef.current) return;

      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscriptRef.current += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      const fullText = finalTranscriptRef.current + interim;
      if (onUpdate) onUpdate(fullText);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => {
      setIsListening(false);
      manualStopRef.current = false;
    };
    recognitionRef.current = recognition;

    return () => { try { recognition.stop(); } catch(e) {} };
  }, [lang, onUpdate]);

  const toggle = useCallback((initialText = '') => {
    if (!recognitionRef.current) return;
    if (isListening) {
      manualStopRef.current = true;
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      manualStopRef.current = false;
      const prefix = initialText ? (initialText.endsWith(' ') ? initialText : initialText + ' ') : '';
      finalTranscriptRef.current = prefix;
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {}
    }
  }, [isListening]);

  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      manualStopRef.current = true;
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return { isListening, toggle, stop };
}

// ── Build fallback questions from translations ───────────────────────────────
function buildFallbackQuestions(t) {
  return [
    { key: 'country', q: t('fb_q_country'), type: 'text', placeholder: t('fb_q_country_ph') },
    { key: 'age', q: t('fb_q_age'), type: 'text', placeholder: t('fb_q_age_ph') },
    { key: 'education', q: t('fb_q_education'), type: 'options', options: [
      { label: t('fb_edu_primary'), value: 'primary' }, { label: t('fb_edu_high'), value: 'high_school' },
      { label: t('fb_edu_tech'), value: 'technical' }, { label: t('fb_edu_uni'), value: 'university' },
      { label: t('fb_edu_post'), value: 'postgraduate' },
    ]},
    { key: 'field', q: t('fb_q_field'), type: 'options', options: [
      { label: t('fb_field_stem'), value: 'stem' }, { label: t('fb_field_health'), value: 'health' },
      { label: t('fb_field_biz'), value: 'business' }, { label: t('fb_field_arts'), value: 'arts' },
      { label: t('fb_field_trades'), value: 'trades' }, { label: t('fb_field_other'), value: 'other' },
    ]},
    { key: 'englishLevel', q: t('fb_q_english'), type: 'options', options: [
      { label: t('fb_eng_none'), value: 'none' }, { label: t('fb_eng_a2'), value: 'a2' },
      { label: t('fb_eng_b2'), value: 'b2' }, { label: t('fb_eng_c1'), value: 'c1' },
      { label: t('fb_eng_native'), value: 'native' },
    ]},
    { key: 'workYears', q: t('fb_q_work'), type: 'text', placeholder: t('fb_q_work_ph') },
  ];
}

const MigrationChat = ({ onComplete }) => {
  const { t, i18n } = useTranslation('landing');
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [profile, setProfile] = useState(() => createEmptyProfile());
  const [completion, setCompletion] = useState(0);
  const [attachment, setAttachment] = useState(null);
  const [fallbackMode, setFallbackMode] = useState(false);
  const [fallbackStep, setFallbackStep] = useState(0);
  const [reportReady, setReportReady] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const voice = useVoiceInput(i18n.language, setInputVal);

  // Translated data
  const FALLBACK_QUESTIONS = useMemo(() => buildFallbackQuestions(t), [t, i18n.language]);
  const milestones = useMemo(() => [
    { at: 0, label: t('chat_progress_start') },
    { at: 33, label: t('chat_progress_basic') },
    { at: 66, label: t('chat_progress_pro') },
    { at: 100, label: t('chat_progress_done') },
  ], [t, i18n.language]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isTyping) inputRef.current?.focus();
  }, [isTyping]);

  // Init — try AI, fallback to buttons if it fails
  // Re-runs when language changes (only resets if user hasn't chatted yet)
  const userHasChatted = useRef(false);
  
  useEffect(() => {
    // If user already sent messages, don't reset the conversation
    if (userHasChatted.current) return;
    
    setIsTyping(true);
    setMessages([]);
    setFallbackMode(false);
    setFallbackStep(0);
    
    const init = async () => {
      try {
        const res = await chatWithKAI([], null, i18n.language);
        const msg = res.choices[0].message;
        setMessages(msg.content ? [msg] : [{ role: 'assistant', content: t('chat_init_msg') }]);
      } catch (e) {
        console.warn('AI unavailable, switching to fallback:', e);
        setFallbackMode(true);
        const questions = buildFallbackQuestions(t);
        setMessages([
          { role: 'assistant', content: t('chat_fallback_init') },
          { role: 'assistant', content: questions[0].q },
        ]);
      }
      setIsTyping(false);
    };
    init();
  }, [i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps

  // File upload handler
  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      setAttachment({
        file,
        preview: file.type.startsWith('image/') ? base64 : null,
        base64,
        name: file.name,
        type: file.type,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);

  const removeAttachment = useCallback(() => setAttachment(null), []);

  // Fallback mode: process text answer for current question
  const handleFallbackAnswer = useCallback((value, label) => {
    const currentQ = FALLBACK_QUESTIONS[fallbackStep];
    if (!currentQ) return;
    userHasChatted.current = true;

    const userMsg = { role: 'user', content: label || value };
    const updatedProfile = { ...profile };

    if (currentQ.key === 'age' || currentQ.key === 'workYears') {
      updatedProfile[currentQ.key] = parseInt(value) || 0;
    } else {
      updatedProfile[currentQ.key] = value;
    }

    setProfile(updatedProfile);
    setCompletion(getProfileCompletion(updatedProfile));

    const nextStep = fallbackStep + 1;
    if (nextStep >= FALLBACK_QUESTIONS.length) {
      setMessages(prev => [...prev, userMsg, {
        role: 'assistant',
        content: t('chat_fallback_complete')
      }]);
      setTimeout(() => onComplete(updatedProfile), 2500);
    } else {
      setMessages(prev => [...prev, userMsg, {
        role: 'assistant', content: FALLBACK_QUESTIONS[nextStep].q
      }]);
      setFallbackStep(nextStep);
    }
  }, [fallbackStep, profile, onComplete, FALLBACK_QUESTIONS, t]);

  // Send message (AI or fallback)
  const handleSend = useCallback(async (e) => {
    e?.preventDefault();
    const text = inputVal.trim();
    if ((!text && !attachment) || isTyping) return;
    userHasChatted.current = true;
    voice.stop();

    if (fallbackMode) {
      setInputVal('');
      if (inputRef.current) inputRef.current.style.height = '52px';
      handleFallbackAnswer(text, text);
      return;
    }

    const userMsg = { role: 'user', content: text || t('chat_attached_doc') };
    if (attachment?.preview) userMsg.attachmentPreview = attachment.preview;

    const currentMsgs = [...messages, userMsg];
    const currentAttachment = attachment;
    setMessages(currentMsgs);
    setInputVal('');
    if (inputRef.current) inputRef.current.style.height = '52px';
    setAttachment(null);
    setIsTyping(true);

    try {
      await processLoop(currentMsgs, profile, currentAttachment?.base64);
    } catch (err) {
      console.error(err);
      // If AI fails mid-conversation, switch to fallback
      console.warn('Switching to fallback mode');
      setFallbackMode(true);
      setIsTyping(false);
      const nextQ = FALLBACK_QUESTIONS.find(q => !profile[q.key]);
      if (nextQ) {
        setFallbackStep(FALLBACK_QUESTIONS.indexOf(nextQ));
        setMessages(prev => [...prev, { role: 'assistant', content: t('chat_fallback_error') + nextQ.q }]);
      }
    }
  }, [inputVal, isTyping, messages, profile, attachment, voice, fallbackMode, handleFallbackAnswer, FALLBACK_QUESTIONS, t]);

  const processLoop = async (msgs, currentProfile, imageBase64 = null) => {
    const response = await chatWithKAI(msgs, imageBase64, i18n.language);
    const resMsg = response.choices[0].message;
    let nextMsgs = [...msgs, resMsg];
    setMessages([...nextMsgs]);

    if (resMsg.tool_calls) {
      let done = false;
      let p = { ...currentProfile };

      for (const tc of resMsg.tool_calls) {
        const args = JSON.parse(tc.function.arguments || '{}');
        if (tc.function.name === 'update_profile') {
          p = { ...p, ...args };
          console.log('Profile updated:', args);
        }
        if (tc.function.name === 'complete_profiling') done = true;

        nextMsgs = [...nextMsgs, {
          role: 'tool', tool_call_id: tc.id,
          name: tc.function.name,
          content: JSON.stringify({ success: true, data: args })
        }];
      }

      setProfile(p);
      setCompletion(getProfileCompletion(p));
      setMessages([...nextMsgs]);

      if (done) {
        setReportReady(true);
      }

      await processLoop(nextMsgs, p); // Always continue so AI can reply naturally
    } else {
      setIsTyping(false);
    }
  };

  const hasSpeech = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  return (
    <div className="flex flex-col flex-1 min-h-0 max-w-2xl w-full mx-auto relative z-10 px-4" style={{ backgroundColor: 'var(--hero-bg)' }}>
      <div className="flex-1 min-h-0 rounded-3xl border shadow-[0_0_80px_rgba(0,0,0,0.4)] backdrop-blur-2xl flex flex-col overflow-hidden relative" style={{ backgroundColor: 'var(--chat-bg)', borderColor: 'var(--chat-border)' }}>

        <ProfileProgress percent={completion} milestones={milestones} />

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pt-5 pb-20"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(139,92,246,0.12) transparent' }}>

          <AnimatePresence initial={false}>
            {messages.map((msg, i) => <Message key={i} msg={msg} />)}
          </AnimatePresence>
          {isTyping && <TypingDots label={t('chat_typing')} />}

          {/* Fallback option buttons */}
          {fallbackMode && !isTyping && FALLBACK_QUESTIONS[fallbackStep]?.type === 'options' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-2 mb-4 pl-11"
            >
              {FALLBACK_QUESTIONS[fallbackStep].options.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => handleFallbackAnswer(opt.value, opt.label)}
                  className="px-4 py-2 rounded-xl bg-purple-500/[0.08] border border-purple-500/15 text-sm text-white/70 hover:bg-purple-500/[0.15] hover:border-purple-500/25 transition-all duration-200"
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Attachment preview */}
        <AnimatePresence>
          {attachment && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-5 pt-2"
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500/[0.08] border border-purple-500/[0.12]">
                {attachment.preview ? (
                  <img src={attachment.preview} alt="" className="w-10 h-10 rounded-lg object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center">
                    <FileText className="w-4 h-4 text-white/30" />
                  </div>
                )}
                <span className="text-xs text-white/50 flex-1 truncate">{attachment.name}</span>
                <button onClick={removeAttachment} className="p-1 hover:bg-white/[0.06] rounded-lg transition-colors">
                  <X className="w-3.5 h-3.5 text-white/30" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Persistent Report CTA Button */}
        {reportReady && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-5 pb-4"
          >
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-600/10 to-cyan-600/10 border border-purple-500/20 shadow-[0_0_30px_rgba(139,92,246,0.15)] flex flex-col items-center justify-center gap-3 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
              <p className="text-sm font-medium text-center" style={{ color: 'var(--text-primary)' }}>
                {i18n.language.startsWith('en') 
                  ? 'Great! Your migration report is ready.' 
                  : '¡Genial! Tu reporte migratorio está listo.'}
              </p>
              <button
                onClick={() => onComplete(profile)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold text-sm hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                {i18n.language.startsWith('en') ? 'View Full Report & Simulator' : 'Ver Reporte Completo y Simulador'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Input area */}
        <div className="px-4 pb-4 pt-2">
          <form onSubmit={handleSend}
            className="relative flex items-center bg-white/[0.04] border border-white/[0.07] rounded-2xl focus-within:border-purple-500/25 focus-within:shadow-[0_0_25px_rgba(139,92,246,0.06)] transition-all duration-300"
          >
            {/* File upload */}
            <input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx" onChange={handleFileSelect} className="hidden" />
            <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isTyping}
              className="ml-2 p-2.5 rounded-xl text-white/25 hover:text-purple-400/60 hover:bg-white/[0.04] disabled:opacity-20 transition-all"
              title={t('chat_attach_file')}
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Text input */}
            <textarea ref={inputRef} value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder={voice.isListening ? t('chat_placeholder_listening') : t('chat_placeholder')}
              autoComplete="off" spellCheck="false" disabled={isTyping}
              className="flex-1 min-w-0 px-2 sm:px-3 py-4 bg-transparent text-white text-sm placeholder:text-white/25 focus:outline-none disabled:opacity-40 max-h-32 overflow-y-auto resize-none m-0"
              style={{ scrollbarWidth: 'none', height: '52px' }}
            />

            {/* Voice button */}
            {hasSpeech && (
              <button type="button" onClick={() => voice.toggle(inputVal)} disabled={isTyping}
                className={`p-2.5 shrink-0 rounded-xl transition-all disabled:opacity-20 ${
                  voice.isListening
                    ? 'text-red-400 bg-red-500/10 animate-pulse'
                    : 'text-white/25 hover:text-purple-400/60 hover:bg-white/[0.04]'
                }`}
                title={voice.isListening ? t('chat_voice_stop') : t('chat_voice_start')}
              >
                {voice.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            )}

            {/* Send button */}
            <button type="submit" disabled={(!inputVal.trim() && !attachment) || isTyping}
              className="mr-2 px-3 sm:mr-2.5 sm:px-0 sm:w-10 h-10 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.2)] disabled:opacity-15 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Send className="w-4 h-4 text-white" />
            </button>
          </form>

          <div className="flex items-center justify-center gap-3 mt-2.5">
            <p className="text-[10px] text-white/15 flex items-center gap-1">
              <Bot className="w-3 h-3" /> KAI Coach · Exodus Intelligence
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MigrationChat;
