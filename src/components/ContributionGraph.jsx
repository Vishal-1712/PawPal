import React, { useMemo, useState } from 'react';
import { Info, Flame, Calendar, Award, Sparkles, Lock, LogIn, UserPlus } from 'lucide-react';

/**
 * GitHub / LeetCode style Wellness Contribution Graph
 * Displays daily activity for the past 365 days
 * Matches user's screenshot design exactly.
 */
export default function ContributionGraph({ 
  activityLog = {}, 
  currentUser, 
  onShowAuth 
}) {
  const today = new Date();

  const getLocalDateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Build 365-day grid (52-53 weeks x 7 days)
  const weeks = useMemo(() => {
    const days = [];
    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = getLocalDateKey(d);
      days.push({ date: d, key, count: activityLog[key] || 0 });
    }

    // Pad front so week starts on Sunday (0=Sun)
    const firstDayOfWeek = days[0].date.getDay();
    const padded = Array(firstDayOfWeek).fill(null).concat(days);

    const w = [];
    for (let i = 0; i < padded.length; i += 7) {
      w.push(padded.slice(i, i + 7));
    }
    return w;
  }, [activityLog]);

  // Total submissions / contributions
  const totalContributions = useMemo(() => {
    return Object.values(activityLog).reduce((a, b) => a + b, 0);
  }, [activityLog]);

  // Total active days
  const totalActive = useMemo(() => {
    return Object.values(activityLog).filter(v => v > 0).length;
  }, [activityLog]);

  // Max streak calculation
  const maxStreak = useMemo(() => {
    const keys = Object.keys(activityLog).filter(k => activityLog[k] > 0).sort();
    if (keys.length === 0) return 0;
    let max = 0, cur = 0, prev = null;
    for (const k of keys) {
      if (prev) {
        const pDate = new Date(prev);
        const cDate = new Date(k);
        const diff = Math.round((cDate - pDate) / (1000 * 60 * 60 * 24));
        cur = diff === 1 ? cur + 1 : 1;
      } else {
        cur = 1;
      }
      max = Math.max(max, cur);
      prev = k;
    }
    return max;
  }, [activityLog]);

  // Month labels at the bottom of the graph
  const monthLabels = useMemo(() => {
    const labels = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const firstReal = week.find(d => d !== null);
      if (firstReal) {
        const m = firstReal.date.getMonth();
        if (m !== lastMonth) {
          labels.push({ 
            wi, 
            label: firstReal.date.toLocaleString('default', { month: 'short' }) 
          });
          lastMonth = m;
        }
      }
    });
    return labels;
  }, [weeks]);

  // Color mapping matching the screenshot's green tones
  const getColor = (count) => {
    if (!count || count === 0) return '#f1f5f9'; // soft off-white/gray
    if (count === 1) return '#86efac';          // light vibrant green
    if (count === 2) return '#4ade80';          // medium green
    if (count <= 4) return '#16a34a';           // deep emerald green
    return '#14532d';                           // richest forest green
  };

  const cellSize = 13;
  const gap = 3.5;
  const totalW = weeks.length * (cellSize + gap);
  const gridHeight = 7 * (cellSize + gap);

  return (
    <div style={{
      background: '#ffffff',
      border: '1.5px solid #d1fae5',
      borderRadius: '16px',
      padding: '1.4rem 1.6rem',
      marginTop: '1.5rem',
      boxShadow: '0 4px 18px rgba(22, 163, 74, 0.06)',
      position: 'relative'
    }}>
      {/* Top Header Row matching screenshot */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '0.8rem', 
        marginBottom: '1.2rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ fontSize: '1.15rem', fontWeight: '800', color: '#111827' }}>
            {totalContributions}
          </span>
          <span style={{ fontSize: '0.95rem', fontWeight: '500', color: '#6b7280' }}>
            submissions in the past one year
          </span>
          <span 
            title="Daily completed habits, hydration milestones, and wellness logs count towards your contributions!" 
            style={{ display: 'inline-flex', alignItems: 'center', color: '#9ca3af', cursor: 'help', marginLeft: '2px' }}
          >
            <Info size={15} />
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.86rem', color: '#6b7280' }}>
          <div>
            Total active days: <strong style={{ color: '#111827', fontWeight: '700', marginLeft: '4px' }}>
              {totalActive}
            </strong>
          </div>
          <div>
            Max streak: <strong style={{ color: '#111827', fontWeight: '700', marginLeft: '4px' }}>
              {maxStreak}
            </strong>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div style={{ overflowX: 'auto', paddingBottom: '0.4rem' }}>
        <svg
          width={totalW}
          height={gridHeight + 24}
          style={{ display: 'block' }}
        >
          {/* Day Cells (52 weeks x 7 days) */}
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              if (!day) return null;
              const x = wi * (cellSize + gap);
              const y = di * (cellSize + gap);
              const count = day.count;
              const dateStr = day.date.toLocaleDateString('default', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <rect
                  key={`${wi}-${di}`}
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  rx={3.2}
                  ry={3.2}
                  fill={getColor(count)}
                  style={{ 
                    transition: 'all 0.15s ease',
                    cursor: 'pointer'
                  }}
                >
                  <title>
                    {`${dateStr}: ${count} wellness submission${count === 1 ? '' : 's'}`}
                  </title>
                </rect>
              );
            })
          )}

          {/* Month Labels at the bottom matching screenshot */}
          {monthLabels.map(({ wi, label }) => (
            <text
              key={wi}
              x={wi * (cellSize + gap)}
              y={gridHeight + 17}
              fontSize="11"
              fill="#9ca3af"
              fontWeight="500"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              {label}
            </text>
          ))}
        </svg>
      </div>

      {/* Guest / Not logged in banner */}
      {!currentUser && (
        <div style={{
          marginTop: '1.2rem',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          border: '1.5px dashed #86efac',
          borderRadius: '12px',
          padding: '1rem 1.2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              flexShrink: 0
            }}>
              <Lock size={18} />
            </div>
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#14532d' }}>
                Save &amp; Track Your Daily Progress with Your Profile!
              </div>
              <div style={{ fontSize: '0.8rem', color: '#166534' }}>
                Sign in or create an account to record your live habit streak and unlock Luna's Boutique 🎩
              </div>
            </div>
          </div>

          <button
            onClick={onShowAuth}
            className="btn btn-primary"
            style={{
              padding: '0.5rem 1.1rem',
              fontSize: '0.85rem',
              fontWeight: '700',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.25)'
            }}
          >
            <Sparkles size={15} />
            <span>Login / Sign Up 🐾</span>
          </button>
        </div>
      )}

      {/* Logged in status */}
      {currentUser && (
        <div style={{
          marginTop: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
          fontSize: '0.78rem',
          color: '#4b7a5c'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
            <span>Active Profile: <strong style={{ color: '#15803d' }}>{currentUser.username}</strong> (Auto-saving daily progress)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#6b7280' }}>
            <span>Less</span>
            {[0, 1, 2, 4, 6].map(count => (
              <div
                key={count}
                style={{ width: '11px', height: '11px', borderRadius: '2.5px', background: getColor(count) }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
      )}
    </div>
  );
}

