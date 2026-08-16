import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Coins, 
  Check, 
  Sparkles, 
  Crown, 
  Heart, 
  ShieldCheck, 
  Lock,
  Eye
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';
import ChibiCat from './ChibiCat';

export default function PetShop({ 
  stats, 
  setStats, 
  equipped, 
  setEquipped, 
  inventory, 
  setInventory,
  spendCoins,
  currentUser,
  onShowAuth
}) {
  const [activeCategory, setActiveCategory] = useState('hats');
  const [previewEquipped, setPreviewEquipped] = useState(equipped);
  const [previewItemName, setPreviewItemName] = useState(null);

  const shopCatalog = {
    hats: [
      { id: 'none', name: 'No Hat (Natural Kitty)', cost: 0, previewEmoji: '🐱', desc: 'Luna in her pure fluffy glory.' },
      { id: 'flowercrown', name: 'Sakura Flower Crown', cost: 30, previewEmoji: '🌸', desc: 'Hand-woven fresh spring blossoms.' },
      { id: 'wizard', name: 'Mystic Forest Wizard Hat', cost: 50, previewEmoji: '🧙‍♂️', desc: 'Sparks wellness wisdom and purrs.' },
      { id: 'crown', name: 'Royal Emerald Crown', cost: 80, previewEmoji: '👑', desc: 'For the majestic ruler of good habits.' }
    ],
    collars: [
      { id: 'none', name: 'No Collar', cost: 0, previewEmoji: '🌿', desc: 'Free and unrestrained.' },
      { id: 'bell', name: 'Golden Jingle Bell Collar', cost: 20, previewEmoji: '🔔', desc: 'Rings a cheerful chime with every step.' },
      { id: 'bowtie', name: 'Dapper Mint Bowtie', cost: 35, previewEmoji: '🎀', desc: 'Fancy fashion for high-streak days.' }
    ],
    beds: [
      { id: 'basket', name: 'Cozy Wool Basket', cost: 0, previewEmoji: '🧺', desc: 'Warm and comforting.' },
      { id: 'cloud', name: 'Fluffy Pastel Cloud Bed', cost: 60, previewEmoji: '☁️', desc: 'Like sleeping on a peaceful dream.' },
      { id: 'velvet', name: 'Royal Forest Cushion', cost: 75, previewEmoji: '🛋️', desc: 'Deep emerald silk luxury.' }
    ],
    rooms: [
      { id: 'twilight', name: 'Cosmic Sanctuary Theme', cost: 0, previewEmoji: '🌌', desc: 'Calming soft green nebula ambient.' },
      { id: 'sakura', name: 'Spring Garden Theme', cost: 50, previewEmoji: '🌸', desc: 'Floating fresh petals in sunlight.' }
    ]
  };

  // Live preview an item on Luna in the boutique
  const handlePreviewItem = (category, item) => {
    const typeKey = category === 'hats' ? 'hat' : category === 'collars' ? 'collar' : category === 'beds' ? 'bed' : 'room';
    setPreviewEquipped(prev => ({ ...prev, [typeKey]: item.id }));
    setPreviewItemName(item.name);
    soundEngine.playPurrBurst();
  };

  const handleBuy = (category, item) => {
    if (inventory.includes(item.id)) {
      // Already owned, equip it
      equipItem(category, item.id);
      return;
    }

    if (stats.coins < item.cost) {
      alert(`Not enough coins! You need ${item.cost - stats.coins} more coins! 🪙 Complete daily habits to earn coins!`);
      return;
    }

    soundEngine.playCoinCollect();
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

    // Deduct coins & add to inventory
    setStats((prev) => ({ ...prev, coins: prev.coins - item.cost }));
    setInventory((prev) => [...prev, item.id]);
    equipItem(category, item.id);
  };

  const equipItem = (category, itemId) => {
    soundEngine.playPurrBurst();
    const typeKey = category === 'hats' ? 'hat' : category === 'collars' ? 'collar' : category === 'beds' ? 'bed' : 'room';
    setEquipped((prev) => ({ ...prev, [typeKey]: itemId }));
    setPreviewEquipped((prev) => ({ ...prev, [typeKey]: itemId }));
    setPreviewItemName(null);
  };

  const currentItems = shopCatalog[activeCategory];

  return (
    <div style={{ position: 'relative' }}>
      
      {/* Guest Lock Overlay */}
      {!currentUser && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(8px)',
          zIndex: 20,
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 1.5rem',
          textAlign: 'center',
          minHeight: '450px'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#16a34a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            marginBottom: '1rem',
            boxShadow: '0 8px 24px rgba(22, 163, 74, 0.3)'
          }}>
            <Lock size={28} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#14532d', marginBottom: '0.5rem' }}>
            Luna's Boutique is Locked for Guests! 🎩
          </h2>
          <p style={{ fontSize: '0.95rem', color: '#4b7a5c', maxWidth: '440px', marginBottom: '1.5rem', lineHeight: '1.5' }}>
            Sign in or create a profile to unlock Luna's Wardrobe, buy cute hats, golden collars, cloud beds, and save your outfits across sessions!
          </p>
          <button 
            onClick={() => onShowAuth('boutique')} 
            className="btn btn-primary"
            style={{ 
              padding: '0.8rem 1.8rem', 
              fontSize: '1rem', 
              fontWeight: '700', 
              boxShadow: '0 6px 20px rgba(22,163,74,0.3)',
              borderRadius: '99px'
            }}
          >
            <Sparkles size={18} />
            <span>Login / Sign Up to Unlock Boutique 🐾</span>
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 360px) 1fr', gap: '1.5rem', alignItems: 'start', opacity: !currentUser ? 0.3 : 1, pointerEvents: !currentUser ? 'none' : 'auto' }}>
      
      {/* ── LIVE LUNA DRESSING ROOM & FITTING STAGE ── */}
      <div className="glass-panel" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', position: 'sticky', top: '90px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '0.8rem' }}>
          <span className="badge badge-purple">Luna's Dressing Room</span>
          <span className="badge badge-gold">🪙 {stats.coins} Coins</span>
        </div>

        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#14532d', marginBottom: '0.2rem' }}>
          Live Outfit Fitting
        </h3>
        <p style={{ fontSize: '0.78rem', color: '#4b7a5c', marginBottom: '1rem' }}>
          See Luna try on hats, crowns and collars live!
        </p>

        {/* Live Luna Cat Stage */}
        <div style={{
          width: '100%',
          minHeight: '260px',
          background: 'linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%)',
          borderRadius: '16px',
          border: '1.5px solid #d1fae5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.2rem',
          position: 'relative',
          boxShadow: 'inset 0 0 20px rgba(22, 163, 74, 0.08)'
        }}>
          <div className="anim-float">
            <ChibiCat emotion="normal" equipped={previewEquipped} size={170} />
          </div>

          <div style={{
            marginTop: '0.6rem',
            background: '#ffffff',
            border: '1px solid #d1fae5',
            borderRadius: '99px',
            padding: '0.25rem 0.8rem',
            fontSize: '0.75rem',
            color: '#166534',
            fontWeight: '600'
          }}>
            {previewItemName ? `Previewing: ${previewItemName}` : "Currently Wearing Outfit"}
          </div>
        </div>

        {/* Reset Preview Button */}
        {previewItemName && (
          <button 
            onClick={() => { setPreviewEquipped(equipped); setPreviewItemName(null); }}
            className="btn btn-outline"
            style={{ marginTop: '0.8rem', width: '100%', fontSize: '0.8rem', padding: '0.4rem' }}
          >
            Reset to Equipped Outfit
          </button>
        )}

        <div style={{ fontSize: '0.78rem', color: '#4b7a5c', marginTop: '1rem', background: '#f0fdf4', padding: '0.6rem 0.9rem', borderRadius: '10px', border: '1px dashed #a7f3d0' }}>
          💡 Complete wellness habits to earn +10 🪙 &amp; dress up Luna!
        </div>
      </div>

      {/* ── SHOP CATALOG ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        
        {/* Boutique Header */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#14532d' }}>Luna's Boutique 🎩</h2>
                <span className="badge badge-emerald">Pet Accessories</span>
              </div>
              <p style={{ color: '#4b7a5c', fontSize: '0.84rem' }}>
                Spend your earned habit coins to customize Luna's wardrobe and sanctuary!
              </p>
            </div>
          </div>

          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
            {[
              { id: 'hats', label: 'Hats & Crowns 👑' },
              { id: 'collars', label: 'Collars & Bowties 🎀' },
              { id: 'beds', label: 'Beds & Cushions ☁️' },
              { id: 'rooms', label: 'Room Themes 🌸' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setPreviewEquipped(equipped); setPreviewItemName(null); }}
                className="glass-pill"
                style={{
                  cursor: 'pointer',
                  background: activeCategory === cat.id ? '#16a34a' : '#f0fdf4',
                  borderColor: activeCategory === cat.id ? '#15803d' : '#a7f3d0',
                  color: activeCategory === cat.id ? '#ffffff' : '#166534',
                  fontWeight: '700'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Items Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {currentItems.map((item) => {
            const isOwned = inventory.includes(item.id) || item.cost === 0;
            const typeKey = activeCategory === 'hats' ? 'hat' : activeCategory === 'collars' ? 'collar' : activeCategory === 'beds' ? 'bed' : 'room';
            const isEquipped = equipped[typeKey] === item.id;
            const isBeingPreviewed = previewEquipped[typeKey] === item.id;
            const canAfford = stats.coins >= item.cost;

            return (
              <div 
                key={item.id} 
                className="glass-panel"
                style={{
                  padding: '1.3rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderColor: isEquipped ? '#16a34a' : isBeingPreviewed ? '#22c55e' : '#d1fae5',
                  background: isEquipped ? '#f0fdf4' : '#ffffff',
                  boxShadow: isEquipped ? '0 2px 10px rgba(22,163,74,0.15)' : 'var(--shadow-xs)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f0fdf4', border: '1px solid #d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem' }}>
                      {item.previewEmoji}
                    </div>

                    {isEquipped ? (
                      <span className="badge badge-emerald">Wearing ✨</span>
                    ) : isOwned ? (
                      <span className="badge badge-purple">Owned</span>
                    ) : (
                      <span className="glass-pill" style={{ color: '#15803d', fontSize: '0.82rem', fontWeight: '700' }}>
                        <Coins size={13} fill="#4ade80" color="#4ade80" /> {item.cost} 🪙
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#14532d', marginBottom: '0.25rem' }}>
                    {item.name}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#4b7a5c', marginBottom: '1rem' }}>
                    {item.desc}
                  </p>
                </div>

                {/* Actions: Try On & Buy/Equip */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {/* Try on Preview button */}
                  <button 
                    onClick={() => handlePreviewItem(activeCategory, item)}
                    className="btn btn-outline"
                    style={{ fontSize: '0.78rem', padding: '0.4rem', width: '100%', borderColor: '#d1fae5' }}
                  >
                    <Eye size={13} />
                    <span>{isBeingPreviewed ? "Previewing on Luna" : "Try On in Dressing Room"}</span>
                  </button>

                  {isEquipped ? (
                    <button disabled className="btn btn-outline" style={{ width: '100%', opacity: 0.7, cursor: 'default', fontSize: '0.82rem', padding: '0.5rem' }}>
                      <Check size={14} />
                      <span>Equipped</span>
                    </button>
                  ) : isOwned ? (
                    <button onClick={() => equipItem(activeCategory, item.id)} className="btn btn-primary" style={{ width: '100%', fontSize: '0.82rem', padding: '0.5rem' }}>
                      <span>Equip Outfit</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleBuy(activeCategory, item)} 
                      disabled={!canAfford}
                      className={`btn ${canAfford ? 'btn-primary' : 'btn-outline'}`} 
                      style={{ width: '100%', opacity: canAfford ? 1 : 0.5, fontSize: '0.82rem', padding: '0.5rem' }}
                    >
                      <Coins size={14} />
                      <span>{canAfford ? `Buy for ${item.cost} Coins` : `Need ${item.cost - stats.coins} More 🪙`}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);
}
