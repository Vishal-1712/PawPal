import React, { useState, useEffect } from 'react';
import { 
  Wind, 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  CheckCircle2, 
  Smile, 
  ArrowRight,
  Heart
} from 'lucide-react';
import { MEDITATIONS, QUICK_STRETCHES } from '../utils/lunaAI';
import { soundEngine } from '../utils/audio';

export default function MindfulnessHub({ onAddXp, onAddCoins, setStats }) {
  const [activeTab, setActiveTab] = useState('breathing'); // 'breathing', 'meditation', 'stretches'

  // Breathing Guide State
  const [breathTechnique, setBreathTechnique] = useState('4-7-8'); // '4-7-8', 'box', 'energize'
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale'); // Inhale, Hold, Exhale
  const [breathCount, setBreathCount] = useState(4);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  // Guided Meditation State
  const [activeMeditation, setActiveMeditation] = useState(MEDITATIONS[0]);
  const [medStepIndex, setMedStepIndex] = useState(0);

  // Techniques config
  const techniques = {
    '4-7-8': {
      name: '4-7-8 Deep Calm',
      desc: 'Proven to slow heart rate and trigger parasympathetic relaxation.',
      phases: [
        { name: 'Inhale through nose', duration: 4, action: 'inhale' },
        { name: 'Hold your breath gently', duration: 7, action: 'hold' },
        { name: 'Exhale slowly through mouth', duration: 8, action: 'exhale' }
      ]
    },
    'box': {
      name: 'Box Breathing (4-4-4-4)',
      desc: 'Used by athletes and Navy SEALs for supreme focus under pressure.',
      phases: [
        { name: 'Inhale deeply', duration: 4, action: 'inhale' },
        { name: 'Hold gently', duration: 4, action: 'hold' },
        { name: 'Exhale smoothly', duration: 4, action: 'exhale' },
        { name: 'Hold empty', duration: 4, action: 'hold' }
      ]
    },
    'energize': {
      name: 'Vitality Reset (4-2-4)',
      desc: 'Clears mental brain fog and delivers fresh oxygen to your brain.',
      phases: [
        { name: 'Inhale vital air', duration: 4, action: 'inhale' },
        { name: 'Pause briefly', duration: 2, action: 'hold' },
        { name: 'Exhale completely', duration: 4, action: 'exhale' }
      ]
    }
  };

  // Breathing Loop Timer
  useEffect(() => {
    let timer;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathCount((prev) => {
          if (prev <= 1) {
            // Advance phase
            const currentPhases = techniques[breathTechnique].phases;
            const currentPhaseIdx = currentPhases.findIndex(p => p.name === breathPhase);
            const nextIdx = (currentPhaseIdx + 1) % currentPhases.length;

            if (nextIdx === 0) {
              setCyclesCompleted(c => c + 1);
              soundEngine.playPurrBurst();
              onAddXp(10);
            } else {
              soundEngine.playMeditationBell();
            }

            setBreathPhase(currentPhases[nextIdx].name);
            return currentPhases[nextIdx].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, breathPhase, breathTechnique]);

  const startBreathing = () => {
    soundEngine.init();
    soundEngine.playMeditationBell();
    const firstPhase = techniques[breathTechnique].phases[0];
    setBreathPhase(firstPhase.name);
    setBreathCount(firstPhase.duration);
    setIsBreathingActive(true);
  };

  const stopBreathing = () => {
    setIsBreathingActive(false);
  };

  const handleNextMedStep = () => {
    soundEngine.playPurrBurst();
    if (medStepIndex < activeMeditation.steps.length - 1) {
      setMedStepIndex(medStepIndex + 1);
    } else {
      // Completed meditation
      soundEngine.playHabitComplete();
      onAddXp(40);
      onAddCoins(15);
      setMedStepIndex(0);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Top Selector Navigation */}
      <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => setActiveTab('breathing')} 
            className={`btn ${activeTab === 'breathing' ? 'btn-primary' : 'btn-outline'}`}
          >
            <Wind size={16} />
            <span>Interactive Breathing</span>
          </button>

          <button 
            onClick={() => setActiveTab('meditation')} 
            className={`btn ${activeTab === 'meditation' ? 'btn-primary' : 'btn-outline'}`}
          >
            <BookOpen size={16} />
            <span>Guided Visualization</span>
          </button>

          <button 
            onClick={() => setActiveTab('stretches')} 
            className={`btn ${activeTab === 'stretches' ? 'btn-primary' : 'btn-outline'}`}
          >
            <Sparkles size={16} />
            <span>Desk Stretches</span>
          </button>
        </div>

        <div className="glass-pill" style={{ color: '#a78bfa' }}>
          🐱 Luna is in Zen Mode
        </div>
      </div>

      {/* Mode 1: Breathing Guide Visualizer */}
      {activeTab === 'breathing' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 380px) 1fr', gap: '1.5rem' }}>
          
          {/* Visual Breathing Bubble */}
          <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <span className="badge badge-purple" style={{ marginBottom: '1.2rem' }}>
              {techniques[breathTechnique].name}
            </span>

            {/* Pulsing Breathing Circle */}
            <div style={{
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(244, 63, 94, 0.15) 100%)',
              border: '2px solid rgba(167, 139, 250, 0.5)',
              boxShadow: isBreathingActive 
                ? '0 0 50px rgba(139, 92, 246, 0.5), inset 0 0 30px rgba(244, 63, 94, 0.3)' 
                : '0 0 20px rgba(139, 92, 246, 0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '1.5rem 0',
              transform: isBreathingActive 
                ? breathPhase.toLowerCase().includes('inhale') ? 'scale(1.2)' : breathPhase.toLowerCase().includes('hold') ? 'scale(1.18)' : 'scale(0.85)'
                : 'scale(1)',
              transition: 'transform 3.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              <div style={{ fontSize: '2.4rem', fontWeight: '800', color: '#ffffff' }}>
                {isBreathingActive ? breathCount : '🌸'}
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--primary-light)', marginTop: '0.2rem', padding: '0 1rem' }}>
                {isBreathingActive ? breathPhase : 'Ready to Breathe'}
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '0.8rem' }}>
              {!isBreathingActive ? (
                <button onClick={startBreathing} className="btn btn-primary" style={{ padding: '0.7rem 1.8rem' }}>
                  <Play size={18} />
                  <span>Start Rhythm</span>
                </button>
              ) : (
                <button onClick={stopBreathing} className="btn btn-secondary" style={{ padding: '0.7rem 1.8rem' }}>
                  <Pause size={18} />
                  <span>Pause</span>
                </button>
              )}
            </div>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
              Cycles Completed: <strong style={{ color: 'var(--accent-gold)' }}>{cyclesCompleted}</strong> (+10 XP per cycle)
            </div>
          </div>

          {/* Technique Selector & Philosophy */}
          <div className="glass-panel" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Choose Breathing Technique</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {Object.keys(techniques).map((key) => {
                const tech = techniques[key];
                const isSel = breathTechnique === key;
                return (
                  <div
                    key={key}
                    onClick={() => {
                      setBreathTechnique(key);
                      setIsBreathingActive(false);
                      setBreathCount(tech.phases[0].duration);
                    }}
                    className="glass-panel glass-panel-interactive"
                    style={{
                      padding: '1.1rem',
                      cursor: 'pointer',
                      borderColor: isSel ? 'var(--primary-light)' : 'var(--border-glass)',
                      background: isSel ? 'rgba(139, 92, 246, 0.18)' : 'var(--surface-subtle)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.98rem', color: isSel ? '#ffffff' : 'var(--text-main)' }}>
                        {tech.name}
                      </span>
                      {isSel && <span className="badge badge-purple">Active</span>}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      {tech.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Cat Purr Science Tip */}
            <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', background: 'rgba(244, 63, 94, 0.08)', border: '1px dashed rgba(244, 63, 94, 0.3)', marginTop: 'auto' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--secondary-light)', marginBottom: '0.2rem' }}>
                🐱 Luna's Zen Wisdom:
              </div>
              <p style={{ fontSize: '0.8rem', color: '#e2e8f0' }}>
                When cats purr, their bodies release endorphins that soothe both cat and companion. Matching your breath with Luna's rhythm calms the nervous system instantly!
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Mode 2: Guided Meditation Visualization Script */}
      {activeTab === 'meditation' && (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <span className="badge badge-rose" style={{ marginBottom: '0.4rem' }}>{activeMeditation.theme}</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{activeMeditation.title}</h2>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Duration: {activeMeditation.duration}</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {MEDITATIONS.map(m => (
                <button
                  key={m.id}
                  onClick={() => { setActiveMeditation(m); setMedStepIndex(0); }}
                  className={`glass-pill`}
                  style={{
                    cursor: 'pointer',
                    background: activeMeditation.id === m.id ? 'rgba(244, 63, 94, 0.25)' : 'var(--surface-card)',
                    borderColor: activeMeditation.id === m.id ? 'var(--secondary-light)' : 'var(--border-glass)',
                    color: activeMeditation.id === m.id ? '#ffffff' : 'var(--text-muted)'
                  }}
                >
                  {m.title}
                </button>
              ))}
            </div>
          </div>

          {/* Current Step Card */}
          <div style={{
            padding: '2.5rem 2rem',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(244, 63, 94, 0.08))',
            border: '1px solid var(--border-glass)',
            minHeight: '180px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontSize: '1.2rem',
            lineHeight: '1.7',
            color: '#f8fafc',
            boxShadow: 'inset 0 0 25px rgba(0,0,0,0.2)'
          }}>
            "{activeMeditation.steps[medStepIndex]}"
          </div>

          {/* Step Progression Bar & Button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Step {medStepIndex + 1} of {activeMeditation.steps.length}
            </div>

            <button onClick={handleNextMedStep} className="btn btn-primary" style={{ padding: '0.7rem 1.6rem' }}>
              <span>{medStepIndex === activeMeditation.steps.length - 1 ? 'Finish & Claim 40 XP 🎉' : 'Next Step'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Mode 3: Desk Stretches */}
      {activeTab === 'stretches' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
          {QUICK_STRETCHES.map((s, idx) => (
            <div key={idx} className="glass-panel glass-panel-interactive" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span className="badge badge-cyan">{s.duration}</span>
                  <span style={{ fontSize: '1.2rem' }}>🧘</span>
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>{s.name}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{s.desc}</p>
              </div>

              <button 
                onClick={() => { soundEngine.playPurrBurst(); onAddXp(15); onAddCoins(5); }}
                className="btn btn-outline" 
                style={{ marginTop: '1.2rem', fontSize: '0.82rem' }}
              >
                <CheckCircle2 size={15} color="#34d399" />
                <span>Completed Stretch (+15 XP)</span>
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
