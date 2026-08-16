/**
 * PawPal Web Audio Synthesizer Engine
 * High-quality procedural sound effects & relaxing ambient generator
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.activeAmbientSources = {};
    this.activeAudio = null; // Tracks the currently playing remote audio
  }

  // Stop any currently playing remote audio (called on tab change)
  stopActiveAudio() {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch (e) {}
      this.activeAudio = null;
    }
  }

  // Internal helper: play a remote mp3
  // - If already playing the SAME url and < 5 seconds in → ignore the click (play only once)
  // - If already playing but 5+ seconds elapsed → allow restart
  // - If a DIFFERENT sound → stop old one and play new one
  _playRemote(url, volume = 0.85) {
    if (this.isMuted) return null;

    // If same audio is already playing and under 5 seconds in → skip (no restart)
    if (
      this.activeAudio &&
      !this.activeAudio.paused &&
      this.activeAudio._sourceUrl === url &&
      this.activeAudio.currentTime < 5
    ) {
      return this.activeAudio; // Already playing, do nothing
    }

    // Stop whatever is currently playing (different sound or same sound after 5s)
    this.stopActiveAudio();

    try {
      const audio = new Audio(url);
      audio.volume = volume;
      audio._sourceUrl = url; // Tag it so we can detect repeated clicks
      audio.play().catch(e => console.warn('Remote audio play error:', e));
      this.activeAudio = audio;
      // Auto-clear when track ends naturally
      audio.addEventListener('ended', () => { this.activeAudio = null; });
      return audio;
    } catch (e) {
      console.warn('Remote audio error:', e);
      return null;
    }
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted) {
      this.stopAllAmbient();
    }
  }

  // Play Level Up Dance Song (Happy Happy Happy Cat Song)
  playLevelUpDanceSong() {
    return this._playRemote('https://www.myinstants.com/media/sounds/happy-happy-happy-song.mp3');
  }

  // Play Pet Luna Song (Meow Sleigh Ride)
  playPetSong() {
    return this._playRemote('https://www.myinstants.com/media/sounds/meow-ride.mp3');
  }

  // Play Feed Luna Song (Kids Happy / Yippee!)
  playFeedSong() {
    return this._playRemote('https://www.myinstants.com/media/sounds/kids-happy.mp3');
  }

  // Play Huh Cat Sound (Untick Habit)
  playHuhCat() {
    return this._playRemote('https://www.myinstants.com/media/sounds/huh-cat.mp3');
  }

  // Play Cat Plays Drums Sound (Play Yarn)
  playCatPlaysDrums() {
    return this._playRemote('https://www.myinstants.com/media/sounds/cat-plays-drums.mp3');
  }

  // Play Snore Mimimimimimi Sound (Power Nap)
  playSnore() {
    return this._playRemote('https://www.myinstants.com/media/sounds/snore-mimimimimimi.mp3');
  }

  // Short click ring/chime sound (habit untick) — generated with Web Audio API
  playClickRing() {
    this.init();
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      // Quick descending ding — high to mid
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.18);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.22, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn('Click ring error:', e);
    }
  }

  // Cute Cat Meow Sound Effect
  playMeow() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      
      // Meow pitch sweep (starts high, drops slightly, then lifts and fades)
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.38);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Realistic Procedural Cat Purr Sound (Binaural therapeutic vibration)
  playPurrBurst() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 1.2;

      // Low frequency vibration
      const osc = this.ctx.createOscillator();
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      const mainGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(32, now); // Cat purr base Hz

      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(26, now); // Purr rumble modulation rate
      lfoGain.gain.setValueAtTime(15, now);

      lfo.connect(osc.frequency);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, now);
      filter.Q.setValueAtTime(3, now);

      mainGain.gain.setValueAtTime(0.001, now);
      mainGain.gain.linearRampToValueAtTime(0.2, now + 0.2);
      mainGain.gain.linearRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(mainGain);
      mainGain.connect(this.ctx.destination);

      lfo.start(now);
      osc.start(now);
      lfo.stop(now + duration);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('Audio purr error:', e);
    }
  }

  // Hydration Water Drinking Sound Effect (Three Stooges Drinking Sound from MyInstants)
  playWaterDrop() {
    if (this.isMuted) return;
    try {
      const audio = new Audio('https://www.myinstants.com/media/sounds/drinking-sound.mp3');
      audio.volume = 0.85;
      audio.play().catch(e => console.warn('Drinking sound play error:', e));
    } catch (e) {
      console.warn('Audio drinking sound error:', e);
    }
  }

  // Habit Complete Sparkle Chime (Major Arpeggio)
  playHabitComplete() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const now = this.ctx.currentTime + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
      });
    } catch (e) {
      console.warn('Audio habit error:', e);
    }
  }

  // Coin Collect Chime
  playCoinCollect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [987.77, 1318.51]; // B5 -> E6
      notes.forEach((freq, idx) => {
        const t = now + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.3);
      });
    } catch (e) {
      console.warn('Audio coin error:', e);
    }
  }

  // Meditation Singing Bell Chime
  playMeditationBell() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const baseFreq = 432; // Healing 432 Hz frequency
      const harmonics = [1, 2.76, 5.4];

      harmonics.forEach((mult, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * mult, now);

        const initialGain = 0.18 / (idx + 1);
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(initialGain, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 3.2);
      });
    } catch (e) {
      console.warn('Audio bell error:', e);
    }
  }

  // Ambient Continuous Sound Engine (Rain, Purr, Lofi, Waves)
  toggleAmbient(type, volume = 0.5) {
    if (this.isMuted) return false;
    this.init();
    if (!this.ctx) return false;

    if (this.activeAmbientSources[type]) {
      this.stopAmbient(type);
      return false;
    }

    try {
      if (type === 'purr') {
        const osc = this.ctx.createOscillator();
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        const mainGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(30, this.ctx.currentTime);

        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(24, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(12, this.ctx.currentTime);
        lfo.connect(osc.frequency);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, this.ctx.currentTime);
        filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

        mainGain.gain.setValueAtTime(volume * 0.35, this.ctx.currentTime);

        osc.connect(filter);
        filter.connect(mainGain);
        mainGain.connect(this.ctx.destination);

        lfo.start();
        osc.start();

        this.activeAmbientSources[type] = {
          stop: () => {
            try {
              mainGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
              setTimeout(() => {
                lfo.stop();
                osc.stop();
              }, 220);
            } catch (e) {}
          },
          gainNode: mainGain
        };
        return true;
      }

      if (type === 'rain' || type === 'waves') {
        const bufferSize = this.ctx.sampleRate * 2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          // Pink/Brown noise approximation
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(type === 'rain' ? 800 : 400, this.ctx.currentTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(volume * (type === 'rain' ? 0.2 : 0.28), this.ctx.currentTime);

        if (type === 'waves') {
          // Add slow swell LFO for ocean waves
          const waveLfo = this.ctx.createOscillator();
          const waveLfoGain = this.ctx.createGain();
          waveLfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // 8-second wave period
          waveLfoGain.gain.setValueAtTime(180, this.ctx.currentTime);
          waveLfo.connect(filter.frequency);
          waveLfo.start();
        }

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();

        this.activeAmbientSources[type] = {
          stop: () => {
            try {
              gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
              setTimeout(() => noise.stop(), 220);
            } catch (e) {}
          },
          gainNode: gain
        };
        return true;
      }

      if (type === 'lofi') {
        // Binaural dreamy harmonic drone
        const freqs = [196, 246.94, 293.66, 369.99]; // G3 Major 7th chord
        const oscs = [];
        const masterGain = this.ctx.createGain();
        masterGain.gain.setValueAtTime(volume * 0.15, this.ctx.currentTime);

        freqs.forEach(f => {
          const osc = this.ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, this.ctx.currentTime);
          osc.connect(masterGain);
          osc.start();
          oscs.push(osc);
        });

        masterGain.connect(this.ctx.destination);

        this.activeAmbientSources[type] = {
          stop: () => {
            try {
              masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
              setTimeout(() => oscs.forEach(o => o.stop()), 320);
            } catch (e) {}
          },
          gainNode: masterGain
        };
        return true;
      }
    } catch (e) {
      console.warn('Ambient start error:', e);
    }
    return false;
  }

  stopAmbient(type) {
    if (this.activeAmbientSources[type]) {
      this.activeAmbientSources[type].stop();
      delete this.activeAmbientSources[type];
    }
  }

  stopAllAmbient() {
    Object.keys(this.activeAmbientSources).forEach(key => this.stopAmbient(key));
  }
}

export const soundEngine = new SoundEngine();
