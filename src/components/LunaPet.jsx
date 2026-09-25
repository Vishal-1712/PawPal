import React, { useState, useEffect } from 'react';
import { Heart, Fish, Sparkles, Moon, Zap, ShoppingBag, AlertCircle, Coins, Music, PartyPopper } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { calculateLevelFromTotalXp } from '../utils/levelSystem';
import ChibiCat from './ChibiCat';

/* Game-style XP & Health Bar Component */
function StatBar({ label, value, max, color, icon }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: '700', color: '#166534' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>{icon} {label}</span>
        <span style={{ color }}>{value}/{max}</span>
      </div>
      <div style={{ height: '10px', background: '#d1fae5', borderRadius: '99px', overflow: 'hidden', border: '1px solid #a7f3d0' }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: color,
          borderRadius: '99px',
          transition: 'width 0.6s cubic-bezier(0.34,1.56,0.64,1)',
          boxShadow: `0 0 6px ${color}66`
        }} />
      </div>
    </div>
  );
}

export default function LunaPet({ 
  stats, 
  setStats, 
  equipped, 
  spendCoins, 
  addXp,
  isDancingExternal, 
  onNavigateToShop, 
  onTriggerDanceParty 
}) {
  const [petEmotion, setPetEmotion] = useState('normal');
  const [hearts, setHearts] = useState([]);
  const [lunaQuote, setLunaQuote] = useState("Purring happily! Keep up your awesome wellness habits! ✨");
  const [activeAction, setActiveAction] = useState(null);
  const [coinAlertMessage, setCoinAlertMessage] = useState(null);

  const quotes = [
    "The healthier you stay, the fluffier I become! 🐾💖",
    "Did you know? Drinking water makes my coat extra shiny! 💧",
    "Purrr... you're doing wonderfully today! 🐾",
    "A 5-minute stretch makes both of us feel great! 🧘",
    "Level up to watch me do the Happy Happy Happy cat dance! 💃🎵"
  ];

  useEffect(() => {
    if (isDancingExternal) {
      setPetEmotion('dancing');
      setLunaQuote("💃 Happy Happy Happy! Luna is dancing with joy! 🎵✨");
    } else if (petEmotion === 'dancing') {
      setPetEmotion('normal');
    }
  }, [isDancingExternal]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (petEmotion === 'normal') {
        setLunaQuote(quotes[Math.floor(Math.random() * quotes.length)]);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [petEmotion]);

  const spawnHeart = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const heart = { id: Date.now() + Math.random(), x: e.clientX - rect.left, y: e.clientY - rect.top };
    setHearts(p => [...p, heart]);
    setTimeout(() => setHearts(p => p.filter(h => h.id !== heart.id)), 1350);
  };

  // Petting Luna costs 10 Coins
  const handlePet = (e) => {
    if (activeAction) return;
    if (stats.coins < 10) {
      setCoinAlertMessage("Need 10 Coins to pet Luna! 🪙 Complete habits to earn coins!");
      setTimeout(() => setCoinAlertMessage(null), 3000);
      return;
    }

    const success = spendCoins(10);
    if (!success) return;

    spawnHeart(e);
    soundEngine.playPetSong();
    setPetEmotion('purring');
    setActiveAction('petting');
    setLunaQuote("🐱 Meow meow! Luna is purring happily with Meow Sleigh Ride! 🎶💚");
    
    // Add XP using addXp so level ups trigger the dance!
    if (addXp) {
      addXp(12);
    }

    setStats(p => ({
      ...p,
      happiness: Math.min(100, p.happiness + 5),
      fluffiness: Math.min(100, p.fluffiness + 3)
    }));

    setTimeout(() => { setPetEmotion('normal'); setActiveAction(null); }, 2400);
  };

  // Feeding Luna costs 10 Coins (Plays Kids Happy / Yippee song!)
  const handleFeed = () => {
    if (activeAction) return;
    if (stats.coins < 10) {
      setCoinAlertMessage("Need 10 Coins to feed Luna fresh salmon! 🪙 Complete habits to earn coins!");
      setTimeout(() => setCoinAlertMessage(null), 3000);
      return;
    }

    const success = spendCoins(10);
    if (!success) return;

    soundEngine.playFeedSong();
    setPetEmotion('eating');
    setActiveAction('feeding');
    setLunaQuote("🎉 YIPPEE! *Crunch crunch* Fresh salmon! Kids Happy cheer! 🐟✨");
    
    // Add XP using addXp so level ups trigger the dance!
    if (addXp) {
      addXp(18);
    }

    setStats(p => ({
      ...p,
      fluffiness: Math.min(100, p.fluffiness + 8),
      happiness: Math.min(100, p.happiness + 6)
    }));

    setTimeout(() => { setPetEmotion('normal'); setActiveAction(null); }, 2600);
  };

  // Play with yarn (Free, no XP gain, plays Cat Plays Drums sound!)
  const handlePlay = () => {
    if (activeAction) return;
    setActiveAction('playing');
    soundEngine.playCatPlaysDrums();
    setPetEmotion('playing');
    setLunaQuote("*Batting at the green yarn ball with Cat Plays Drums beat!* 🧶🥁✨");
    
    // No XP increase as requested!
    setStats(p => ({
      ...p,
      happiness: Math.min(100, p.happiness + 4)
    }));

    setTimeout(() => { setPetEmotion('normal'); setActiveAction(null); }, 3200);
  };

  // Power nap (Free, no XP gain, plays Snore mimimimimimi sound!)
  const handleNap = () => {
    if (activeAction) return;
    setActiveAction('sleeping');
    soundEngine.playSnore();
    setPetEmotion('sleeping');
    setLunaQuote("*Snore mimimimimimi...* Luna is taking a cozy power nap! 😴💤");
    
    // No XP increase
    setStats(p => ({
      ...p,
      happiness: Math.min(100, p.happiness + 2)
    }));

    setTimeout(() => { setPetEmotion('normal'); setActiveAction(null); }, 4000);
  };

  // Level & XP calculation using AP difference 50
  const levelInfo = calculateLevelFromTotalXp(stats.xp || 0);

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>

      {/* Clean Header - Just Luna's Sanctuary & Badges */}
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#14532d' }}>Luna's Sanctuary</h2>
        <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
          <span className="badge badge-purple">Level {levelInfo.level} Digital Pet</span>
          <span className="badge badge-gold">🪙 {stats.coins} Coins</span>
        </div>
        <p style={{ color: '#4b7a5c', fontSize: '0.82rem', marginTop: '0.4rem' }}>
          Your wellness companion. Interactive, responsive &amp; loving!
        </p>
      </div>

      {/* Coin Alert Notification */}
      {coinAlertMessage && (
        <div style={{
          background: '#fef2f2',
          border: '1.5px solid #f87171',
          borderRadius: '12px',
          padding: '0.6rem 0.9rem',
          marginBottom: '0.8rem',
          fontSize: '0.82rem',
          color: '#b91c1c',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <AlertCircle size={15} />
          <span>{coinAlertMessage}</span>
        </div>
      )}

      {/* Speech bubble */}
      <div style={{
        background: '#f0fdf4',
        border: '1.5px solid #d1fae5',
        borderRadius: '14px',
        padding: '0.65rem 1rem',
        marginBottom: '0.8rem',
        fontSize: '0.85rem',
        color: '#166534',
        fontWeight: '500',
        textAlign: 'center',
        position: 'relative'
      }}>
        {lunaQuote}
        {/* bubble tail */}
        <div style={{
          position: 'absolute', bottom: '-10px', left: '50%', transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '10px solid #d1fae5'
        }} />
      </div>

      {/* Cat Canvas */}
      <div
        onClick={handlePet}
        style={{
          minHeight: '280px',
          background: 'linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)',
          borderRadius: '16px',
          border: '1.5px solid #d1fae5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          position: 'relative',
          userSelect: 'none',
          overflow: 'hidden'
        }}
      >
        {/* Floating hearts */}
        {hearts.map(h => (
          <div key={h.id} className="floating-heart" style={{ left: `${h.x}px`, top: `${h.y}px` }}>💚</div>
        ))}

        {/* Decorative grass blades */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '28px', background: 'linear-gradient(0deg, #dcfce7 0%, transparent 100%)', borderRadius: '0 0 14px 14px' }} />

        <div className={petEmotion === 'dancing' ? 'anim-dance' : petEmotion === 'purring' ? 'anim-purr' : 'anim-float'} style={{ position: 'relative', zIndex: 2 }}>
          <ChibiCat emotion={petEmotion} equipped={equipped} isPurring={petEmotion === 'purring'} />
        </div>

        <p style={{ fontSize: '0.75rem', color: '#4b7a5c', marginTop: '0.2rem', zIndex: 2 }}>
          ✨ Click Luna to pet (Costs 10 🪙) &amp; hear her purr!
        </p>
      </div>

      {/* ── XP & Health Stats (game-style bars with Level System AP diff 50) ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginTop: '1.1rem' }}>
        <StatBar
          label="Happiness"
          value={stats.happiness}
          max={100}
          color="linear-gradient(90deg,#16a34a,#4ade80)"
          icon="💚"
        />
        <StatBar
          label="Fluffiness (Wellness)"
          value={stats.fluffiness}
          max={100}
          color="linear-gradient(90deg,#059669,#22c55e)"
          icon="⭐"
        />
        <StatBar
          label={`Level ${levelInfo.level} Kitten Progression (+50 XP per lvl)`}
          value={levelInfo.xpInCurrentLevel}
          max={levelInfo.xpNeededForNextLevel}
          color="linear-gradient(90deg,#15803d,#4ade80)"
          icon="⚡"
        />
      </div>

      {/* Action Buttons with 10 Coin cost */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <button 
          onClick={handlePet} 
          className={`btn ${activeAction === 'petting' ? 'btn-primary' : 'btn-outline'}`} 
          style={{ flex: '1 1 120px', fontSize: '0.82rem', position: 'relative' }}
          title="Pet Luna (Costs 10 Coins)"
        >
          <Heart size={14} fill={activeAction === 'petting' ? '#fff' : '#16a34a'} color={activeAction === 'petting' ? '#fff' : '#16a34a'} />
          <span>Pet Luna (10 🪙)</span>
        </button>

        <button 
          onClick={handleFeed} 
          className={`btn ${activeAction === 'feeding' ? 'btn-primary' : 'btn-outline'}`} 
          style={{ flex: '1 1 120px', fontSize: '0.82rem' }}
          title="Feed Luna fresh salmon (Costs 10 Coins)"
        >
          <Fish size={14} color={activeAction === 'feeding' ? '#fff' : '#16a34a'} />
          <span>Feed Treat (10 🪙)</span>
        </button>

        <button 
          onClick={handlePlay} 
          className={`btn ${activeAction === 'playing' ? 'btn-primary' : 'btn-outline'}`} 
          style={{ flex: '1 1 100px', fontSize: '0.82rem' }}
          title="Play with yarn (Free)"
        >
          <Sparkles size={14} color={activeAction === 'playing' ? '#fff' : '#16a34a'} />
          <span>Play Yarn</span>
        </button>

        <button 
          onClick={handleNap} 
          className={`btn ${activeAction === 'sleeping' ? 'btn-primary' : 'btn-outline'}`} 
          style={{ flex: '1 1 100px', fontSize: '0.82rem' }}
          title="Power nap (Free)"
        >
          <Moon size={14} color={activeAction === 'sleeping' ? '#fff' : '#16a34a'} />
          <span>Power Nap</span>
        </button>

        <button 
          onClick={onTriggerDanceParty} 
          className="btn btn-outline" 
          style={{ flex: '1 1 110px', fontSize: '0.82rem', borderColor: '#a7f3d0', background: '#f0fdf4' }}
          title="Play Happy Happy Happy dance party!"
        >
          <PartyPopper size={14} color="#16a34a" />
          <span>Dance Party 🎵</span>
        </button>
      </div>
    </div>
  );
}
