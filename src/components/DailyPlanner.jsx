import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Sparkles, 
  RefreshCw, 
  Sun, 
  Moon, 
  Droplet, 
  Utensils, 
  Wind, 
  Dumbbell
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

export default function DailyPlanner({ onAddXp, onAddCoins }) {
  const [wakeTime, setWakeTime] = useState('07:30');
  const [bedTime, setBedTime] = useState('22:30');
  const [schedule, setSchedule] = useState([
    { id: 1, time: '07:30 AM', title: 'Gentle Wake-Up & Warm Water', category: 'hydration', completed: true, desc: 'Drink a big glass of room-temp water and do a 2-minute cat stretch.' },
    { id: 2, time: '08:15 AM', title: 'Nourishing Breakfast & Luna Check-In', category: 'food', completed: false, desc: 'Enjoy antioxidant smoothie bowl or eggs & toast.' },
    { id: 3, time: '09:30 AM', title: 'Morning Deep Focus Sprint 🎯', category: 'work', completed: false, desc: 'Block all distractions and conquer your #1 priority task.' },
    { id: 4, time: '11:15 AM', title: 'Hydration & Posture Reset Break 💧', category: 'hydration', completed: false, desc: 'Refill water bottle and roll shoulders 5 times.' },
    { id: 5, time: '01:00 PM', title: 'Wholesome Lunch & 15-Min Walk 🥗', category: 'food', completed: false, desc: 'Step outside for natural daylight and digestion.' },
    { id: 6, time: '03:30 PM', title: '4-7-8 Mindfulness Breathing Reset 🧘', category: 'zen', completed: false, desc: '3 minutes of deep breathing to clear afternoon brain fog.' },
    { id: 7, time: '06:00 PM', title: 'Active Workout or Playful Movement 🏃', category: 'fitness', completed: false, desc: 'Cardio, strength, or cycling to energize your body.' },
    { id: 8, time: '07:30 PM', title: 'Balanced Dinner with Veggies & Protein', category: 'food', completed: false, desc: 'Unplug while eating and savor every bite.' },
    { id: 9, time: '09:30 PM', title: 'Screen-Free Wind-Down & Reading 🌙', category: 'sleep', completed: false, desc: 'Dim lights, cozy chamomile tea, and restful sleep.' }
  ]);

  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('12:00 PM');
  const [showAddModal, setShowAddModal] = useState(false);

  const toggleBlock = (id) => {
    soundEngine.playHabitComplete();
    setSchedule(schedule.map(block => {
      if (block.id === id) {
        const nextComp = !block.completed;
        if (nextComp) {
          onAddXp(20);
          onAddCoins(10);
        }
        return { ...block, completed: nextComp };
      }
      return block;
    }));
  };

  const handleAddBlock = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newBlock = {
      id: Date.now(),
      time: newTime,
      title: newTitle.trim(),
      category: 'work',
      completed: false,
      desc: 'Custom wellness activity'
    };

    setSchedule([...schedule, newBlock]);
    setNewTitle('');
    setShowAddModal(false);
    soundEngine.playPurrBurst();
  };

  const completedCount = schedule.filter(s => s.completed).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Planner Header Card */}
      <div className="glass-panel" style={{ padding: '1.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Daily Wellness Timeline 📅</h2>
              <span className="badge badge-purple">{completedCount}/{schedule.length} Completed</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              A balanced rhythm for mind, body, and focus. Check off timeblocks as your day unfolds!
            </p>
          </div>

          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            <Plus size={16} />
            <span>Add Time Block</span>
          </button>
        </div>

        {/* Schedule Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap', fontSize: '0.88rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sun size={16} color="#fbbf24" />
            <span style={{ color: 'var(--text-muted)' }}>Wake Time:</span>
            <input 
              type="time" 
              value={wakeTime} 
              onChange={(e) => setWakeTime(e.target.value)} 
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', borderRadius: '6px', color: '#fff', padding: '0.2rem 0.5rem' }} 
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Moon size={16} color="#818cf8" />
            <span style={{ color: 'var(--text-muted)' }}>Bed Time:</span>
            <input 
              type="time" 
              value={bedTime} 
              onChange={(e) => setBedTime(e.target.value)} 
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', borderRadius: '6px', color: '#fff', padding: '0.2rem 0.5rem' }} 
            />
          </div>
        </div>
      </div>

      {/* Timeline Schedule Blocks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {schedule.map((block) => (
          <div
            key={block.id}
            onClick={() => toggleBlock(block.id)}
            className="glass-panel glass-panel-interactive"
            style={{
              padding: '1.2rem 1.5rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              borderColor: block.completed ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-glass)',
              background: block.completed ? 'rgba(16, 185, 129, 0.06)' : 'var(--surface-card)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
              
              {/* Check Circle */}
              <div style={{ flexShrink: 0 }}>
                {block.completed ? (
                  <CheckCircle2 size={24} color="#10b981" />
                ) : (
                  <Circle size={24} color="var(--text-dim)" />
                )}
              </div>

              {/* Time Badge */}
              <div className="glass-pill" style={{ fontSize: '0.78rem', color: 'var(--primary-light)', padding: '0.3rem 0.7rem', flexShrink: 0 }}>
                <Clock size={13} />
                <span>{block.time}</span>
              </div>

              {/* Content */}
              <div>
                <div style={{ 
                  fontWeight: '700', 
                  fontSize: '0.98rem', 
                  color: block.completed ? 'var(--text-muted)' : 'var(--text-main)',
                  textDecoration: block.completed ? 'line-through' : 'none'
                }}>
                  {block.title}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.15rem' }}>
                  {block.desc}
                </div>
              </div>
            </div>

            {/* XP Bonus */}
            <div className="glass-pill" style={{ fontSize: '0.75rem', color: '#fbbf24' }}>
              +20 XP
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Time Block Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{ width: '100%', maxWidth: '420px', padding: '1.8rem', background: 'rgba(20, 24, 40, 0.95)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>Add Schedule Block</h3>
            <form onSubmit={handleAddBlock}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Time</label>
                <input 
                  type="text" 
                  value={newTime} 
                  onChange={(e) => setNewTime(e.target.value)} 
                  placeholder="E.g., 02:30 PM"
                  style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', color: '#fff' }} 
                />
              </div>

              <div style={{ marginBottom: '1.4rem' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Activity Name</label>
                <input 
                  type="text" 
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  placeholder="E.g., 15-Minute Outdoor Walk 🌿"
                  required
                  style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: 'var(--radius-md)', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', color: '#fff' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'flex-end' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">Cancel</button>
                <button type="submit" className="btn btn-primary">Add to Day</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
