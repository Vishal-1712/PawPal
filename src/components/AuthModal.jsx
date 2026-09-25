import React, { useState } from 'react';
import { User, Lock, Mail, Eye, EyeOff, Cat, X, Sparkles } from 'lucide-react';

/**
 * Auth Modal — Login & Create Profile
 * All data stored in localStorage. No backend needed.
 * Session persists until the user explicitly logs out.
 */
export default function AuthModal({ onClose, onLogin, reason = 'contribution' }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const reasonText = reason === 'boutique'
    ? "Login to access Luna's Boutique and save your outfits! 🎩"
    : "Login to view your Wellness Contribution Graph! 🌿";

  const set = (field) => (e) => {
    setForm(p => ({ ...p, [field]: e.target.value }));
    setError('');
  };

  const hashPassword = async (plainText) => {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(plainText);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (e) {
      let hash = 0;
      for (let i = 0; i < plainText.length; i++) {
        hash = ((hash << 5) - hash) + plainText.charCodeAt(i);
        hash |= 0;
      }
      return 'h_' + Math.abs(hash);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = form;

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    const usersRaw = localStorage.getItem('pawpal_users');
    const users = usersRaw ? JSON.parse(usersRaw) : {};
    const hashedPassword = await hashPassword(password);

    if (mode === 'signup') {
      if (users[username.toLowerCase()]) {
        setError('Username already taken. Try logging in instead!');
        return;
      }
      const newUser = {
        username: username.trim(),
        email: email.trim(),
        password: hashedPassword, // SHA-256 hashed password
        createdAt: new Date().toISOString(),
        avatarColor: '#16a34a'
      };
      users[username.toLowerCase()] = newUser;
      localStorage.setItem('pawpal_users', JSON.stringify(users));
      localStorage.setItem('pawpal_session', JSON.stringify({ username: newUser.username, loggedInAt: Date.now() }));
      onLogin(newUser);
    } else {
      const user = users[username.toLowerCase()];
      const isMatch = user && (user.password === hashedPassword || user.password === password);
      if (!user || !isMatch) {
        setError('Invalid username or password. Check your details!');
        return;
      }
      // Migrate legacy plaintext password to hash if matched
      if (user.password === password) {
        user.password = hashedPassword;
        localStorage.setItem('pawpal_users', JSON.stringify(users));
      }
      localStorage.setItem('pawpal_session', JSON.stringify({ username: user.username, loggedInAt: Date.now() }));
      onLogin(user);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="glass-panel"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '420px',
          padding: '2rem',
          background: '#ffffff',
          border: '2px solid #d1fae5',
          borderRadius: '20px',
          boxShadow: '0 12px 40px rgba(22,163,74,0.18)'
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            background: '#16a34a', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 0.8rem', fontSize: '1.4rem'
          }}>
            🐱
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#14532d' }}>
            {mode === 'login' ? 'Welcome Back!' : 'Create Your Profile'}
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#4b7a5c', marginTop: '0.3rem' }}>
            {reasonText}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>

          {/* Username */}
          <div style={{ position: 'relative' }}>
            <User size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#16a34a' }} />
            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={set('username')}
              required
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                border: '1.5px solid #d1fae5',
                borderRadius: '10px',
                fontSize: '0.9rem',
                color: '#14532d',
                background: '#f0fdf4',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Email (signup only) */}
          {mode === 'signup' && (
            <div style={{ position: 'relative' }}>
              <Mail size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#16a34a' }} />
              <input
                type="email"
                placeholder="Email (optional)"
                value={form.email}
                onChange={set('email')}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem 0.65rem 2.4rem',
                  border: '1.5px solid #d1fae5',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  color: '#14532d',
                  background: '#f0fdf4',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          {/* Password */}
          <div style={{ position: 'relative' }}>
            <Lock size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#16a34a' }} />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={set('password')}
              required
              style={{
                width: '100%',
                padding: '0.65rem 2.5rem 0.65rem 2.4rem',
                border: '1.5px solid #d1fae5',
                borderRadius: '10px',
                fontSize: '0.9rem',
                color: '#14532d',
                background: '#f0fdf4',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPass(p => !p)}
              style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <p style={{ fontSize: '0.8rem', color: '#dc2626', background: '#fef2f2', padding: '0.5rem 0.8rem', borderRadius: '8px', border: '1px solid #fca5a5' }}>
              ⚠️ {error}
            </p>
          )}

          {/* Submit */}
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.7rem', fontSize: '0.95rem', fontWeight: '700' }}>
            <Sparkles size={16} />
            <span>{mode === 'login' ? 'Login to PawPal 🐾' : 'Create My Profile 🌿'}</span>
          </button>
        </form>

        {/* Toggle mode */}
        <p style={{ textAlign: 'center', marginTop: '1.2rem', fontSize: '0.83rem', color: '#4b7a5c' }}>
          {mode === 'login' ? "Don't have a profile? " : 'Already have an account? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }}
            style={{ background: 'none', border: 'none', color: '#16a34a', fontWeight: '700', cursor: 'pointer', fontSize: '0.83rem' }}
          >
            {mode === 'login' ? 'Create one!' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
}
