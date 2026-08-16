/**
 * PawPal Level & XP Progression System
 * Level 1 starts with 100 XP required.
 * Each subsequent level requires +50 XP more than the previous level (arithmetic progression difference = 50).
 * Level 1 -> 2: 100 XP (Total 100)
 * Level 2 -> 3: 150 XP (Total 250)
 * Level 3 -> 4: 200 XP (Total 450)
 * Level 4 -> 5: 250 XP (Total 700)
 * Level 5 -> 6: 300 XP (Total 1000)
 */

export function getXpRequiredForLevel(level) {
  // XP needed within level L to reach L + 1
  return 100 + (level - 1) * 50;
}

export function getTotalXpForLevelStart(level) {
  if (level <= 1) return 0;
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += getXpRequiredForLevel(i);
  }
  return total;
}

export function calculateLevelFromTotalXp(totalXp) {
  let level = 1;
  let accumulatedXp = 0;

  while (true) {
    const needed = getXpRequiredForLevel(level);
    if (totalXp >= accumulatedXp + needed) {
      accumulatedXp += needed;
      level++;
    } else {
      break;
    }
  }

  const currentLevelStartXp = accumulatedXp;
  const xpInCurrentLevel = totalXp - currentLevelStartXp;
  const xpNeededForNextLevel = getXpRequiredForLevel(level);
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeededForNextLevel) * 100));

  return {
    level,
    xpInCurrentLevel,
    xpNeededForNextLevel,
    progressPercent,
    totalXp
  };
}
