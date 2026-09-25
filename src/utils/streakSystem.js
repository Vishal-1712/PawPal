/**
 * PawPal Consecutive Streak Calculation System
 * Accurately calculates daily active streaks from the user's activity log.
 */

export const calculateConsecutiveStreak = (activityLog = {}, referenceDate = new Date()) => {
  const getDayKey = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const todayKey = getDayKey(referenceDate);
  const yesterday = new Date(referenceDate);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getDayKey(yesterday);

  const hasToday = (activityLog[todayKey] || 0) > 0;
  const hasYesterday = (activityLog[yesterdayKey] || 0) > 0;

  if (!hasToday && !hasYesterday) {
    return 0;
  }

  let streak = 0;
  let checkDate = hasToday ? new Date(referenceDate) : new Date(yesterday);

  while (true) {
    const key = getDayKey(checkDate);
    if ((activityLog[key] || 0) > 0) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};
