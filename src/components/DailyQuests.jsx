import React from 'react';
import { 
  Trophy, 
  Award, 
  Sparkles, 
  Coins, 
  CheckCircle2, 
  ShieldCheck, 
  Droplet, 
  Flame, 
  Wind, 
  Heart
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

export default function DailyQuests({ 
  quests, 
  setQuests, 
  onAddCoins, 
  onAddXp, 
  stats 
}) {
  const claimQuest = (questId) => {
    const q = quests.find(item => item.id === questId);
    if (!q || q.claimed || q.progress < q.target) return;

    soundEngine.playCoinCollect();
    soundEngine.playHabitComplete();
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });

    onAddCoins(q.coinReward);
    onAddXp(q.xpReward);

    setQuests(quests.map(item => item.id === questId ? { ...item, claimed: true } : item));
  };

  const achievements = [
    { id: 'a1', title: 'Hydration Pioneer 💧', desc: 'Drank over 1500ml in a single day.', unlocked: true },
    { id: 'a2', title: 'Streak Champion 🔥', desc: 'Maintained a 3+ day streak.', unlocked: stats.streak >= 3 },
    { id: 'a3', title: 'Mindful Soul 🧘', desc: 'Completed a 4-7-8 breathing session.', unlocked: true },
    { id: 'a4', title: 'Luna’s True Companion 💖', desc: 'Reached Level 2 with your digital cat.', unlocked: stats.level >= 2 }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(320px, 380px)', gap: '1.5rem' }}>
      
      {/* Daily Quests Section */}
      <div className="glass-panel" style={{ padding: '1.8rem' }}>
        <div style={{ marginBottom: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Daily Quests 🎯</h2>
            <span className="badge badge-gold">Bonus Rewards</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Complete quests each day to earn bonus XP and shiny boutique coins for Luna!
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {quests.map((q) => {
            const isDone = q.progress >= q.target;
            const pct = Math.min(100, Math.round((q.progress / q.target) * 100));

            return (
              <div 
                key={q.id} 
                className="stat-card"
                style={{
                  borderColor: q.claimed ? 'rgba(16, 185, 129, 0.4)' : isDone ? 'var(--accent-gold)' : 'var(--border-glass)',
                  background: q.claimed ? 'rgba(16, 185, 129, 0.05)' : 'var(--surface-subtle)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <div style={{ fontWeight: '700', fontSize: '1rem', color: q.claimed ? 'var(--text-muted)' : 'var(--text-main)' }}>
                    {q.title}
                  </div>
                  <div className="glass-pill" style={{ fontSize: '0.75rem', color: '#fbbf24' }}>
                    +{q.coinReward} 🪙 & +{q.xpReward} XP
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                  {q.desc} ({q.progress}/{q.target})
                </div>

                {/* Progress Bar */}
                <div className="progress-bar-container" style={{ height: '8px', marginBottom: '0.8rem' }}>
                  <div 
                    className="progress-bar-fill" 
                    style={{ 
                      width: `${pct}%`, 
                      background: q.claimed ? '#10b981' : isDone ? '#fbbf24' : 'linear-gradient(90deg, var(--primary), var(--secondary))' 
                    }} 
                  />
                </div>

                {/* Claim Button */}
                {q.claimed ? (
                  <div style={{ fontSize: '0.82rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: '600' }}>
                    <CheckCircle2 size={16} /> Claimed
                  </div>
                ) : isDone ? (
                  <button onClick={() => claimQuest(q.id)} className="btn btn-gold" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                    <Sparkles size={15} />
                    <span>Claim Reward</span>
                  </button>
                ) : (
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    In Progress • {pct}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Trophy & Achievements Badges */}
      <div className="glass-panel" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700' }}>Achievements 🏆</h3>
            <span className="badge badge-purple">Trophies</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            Lifetime milestones earned along your health journey.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {achievements.map((ach) => (
            <div 
              key={ach.id} 
              className="stat-card"
              style={{
                borderColor: ach.unlocked ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                opacity: ach.unlocked ? 1 : 0.45
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                <div style={{ 
                  width: '38px', 
                  height: '38px', 
                  borderRadius: '50%', 
                  background: ach.unlocked ? 'linear-gradient(135deg, #fbbf24, #d97706)' : 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  boxShadow: ach.unlocked ? '0 0 15px rgba(251, 191, 36, 0.4)' : 'none'
                }}>
                  {ach.unlocked ? '🏆' : '🔒'}
                </div>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem', color: ach.unlocked ? '#fff' : 'var(--text-muted)' }}>
                    {ach.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    {ach.desc}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
