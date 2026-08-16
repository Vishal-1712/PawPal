import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Mic, 
  AlertTriangle, 
  Bot, 
  User, 
  Volume2, 
  HeartHandshake, 
  Flame, 
  Smile, 
  RefreshCw,
  Info
} from 'lucide-react';
import { generateLunaResponse, analyzeVoiceEmotion, MEDICAL_DISCLAIMER, VOICE_DISCLAIMER } from '../utils/lunaAI';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

export default function LunaChat({ contextData, onActionTrigger }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'luna',
      text: "*Purrrrrs softly and waves a fluffy paw* 🐾✨\n\nMeow! I'm **Luna**, your wellness kitty and best friend! How are you feeling right now? Have you sipped some fresh water yet? 💧💖",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showVoiceAnalyzer, setShowVoiceAnalyzer] = useState(false);
  const [voiceToneInput, setVoiceToneInput] = useState('');
  const [selectedTonePreset, setSelectedTonePreset] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Quick Prompt Options
  const promptChips = [
    { label: "How's my water? 💧", query: "How much water did I drink today?" },
    { label: "What should I eat? 🥗", query: "Can you recommend a healthy delicious meal?" },
    { label: "I feel stressed 🌧️", query: "I'm feeling really stressed out and overwhelmed today." },
    { label: "Give me a daily schedule 📅", query: "Can you create a daily wellness schedule for me?" },
    { label: "5-min stretch 🧘", query: "Suggest a quick stretch break for my desk!" },
    { label: "Play relaxing music 🎵", query: "What mood music do you recommend right now?" },
    { label: "Tell me a cat joke 😸", query: "Tell me a funny cat joke to make me smile!" }
  ];

  const handleSend = (textToSend = input) => {
    const trimmed = textToSend.trim();
    if (!trimmed) return;

    soundEngine.init();
    soundEngine.playPurrBurst();

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate Luna Thinking & Typing
    setTimeout(() => {
      const lunaReply = generateLunaResponse(trimmed, contextData);
      
      const botMsg = {
        id: Date.now() + 1,
        sender: 'luna',
        text: lunaReply.text,
        isMedicalWarning: lunaReply.isMedicalWarning,
        action: lunaReply.action,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      soundEngine.playMeow();

      if (lunaReply.action === 'confetti') {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
      }

      if (onActionTrigger && lunaReply.action) {
        onActionTrigger(lunaReply.action);
      }
    }, 700);
  };

  const handleVoiceAnalysis = () => {
    if (!voiceToneInput && !selectedTonePreset) return;
    const result = analyzeVoiceEmotion(voiceToneInput, selectedTonePreset);
    setAnalysisResult(result);
    soundEngine.playMeditationBell();
  };

  return (
    <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '700px', overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255, 255, 255, 0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }} className="anim-float">
            🐱
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Luna Companion</h3>
              <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>Online & Purring</span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Warm, empathetic, mischievous wellness friend
            </p>
          </div>
        </div>

        {/* Voice Emotion Analysis Toggle */}
        <button 
          onClick={() => setShowVoiceAnalyzer(!showVoiceAnalyzer)} 
          className={`btn ${showVoiceAnalyzer ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
        >
          <Mic size={15} />
          <span>Voice Emotion Proxy</span>
        </button>
      </div>

      {/* Mandatory Medical Disclaimer Banner */}
      <div style={{ 
        padding: '0.6rem 1.2rem', 
        background: 'rgba(245, 158, 11, 0.1)', 
        borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.6rem',
        fontSize: '0.78rem',
        color: '#fbbf24'
      }}>
        <AlertTriangle size={15} style={{ flexShrink: 0 }} />
        <span>
          <strong>Wellness Companion Notice:</strong> Luna is your supportive pet companion, not a doctor. Consult a healthcare professional for medical diagnoses or treatments.
        </span>
      </div>

      {/* Voice Emotion Proxy Modal / Drawer */}
      {showVoiceAnalyzer && (
        <div style={{ 
          padding: '1.2rem', 
          background: 'rgba(2, 13, 6, 0.82)', 
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(22, 163, 74, 0.3)',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Mic size={16} /> Voice & Tone Emotion Analyzer
            </h4>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{VOICE_DISCLAIMER}</span>
          </div>
          
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
            Describe how you spoke or pick your vocal tone to receive a tailored grounding activity:
          </p>

          {/* Quick Tone Selectors */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
            {[
              { id: 'fired_up', label: '🔥 Fired up / Yelling' },
              { id: 'anxious', label: '💓 Whispering / Anxious' },
              { id: 'exhausted', label: '😴 Weary / Monotone' },
              { id: 'joyful', label: '🎉 Laughing / Joyful' }
            ].map(t => (
              <button 
                key={t.id} 
                onClick={() => setSelectedTonePreset(t.id)}
                className={`glass-pill`}
                style={{ 
                  cursor: 'pointer',
                  border: selectedTonePreset === t.id ? '1px solid var(--primary-light)' : '1px solid var(--border-glass)',
                  background: selectedTonePreset === t.id ? 'rgba(139, 92, 246, 0.25)' : 'var(--surface-glass)',
                  color: selectedTonePreset === t.id ? '#ffffff' : 'var(--text-main)'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <input 
              type="text" 
              value={voiceToneInput}
              onChange={(e) => setVoiceToneInput(e.target.value)}
              placeholder="E.g., 'I felt like shouting because of work stress...'"
              style={{
                flex: 1,
                padding: '0.55rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid var(--border-glass)',
                color: '#fff',
                fontSize: '0.88rem'
              }}
            />
            <button onClick={handleVoiceAnalysis} className="btn btn-primary" style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
              Analyze Tone
            </button>
          </div>

          {/* Analysis Results Display */}
          {analysisResult && (
            <div style={{ marginTop: '0.9rem', padding: '0.9rem', borderRadius: 'var(--radius-md)', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span className="badge badge-purple">Implied Tone: {analysisResult.detectedEmotion}</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#e2e8f0', marginBottom: '0.4rem' }}>
                {analysisResult.lunaAdvice}
              </p>
              <div style={{ fontSize: '0.82rem', color: '#38bdf8', fontWeight: '500' }}>
                💡 <strong>Suggested Activity:</strong> {analysisResult.suggestedActivity}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Message Chat Flow */}
      <div style={{ flex: 1, padding: '1.2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {messages.map((msg) => {
          const isLuna = msg.sender === 'luna';
          return (
            <div 
              key={msg.id} 
              style={{ 
                display: 'flex', 
                gap: '0.8rem', 
                alignSelf: isLuna ? 'flex-start' : 'flex-end',
                maxWidth: '85%'
              }}
            >
              {isLuna && (
                <div style={{ 
                  width: '34px', 
                  height: '34px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #16a34a, #22c55e)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  🐱
                </div>
              )}

              <div>
                <div 
                  style={{
                    padding: '0.85rem 1.15rem',
                    borderRadius: isLuna ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                    background: isLuna 
                      ? msg.isMedicalWarning ? 'rgba(239, 68, 68, 0.15)' : 'var(--surface-card)' 
                      : 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                    border: isLuna 
                      ? msg.isMedicalWarning ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-glass)' 
                      : 'none',
                    color: isLuna ? 'var(--text-main)' : '#ffffff',
                    fontSize: '0.92rem',
                    lineHeight: '1.55',
                    boxShadow: 'var(--shadow-sm)',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {msg.text}
                </div>
                <div style={{ 
                  fontSize: '0.7rem', 
                  color: 'var(--text-dim)', 
                  marginTop: '0.25rem', 
                  textAlign: isLuna ? 'left' : 'right',
                  padding: '0 0.3rem' 
                }}>
                  {msg.timestamp}
                </div>
              </div>

              {!isLuna && (
                <div style={{ 
                  width: '34px', 
                  height: '34px', 
                  borderRadius: '50%', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <User size={16} color="#cbd5e1" />
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: 'flex', gap: '0.8rem', alignSelf: 'flex-start' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #f43f5e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }} className="anim-purr">
              🐱
            </div>
            <div style={{ padding: '0.6rem 1rem', borderRadius: '18px 18px 18px 4px', background: 'var(--surface-card)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Luna is purring & typing</span>
              <span className="anim-float">🐾</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Chips */}
      <div style={{ padding: '0.5rem 1.2rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', background: 'rgba(0, 0, 0, 0.15)', borderTop: '1px solid var(--border-glass)' }}>
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip.query)}
            className="glass-pill"
            style={{ 
              cursor: 'pointer', 
              fontSize: '0.78rem', 
              whiteSpace: 'nowrap',
              background: 'rgba(255, 255, 255, 0.05)',
              transition: 'background 0.2s'
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Input Field Bar */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
        style={{ padding: '1rem 1.2rem', borderTop: '1px solid var(--border-glass)', display: 'flex', gap: '0.6rem', background: 'var(--surface-card)' }}
      >
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Luna for healthy food, mood music, a schedule, or just chat... 🐾"
          style={{
            flex: 1,
            padding: '0.8rem 1.2rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-glass)',
            color: '#fff',
            fontSize: '0.92rem',
            outline: 'none'
          }}
        />
        <button 
          type="submit" 
          className="btn btn-primary"
          style={{ width: '46px', height: '46px', borderRadius: '50%', padding: 0 }}
          title="Send to Luna"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
