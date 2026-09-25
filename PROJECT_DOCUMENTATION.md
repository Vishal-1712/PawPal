# PawPal Project Documentation

## 1. Project Overview

PawPal is a browser-based wellness and virtual-pet application. Users complete healthy activities, care for Luna the cat, earn experience points and coins, unlock cosmetics, and review their wellness history.

The application is currently a frontend-only project. User profiles and wellness data are stored in the browser with `localStorage`; there is no backend API or database.

## 2. Main Features

### Virtual Pet Sanctuary

- View Luna with animated emotions and equipped cosmetics.
- Pet, feed, play with, and let Luna nap.
- Increase Luna's happiness and fluffiness through wellness actions.
- Trigger a level-up celebration with dancing animation, confetti, sound, and bonus coins.

### Wellness Habits

- Track habits in categories such as mindfulness, fitness, nutrition, sleep, and growth.
- Mark habits complete and receive XP and coins.
- Record completed activities in the contribution graph.
- Automatically synchronize the water habit when the hydration goal reaches 100%.

### Hydration Tracker

- Set a daily water goal in milliliters.
- Add water using quick actions such as 250 ml and 500 ml.
- Show progress toward the daily goal and intake history.
- Reward hydration progress with gamification feedback.

### Mood Journal

- Record a mood, tags, and a personal reflection note.
- Review previous mood entries.
- Link mood actions to mindfulness and sound experiences.

### Mindfulness Hub

- Practice guided 4-7-8 breathing.
- Use short desk stretches.
- Follow cloud and nature visualization sessions.
- Earn wellness rewards after completing sessions.

### Sound Sanctuary

- Play ambient and nature sound experiences.
- Stop active audio when the user changes application tabs.
- Mute or unmute sound effects and ambient audio.

### Food Planner

- Display curated meal recommendations.
- Show category, preparation time, calories, ingredients, tags, and health benefits.

### Daily Planner

- Organize wellness activities into a daily schedule.
- Earn XP and coins for completing planner actions.

### Daily Quests and Achievements

- Complete goals such as drinking water, finishing habits, journaling, and practicing mindfulness.
- Claim bonus XP and coins after reaching quest targets.
- Unlock achievement badges based on streaks, hydration, mindfulness, and Luna's level.

### Luna's Boutique

- Spend coins on hats, collars, beds, and room themes.
- Store purchased items in an inventory.
- Equip owned cosmetics on Luna.

### Profiles and Guest Mode

- Use PawPal as a guest without creating a profile.
- Create a local profile or log in with an existing local profile.
- Save profile-specific stats, habits, hydration, inventory, equipment, and activity history.
- Save profile-specific mood journal entries and daily quest progress.
- Restore the active session after refreshing the page.

## 3. Technology Stack

### Runtime and Build Tools

- **JavaScript:** Application language.
- **React 18:** Component-based user interface and state management.
- **Vite:** Development server and production build tool.
- **React DOM:** Mounts the React application into the browser DOM.

### Libraries

- **Lucide React:** Interface icons.
- **canvas-confetti:** Confetti effects for rewards and level-ups.

### Browser APIs

- **localStorage:** Stores local profiles, sessions, stats, habits, hydration data, inventory, equipment, and contribution history.
- **Web Audio API:** Generates procedural sounds such as meows, purrs, chimes, and completion sounds.
- **HTML Audio API:** Plays remote sound files and ambient tracks.
- **SVG:** Renders the contribution heatmap and parts of the cat interface.

### Styling

- Custom CSS in `src/index.css`.
- CSS variables for colors and shared design tokens.
- Responsive layouts, glass-style panels, progress bars, transitions, and animations.
- No CSS framework or component library is used.

## 4. Application Architecture

### Entry Point

1. `index.html` provides the browser document and root element.
2. `src/main.jsx` mounts the React application.
3. `src/App.jsx` renders the main application and owns shared state.

### Root State in `App.jsx`

`App.jsx` coordinates the data used by multiple components:

- Active navigation tab.
- Current user and authentication modal state.
- Theme and mute state.
- Luna stats: level, XP, coins, happiness, fluffiness, and streak.
- Habits and activity history.
- Hydration data.
- Cosmetics and inventory.
- Mood logs and daily quests.
- Level-up celebration state.

Child components receive data and event handlers through props. A component updates shared data by calling a setter or callback supplied by `App.jsx`.

### Navigation Flow

The navbar changes `activeTab`. `App.jsx` then conditionally renders the matching feature component, for example:

- `sanctuary` -> `LunaPet` and `HabitsTracker`
- `hydration` -> `HydrationTracker`
- `mood` -> `MoodJournal`
- `mindfulness` -> `MindfulnessHub`
- `shop` -> `PetShop`
- `quests` -> `DailyQuests`

When the active tab changes, the audio engine stops the currently active remote audio track.

### Persistence Flow

1. On startup, PawPal reads the saved session from `localStorage`.
2. If a session exists, user-specific records are loaded using keys such as `pawpal_user_<username>_stats`.
3. When shared state changes, a React `useEffect` serializes it with `JSON.stringify` and saves it for the logged-in user.
4. Logging out removes the active session and resets the UI to guest defaults.

Mood entries and quest progress use separate username-based storage keys, so one user's journal and rewards do not appear in another user's profile. Existing sessions also reload these records after a page refresh.

Guest data is available during the current browser session but is not saved as a user profile.

## 5. Gamification Flow

### Completing an Activity

1. The user completes a habit, hydration action, quest, planner item, or mindfulness session.
2. The relevant component calls `onAddXp` and/or `onAddCoins`.
3. `App.jsx` updates the stats object.
4. The activity can be recorded against the current local date.
5. The contribution graph reads the activity log and recalculates totals and streaks.
6. If total XP crosses a level boundary, the level-up celebration starts.

### XP Progression

XP requirements use an arithmetic progression:

- Level 1 to 2: 100 XP
- Level 2 to 3: 150 XP
- Level 3 to 4: 200 XP
- Level 4 to 5: 250 XP

The requirement for level `L` is:

`XP required = 100 + (L - 1) * 50`

`calculateLevelFromTotalXp` repeatedly subtracts each level requirement until the remaining XP fits inside the current level. It returns the level, XP in the current level, XP needed for the next level, and percentage progress.

## 6. Data Structures Used

### Arrays

Arrays store ordered collections:

- Habit records.
- Quest records.
- Mood log entries.
- Inventory item IDs.
- Equipped item options.
- Meal, music, meditation, and stretch content.
- Audio note frequencies.

Common array operations include `map`, `find`, `filter`, `slice`, `forEach`, and `some`.

### Objects as Records

Plain objects represent related fields for one entity:

- A user profile.
- Luna's stats.
- Hydration data.
- A habit or quest.
- A meal or meditation.
- The equipped cosmetics object.

This provides direct property access such as `stats.coins` or `waterData.currentMl`.

### Objects as Hash Maps

JavaScript objects are also used as key-value maps:

- User lookup by lowercase username in `pawpal_users`.
- Daily activity lookup by date key such as `2026-09-08`.
- Music lookup by mood such as `stressed`, `happy`, `tired`, or `focus`.
- Local storage records keyed by username and data type.

Username lookup is approximately $O(1)$ on average, as is activity lookup by date key.

### Sets and Queues

No explicit `Set`, queue, stack, tree, graph, or linked-list implementation is currently used. Ordered arrays and objects are sufficient for the current feature set.

## 7. Algorithms and Logic

### Linear Search

Several features search short arrays from start to finish:

- `find` locates a quest or user record.
- `some` checks whether text contains a medical or wellness keyword.
- `find` checks for a specific water habit.

For an array of size $n$, these operations are generally $O(n)$.

### Filtering and Counting

The contribution graph uses `filter` to count active days and ignore zero-activity dates. This is $O(n)$ for $n$ activity records.

### Aggregation

`reduce` sums contribution counts to calculate total submissions. This is $O(n)$.

### Sorting and Chronological Streaks

The contribution graph:

1. Filters activity dates with a count greater than zero.
2. Sorts date keys chronologically.
3. Compares each date with the previous date.
4. Increases the current streak when dates are exactly one day apart.
5. Stores the largest streak found.

The sorting step is $O(n \log n)$ and the streak scan is $O(n)$.

### Sliding Date Window Construction

The contribution graph builds a rolling 365-day window by iterating backward from today, creating a local date key for every day, and grouping the results into weeks of seven days. This is $O(365)$, effectively constant time for the fixed window.

### Arithmetic Progression

The XP system uses a mathematical arithmetic progression instead of a lookup table. The difference between successive level requirements is always 50 XP.

### Rule-Based Keyword Matching

`generateLunaResponse` converts the user message to lowercase and checks keyword groups in order. The first matching rule returns a response and optional action such as opening breathing exercises, suggesting food, or prompting hydration.

If there are $k$ keyword rules and each rule has a small keyword list, the current approach is effectively $O(k)$ per message. It is a deterministic rule engine, not a machine-learning model or external AI service.

### Progress and Boundary Clamping

Progress values use `Math.min` and `Math.max` to stay within valid bounds:

- Hydration progress cannot exceed 100%.
- Happiness and fluffiness cannot exceed 100.
- Coins cannot become negative.
- Quest progress cannot claim a reward before reaching its target.

## 8. Testing

The project uses Node's built-in test runner for dependency-free logic tests. Current tests verify the XP progression formula, level boundaries, and progress percentage calculation.

```bash
npm test
```

The test files are stored in `test/`. UI integration and end-to-end tests can be added later with a browser testing tool.

## 9. Important Limitations

- Authentication is local demo authentication, not production authentication.
- Passwords are stored in browser storage in plain text and must be hashed by a real backend in production.
- Data is device- and browser-specific and can be removed by clearing site storage.
- There is no server synchronization or multi-device account access.
- Luna's chat responses are rule-based and use curated wellness content.
- Medical responses include a disclaimer and are not medical diagnosis or treatment.
- Remote audio URLs require network access and may be affected by browser autoplay policies or availability of the remote files.

## 10. Source Map

- `src/App.jsx` - Root state, navigation, persistence, rewards, and shared behavior.
- `src/components/` - Feature-specific React components.
- `src/utils/audio.js` - Web Audio and remote audio engine.
- `src/utils/levelSystem.js` - XP progression and level calculations.
- `src/utils/lunaAI.js` - Luna persona, wellness content, and rule-based responses.
- `src/index.css` - Global styles, design tokens, and animations.
- `test/levelSystem.test.js` - Automated tests for XP progression and level boundaries.
- `package.json` - Dependencies and npm scripts.

## 11. Recent Enhancements

- Added per-user persistence for mood journal entries.
- Added per-user persistence for daily quest progress.
- Added refresh-time loading so saved mood and quest data is restored when a session already exists.
- Added guest-mode reset behavior for mood logs and quests during logout.
- Added automated XP progression tests using Node's built-in test runner.
- Added the `npm test` command for repeatable verification.

## 12. Development Commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm test
```

`npm run dev` starts the Vite development server. `npm run build` creates the production bundle in the Vite output directory, and `npm run preview` serves that production build locally.
