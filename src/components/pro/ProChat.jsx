import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Mic, MicOff, Paperclip, X, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { chatWithKAI } from '@/lib/kaiAgent';

function renderText(text) {
  if (!text) return null;
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

const TypingDots = memo(({ label }) => (
  <div className="flex items-center gap-4 mb-4 mt-2">
    <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
      <motion.div
        className="absolute inset-0 rounded-full bg-cyan-500/30 blur-md"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="w-8 h-8 rounded-full bg-[#0a0a0d] border border-white/10 shadow-[inset_0_0_15px_rgba(34,211,238,0.4)] flex items-center justify-center relative z-10">
        <Bot className="w-4 h-4 text-white/80" />
      </div>
    </div>
    <div className="flex items-center h-10 overflow-hidden">
      <motion.span 
        initial={{ opacity: 0, x: -10 }} 
        animate={{ opacity: 1, x: 0 }} 
        className="text-[11px] text-cyan-200/50 italic tracking-wide"
      >
        {label}
      </motion.span>
    </div>
  </div>
));

const Message = memo(({ msg }) => {
  const isKai = msg.role === 'assistant';
  if (msg.role === 'system' || msg.role === 'tool') return null;
  if (!msg.content && msg.tool_calls) return null;

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
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center shrink-0 mr-3 shadow-[0_0_12px_rgba(34,211,238,0.3)]">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={`max-w-[85%] rounded-2xl text-sm leading-relaxed ${isKai
          ? 'bg-white/[0.05] border border-white/[0.06] text-white/80 rounded-tl-sm'
          : 'bg-gradient-to-r from-cyan-600/90 to-purple-600/90 text-white rounded-tr-sm shadow-[0_0_20px_rgba(34,211,238,0.12)]'
      }`}>
        {msg.attachmentPreview && (
          <div className="p-2 pb-0">
            <img src={msg.attachmentPreview} alt="" className="rounded-xl max-h-40 w-auto" />
          </div>
        )}
        {textContent && <div className="px-4 py-3">{isKai ? renderText(textContent) : textContent}</div>}
      </div>
    </motion.div>
  );
});

function useVoiceInput(lang) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = lang?.startsWith('en') ? 'en-US' : 'es-ES';
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onresult = (event) => {
      let text = '';
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      setTranscript(text);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;

    return () => { try { recognition.stop(); } catch(e) {} };
  }, [lang]);

  const toggle = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  return { isListening, transcript, toggle, stop };
}

const ProChat = () => {
  const { t, i18n } = useTranslation('dashboard');
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [attachment, setAttachment] = useState(null);
  
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const voice = useVoiceInput(i18n.language);

  // Focus and scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (voice.transcript) setInputVal(voice.transcript);
  }, [voice.transcript]);

  // Initial greeting
  const initialized = useRef(false);
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    
    const init = async () => {
        setIsTyping(true);
        try {
            const isEn = i18n.language.startsWith('en');
            // Give KAI some context that this is the Pro Dashboard
            const sysMsg = { role: 'system', content: isEn ? "User is on the Pro Dashboard. Introduce yourself briefly." : "El usuario está en el Dashboard Pro. Preséntate brevemente para ayudarlo con su perfil o tareas." };
            const res = await chatWithKAI([sysMsg], null, i18n.language);
            const msg = res.choices[0].message;
            setMessages([{ role: 'assistant', content: msg.content }]);
        } catch (e) {
            setMessages([{ role: 'assistant', content: 'Hola, soy KAI. Tu agente inteligente. Estoy aquí para procesar tus documentos y planificar tu ruta migratoria. ¿En qué te puedo ayudar hoy?' }]);
        }
        setIsTyping(false);
    }
    init();
  }, [i18n.language]);

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
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }, []);

  const handleSend = async (e) => {
    e?.preventDefault();
    const text = inputVal.trim();
    if ((!text && !attachment) || isTyping) return;
    voice.stop();

    const userMsg = { role: 'user', content: text || 'Documento adjunto' };
    if (attachment?.preview) userMsg.attachmentPreview = attachment.preview;

    const currentMsgs = [...messages, userMsg];
    const currentAttachment = attachment;
    
    setMessages(currentMsgs);
    setInputVal('');
    setAttachment(null);
    setIsTyping(true);

    try {
      const response = await chatWithKAI(currentMsgs, currentAttachment?.base64, i18n.language);
      const resMsg = response.choices[0].message;
      setMessages(prev => [...prev, resMsg]);
    } catch (err) {
      console.warn('AI error', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, hubo un error de conexión con la red inteligente. Por favor intenta de nuevo en unos segundos.' }]);
    }
    setIsTyping(false);
  };

  const hasSpeech = !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  return (
    <div className="flex flex-col h-full w-full relative z-10 bg-slate-900/40 backdrop-blur-3xl border border-white/[0.05] rounded-3xl overflow-hidden shadow-2xl">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pt-8 pb-6" style={{ scrollbarWidth: 'none' }}>
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => <Message key={i} msg={msg} />)}
        </AnimatePresence>
        {isTyping && <TypingDots label="Procesando..." />}
      </div>

      {/* Attachment preview */}
      <AnimatePresence>
        {attachment && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-5 pt-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-cyan-500/[0.08] border border-cyan-500/[0.12]">
              {attachment.preview ? (
                <img src={attachment.preview} alt="" className="w-10 h-10 rounded-lg object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white/30" />
                </div>
              )}
              <span className="text-xs text-white/50 flex-1 truncate">{attachment.name}</span>
              <button onClick={() => setAttachment(null)} className="p-1 hover:bg-white/[0.06] rounded-lg transition-colors">
                <X className="w-3.5 h-3.5 text-white/30" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Box */}
      <div className="px-4 pb-4 pt-2">
        <form onSubmit={handleSend} className="relative flex items-center bg-white/[0.03] border border-white/[0.08] rounded-2xl focus-within:border-cyan-500/40 focus-within:bg-white/[0.05] transition-all duration-300 shadow-inner">
          <input ref={fileInputRef} type="file" accept="image/*,.pdf,.doc,.docx" onChange={handleFileSelect} className="hidden" />
          <button type="button" onClick={() => fileInputRef.current?.click()} disabled={isTyping} className="ml-2 p-2.5 rounded-xl text-white/30 hover:text-cyan-400 hover:bg-white/[0.05] disabled:opacity-20 transition-all">
            <Paperclip className="w-4 h-4" />
          </button>
          
          <input type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)}
            placeholder={voice.isListening ? "Escuchando..." : "Mensaje para KAI..."}
            autoComplete="off" spellCheck="false" disabled={isTyping}
            className="flex-1 px-3 py-4 bg-transparent text-white text-sm placeholder:text-white/30 focus:outline-none disabled:opacity-40"
          />

          {hasSpeech && (
            <button type="button" onClick={voice.toggle} disabled={isTyping}
              className={`p-2.5 rounded-xl transition-all disabled:opacity-20 ${voice.isListening ? 'text-cyan-400 bg-cyan-500/10 animate-pulse' : 'text-white/30 hover:text-cyan-400 hover:bg-white/[0.05]'}`}
            >
              {voice.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          <button type="submit" disabled={(!inputVal.trim() && !attachment) || isTyping}
            className="mr-2.5 w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(34,211,238,0.2)] disabled:opacity-20 disabled:grayscale transition-all duration-200"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProChat;
