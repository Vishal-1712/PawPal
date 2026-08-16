import React from 'react';
import { 
  Sparkles, 
  Coins, 
  Flame, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Cat, 
  Droplet, 
  CheckCircle2, 
  HeartHandshake, 
  Utensils, 
  Music, 
  Wind, 
  Calendar, 
  ShoppingBag,
  Trophy
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { calculateLevelFromTotalXp } from '../utils/levelSystem';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  stats, 
  isMuted, 
  setIsMuted, 
  theme, 
  setTheme,
  onPetLunaQuick,
  currentUser,
  onShowAuth,
  onLogout
}) {
  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundEngine.setMuted(newMuted);
    if (!newMuted) soundEngine.playMeow();
  };

  const navItems = [
    { id: 'sanctuary', label: 'Luna Sanctuary', icon: Cat },
    { id: 'shop', label: "Luna's Boutique 🎩", icon: ShoppingBag },
    { id: 'hydration', label: 'Hydration 💧', icon: Droplet },
    { id: 'habits', label: 'Habits 🎯', icon: CheckCircle2 },
    { id: 'mood', label: 'Mood Journal 💖', icon: Sparkles },
    { id: 'food', label: 'Nutrition 🥗', icon: Utensils },
    { id: 'mindfulness', label: 'Zen & Breath 🧘', icon: Wind },
    { id: 'sound', label: 'Sound Sanctuary 🎵', icon: Music },
    { id: 'planner', label: 'Day Planner 📅', icon: Calendar },
    { id: 'quests', label: 'Quests 🏆', icon: Trophy },
  ];

  // Level & XP calculation using AP difference 50
  const levelInfo = calculateLevelFromTotalXp(stats.xp || 0);

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1.5px solid #d1fae5',
      boxShadow: '0 2px 8px rgba(22,163,74,0.07)',
      position: 'sticky',
      top: 0,
      zIndex: 90
    }}>
      {/* Top bar */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.8rem'
      }}>
        {/* Brand */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
          onClick={() => setActiveTab('sanctuary')}
        >
          <div
            onClick={e => { e.stopPropagation(); onPetLunaQuick(); }}
            title="Click to pet Luna! (Costs 10 Coins)"
            className="anim-float"
            style={{
              width: '42px', height: '42px',
              borderRadius: '50%',
              background: '#16a34a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.3rem',
              boxShadow: '0 3px 10px rgba(22,163,74,0.3)',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            🐱
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="brand-font" style={{
                fontSize: '1.35rem', fontWeight: '800', color: '#14532d'
              }}>PawPal</span>
              <span className="badge badge-purple" style={{ fontSize: '0.68rem' }}>Wellness</span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#4b7a5c', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span>Luna Lvl {levelInfo.level}</span>
              <span style={{ color: '#d1fae5' }}>•</span>
              <span style={{ color: '#16a34a', fontWeight: '600' }}>{stats.happiness}% Happy</span>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          {/* Streak */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            background: '#f0fdf4', border: '1.5px solid #a7f3d0',
            borderRadius: '99px', padding: '0.3rem 0.8rem',
            fontSize: '0.82rem', fontWeight: '700', color: '#15803d'
          }} title="Daily Wellness Streak">
            <Droplet size={14} fill="#4ade80" color="#4ade80" />
            <span>{stats.streak} Days</span>
          </div>

          {/* Coins */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            background: '#f0fdf4', border: '1.5px solid #a7f3d0',
            borderRadius: '99px', padding: '0.3rem 0.8rem',
            fontSize: '0.82rem', fontWeight: '700', color: '#15803d'
          }} title="Wellness Coins (Used to pet, feed & buy boutique outfits)">
            <Coins size={14} fill="#4ade80" color="#4ade80" />
            <span>{stats.coins}</span>
          </div>

          {/* XP / Level bar */}
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '0.15rem',
            minWidth: '150px'
          }} title={`Level ${levelInfo.level}: ${levelInfo.xpInCurrentLevel}/${levelInfo.xpNeededForNextLevel} XP to Level ${levelInfo.level + 1}`}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#4b7a5c', fontWeight: '600' }}>
              <span>Lvl {levelInfo.level} Kitten ({levelInfo.xpInCurrentLevel}/{levelInfo.xpNeededForNextLevel} XP)</span>
              <span style={{ color: '#16a34a' }}>{levelInfo.progressPercent}%</span>
            </div>
            <div className="progress-bar-container" style={{ height: '7px' }}>
              <div className="progress-bar-fill" style={{
                width: `${levelInfo.progressPercent}%`,
                background: 'linear-gradient(90deg, #16a34a, #22c55e)'
              }} />
            </div>
          </div>

          {/* Mute */}
          <button
            onClick={toggleMute}
            className="btn btn-outline btn-icon"
            style={{ width: '36px', height: '36px', borderColor: '#a7f3d0' }}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted
              ? <VolumeX size={15} color="#6b7280" />
              : <Volume2 size={15} color="#16a34a" />}
          </button>

          {/* User Profile / Auth Action */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f0fdf4', border: '1.5px solid #a7f3d0', borderRadius: '99px', padding: '0.2rem 0.6rem 0.2rem 0.8rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#15803d', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                👤 {currentUser.username}
              </span>
              <button 
                onClick={onLogout} 
                className="btn btn-outline" 
                style={{ padding: '0.15rem 0.55rem', fontSize: '0.72rem', borderRadius: '99px', borderColor: '#86efac', color: '#166534' }}
                title="Log Out of your profile"
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => onShowAuth('general')}
              className="btn btn-primary"
              style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem', fontWeight: '700', borderRadius: '99px', boxShadow: '0 3px 10px rgba(22, 163, 74, 0.25)' }}
            >
              <Sparkles size={14} />
              <span>Login / Sign Up</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab navigation */}
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 1.5rem 0.6rem' }}>
        <nav className="nav-tabs-wrapper">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); soundEngine.init(); }}
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
