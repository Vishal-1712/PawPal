# PawPal
PawPal is a wellness app where completing healthy tasks levels up and dresses your virtual cat.

 Project Documentation




1. Features Overview


2. Virtual Pet Sanctuary (LunaPet and ChibiCat)
- Interactive Pet Companion: Pet Luna, feed delicious treats, play with yarn, or let her take a power nap.
- Fluffiness and Happiness Levels: Luna's happiness and fluffiness increase as you complete daily wellness goals.
- Level Progression and Dance Party: Earn XP to level up Luna. Leveling up triggers a confetti dance celebration with cheerful cat audio.




3. Daily Wellness Habits and Heatmap (HabitsTracker and ContributionGraph)
- Categorized Habit Tracker: Create and manage habits across Mindfulness, Movement, Nutrition, Rest, and Growth.
- GitHub and LeetCode Style Contribution Graph: Visual 365-day activity heatmap tracking your daily habit completions, active day streaks, and total submissions.
- Smart Habit Interlocking: Special habits like Drink 8 Fresh Glasses of Water automatically sync and unlock upon reaching 100% hydration.




4. Hydration Companion (HydrationTracker)
- Track daily water intake in milliliters with customizable daily hydration targets.
- Quick-add intake buttons for 250ml and 500ml with animated progress bars and log history.




5. Mood Journal (MoodJournal)
- Check in with your emotions using mood indicators, custom tags, and reflection notes.
- View past mood entries to reflect on your emotional growth.




6. Zen and Mindfulness Hub (MindfulnessHub)
- Guided Breathing: 4-7-8 breathing circle animation with audio bell cues.
- Desk Stretches and Cloud Visualization: Quick 30-second ergonomics stretch instructions and relaxing visualization timers.




7. Sound Sanctuary (SoundSanctuary)
- Ambient soundscape player featuring soothing music tracks and nature audio to focus, meditate, or sleep.




8. Healthy Nutrition Planner (FoodPlanner)
- Curated nutritionist-approved meal suggestions with explanations of their health benefits.




9. Daily Quests and Gamification (DailyQuests)
- Complete daily quests such as Reach 1000ml hydration or Complete 3 habits to earn bonus Coins and XP.




10. Luna's Boutique and Cosmetic Shop (PetShop)
- Spend earned coins to unlock and equip accessories for Luna:
  - Hats: Flower Crown, Top Hat, Wizard Cap, Strawberry Bandana
  - Collars: Golden Bell, Red Ribbon, Bowtie, Pearl Necklace
  - Beds: Cloud Cushion, Royal Velvet Bed, Woven Basket
  - Room Themes: Twilight Haven, Pastel Meadow, Cozy Fireplace, Sakura Garden




11. User Profiles and Local Persistence (AuthModal)
- Local profile authentication and session saving via localStorage.
- Supports Guest Mode as well as custom user accounts that preserve stats, inventory, habits, and contribution history across sessions.








12. Project Structure


- index.html - Main HTML entry point and font configuration
- package.json - Project dependencies and scripts
- vite.config.js - Vite configuration and dev server settings
- src/
  - App.jsx - Root application and state provider
  - main.jsx - React DOM render entry point
  - index.css - Global CSS design system with glassmorphism, variables, animations
  - components/
    - Navbar.jsx - Navigation bar and user profile status
    - LunaPet.jsx - Virtual pet controls and sanctuary dashboard
    - ChibiCat.jsx - Animated SVG cat render with cosmetics and emotions
    - HabitsTracker.jsx - Habit management list and progress bars
    - ContributionGraph.jsx - 365-day activity heatmap grid
    - HydrationTracker.jsx - Water intake logging and progress
    - MoodJournal.jsx - Emotion check-ins and journal history
    - MindfulnessHub.jsx - Guided breathing and stretch exercises
    - SoundSanctuary.jsx - Ambient audio soundscapes
    - FoodPlanner.jsx - Healthy meal recommendations
    - DailyPlanner.jsx - Time-blocked daily task planner
    - DailyQuests.jsx - Gamified daily quests and rewards
    - PetShop.jsx - Luna's cosmetic boutique
    - LunaChat.jsx - Interactive wellness companion chat
    - AuthModal.jsx - Login and registration modal
  - utils/
    - audio.js - Web Audio API sound engine
    - levelSystem.js - Level XP progression formulas
    - lunaAI.js - Response generator and wellness knowledge base.




13. Tech Stack and Design System


- Framework: React 18 and Vite
- Icons: Lucide React
- Effects: Canvas Confetti
- Audio: Native Web Audio API Synthesizer
- Styling: Custom Vanilla CSS with modern Glassmorphism, HSL color tokens, smooth micro-animations, and dynamic theme switching.




