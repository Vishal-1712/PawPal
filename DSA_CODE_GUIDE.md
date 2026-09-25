# PawPal DSA Code Guide

This document explains the data structures and algorithms used in PawPal with code examples from the project.

PawPal is primarily a React frontend, so its DSA usage is practical and application-focused. It uses arrays, objects, searching, filtering, aggregation, sorting, date traversal, arithmetic progression, and rule-based matching. It does not currently require trees, graphs, linked lists, heaps, or explicit queues.

## 1. Arrays

Arrays are used to store ordered collections of related records.

Examples in PawPal include:

- Habits
- Daily quests
- Mood journal entries
- Inventory items
- Meal recommendations
- Meditation steps
- Audio frequencies

### Example: Mapping habits

```javascript
setHabits((previousHabits) =>
  previousHabits.map((habit) => {
    if (habit.id === id) {
      return {
        ...habit,
        completed: willBeCompleted,
        streak: nextStreak
      };
    }
    return habit;
  })
);
```

`map` creates a new array while changing only the matching habit. This is important in React because state should be updated immutably.

### Complexity

For an array with $n$ elements:

- Reading by index: $O(1)$
- Searching with `find`: $O(n)$
- Mapping with `map`: $O(n)$
- Filtering with `filter`: $O(n)$

The new array created by `map` requires $O(n)$ additional space.

## 2. Objects as Records

Plain JavaScript objects store the fields of one application entity.

### Example: Luna statistics

```javascript
const defaultStats = {
  streak: 0,
  coins: 20,
  xp: 35,
  level: 1,
  happiness: 80,
  fluffiness: 80
};
```

The object allows direct access to values:

```javascript
stats.coins;
stats.xp;
stats.level;
```

This is a record-like data structure. It groups related properties into one logical unit.

Other record objects include:

```javascript
const waterData = {
  currentMl: 750,
  goalMl: 2000,
  history: []
};
```

```javascript
const equipped = {
  hat: 'flowercrown',
  collar: 'bell',
  bed: 'cloud',
  room: 'twilight'
};
```

Property access is approximately $O(1)$ on average.

## 3. Objects as Hash Maps

PawPal uses objects as key-value maps when a value needs to be found by a known key.

### Example: Activity log

```javascript
const nextActivityLog = {
  ...previousActivityLog,
  [todayKey]: (previousActivityLog[todayKey] || 0) + amount
};
```

A date such as `2026-09-08` is used as a key. This avoids searching an entire list of dates.

```javascript
const count = activityLog['2026-09-08'] || 0;
```

### Example: User lookup

```javascript
const users = JSON.parse(localStorage.getItem('pawpal_users') || '{}');
const user = users[username.toLowerCase()];
```

### Complexity

Hash-map lookup and update are approximately $O(1)$ on average. The complete activity log still requires $O(n)$ time when all dates are processed for totals or streaks.

## 4. Linear Search with `find`

The application uses linear search for small collections.

### Example: Finding a quest

```javascript
const quest = quests.find((item) => item.id === questId);
```

The array is checked from the beginning until the requested quest is found.

### Complexity

- Best case: $O(1)$ when the first element matches.
- Worst case: $O(n)$ when the item is last or absent.
- Extra space: $O(1)$.

This is appropriate because the quest and habit lists are small.

## 5. Filtering Data

`filter` creates a new array containing only records that satisfy a condition.

### Example: Filtering habits by category

```javascript
const filteredHabits = selectedFilter === 'all'
  ? habits
  : habits.filter((habit) => habit.category === selectedFilter);
```

This is used to display only mindfulness, fitness, nutrition, sleep, or growth habits.

### Complexity

Filtering $n$ habits requires $O(n)$ time and up to $O(n)$ additional space for the result.

## 6. Counting with `filter`

The application counts completed records by filtering and reading the resulting array length.

```javascript
const completedCount = habits.filter((habit) => habit.completed).length;
```

The same pattern is used for active contribution days:

```javascript
const totalActive = Object.values(activityLog)
  .filter((count) => count > 0)
  .length;
```

### Complexity

Both examples are $O(n)$ time. The filter result uses $O(n)$ additional space in the general case.

## 7. Aggregation with `reduce`

`reduce` combines many values into one result.

### Example: Total contributions

```javascript
const totalContributions = Object.values(activityLog)
  .reduce((total, count) => total + count, 0);
```

This calculates the total number of wellness submissions across all dates.

### Complexity

For $n$ activity values:

- Time: $O(n)$
- Extra space: $O(1)$, excluding the array returned by `Object.values`.

## 8. Sorting and Longest Streak Calculation

The contribution graph calculates the maximum consecutive-day streak.

Simplified code from `ContributionGraph.jsx`:

```javascript
const activeDates = Object.keys(activityLog)
  .filter((dateKey) => activityLog[dateKey] > 0)
  .sort();

let maximumStreak = 0;
let currentStreak = 0;
let previousDate = null;

for (const dateKey of activeDates) {
  if (previousDate) {
    const previous = new Date(previousDate);
    const current = new Date(dateKey);
    const difference = Math.round(
      (current - previous) / (1000 * 60 * 60 * 24)
    );

    currentStreak = difference === 1 ? currentStreak + 1 : 1;
  } else {
    currentStreak = 1;
  }

  maximumStreak = Math.max(maximumStreak, currentStreak);
  previousDate = dateKey;
}
```

### Algorithm steps

1. Remove dates with zero activity.
2. Sort the remaining date keys chronologically.
3. Compare each date with the previous date.
4. Continue the streak when the difference is exactly one day.
5. Reset the streak when a day is missing.
6. Keep the largest streak found.

### Complexity

For $n$ active dates:

- Filtering: $O(n)$
- Sorting: $O(n \log n)$
- Streak scan: $O(n)$
- Overall: $O(n \log n)$
- Extra space: $O(n)$

The sorting operation dominates the total complexity.

## 9. Fixed Sliding Date Window

The contribution graph creates a rolling 365-day view.

```javascript
const days = [];

for (let offset = 364; offset >= 0; offset -= 1) {
  const date = new Date(today);
  date.setDate(date.getDate() - offset);

  const key = getLocalDateKey(date);
  days.push({
    date,
    key,
    count: activityLog[key] || 0
  });
}
```

The list is then split into groups of seven days to create calendar weeks.

### Complexity

The loop always processes 365 days:

- Time: $O(365)$
- Space: $O(365)$

Because 365 is fixed, this is effectively constant work for the application.

## 10. Arithmetic Progression for XP

PawPal increases the XP required for each level by 50.

```javascript
export function getXpRequiredForLevel(level) {
  return 100 + (level - 1) * 50;
}
```

The sequence is:

```text
100, 150, 200, 250, 300, ...
```

This is an arithmetic progression with:

- First term: 100
- Common difference: 50

### Level calculation

```javascript
export function calculateLevelFromTotalXp(totalXp) {
  let level = 1;
  let accumulatedXp = 0;

  while (true) {
    const needed = getXpRequiredForLevel(level);

    if (totalXp >= accumulatedXp + needed) {
      accumulatedXp += needed;
      level += 1;
    } else {
      break;
    }
  }

  return {
    level,
    xpInCurrentLevel: totalXp - accumulatedXp,
    xpNeededForNextLevel: getXpRequiredForLevel(level)
  };
}
```

The loop checks level boundaries one by one.

If the calculated level is $L$, the loop takes approximately $O(L)$ time and $O(1)$ space. This is sufficient because PawPal levels are expected to remain relatively small.

## 11. Rule-Based Keyword Matching

Luna's companion uses deterministic keyword rules instead of a machine-learning model.

```javascript
const input = (userInput || '').toLowerCase().trim();

const medicalKeywords = [
  'sick',
  'doctor',
  'pain',
  'fever',
  'diagnos',
  'medicine'
];

if (medicalKeywords.some((keyword) => input.includes(keyword))) {
  return {
    text: MEDICAL_DISCLAIMER,
    isMedicalWarning: true,
    action: 'show_comfort'
  };
}
```

The input is normalized and checked against known keyword groups. The first matching rule determines Luna's response.

### Complexity

If there are $k$ keyword rules and each rule has a small keyword list:

- Time: approximately $O(k)$ for the current small rule set.
- Space: $O(1)$ extra space apart from response data.

This approach is predictable and easy to test, but it does not understand language as deeply as a real AI model.

## 12. Progress Clamping

The application uses boundary checks to keep values valid.

### Example: Hydration progress

```javascript
const percentage = Math.min(
  100,
  Math.round((currentMl / goalMl) * 100)
);
```

### Example: Coin balance

```javascript
coins: Math.max(0, previousStats.coins + amount)
```

### Example: Luna happiness

```javascript
happiness: Math.min(100, previousStats.happiness + 5)
```

These operations prevent invalid states such as hydration above 100%, negative coins, or happiness above 100.

Each individual clamp operation is $O(1)$ time and $O(1)$ space.

## 13. Immutable State Updates in React

React state updates use copies instead of directly mutating existing arrays or objects.

```javascript
setQuests((previousQuests) =>
  previousQuests.map((quest) =>
    quest.id === questId
      ? { ...quest, claimed: true }
      : quest
  )
);
```

The spread operator copies the matching object, while `map` creates a new array. This lets React detect the state change reliably.

### Complexity

For $n$ quests:

- Time: $O(n)$
- Space: $O(n)$ for the new array and copied object references.

## 14. Data Structures Not Currently Used

The current implementation does not explicitly use:

- Linked lists
- Stacks
- Queues
- Priority queues or heaps
- Binary search trees
- Graphs
- Trie structures
- Dynamic programming tables
- HashSet or Map instances

This is not a problem. The project requirements are well served by arrays and object-based maps. These advanced structures could be introduced only if the application adds features that need them, such as notification queues, recommendation graphs, or high-volume search.

## 15. DSA Summary Table

| Concept | PawPal usage | Typical complexity |
|---|---|---|
| Array | Habits, quests, moods, inventory | Access $O(1)$, scan $O(n)$ |
| Object record | Stats, hydration, cosmetics | Property access $O(1)$ average |
| Object hash map | Users and date activity | Lookup $O(1)$ average |
| Linear search | Quest and habit lookup | $O(n)$ |
| Filtering | Category and active-day filtering | $O(n)$ |
| Aggregation | Contribution totals | $O(n)$ |
| Sorting | Chronological activity dates | $O(n \log n)$ |
| Sequential scan | Maximum streak calculation | $O(n)$ |
| Arithmetic progression | XP requirements | $O(1)$ per requirement |
| Rule matching | Luna responses | Approximately $O(k)$ |
| Boundary checks | Progress and reward validation | $O(1)$ |

## 16. How to Explain This in a Viva

A concise explanation can be:

> PawPal uses arrays for ordered application data such as habits and quests, and JavaScript objects as records and hash maps for user profiles and date-based activity. The contribution graph uses filtering, sorting, and a sequential scan to calculate active days and maximum streaks. The XP system uses an arithmetic progression, while Luna's chat uses deterministic keyword matching. React state is updated immutably with `map` and object spread syntax. The current feature set does not require advanced structures such as trees or graphs.

## 17. Related Files

- `src/App.jsx` - Shared state, persistence, and activity updates.
- `src/components/HabitsTracker.jsx` - Habit search, filtering, and immutable updates.
- `src/components/ContributionGraph.jsx` - 365-day window, totals, sorting, and streak calculation.
- `src/components/DailyQuests.jsx` - Quest lookup and immutable reward updates.
- `src/utils/levelSystem.js` - XP arithmetic progression and level calculation.
- `src/utils/lunaAI.js` - Rule-based keyword matching.
- `src/components/HydrationTracker.jsx` - Progress clamping and hydration calculations.
- `test/levelSystem.test.js` - Tests for XP boundaries and progress.
