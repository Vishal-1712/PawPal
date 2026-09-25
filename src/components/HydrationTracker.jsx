import React, { useState } from 'react';
import { 
  Droplet, 
  Plus, 
  RotateCcw, 
  Sparkles, 
  Award, 
  Flame, 
  Heart, 
  Info,
  CheckCircle2
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

export default function HydrationTracker({ 
  waterData, 
  setWaterData, 
  onAddCoins, 
  onAddXp 
}) {
  const [customMl, setCustomMl] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [newGoalInput, setNewGoalInput] = useState(waterData.goalMl || 2000);

  const currentMl = waterData.currentMl || 0;
  const goalMl = waterData.goalMl || 2000;
  const percentage = Math.min(100, Math.round((currentMl / goalMl) * 100));
  const glassesDrunk = Math.floor(currentMl / 250);
  const totalGlasses = Math.floor(goalMl / 250);

  const addWater = (ml) => {
    soundEngine.playWaterDrop();
    const nextMl = currentMl + ml;
    const wasUnderGoal = currentMl < goalMl;
    const reachedGoal = nextMl >= goalMl;
    const alreadyCelebrated = waterData.goalCelebratedToday;

    setWaterData((prev) => ({
      ...prev,
      currentMl: nextMl,
      goalCelebratedToday: prev.goalCelebratedToday || reachedGoal,
      history: [
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), ml },
        ...(prev.history || []).slice(0, 7)
      ]
    }));

    // Award incremental XP with reasonable ceiling per day
    if (nextMl <= goalMl + 500) {
      onAddXp(5);
    }

    // Goal reached celebration! (Awarded once per daily cycle)
    if (wasUnderGoal && reachedGoal && !alreadyCelebrated) {
      soundEngine.playHabitComplete();
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      onAddCoins(20);
      onAddXp(50);
    }
  };

  const resetWater = () => {
    soundEngine.playClickRing();
    setWaterData((prev) => ({ ...prev, currentMl: 0 }));
  };

  const handleSetGoal = (e) => {
    e.preventDefault();
    const g = parseInt(newGoalInput, 10);
    if (g && g > 500) {
      setWaterData((prev) => ({ ...prev, goalMl: g }));
      setShowGoalModal(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 380px) 1fr', gap: '1.5rem' }}>
      
      {/* Visual Water Bottle Card */}
      <div className="glass-panel" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '1rem' }}>
          <span className="badge badge-cyan">Hydration Tracker</span>
          <button 
            onClick={() => setShowGoalModal(true)} 
            className="btn btn-outline" 
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
          >
            Adjust Goal
          </button>
        </div>

        {/* Animated Water Bottle Graphic */}
        <div style={{ position: 'relative', width: '130px', height: '260px', margin: '1rem 0' }}>
          
          {/* Bottle Cap */}
          <div style={{
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '44px',
            height: '22px',
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            borderRadius: '6px 6px 0 0',
            border: '2px solid rgba(255, 255, 255, 0.4)',
            zIndex: 10
          }}></div>

          {/* Bottle Neck */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '32px',
            height: '24px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderLeft: '2px solid rgba(255, 255, 255, 0.3)',
            borderRight: '2px solid rgba(255, 255, 255, 0.3)',
            zIndex: 5
          }}></div>

          {/* Bottle Main Body */}
          <div style={{
            position: 'absolute',
            top: '40px',
            left: '0',
            width: '130px',
            height: '220px',
            borderRadius: '24px 24px 32px 32px',
            background: 'rgba(6, 182, 212, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(56, 189, 248, 0.4)',
            boxShadow: '0 10px 30px rgba(6, 182, 212, 0.2), inset 0 0 20px rgba(56, 189, 248, 0.1)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-end'
          }}>
            
            {/* Water Fill Layer */}
            <div 
              style={{
                width: '100%',
                height: `${percentage}%`,
                background: 'linear-gradient(180deg, #38bdf8 0%, #0284c7 100%)',
                boxShadow: '0 0 25px rgba(56, 189, 248, 0.6)',
                transition: 'height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                position: 'relative'
              }}
            >
              {/* Animated Wave Top */}
              <div 
                style={{
                  position: 'absolute',
                  top: '-8px',
                  left: 0,
                  width: '200%',
                  height: '16px',
                  background: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '40%',
                  animation: 'wave-motion 4s linear infinite'
                }}
              />
            </div>

            {/* Percentage Display Center */}
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
              textShadow: '0 2px 6px rgba(0, 0, 0, 0.5)'
            }}>
              <span style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ffffff' }}>
                {percentage}%
              </span>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.9)' }}>
                {currentMl} / {goalMl} ml
              </span>
            </div>
          </div>
        </div>

        {/* Glasses Counter */}
        <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-main)', marginTop: '0.5rem' }}>
          🥤 {glassesDrunk} of {totalGlasses} glasses completed
        </div>

        {/* Luna Cheer */}
        <div style={{ marginTop: '0.8rem', fontSize: '0.82rem', color: 'var(--text-muted)', background: 'rgba(6, 182, 212, 0.08)', padding: '0.6rem 0.9rem', borderRadius: 'var(--radius-md)' }}>
          {percentage >= 100 
            ? "🎉 Amazing job! Luna is purring with hydration pride! +20 Coins awarded!" 
            : `💧 Need ${Math.max(0, goalMl - currentMl)} ml more to hit today's hydration target!`
          }
        </div>
      </div>

      {/* Logging Controls & Hydration Benefits */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        {/* Quick Log Action Panel */}
        <div className="glass-panel" style={{ padding: '1.8rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Droplet size={20} color="#38bdf8" /> Quick Add Water
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
            Log each glass of water to keep your body fueled and Luna energized!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.8rem' }}>
            <button onClick={() => addWater(250)} className="btn btn-cyan">
              <Plus size={16} />
              <span>+1 Glass (250ml)</span>
            </button>

            <button onClick={() => addWater(500)} className="btn btn-cyan">
              <Plus size={16} />
              <span>+2 Glasses (500ml)</span>
            </button>

            <button onClick={() => addWater(750)} className="btn btn-cyan">
              <Plus size={16} />
              <span>+1 Bottle (750ml)</span>
            </button>
          </div>

          {/* Custom ml logger */}
          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1.2rem' }}>
            <input 
              type="number"
              value={customMl}
              onChange={(e) => setCustomMl(e.target.value)}
              placeholder="Custom amount (e.g. 350 ml)"
              style={{
                flex: 1,
                padding: '0.65rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'rgba(0, 0, 0, 0.25)',
                border: '1px solid var(--border-glass)',
                color: '#fff',
                fontSize: '0.88rem'
              }}
            />
            <button 
              onClick={() => {
                const val = parseInt(customMl, 10);
                if (val > 0) {
                  addWater(val);
                  setCustomMl('');
                }
              }} 
              className="btn btn-primary"
            >
              Add ml
            </button>

            <button onClick={resetWater} className="btn btn-outline" title="Reset Today's Water" style={{ padding: '0 0.8rem' }}>
              <RotateCcw size={16} />
            </button>
          </div>
        </div>

        {/* Hydration Science & Luna's Tips */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--accent-cyan-light)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} /> Why Proper Hydration Matters
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
            <div className="stat-card">
              <span style={{ fontWeight: '600', fontSize: '0.88rem', color: '#67e8f9' }}>⚡ Sustained Energy</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Dehydration by just 2% reduces cognitive focus & workout endurance.</span>
            </div>
            <div className="stat-card">
              <span style={{ fontWeight: '600', fontSize: '0.88rem', color: '#6ee7b7' }}>✨ Radiant Skin & Cellular Health</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Flushes metabolic toxins and supports natural skin hydration.</span>
            </div>
            <div className="stat-card">
              <span style={{ fontWeight: '600', fontSize: '0.88rem', color: '#fda4af' }}>🐱 Shiny Fur & Fluffiness</span>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Luna stays energized and happy with your healthy habits!</span>
            </div>
          </div>
        </div>

        {/* Recent Water Log History */}
        {waterData.history && waterData.history.length > 0 && (
          <div className="glass-panel" style={{ padding: '1.2rem 1.5rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
              Today's Drink Log
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {waterData.history.map((item, idx) => (
                <div key={idx} className="glass-pill" style={{ fontSize: '0.75rem', color: '#67e8f9' }}>
                  <Droplet size={12} /> {item.ml} ml at {item.time}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Goal Adjustment Modal */}
      {showGoalModal && (
        <div className="modal-overlay" onClick={() => setShowGoalModal(false)}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '400px', padding: '1.8rem', background: 'rgba(20, 24, 40, 0.95)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Set Daily Water Goal</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
              Recommended: 2000ml (8 glasses) for normal activity, or 2500ml+ for workouts.
            </p>

            <form onSubmit={handleSetGoal}>
              <input 
                type="number" 
                value={newGoalInput} 
                onChange={(e) => setNewGoalInput(e.target.value)}
                min="500"
                max="5000"
                step="250"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(0, 0, 0, 0.3)',
                  border: '1px solid var(--border-glass)',
                  color: '#fff',
                  fontSize: '1rem',
                  marginBottom: '1.2rem'
                }}
              />
              <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowGoalModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-cyan">Save Goal</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
