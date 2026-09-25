import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getXpRequiredForLevel,
  calculateLevelFromTotalXp
} from '../src/utils/levelSystem.js';

test('XP requirements follow the arithmetic progression', () => {
  assert.equal(getXpRequiredForLevel(1), 100);
  assert.equal(getXpRequiredForLevel(2), 150);
  assert.equal(getXpRequiredForLevel(5), 300);
});

test('total XP remains level 1 before the first boundary', () => {
  const result = calculateLevelFromTotalXp(99);

  assert.equal(result.level, 1);
  assert.equal(result.xpInCurrentLevel, 99);
  assert.equal(result.xpNeededForNextLevel, 100);
  assert.equal(result.progressPercent, 99);
});

test('exact XP boundaries advance to the next level', () => {
  const result = calculateLevelFromTotalXp(250);

  assert.equal(result.level, 3);
  assert.equal(result.xpInCurrentLevel, 0);
  assert.equal(result.xpNeededForNextLevel, 200);
  assert.equal(result.progressPercent, 0);
});

test('progress is calculated inside the current level', () => {
  const result = calculateLevelFromTotalXp(325);

  assert.equal(result.level, 3);
  assert.equal(result.xpInCurrentLevel, 75);
  assert.equal(result.xpNeededForNextLevel, 200);
  assert.equal(result.progressPercent, 38);
});
