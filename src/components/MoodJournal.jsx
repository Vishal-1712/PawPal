import React, { useState } from 'react';
import { 
  Smile, 
  Frown, 
  Meh, 
  Heart, 
  Sparkles, 
  Wind, 
  Music, 
  BookOpen, 
  Calendar, 
  Send, 
  Clock,
  Trash2
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

export default function MoodJournal({ 
  moodLogs, 
  setMoodLogs, 
  onTriggerBreathing, 
  onTriggerMusic,
  onAddXp,
  onAddCoins 
}) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [journalNote, setJournalNote] = useState('');
  const [activeCalmProtocol, setActiveCalmProtocol] = useState(null);

  const moodOptions = [
    { id: 'ecstatic', label: 'Super Joyful', emoji: '🌟', color: '#fbbf24', desc: 'Feeling vibrant and full of energy!' },
    { id: 'peaceful', label: 'Peaceful', emoji: '😌', color: '#34d399', desc: 'Calm, balanced, and present.' },
    { id: 'neutral', label: 'Neutral / Okay', emoji: '😐', color: '#94a3b8', desc: 'Just taking things one step at a time.' },
    { id: 'stressed', label: 'Stressed', emoji: '😣', color: '#fb923c', desc: 'Feeling overloaded or tense.' },
    { id: 'sad', label: 'Down / Sad', emoji: '😢', color: '#60a5fa', desc: 'Feeling blue or emotionally heavy.' },
    { id: 'exhausted', label: 'Exhausted', emoji: '😴', color: '#a78bfa', desc: 'Low battery, need gentle rest.' }
  ];

  const tagOptions = ['Work 💼', 'Family 🏡', 'Sleep 🌙', 'Health 🥗', 'Study 📚', 'Social 👥', 'Weather ⛅', 'Self-Care 🧘'];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const todayDateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const entriesToday = (moodLogs || []).filter(log => log.date === todayDateStr).length;
  const isRewardEligible = entriesToday < 2;

  const handleSaveMood = (e) => {
    e.preventDefault();
    if (!selectedMood) return;

    soundEngine.playPurrBurst();
    
    // Only award XP/Coins for the first 2 entries of the day to prevent spam-farming
    if (isRewardEligible) {
      onAddXp(20);
      onAddCoins(10);
    }

    const newEntry = {
      id: Date.now(),
      mood: selectedMood,
      tags: selectedTags,
      note: journalNote,
      date: todayDateStr,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMoodLogs([newEntry, ...(moodLogs || [])]);

    // Trigger Luna Calming Protocol for low moods
    if (['stressed', 'sad', 'exhausted'].includes(selectedMood.id)) {
      setActiveCalmProtocol({
        mood: selectedMood.label,
        message: selectedMood.id === 'stressed'
          ? "I see you're carrying a lot of tension today. Luna is sending you a warm digital cuddle! Let's take a 3-minute pause to reset your nervous system. 🌸🐾"
          : selectedMood.id === 'sad'
          ? "It's completely okay to have heavy days. Be extra gentle with yourself. You are valued and loved! Would you like some soothing music or a quiet moment? 🐱💖"
          : "Your battery is running low. Make sure to hydrate, unplug from bright screens, and give yourself permission to rest. 🛌💧"
      });
    } else {
      setActiveCalmProtocol(null);
    }

    // Reset inputs
    setJournalNote('');
    setSelectedTags([]);
  };

  const handleDeleteEntry = (entryId) => {
    soundEngine.playClickRing();
    setMoodLogs((prev) => prev.filter(item => item.id !== entryId));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(320px, 400px)', gap: '1.5rem' }}>
      
      {/* Mood Check-In Form */}
      <div className="glass-panel" style={{ padding: '1.8rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Daily Mood Journal</h2>
            <span className="badge badge-purple">Self-Reflection</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            How does your mind and heart feel right now? Luna is here to listen without judgment.
          </p>
        </div>

        <form onSubmit={handleSaveMood}>
          {/* Mood Selector Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.8rem', marginBottom: '1.5rem' }}>
            {moodOptions.map((opt) => {
              const isSelected = selectedMood?.id === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => setSelectedMood(opt)}
                  className="glass-panel glass-panel-interactive"
                  style={{
                    padding: '0.9rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? `2px solid ${opt.color}` : '1px solid var(--border-glass)',
                    background: isSelected ? 'rgba(255, 255, 255, 0.08)' : 'var(--surface-subtle)',
                    boxShadow: isSelected ? `0 0 15px ${opt.color}44` : 'none'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.3rem' }}>{opt.emoji}</div>
                  <div style={{ fontSize: '0.88rem', fontWeight: '700', color: opt.color }}>{opt.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>{opt.desc}</div>
                </div>
              );
            })}
          </div>

          {/* Context Tags */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              What influenced this mood? (Select tags)
            </label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {tagOptions.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className="glass-pill"
                  style={{
                    cursor: 'pointer',
                    background: selectedTags.includes(tag) ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.04)',
                    borderColor: selectedTags.includes(tag) ? 'var(--primary-light)' : 'var(--border-glass)',
                    color: selectedTags.includes(tag) ? '#fff' : 'var(--text-muted)'
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Private Journal Notes */}
          <div style={{ marginBottom: '1.4rem' }}>
            <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
              Thoughts & Gratitude (Optional)
            </label>
            <textarea
              rows="3"
              value={journalNote}
              onChange={(e) => setJournalNote(e.target.value)}
              placeholder="Jot down a few thoughts, wins, or feelings..."
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--surface-light)',
                border: '1.5px solid var(--border-light)',
                color: 'var(--text-main)',
                fontSize: '0.9rem',
                resize: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <button type="submit" disabled={!selectedMood} className="btn btn-primary" style={{ width: '100%' }}>
            <Sparkles size={16} />
            <span>Save Mood & Log to Journal ({isRewardEligible ? '+20 XP, +10 🪙' : 'Daily limit reached'})</span>
          </button>
        </form>

        {/* Luna Calming Protocol Card (When triggered) */}
        {activeCalmProtocol && (
          <div style={{ 
            marginTop: '1.5rem', 
            padding: '1.2rem', 
            borderRadius: 'var(--radius-md)', 
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(244, 63, 94, 0.15))',
            border: '1px solid var(--primary-glow)',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.3rem' }}>🐱</span>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--secondary-light)' }}>
                Luna's Calming Care Protocol
              </h4>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '0.9rem', lineHeight: '1.5' }}>
              {activeCalmProtocol.message}
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <button onClick={onTriggerBreathing} className="btn btn-secondary" style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}>
                <Wind size={15} />
                <span>Start 4-7-8 Breathing</span>
              </button>
              <button onClick={onTriggerMusic} className="btn btn-outline" style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}>
                <Music size={15} />
                <span>Play Calming Lo-Fi</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mood History & Reflection Log */}
      <div className="glass-panel" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={18} color="#a78bfa" /> Recent Check-Ins
        </h3>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Your emotional journey and trends over time.
        </p>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '520px' }}>
          {moodLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-dim)', fontSize: '0.88rem' }}>
              No check-ins yet today. Select an emotion on the left to start your journal! 🐾
            </div>
          ) : (
            moodLogs.map((log) => (
              <div key={log.id} className="stat-card" style={{ borderLeft: `3px solid ${log.mood.color}`, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.92rem', color: log.mood.color, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span>{log.mood.emoji}</span> {log.mood.label}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Clock size={11} /> {log.date} at {log.time}
                    </span>
                    <button
                      onClick={() => handleDeleteEntry(log.id)}
                      title="Delete entry"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-dim)',
                        padding: '2px'
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {log.note && (
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', marginTop: '0.35rem', fontStyle: 'italic' }}>
                    "{log.note}"
                  </p>
                )}

                {log.tags && log.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
                    {log.tags.map((t, idx) => (
                      <span key={idx} className="glass-pill" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
