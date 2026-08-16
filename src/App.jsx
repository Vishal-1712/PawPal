import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import LunaPet from './components/LunaPet';
import HydrationTracker from './components/HydrationTracker';
import HabitsTracker from './components/HabitsTracker';
import MoodJournal from './components/MoodJournal';
import FoodPlanner from './components/FoodPlanner';
import SoundSanctuary from './components/SoundSanctuary';
import MindfulnessHub from './components/MindfulnessHub';
import DailyPlanner from './components/DailyPlanner';
import PetShop from './components/PetShop';
import DailyQuests from './components/DailyQuests';
import ChibiCat from './components/ChibiCat';
import AuthModal from './components/AuthModal';
import { soundEngine } from './utils/audio';
import { calculateLevelFromTotalXp } from './utils/levelSystem';
import confetti from 'canvas-confetti';
import { Sparkles, Coins, Trophy, Music, Play, Square, PartyPopper } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('sanctuary');
  const [isMuted, setIsMuted] = useState(false);
  const [theme, setTheme] = useState('light');

  // Level Up Celebration State
  const [levelUpModal, setLevelUpModal] = useState(null); // { oldLevel, newLevel }
  const [isLunaDancing, setIsLunaDancing] = useState(false);
  const activeAudioRef = useRef(null);

  // Authentication & Profile Session State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('pawpal_session');
    if (saved) {
      try {
        const session = JSON.parse(saved);
        const users = JSON.parse(localStorage.getItem('pawpal_users') || '{}');
        return users[session.username?.toLowerCase()] || { username: session.username };
      } catch (e) {}
    }
    return null;
  });

  const [authModalReason, setAuthModalReason] = useState(null); // null | 'contribution' | 'boutique' | 'general'

  const getLocalDateKey = (date = new Date()) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Activity Log State (Recorded per user ID; empty {} when guest/new user)
  const [activityLog, setActivityLog] = useState(() => {
    if (!currentUser) return {}; // 0 submissions by default
    const key = `pawpal_user_${currentUser.username.toLowerCase()}_activity`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {};
  });

  const recordActivity = (amount = 1) => {
    const todayKey = getLocalDateKey(new Date());
    setActivityLog((prev) => {
      const next = { ...prev, [todayKey]: (prev[todayKey] || 0) + amount };
      if (currentUser) {
        localStorage.setItem(`pawpal_user_${currentUser.username.toLowerCase()}_activity`, JSON.stringify(next));
      }
      return next;
    });
  };

  // Stats: Level 1 for Guest, Loaded profile for Logged In User
  const [stats, setStats] = useState(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`pawpal_user_${currentUser.username.toLowerCase()}_stats`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
      return { streak: 1, coins: 40, xp: 35, level: 1, happiness: 85, fluffiness: 80 };
    }
    // Default Guest state: Level 1 (35 XP), 0 streak, 20 coins
    return { streak: 0, coins: 20, xp: 35, level: 1, happiness: 80, fluffiness: 80 };
  });

  // Equipped Cosmetics on Luna
  const [equipped, setEquipped] = useState(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`pawpal_user_${currentUser.username.toLowerCase()}_equipped`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
      return { hat: 'flowercrown', collar: 'bell', bed: 'cloud', room: 'twilight' };
    }
    return { hat: 'none', collar: 'none', bed: 'basket', room: 'twilight' };
  });

  // Inventory Owned Items
  const [inventory, setInventory] = useState(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`pawpal_user_${currentUser.username.toLowerCase()}_inventory`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
      return ['none', 'flowercrown', 'bell', 'cloud', 'twilight'];
    }
    return ['none', 'basket', 'twilight'];
  });

  // Hydration Tracker State
  const [waterData, setWaterData] = useState(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`pawpal_user_${currentUser.username.toLowerCase()}_water`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
      return { currentMl: 750, goalMl: 2000, history: [{ time: '08:30 AM', ml: 250 }, { time: '11:00 AM', ml: 500 }] };
    }
    return { currentMl: 0, goalMl: 2000, history: [] };
  });

  // Habits State
  const [habits, setHabits] = useState(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`pawpal_user_${currentUser.username.toLowerCase()}_habits`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [
      { id: 'h1', title: '10-Minute Morning Sun & Cat-Cow Stretch 🧘', category: 'mindfulness', completed: false, streak: 0, xpReward: 25, coinReward: 10 },
      { id: 'h2', title: 'Drink 8 Fresh Glasses of Water 💧', category: 'nutrition', completed: false, streak: 0, xpReward: 25, coinReward: 10 },
      { id: 'h3', title: '30-Minute Outdoor Walk / Cardio 🏃', category: 'fitness', completed: false, streak: 0, xpReward: 25, coinReward: 10 },
      { id: 'h4', title: 'Eat a Rainbow Nutrient-Rich Lunch 🥗', category: 'nutrition', completed: false, streak: 0, xpReward: 25, coinReward: 10 },
      { id: 'h5', title: 'Screen-Free Relaxing Wind-Down (10 PM) 🌙', category: 'sleep', completed: false, streak: 0, xpReward: 25, coinReward: 10 },
      { id: 'h6', title: 'Read 15 Minutes of a Book 📚', category: 'growth', completed: false, streak: 0, xpReward: 25, coinReward: 10 }
    ];
  });

  // Mood Journal Logs
  const [moodLogs, setMoodLogs] = useState(() => [
    {
      id: 1,
      mood: { id: 'peaceful', label: 'Peaceful', emoji: '😌', color: '#16a34a' },
      tags: ['Self-Care 🧘', 'Sleep 🌙'],
      note: 'Felt refreshed and ready to grow with Luna today!',
      date: 'Today',
      time: '09:15 AM'
    }
  ]);

  // Daily Quests
  const [quests, setQuests] = useState(() => [
    { id: 'q1', title: 'Sip 4 Glasses of Water 💧', desc: 'Reach 1000ml hydration intake.', progress: 0, target: 4, coinReward: 15, xpReward: 30, claimed: false },
    { id: 'q2', title: 'Conquer 3 Daily Habits 🎯', desc: 'Check off 3 wellness habits.', progress: 0, target: 3, coinReward: 20, xpReward: 40, claimed: false },
    { id: 'q3', title: 'Log a Mood Journal Entry 💖', desc: 'Check in with how your heart feels.', progress: 0, target: 1, coinReward: 10, xpReward: 25, claimed: false },
    { id: 'q4', title: 'Complete 1 Mindfulness Session 🧘', desc: 'Do a 4-7-8 breathing or cloud visualization.', progress: 0, target: 1, coinReward: 15, xpReward: 35, claimed: false }
  ]);

  // Handle Login Event: Load or create user profile data
  const handleLogin = (user) => {
    const username = user.username.toLowerCase();
    setCurrentUser(user);
    setAuthModalReason(null);

    // Save session
    localStorage.setItem('pawpal_session', JSON.stringify({ username: user.username, loggedInAt: Date.now() }));

    // Load or initialize Stats
    const savedStats = localStorage.getItem(`pawpal_user_${username}_stats`);
    if (savedStats) setStats(JSON.parse(savedStats));
    else setStats({ streak: 1, coins: 40, xp: 35, level: 1, happiness: 85, fluffiness: 80 });

    // Load or initialize Cosmetics
    const savedEquipped = localStorage.getItem(`pawpal_user_${username}_equipped`);
    if (savedEquipped) setEquipped(JSON.parse(savedEquipped));
    else setEquipped({ hat: 'flowercrown', collar: 'bell', bed: 'cloud', room: 'twilight' });

    const savedInventory = localStorage.getItem(`pawpal_user_${username}_inventory`);
    if (savedInventory) setInventory(JSON.parse(savedInventory));
    else setInventory(['none', 'flowercrown', 'bell', 'cloud', 'twilight']);

    // Load or initialize Water Data
    const savedWater = localStorage.getItem(`pawpal_user_${username}_water`);
    if (savedWater) setWaterData(JSON.parse(savedWater));
    else setWaterData({ currentMl: 750, goalMl: 2000, history: [{ time: '08:30 AM', ml: 250 }] });

    // Load or initialize Activity Log (Contribution Graph)
    const savedActivity = localStorage.getItem(`pawpal_user_${username}_activity`);
    if (savedActivity) {
      setActivityLog(JSON.parse(savedActivity));
    } else {
      setActivityLog({});
      localStorage.setItem(`pawpal_user_${username}_activity`, JSON.stringify({}));
    }
  };

  // Handle Logout Event: Reset to Guest Mode (Level 1, 0 streak, 0 submissions)
  const handleLogout = () => {
    localStorage.removeItem('pawpal_session');
    setCurrentUser(null);

    setStats({ streak: 0, coins: 20, xp: 35, level: 1, happiness: 80, fluffiness: 80 });
    setEquipped({ hat: 'none', collar: 'none', bed: 'basket', room: 'twilight' });
    setInventory(['none', 'basket', 'twilight']);
    setWaterData({ currentMl: 0, goalMl: 2000, history: [] });
    setHabits([
      { id: 'h1', title: '10-Minute Morning Sun & Cat-Cow Stretch 🧘', category: 'mindfulness', completed: false, streak: 0, xpReward: 25, coinReward: 10 },
      { id: 'h2', title: 'Drink 8 Fresh Glasses of Water 💧', category: 'nutrition', completed: false, streak: 0, xpReward: 25, coinReward: 10 },
      { id: 'h3', title: '30-Minute Outdoor Walk / Cardio 🏃', category: 'fitness', completed: false, streak: 0, xpReward: 25, coinReward: 10 },
      { id: 'h4', title: 'Eat a Rainbow Nutrient-Rich Lunch 🥗', category: 'nutrition', completed: false, streak: 0, xpReward: 25, coinReward: 10 },
      { id: 'h5', title: 'Screen-Free Relaxing Wind-Down (10 PM) 🌙', category: 'sleep', completed: false, streak: 0, xpReward: 25, coinReward: 10 },
      { id: 'h6', title: 'Read 15 Minutes of a Book 📚', category: 'growth', completed: false, streak: 0, xpReward: 25, coinReward: 10 }
    ]);
    setActivityLog({});
  };

  // Auto-Save Effect for Logged-In Users
  useEffect(() => {
    if (currentUser) {
      const username = currentUser.username.toLowerCase();
      localStorage.setItem(`pawpal_user_${username}_stats`, JSON.stringify(stats));
      localStorage.setItem(`pawpal_user_${username}_equipped`, JSON.stringify(equipped));
      localStorage.setItem(`pawpal_user_${username}_inventory`, JSON.stringify(inventory));
      localStorage.setItem(`pawpal_user_${username}_water`, JSON.stringify(waterData));
      localStorage.setItem(`pawpal_user_${username}_habits`, JSON.stringify(habits));
      localStorage.setItem(`pawpal_user_${username}_activity`, JSON.stringify(activityLog));
    }
  }, [currentUser, stats, equipped, inventory, waterData, habits, activityLog]);

  // Sync "Drink 8 Fresh Glasses of Water" habit with Hydration Tracker progress (100% complete)
  useEffect(() => {
    const isHydration100 = waterData.currentMl >= waterData.goalMl && waterData.goalMl > 0;
    setHabits((prevHabits) =>
      prevHabits.map((h) => {
        const isWaterHabit = h.id === 'h2' || h.title.toLowerCase().includes('drink 8') || (h.category === 'nutrition' && h.title.toLowerCase().includes('water'));
        if (isWaterHabit) {
          if (isHydration100 && !h.completed) {
            return { ...h, completed: true, streak: h.streak + 1 };
          } else if (!isHydration100 && h.completed) {
            return { ...h, completed: false };
          }
        }
        return h;
      })
    );
  }, [waterData.currentMl, waterData.goalMl]);

  // AUTO-STOP all audio whenever the user navigates to a different tab
  useEffect(() => {
    soundEngine.stopActiveAudio();
  }, [activeTab]);

  // Level Up & XP Calculation with difference 50
  const addXp = (amount) => {
    setStats((prev) => {
      const currentLevel = prev.level || 1;
      const nextTotalXp = (prev.xp || 0) + amount;
      const levelInfo = calculateLevelFromTotalXp(nextTotalXp);

      // Check if leveled up!
      if (levelInfo.level > currentLevel) {
        triggerLevelUpCelebration(currentLevel, levelInfo.level);
      }

      return {
        ...prev,
        xp: nextTotalXp,
        level: levelInfo.level
      };
    });
  };

  // Trigger Level Up Dance Celebration with Garama and Mandundung Song!
  const triggerLevelUpCelebration = (oldLevel, newLevel) => {
    // 1. Confetti explosion
    confetti({
      particleCount: 160,
      spread: 100,
      origin: { y: 0.5 }
    });

    // 2. Play Happy Happy Happy Cat Song
    soundEngine.playLevelUpDanceSong();
    // Keep activeAudioRef in sync for closeLevelUpModal
    activeAudioRef.current = soundEngine.activeAudio;

    // 3. Make Luna dance
    setIsLunaDancing(true);

    // 4. Award bonus +25 coins
    addCoins(25);

    // 5. Open celebration modal
    setLevelUpModal({ oldLevel, newLevel });
  };

  const closeLevelUpModal = () => {
    soundEngine.stopActiveAudio();
    activeAudioRef.current = null;
    setLevelUpModal(null);
    setIsLunaDancing(false);
  };

  const addCoins = (amount) => {
    setStats((prev) => ({
      ...prev,
      coins: Math.max(0, prev.coins + amount)
    }));
  };

  const spendCoins = (amount) => {
    if (stats.coins < amount) return false;
    setStats((prev) => ({
      ...prev,
      coins: prev.coins - amount
    }));
    return true;
  };

  // Quick pet button in navbar
  const handlePetLunaQuick = () => {
    if (stats.coins < 10) {
      alert("Need 10 Coins to pet Luna! 🪙 Complete habits or drink water to earn coins!");
      return;
    }
    spendCoins(10);
    soundEngine.playPetSong();
    addXp(8);
    setStats((prev) => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 3)
    }));
  };

  return (
    <div className="app-wrapper">
      
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        theme={theme}
        setTheme={setTheme}
        onPetLunaQuick={handlePetLunaQuick}
        currentUser={currentUser}
        onShowAuth={(reason) => setAuthModalReason(reason || 'general')}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main className="app-main">
        {activeTab === 'sanctuary' && (
          <div className="dashboard-grid">
            <LunaPet
              stats={stats}
              setStats={setStats}
              equipped={equipped}
              spendCoins={spendCoins}
              addXp={addXp}
              isDancingExternal={isLunaDancing}
              onNavigateToShop={() => setActiveTab('shop')}
              onTriggerDanceParty={() => triggerLevelUpCelebration(stats.level, stats.level + 1)}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <HabitsTracker
                habits={habits}
                setHabits={setHabits}
                waterData={waterData}
                onAddCoins={addCoins}
                onAddXp={addXp}
                stats={stats}
                setStats={setStats}
                currentUser={currentUser}
                activityLog={activityLog}
                onShowAuth={(reason) => setAuthModalReason(reason || 'contribution')}
                onRecordActivity={recordActivity}
              />
            </div>
          </div>
        )}

        {activeTab === 'hydration' && (
          <HydrationTracker
            waterData={waterData}
            setWaterData={setWaterData}
            onAddCoins={addCoins}
            onAddXp={addXp}
          />
        )}

        {activeTab === 'habits' && (
          <HabitsTracker
            habits={habits}
            setHabits={setHabits}
            waterData={waterData}
            onAddCoins={addCoins}
            onAddXp={addXp}
            stats={stats}
            setStats={setStats}
            currentUser={currentUser}
            activityLog={activityLog}
            onShowAuth={(reason) => setAuthModalReason(reason || 'contribution')}
            onRecordActivity={recordActivity}
          />
        )}

        {activeTab === 'mood' && (
          <MoodJournal
            moodLogs={moodLogs}
            setMoodLogs={setMoodLogs}
            onTriggerBreathing={() => setActiveTab('mindfulness')}
            onTriggerMusic={() => setActiveTab('sound')}
            onAddXp={addXp}
            onAddCoins={addCoins}
          />
        )}

        {activeTab === 'food' && (
          <FoodPlanner />
        )}

        {activeTab === 'mindfulness' && (
          <MindfulnessHub
            onAddXp={addXp}
            onAddCoins={addCoins}
            setStats={setStats}
          />
        )}

        {activeTab === 'sound' && (
          <SoundSanctuary />
        )}

        {activeTab === 'planner' && (
          <DailyPlanner
            onAddXp={addXp}
            onAddCoins={addCoins}
          />
        )}

        {activeTab === 'shop' && (
          <PetShop
            stats={stats}
            setStats={setStats}
            equipped={equipped}
            setEquipped={setEquipped}
            inventory={inventory}
            setInventory={setInventory}
            spendCoins={spendCoins}
            currentUser={currentUser}
            onShowAuth={(reason) => setAuthModalReason(reason || 'boutique')}
          />
        )}

        {activeTab === 'quests' && (
          <DailyQuests
            quests={quests}
            setQuests={setQuests}
            onAddCoins={addCoins}
            onAddXp={addXp}
            stats={stats}
          />
        )}
      </main>

      {/* ── LEVEL UP DANCE CELEBRATION MODAL ── */}
      {levelUpModal && (
        <div className="modal-overlay" onClick={closeLevelUpModal}>
          <div 
            className="glass-panel anim-float" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              width: '100%', 
              maxWidth: '460px', 
              padding: '2rem', 
              textAlign: 'center',
              background: '#ffffff',
              border: '2px solid #16a34a',
              boxShadow: '0 10px 40px rgba(22, 163, 74, 0.3)',
              borderRadius: '24px'
            }}
          >
            {/* Header Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#dcfce7', color: '#15803d', padding: '0.35rem 1rem', borderRadius: '99px', fontWeight: '800', fontSize: '0.85rem', marginBottom: '0.8rem', border: '1.5px solid #a7f3d0' }}>
              <PartyPopper size={16} /> LEVEL UP DANCE PARTY!
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: '900', color: '#14532d', marginBottom: '0.2rem' }}>
              LEVEL {levelUpModal.newLevel} REACHED! 🎉
            </h2>

            <p style={{ fontSize: '0.88rem', color: '#166534', fontWeight: '600', marginBottom: '1.2rem' }}>
              🎵 Playing: <em>Happy Happy Happy Cat Song!</em> 🐱✨
            </p>

            {/* Dancing Luna Stage */}
            <div style={{
              background: 'linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)',
              border: '2px dashed #86efac',
              borderRadius: '20px',
              padding: '1.5rem',
              margin: '0 auto 1.2rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
            }}>
              <div className="anim-dance">
                <ChibiCat emotion="dancing" equipped={equipped} size={180} />
              </div>
              <div style={{ marginTop: '0.6rem', fontSize: '0.8rem', fontWeight: '700', color: '#15803d' }}>
                💃 Luna is grooving with pure joy!
              </div>
            </div>

            {/* Bonus Rewards */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="glass-pill" style={{ color: '#15803d', fontWeight: '700', fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
                <Coins size={16} fill="#4ade80" color="#4ade80" /> +25 Bonus Coins 🪙
              </div>
              <div className="glass-pill" style={{ color: '#15803d', fontWeight: '700', fontSize: '0.9rem', padding: '0.4rem 1rem' }}>
                <Trophy size={16} color="#16a34a" /> Level {levelUpModal.newLevel} Badge
              </div>
            </div>

            {/* Action Buttons */}
            <button 
              onClick={closeLevelUpModal}
              className="btn btn-primary"
              style={{ width: '100%', fontSize: '1rem', padding: '0.75rem' }}
            >
              <span>Claim &amp; Continue Wellness Journey ✨</span>
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '1.5rem', borderTop: '1.5px solid #d1fae5', background: '#ffffff', color: '#4b7a5c', fontSize: '0.8rem' }}>
        <p>
          🐾 <strong>PawPal</strong> • Powered by Luna Companion • 
          <em> "The healthier you are, the happier and fluffier I become!" 🐱✨</em>
        </p>
      </footer>

      {/* ── AUTH LOGIN / SIGNUP MODAL ── */}
      {authModalReason && (
        <AuthModal
          onClose={() => setAuthModalReason(null)}
          onLogin={handleLogin}
          reason={authModalReason}
        />
      )}

    </div>
  );
}
