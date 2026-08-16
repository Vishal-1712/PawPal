import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Flame, 
  Coins, 
  Sparkles, 
  Award, 
  Trash2, 
  Tag, 
  Dumbbell, 
  Wind, 
  BookOpen, 
  Moon, 
  Apple, 
  Droplet,
  Lock
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import ContributionGraph from './ContributionGraph';

export default function HabitsTracker({ 
  habits, 
  setHabits, 
  waterData,
  onAddCoins, 
  onAddXp, 
  stats, 
  setStats,
  currentUser,
  activityLog,
  onShowAuth,
  onRecordActivity
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('mindfulness');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const categories = [
    { id: 'all', label: 'All Habits', icon: Sparkles },
    { id: 'mindfulness', label: 'Mindfulness 🧘', icon: Wind },
    { id: 'fitness', label: 'Movement 🏃', icon: Dumbbell },
    { id: 'nutrition', label: 'Nutrition 🥗', icon: Apple },
    { id: 'sleep', label: 'Sleep & Rest 🌙', icon: Moon },
    { id: 'growth', label: 'Growth 📚', icon: BookOpen }
  ];

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'mindfulness': return <Wind size={16} color="#c084fc" />;
      case 'fitness': return <Dumbbell size={16} color="#fb7185" />;
      case 'nutrition': return <Apple size={16} color="#34d399" />;
      case 'sleep': return <Moon size={16} color="#38bdf8" />;
      case 'growth': return <BookOpen size={16} color="#fbbf24" />;
      default: return <Sparkles size={16} color="#a78bfa" />;
    }
  };

  const currentMl = waterData?.currentMl || 0;
  const goalMl = waterData?.goalMl || 2000;
  const hydrationPct = goalMl > 0 ? Math.min(100, Math.round((currentMl / goalMl) * 100)) : 0;
  const isHydration100 = currentMl >= goalMl && goalMl > 0;

  const isWaterHabit = (h) => {
    if (!h) return false;
    return h.id === 'h2' || 
      h.title.toLowerCase().includes('drink 8') || 
      h.title.toLowerCase().includes('fresh glasses of water') ||
      (h.category === 'nutrition' && h.title.toLowerCase().includes('water'));
  };

  const toggleHabit = (id) => {
    const target = habits.find((h) => h.id === id);
    if (!target) return;

    // Water habit lock check!
    if (isWaterHabit(target) && !isHydration100) {
      soundEngine.playClickRing();
      alert(`🔒 Locked! "Drink 8 Fresh Glasses of Water" can only be unlocked by completing 100% hydration in the Hydration Tracker!\n\nCurrent Hydration: ${hydrationPct}% (${currentMl} / ${goalMl} ml)\nDrink ${Math.ceil((goalMl - currentMl) / 250)} more glass(es) to unlock!`);
      return;
    }

    const willBeCompleted = !target.completed;
    
    if (willBeCompleted) {
      soundEngine.playHabitComplete();
      soundEngine.playCoinCollect();
      onAddXp(25);
      onAddCoins(10);

      // Record activity in contribution graph
      if (onRecordActivity) {
        onRecordActivity(1);
      }

      // Boost Luna happiness & fluffiness
      setStats((prev) => ({
        ...prev,
        happiness: Math.min(100, prev.happiness + 5),
        fluffiness: Math.min(100, prev.fluffiness + 4)
      }));

      // Check if all habits done
      const otherCompletedCount = habits.filter((h) => h.id !== id && h.completed).length;
      if (otherCompletedCount + 1 === habits.length) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });
        onAddCoins(30);
        onAddXp(100);
      }
    } else {
      // Unticking a habit -> play a quick click ring
      soundEngine.playClickRing();
    }

    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const nextStreak = willBeCompleted ? h.streak + 1 : Math.max(0, h.streak - 1);
          return { ...h, completed: willBeCompleted, streak: nextStreak };
        }
        return h;
      })
    );
  };

  const deleteHabit = (id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newHabit = {
      id: 'h_' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      completed: false,
      streak: 0,
      xpReward: 25,
      coinReward: 10
    };

    setHabits((prev) => [newHabit, ...prev]);
    setNewTitle('');
    setShowAddModal(false);
    soundEngine.playPurrBurst();
  };

  const filteredHabits = selectedFilter === 'all' 
    ? habits 
    : habits.filter((h) => h.category === selectedFilter);

  const completedCount = habits.filter((h) => h.completed).length;
  const progressPercent = habits.length ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header & Overview Stats */}
      <div className="glass-panel" style={{ padding: '1.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Daily Wellness Habits</h2>
              <span className="badge badge-purple">{completedCount}/{habits.length} Done Today</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Complete habits to power up your daily streak and earn coins for Luna's wardrobe!
            </p>
          </div>

          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            <Plus size={18} />
            <span>Create Habit</span>
          </button>
        </div>

        {/* Overall Completion Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>Daily Progress</span>
            <span style={{ color: 'var(--primary-light)', fontWeight: '700' }}>{progressPercent}%</span>
          </div>
          <div className="progress-bar-container" style={{ height: '10px' }}>
            <div 
              className="progress-bar-fill" 
              style={{ 
                width: `${progressPercent}%`, 
                background: progressPercent === 100 
                  ? 'linear-gradient(90deg, #10b981, #34d399)' 
                  : 'linear-gradient(90deg, #8b5cf6, #ec4899)' 
              }} 
            />
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedFilter(c.id)}
            className="glass-pill"
            style={{
              cursor: 'pointer',
              background: selectedFilter === c.id ? 'rgba(139, 92, 246, 0.25)' : 'var(--surface-card)',
              border: selectedFilter === c.id ? '1px solid var(--primary-light)' : '1px solid var(--border-glass)',
              color: selectedFilter === c.id ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Habits List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
        {filteredHabits.map((habit) => {
          const isWater = isWaterHabit(habit);
          const isLockedWater = isWater && !isHydration100;

          return (
            <div
              key={habit.id}
              onClick={() => toggleHabit(habit.id)}
              className="glass-panel glass-panel-interactive"
              style={{
                padding: '1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                borderColor: habit.completed 
                  ? 'rgba(16, 185, 129, 0.4)' 
                  : isLockedWater 
                  ? 'rgba(245, 158, 11, 0.4)' 
                  : 'var(--border-glass)',
                background: habit.completed 
                  ? 'rgba(16, 185, 129, 0.08)' 
                  : isLockedWater 
                  ? 'rgba(245, 158, 11, 0.05)' 
                  : 'var(--surface-card)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flex: 1 }}>
                
                {/* Checkbox Icon / Lock Icon */}
                <div style={{ flexShrink: 0 }}>
                  {habit.completed ? (
                    <CheckCircle2 size={24} color="#10b981" fill="#10b98122" />
                  ) : isLockedWater ? (
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '50%', 
                      background: 'rgba(245, 158, 11, 0.15)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      border: '1px solid rgba(245, 158, 11, 0.4)'
                    }}>
                      <Lock size={13} color="#f59e0b" />
                    </div>
                  ) : (
                    <Circle size={24} color="var(--text-dim)" />
                  )}
                </div>

                {/* Title & Category */}
                <div>
                  <div style={{ 
                    fontSize: '0.98rem', 
                    fontWeight: '600', 
                    color: habit.completed ? 'var(--text-muted)' : isLockedWater ? '#d97706' : 'var(--text-main)',
                    textDecoration: habit.completed ? 'line-through' : 'none'
                  }}>
                    {habit.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'capitalize' }}>
                      {getCategoryIcon(habit.category)} {habit.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#fb923c', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Flame size={12} fill="#fb923c" /> {habit.streak}d streak
                    </span>
                    
                    {/* Water Habit Specific Lock/Unlock Status Badge */}
                    {isWater && (
                      isLockedWater ? (
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: '600',
                          color: '#f59e0b', 
                          background: 'rgba(245, 158, 11, 0.12)',
                          padding: '0.1rem 0.45rem',
                          borderRadius: '10px',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                        }}>
                          <Lock size={10} /> Locked ({hydrationPct}% Water)
                        </span>
                      ) : (
                        <span style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: '600',
                          color: '#10b981', 
                          background: 'rgba(16, 185, 129, 0.12)',
                          padding: '0.1rem 0.45rem',
                          borderRadius: '10px',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.2rem'
                        }}>
                          💧 100% Hydration Complete!
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Rewards & Delete Action */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
                <div className="glass-pill" style={{ fontSize: '0.72rem', color: '#fbbf24', padding: '0.25rem 0.55rem' }}>
                  +10 🪙
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteHabit(habit.id); }}
                  className="btn-icon" 
                  title="Delete Habit"
                  style={{ width: '28px', height: '28px', background: 'transparent', border: 'none', color: 'var(--text-dim)' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contribution Heatmap Graph at the end of habits */}
      <ContributionGraph
        activityLog={activityLog}
        currentUser={currentUser}
        onShowAuth={onShowAuth}
      />

      {/* Add Custom Habit Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '440px', padding: '1.8rem', background: 'rgba(20, 24, 40, 0.95)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>Add New Wellness Habit</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
              Build a sustainable routine. Luna will cheer you on every day!
            </p>

            <form onSubmit={handleAddHabit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Habit Title
                </label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="E.g., 10-Minute Morning Sun Walk ☀️"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid var(--border-glass)',
                    color: '#fff',
                    fontSize: '0.95rem'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.4rem' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem' }}>
                  Category
                </label>
                <select 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid var(--border-glass)',
                    color: '#fff',
                    fontSize: '0.92rem'
                  }}
                >
                  <option value="mindfulness">Mindfulness & Breath 🧘</option>
                  <option value="fitness">Movement & Exercise 🏃</option>
                  <option value="nutrition">Healthy Nutrition 🥗</option>
                  <option value="sleep">Rest & Sleep 🌙</option>
                  <option value="growth">Productivity & Reading 📚</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Save Habit</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
