import React, { useState } from 'react';
import { 
  Music, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Sparkles, 
  CloudRain, 
  Waves, 
  Headphones, 
  Bell, 
  Radio, 
  ExternalLink,
  Flame
} from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { MOOD_MUSIC } from '../utils/lunaAI';

export default function SoundSanctuary() {
  const [ambientStates, setAmbientStates] = useState({
    purr: false,
    rain: false,
    waves: false,
    lofi: false
  });

  const [volumes, setVolumes] = useState({
    purr: 0.6,
    rain: 0.5,
    waves: 0.5,
    lofi: 0.4
  });

  const [activeMoodKey, setActiveMoodKey] = useState('stressed');

  const toggleSound = (type) => {
    const nextState = !ambientStates[type];
    const started = soundEngine.toggleAmbient(type, volumes[type]);
    setAmbientStates((prev) => ({ ...prev, [type]: started }));
  };

  const handleVolumeChange = (type, newVol) => {
    setVolumes((prev) => ({ ...prev, [type]: newVol }));
    if (ambientStates[type]) {
      // Re-trigger with new volume
      soundEngine.toggleAmbient(type);
      soundEngine.toggleAmbient(type, newVol);
    }
  };

  const ringBell = () => {
    soundEngine.playMeditationBell();
  };

  const moodStations = [
    { key: 'stressed', label: 'Overwhelmed / Stressed 🌧️', desc: 'Calming Lo-Fi & Gentle Piano' },
    { key: 'happy', label: 'Happy & Energized ☀️', desc: 'Uplifting Pop & Feel-Good Groove' },
    { key: 'focus', label: 'Deep Work / Focus 🎯', desc: 'Binaural Flow & Instrumental' },
    { key: 'tired', label: 'Tired / Wind-Down 🌙', desc: 'Acoustic Folk & 432Hz Rest' }
  ];

  const currentStation = MOOD_MUSIC[activeMoodKey];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 420px) 1fr', gap: '1.5rem' }}>
      
      {/* Ambient Soundscape Synthesizer Mixer */}
      <div className="glass-panel" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Ambient Sound Mixer</h2>
            <span className="badge badge-purple">Web Audio</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            Procedurally synthesized relaxing soundscapes. Layer cat purrs with soothing rain!
          </p>
        </div>

        {/* Ambient Channels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          
          {/* Channel: Cat Purr */}
          <div className="stat-card" style={{ borderColor: ambientStates.purr ? 'var(--secondary-light)' : 'var(--border-glass)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.3rem' }}>🐱</span>
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>Therapeutic Cat Purr</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>25-50Hz frequency proven to reduce stress</div>
                </div>
              </div>
              <button 
                onClick={() => toggleSound('purr')} 
                className={`btn ${ambientStates.purr ? 'btn-secondary' : 'btn-outline'}`}
                style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
              >
                {ambientStates.purr ? 'Playing 🐾' : 'Play'}
              </button>
            </div>
            {ambientStates.purr && (
              <input 
                type="range" 
                min="0.1" 
                max="1.0" 
                step="0.05"
                value={volumes.purr}
                onChange={(e) => handleVolumeChange('purr', parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--secondary)', marginTop: '0.4rem' }}
              />
            )}
          </div>

          {/* Channel: Rain */}
          <div className="stat-card" style={{ borderColor: ambientStates.rain ? '#38bdf8' : 'var(--border-glass)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <CloudRain size={22} color="#38bdf8" />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>Gentle Window Rain</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Pink noise filter for focus & sleep</div>
                </div>
              </div>
              <button 
                onClick={() => toggleSound('rain')} 
                className={`btn ${ambientStates.rain ? 'btn-cyan' : 'btn-outline'}`}
                style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
              >
                {ambientStates.rain ? 'Playing 🌧️' : 'Play'}
              </button>
            </div>
            {ambientStates.rain && (
              <input 
                type="range" 
                min="0.1" 
                max="1.0" 
                step="0.05"
                value={volumes.rain}
                onChange={(e) => handleVolumeChange('rain', parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8', marginTop: '0.4rem' }}
              />
            )}
          </div>

          {/* Channel: Ocean Waves */}
          <div className="stat-card" style={{ borderColor: ambientStates.waves ? '#34d399' : 'var(--border-glass)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Waves size={22} color="#34d399" />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>Rhythmic Ocean Waves</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>8-second tidal breathing cadence</div>
                </div>
              </div>
              <button 
                onClick={() => toggleSound('waves')} 
                className={`btn ${ambientStates.waves ? 'btn-emerald' : 'btn-outline'}`}
                style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
              >
                {ambientStates.waves ? 'Playing 🌊' : 'Play'}
              </button>
            </div>
            {ambientStates.waves && (
              <input 
                type="range" 
                min="0.1" 
                max="1.0" 
                step="0.05"
                value={volumes.waves}
                onChange={(e) => handleVolumeChange('waves', parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#34d399', marginTop: '0.4rem' }}
              />
            )}
          </div>

          {/* Channel: Lo-Fi Synth Drone */}
          <div className="stat-card" style={{ borderColor: ambientStates.lofi ? '#a78bfa' : 'var(--border-glass)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Headphones size={22} color="#a78bfa" />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>Dreamy Lo-Fi Pad</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Warm G Major 7th harmonic drone</div>
                </div>
              </div>
              <button 
                onClick={() => toggleSound('lofi')} 
                className={`btn ${ambientStates.lofi ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.35rem 0.8rem', fontSize: '0.78rem' }}
              >
                {ambientStates.lofi ? 'Playing 🎧' : 'Play'}
              </button>
            </div>
            {ambientStates.lofi && (
              <input 
                type="range" 
                min="0.1" 
                max="1.0" 
                step="0.05"
                value={volumes.lofi}
                onChange={(e) => handleVolumeChange('lofi', parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--primary)', marginTop: '0.4rem' }}
              />
            )}
          </div>

          {/* Tibetan Bell One-Shot Strike */}
          <button onClick={ringBell} className="btn btn-outline" style={{ marginTop: '0.4rem', justifyContent: 'center' }}>
            <Bell size={16} color="#fbbf24" />
            <span>Strike 432Hz Zen Bell</span>
          </button>
        </div>
      </div>

      {/* Mood-Based Music Playlist Station */}
      <div className="glass-panel" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Mood Music Matcher 🎵</h2>
            <span className="badge badge-rose">Personalized Vibe</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Select your current emotional state to reveal Luna's hand-picked songs & playlists.
          </p>
        </div>

        {/* Mood Selector Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.6rem' }}>
          {moodStations.map((station) => (
            <button
              key={station.key}
              onClick={() => setActiveMoodKey(station.key)}
              className="glass-panel glass-panel-interactive"
              style={{
                padding: '0.8rem',
                textAlign: 'left',
                cursor: 'pointer',
                borderColor: activeMoodKey === station.key ? 'var(--primary-light)' : 'var(--border-glass)',
                background: activeMoodKey === station.key ? 'rgba(139, 92, 246, 0.2)' : 'var(--surface-subtle)'
              }}
            >
              <div style={{ fontWeight: '700', fontSize: '0.85rem', color: activeMoodKey === station.key ? '#fff' : 'var(--text-main)' }}>
                {station.label}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                {station.desc}
              </div>
            </button>
          ))}
        </div>

        {/* Curated Tracklist Display */}
        {currentStation && (
          <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--secondary-light)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Radio size={16} /> Recommended Tracks for {currentStation.recommendation}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {currentStation.tracks.map((track, idx) => (
                <div 
                  key={idx} 
                  className="stat-card" 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0.9rem 1.2rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-light)', fontWeight: '700', fontSize: '0.8rem' }}>
                      {idx + 1}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.92rem' }}>{track.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{track.artist}</div>
                    </div>
                  </div>
                  <span className="glass-pill" style={{ fontSize: '0.72rem', color: '#c4b5fd' }}>
                    {track.vibe}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
