import React from 'react';

/**
 * Reusable Chibi-Style Luna Cat SVG Component
 * Supports dynamic emotions, hats, collars, beds, and animations
 */
export default function ChibiCat({ emotion = 'normal', equipped = {}, size = 200 }) {
  const eyeStyle = emotion === 'sleeping'
    ? 'closed'
    : emotion === 'playing' || emotion === 'dancing'
    ? 'star'
    : emotion === 'purring'
    ? 'happy'
    : 'normal';

  return (
    <svg viewBox="0 0 220 240" width={size} height={size * 1.1} style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="bodyGrad" cx="45%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f0fdf4" />
        </radialGradient>
        <radialGradient id="headGrad" cx="40%" cy="35%" r="55%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f0fdf4" />
        </radialGradient>
        <radialGradient id="innerEar" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#fb7185" />
        </radialGradient>
      </defs>

      {/* Shadow under cat */}
      <ellipse cx="110" cy="228" rx="55" ry="10" fill="rgba(22,163,74,0.10)" />

      {/* Tail */}
      <path
        d={emotion === 'playing'
          ? 'M 158 185 Q 205 155 198 115 Q 185 140 158 175 Z'
          : 'M 155 188 Q 198 172 192 138 Q 178 158 156 182 Z'}
        fill="url(#bodyGrad)"
        stroke="#d1fae5"
        strokeWidth="1.5"
        style={{
          transformOrigin: '155px 188px',
          animation: emotion === 'sleeping' ? 'none' : 'tail-wag 2.8s ease-in-out infinite'
        }}
      />
      {/* Tail tip */}
      <ellipse
        cx={emotion === 'playing' ? '193' : '190'}
        cy={emotion === 'playing' ? '118' : '140'}
        rx="8" ry="8"
        fill="#dcfce7"
        stroke="#a7f3d0"
        strokeWidth="1"
      />

      {/* Body */}
      <ellipse cx="110" cy="190" rx="52" ry="44" fill="url(#bodyGrad)" stroke="#d1fae5" strokeWidth="1.5" />

      {/* Chest fluff */}
      <ellipse cx="110" cy="175" rx="30" ry="28" fill="#ffffff" />
      <ellipse cx="110" cy="183" rx="22" ry="20" fill="#f9fafb" />

      {/* Front paws */}
      <ellipse cx="86" cy="218" rx="16" ry="11" fill="#ffffff" stroke="#d1fae5" strokeWidth="1.5" />
      <ellipse cx="134" cy="218" rx="16" ry="11" fill="#ffffff" stroke="#d1fae5" strokeWidth="1.5" />
      {/* Paw toe lines */}
      <line x1="82" y1="218" x2="82" y2="225" stroke="#d1fae5" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="86" y1="218" x2="86" y2="226" stroke="#d1fae5" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="90" y1="218" x2="90" y2="225" stroke="#d1fae5" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="130" y1="218" x2="130" y2="225" stroke="#d1fae5" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="134" y1="218" x2="134" y2="226" stroke="#d1fae5" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="138" y1="218" x2="138" y2="225" stroke="#d1fae5" strokeWidth="1.2" strokeLinecap="round" />

      {/* Head */}
      <ellipse cx="110" cy="105" rx="52" ry="48" fill="url(#headGrad)" stroke="#d1fae5" strokeWidth="1.5" />

      {/* Left ear */}
      <path d="M 70 70 L 56 32 L 90 58 Z" fill="url(#headGrad)" stroke="#d1fae5" strokeWidth="1.5" style={{ transformOrigin: '70px 70px', animation: 'ear-twitch 4.5s ease-in-out infinite' }} />
      <path d="M 72 66 L 62 38 L 86 58 Z" fill="url(#innerEar)" opacity="0.8" />

      {/* Right ear */}
      <path d="M 150 70 L 164 32 L 130 58 Z" fill="url(#headGrad)" stroke="#d1fae5" strokeWidth="1.5" style={{ transformOrigin: '150px 70px', animation: 'ear-twitch 4.5s ease-in-out 0.6s infinite' }} />
      <path d="M 148 66 L 158 38 L 134 58 Z" fill="url(#innerEar)" opacity="0.8" />

      {/* Eyes based on emotion */}
      {eyeStyle === 'closed' && (
        <g stroke="#14532d" strokeWidth="2.8" strokeLinecap="round" fill="none">
          <path d="M 86 105 Q 95 115 104 105" />
          <path d="M 116 105 Q 125 115 134 105" />
          <text x="148" y="72" fontSize="15" fill="#4ade80" fontWeight="800" stroke="none">Zzz</text>
        </g>
      )}
      {eyeStyle === 'happy' && (
        <g stroke="#14532d" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M 84 102 Q 95 93 106 102" />
          <path d="M 114 102 Q 125 93 136 102" />
        </g>
      )}
      {eyeStyle === 'star' && (
        <g>
          <circle cx="95" cy="100" r="10" fill="#14532d" />
          <polygon points="95,93 97,98 102,100 97,102 95,107 93,102 88,100 93,98" fill="#fbbf24" />
          <circle cx="125" cy="100" r="10" fill="#14532d" />
          <polygon points="125,93 127,98 132,100 127,102 125,107 123,102 118,100 123,98" fill="#fbbf24" />
        </g>
      )}
      {eyeStyle === 'normal' && (
        <g style={{ animation: 'blink 5s ease-in-out infinite' }}>
          <circle cx="95" cy="100" r="11" fill="#14532d" />
          <circle cx="92" cy="96" r="4" fill="#ffffff" />
          <circle cx="97" cy="102" r="2" fill="#ffffff" opacity="0.7" />
          <circle cx="125" cy="100" r="11" fill="#14532d" />
          <circle cx="122" cy="96" r="4" fill="#ffffff" />
          <circle cx="127" cy="102" r="2" fill="#ffffff" opacity="0.7" />
        </g>
      )}

      {/* Blush cheeks */}
      <ellipse cx="76" cy="112" rx="9" ry="6" fill="#fda4af" opacity="0.55" />
      <ellipse cx="144" cy="112" rx="9" ry="6" fill="#fda4af" opacity="0.55" />

      {/* Nose */}
      <polygon points="107,115 113,115 110,119" fill="#f43f5e" opacity="0.85" />

      {/* Mouth */}
      <path d="M 104 120 Q 110 126 110 120 Q 110 126 116 120" stroke="#14532d" strokeWidth="1.8" fill="none" strokeLinecap="round" />

      {/* Whiskers */}
      <g stroke="#a7f3d0" strokeWidth="1.4" strokeLinecap="round">
        <line x1="56" y1="110" x2="80" y2="112" />
        <line x1="54" y1="117" x2="78" y2="116" />
        <line x1="140" y1="112" x2="164" y2="110" />
        <line x1="142" y1="116" x2="166" y2="117" />
      </g>

      {/* COLLAR */}
      {equipped?.collar && equipped.collar !== 'none' && (
        <g>
          <path d="M 74 140 Q 110 152 146 140" stroke="#16a34a" strokeWidth="6" fill="none" strokeLinecap="round" />
          {equipped.collar === 'bell' && (
            <>
              <circle cx="110" cy="149" r="6.5" fill="#4ade80" stroke="#16a34a" strokeWidth="1.5" />
              <line x1="110" y1="148" x2="112" y2="153" stroke="#14532d" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="110" cy="154" r="1.5" fill="#14532d" />
            </>
          )}
          {equipped.collar === 'bowtie' && (
            <>
              <polygon points="100,144 110,150 100,156" fill="#4ade80" />
              <polygon points="120,144 110,150 120,156" fill="#4ade80" />
              <circle cx="110" cy="150" r="3" fill="#ffffff" />
            </>
          )}
        </g>
      )}

      {/* HAT */}
      {equipped?.hat === 'wizard' && (
        <g>
          <polygon points="70,65 110,12 150,65" fill="#166534" stroke="#15803d" strokeWidth="2" />
          <ellipse cx="110" cy="65" rx="42" ry="10" fill="#15803d" />
          <polygon points="110,32 113,40 121,42 115,48 117,56 110,52 103,56 105,48 99,42 107,40" fill="#4ade80" />
        </g>
      )}
      {equipped?.hat === 'crown' && (
        <g>
          <polygon points="74,60 82,34 92,50 110,26 128,50 138,34 146,60" fill="#4ade80" stroke="#16a34a" strokeWidth="2" />
          <circle cx="82" cy="33" r="3" fill="#ffffff" />
          <circle cx="110" cy="25" r="4" fill="#ffffff" />
          <circle cx="138" cy="33" r="3" fill="#ffffff" />
        </g>
      )}
      {equipped?.hat === 'flowercrown' && (
        <g>
          <path d="M 68 60 Q 110 50 152 60" stroke="#4ade80" strokeWidth="3.5" fill="none" />
          <circle cx="80" cy="56" r="6" fill="#16a34a" />
          <circle cx="80" cy="56" r="2.5" fill="#dcfce7" />
          <circle cx="110" cy="51" r="7" fill="#22c55e" />
          <circle cx="110" cy="51" r="3" fill="#dcfce7" />
          <circle cx="140" cy="56" r="6" fill="#16a34a" />
          <circle cx="140" cy="56" r="2.5" fill="#dcfce7" />
        </g>
      )}

      {/* Eating treat */}
      {emotion === 'eating' && (
        <ellipse cx="110" cy="130" rx="13" ry="7" fill="#4ade80" opacity="0.9" />
      )}

      {/* Playing with Yarn Animation */}
      {emotion === 'playing' && (
        <g style={{ transformOrigin: '55px 195px' }} className="anim-yarn">
          {/* Thread trail */}
          <path d="M 55 195 Q 75 180 90 205 Q 110 215 125 210" stroke="#16a34a" strokeWidth="2" fill="none" strokeDasharray="3,2" />
          {/* Yarn Ball */}
          <circle cx="55" cy="195" r="16" fill="#22c55e" stroke="#15803d" strokeWidth="2" />
          <ellipse cx="55" cy="195" rx="14" ry="7" fill="none" stroke="#dcfce7" strokeWidth="1.5" transform="rotate(35 55 195)" />
          <ellipse cx="55" cy="195" rx="14" ry="7" fill="none" stroke="#dcfce7" strokeWidth="1.5" transform="rotate(-40 55 195)" />
          <ellipse cx="55" cy="195" rx="14" ry="7" fill="none" stroke="#166534" strokeWidth="1.5" transform="rotate(80 55 195)" />
          {/* Sparkle */}
          <text x="35" y="175" fontSize="14">✨</text>
        </g>
      )}

      {/* Dancing Musical Notes */}
      {emotion === 'dancing' && (
        <g style={{ fontSize: '18px', fontWeight: 'bold' }}>
          <text x="35" y="60" fill="#16a34a" className="anim-float">🎵</text>
          <text x="165" y="55" fill="#22c55e" className="anim-float" style={{ animationDelay: '0.4s' }}>🎶</text>
          <text x="175" y="115" fill="#15803d" className="anim-float" style={{ animationDelay: '0.8s' }}>✨</text>
          <text x="25" y="115" fill="#4ade80" className="anim-float" style={{ animationDelay: '1.2s' }}>⭐</text>
        </g>
      )}
    </svg>
  );
}
