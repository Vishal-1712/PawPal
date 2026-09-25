import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateConsecutiveStreak } from '../src/utils/streakSystem.js';

const getDayKey = (daysAgo = 0) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

test('streak is 0 for empty activity log', () => {
  assert.equal(calculateConsecutiveStreak({}), 0);
});

test('streak is 1 when activity is recorded today only', () => {
  const log = { [getDayKey(0)]: 2 };
  assert.equal(calculateConsecutiveStreak(log), 1);
});

test('streak is 1 when activity was recorded yesterday but not yet today', () => {
  const log = { [getDayKey(1)]: 3 };
  assert.equal(calculateConsecutiveStreak(log), 1);
});

test('streak is 2 when activity is recorded both today and yesterday', () => {
  const log = {
    [getDayKey(0)]: 1,
    [getDayKey(1)]: 2
  };
  assert.equal(calculateConsecutiveStreak(log), 2);
});

test('streak increments correctly for multiple consecutive days', () => {
  const log = {
    [getDayKey(0)]: 1,
    [getDayKey(1)]: 2,
    [getDayKey(2)]: 1,
    [getDayKey(3)]: 4
  };
  assert.equal(calculateConsecutiveStreak(log), 4);
});

test('streak resets to 0 if a day was skipped before yesterday', () => {
  const log = {
    [getDayKey(2)]: 3,
    [getDayKey(3)]: 2
  };
  assert.equal(calculateConsecutiveStreak(log), 0);
});
