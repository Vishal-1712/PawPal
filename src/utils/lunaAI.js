/**
 * Luna Companion Engine - Knowledge, Rules, Persona & Response Generator
 */

export const LUNA_PERSONA = {
  name: "Luna",
  role: "Wellness Cat Companion",
  tone: "Warm, playful, empathetic, slightly mischievous",
  favoriteFood: "Fresh salmon & catnip tea 🐟🍵",
  motto: "The healthier you are, the happier and fluffier I become! 🐱✨"
};

export const MEDICAL_DISCLAIMER = "I'm Luna, your wellness buddy, not a doctor! 🐱 Please consult a healthcare professional for medical advice. I can, however, suggest some relaxing stretches or a healthy snack! 🌿✨";
export const VOICE_DISCLAIMER = "Note: Voice & emotion analysis is for wellness support only, not clinical diagnosis. 🧘";

// Curated Healthy Meals with Nutrition "Why"
export const HEALTHY_MEALS = [
  {
    id: "m1",
    name: "Golden Turmeric Berry Smoothie Bowl",
    category: "Breakfast",
    tags: ["Vegetarian", "Vegan", "Gluten-Free", "Antioxidant"],
    prepTime: "5 mins",
    calories: 280,
    benefits: "Packed with Vitamin C and antioxidant blueberries to boost your brain focus and immunity! 🫐✨",
    ingredients: ["Frozen blueberries & bananas", "Almond or oat milk", "Chia seeds & hemp hearts", "Dash of turmeric & cinnamon"]
  },
  {
    id: "m2",
    name: "Mediterranean Quinoa & Avocado Bowl",
    category: "Lunch",
    tags: ["Vegetarian", "Vegan", "Gluten-Free", "High-Protein"],
    prepTime: "15 mins",
    calories: 420,
    benefits: "Rich in healthy monounsaturated fats and plant protein to keep your afternoon energy steady! 🥑🥗",
    ingredients: ["Cooked fluffy quinoa", "Diced Hass avocado", "Cherry tomatoes & cucumber", "Lemon-tahini drizzle", "Toasted pumpkin seeds"]
  },
  {
    id: "m3",
    name: "Warm Ginger Salmon (or Tofu) with Steamed Greens",
    category: "Dinner",
    tags: ["High-Protein", "Gluten-Free", "Anti-inflammatory"],
    prepTime: "20 mins",
    calories: 480,
    benefits: "Loaded with Omega-3 fatty acids to soothe inflammation and support sound, restful sleep! 🐟🌿",
    ingredients: ["Wild salmon fillet (or crispy tofu)", "Steamed baby bok choy & broccoli", "Grated fresh ginger & garlic", "Low-sodium tamari glaze"]
  },
  {
    id: "m4",
    name: "Crunchy Apple Slices with Almond Butter & Chia",
    category: "Snack",
    tags: ["Vegetarian", "Vegan", "Gluten-Free"],
    prepTime: "3 mins",
    calories: 190,
    benefits: "Fiber-rich crisp apples provide a steady release of natural energy without blood sugar spikes! 🍎🥜",
    ingredients: ["Crisp Honeycrisp apple slices", "2 tbsp creamy almond butter", "Sprinkle of chia seeds & cinnamon"]
  },
  {
    id: "m5",
    name: "Cozy Chamomile Moon Milk & Honey",
    category: "Wind-down",
    tags: ["Vegetarian", "Gluten-Free", "Sleep-Aid"],
    prepTime: "5 mins",
    calories: 120,
    benefits: "Calming chamomile and magnesium-rich warm milk help relax tense muscles for sweet kitty dreams! 🌙🍵",
    ingredients: ["Warm oat or almond milk", "Brewed chamomile tea concentrate", "1 tsp raw honey", "Pinch of nutmeg"]
  }
];

// Curated Mood Music Stations
export const MOOD_MUSIC = {
  stressed: {
    mood: "Stressed / Overwhelmed 🌧️",
    recommendation: "Calming Lo-Fi & Gentle Ambient",
    tracks: [
      { title: "Weightless", artist: "Marconi Union", vibe: "Proven heart-rate relaxation" },
      { title: "Comptine d'un autre été", artist: "Yann Tiersen", vibe: "Peaceful acoustic piano" },
      { title: "Rainy Afternoon in Tokyo", artist: "ChilledCow / Lofi Girl", vibe: "Warm lo-fi beats" },
      { title: "Spiegel im Spiegel", artist: "Arvo Pärt", vibe: "Meditative stillness" }
    ]
  },
  happy: {
    mood: "Happy & Energized ☀️",
    recommendation: "Upbeat Sunshine & Groovy Vibes",
    tracks: [
      { title: "Sunroof", artist: "Nicky Youre & dazy", vibe: "Pure dopamine rush" },
      { title: "Levitating", artist: "Dua Lipa", vibe: "Uplifting disco pop" },
      { title: "Walking On Sunshine", artist: "Katrina and the Waves", vibe: "Classic celebration" },
      { title: "Can't Stop the Feeling!", artist: "Justin Timberlake", vibe: "Joyful habit dance" }
    ]
  },
  tired: {
    mood: "Tired / Low Energy 😴",
    recommendation: "Soft Acoustic & Healing Frequencies",
    tracks: [
      { title: "Banana Pancakes", artist: "Jack Johnson", vibe: "Cozy Sunday warmth" },
      { title: "Holocene", artist: "Bon Iver", vibe: "Gentle soothing folk" },
      { title: "Clair de Lune", artist: "Claude Debussy", vibe: "Restorative classical" },
      { title: "432Hz Binaural Rest", artist: "Zen Soundscapes", vibe: "Deep relaxation" }
    ]
  },
  focus: {
    mood: "Deep Work / Study 🎯",
    recommendation: "Binaural Beats & Modern Instrumental",
    tracks: [
      { title: "Coffee Cold", artist: "Galt MacDermot", vibe: "Smooth focus groove" },
      { title: "Time", artist: "Hans Zimmer (Inception)", vibe: "Cinematic momentum" },
      { title: "Night Owl", artist: "Galimatias", vibe: "Crisp atmospheric flow" },
      { title: "Study with Me Lofi", artist: "Kudos", vibe: "No-distraction cadence" }
    ]
  }
};

// Guided Meditation Visualizations
export const MEDITATIONS = [
  {
    id: "med1",
    title: "Floating on a Fluffy Cloud ☁️",
    duration: "2-3 Minutes",
    theme: "Stress Relief & Surrender",
    steps: [
      "Find a comfortable seat, soften your shoulders, and close your eyes gently. 🐾",
      "Take a slow, deep breath in through your nose for 4 seconds... and let it drift away like a warm breeze.",
      "Imagine yourself stepping onto a soft, warm pastel cloud floating peacefully in a golden twilight sky.",
      "With every gentle breath, the cloud supports every muscle. You don't have to carry anything right now.",
      "Feel Luna curling up next to you, purring with gentle rhythmic warmth. Breathe in calm... breathe out tension.",
      "When you're ready, wiggle your toes, gently open your eyes, and bring this peaceful lightness into your day. ✨"
    ]
  },
  {
    id: "med2",
    title: "The Sunlit Forest Glade 🍃",
    duration: "3 Minutes",
    theme: "Rejuvenation & Clarity",
    steps: [
      "Sit upright with your spine tall like a majestic tree. Relax your jaw and brow. 🌲",
      "Inhale the crisp, pine-scented mountain air... Hold for a moment... Exhale completely.",
      "Visualize walking on a mossy path dappled with soft golden sunlight filtering through emerald leaves.",
      "Listen to the quiet rustle of leaves and a gentle babbling brook nearby. The water washes away busy thoughts.",
      "You are grounded, safe, and fully present. Inhale vitality and fresh energy.",
      "Carry this grounded strength back into your room. Give a gentle stretch as you return. 🧘"
    ]
  }
];

// Quick Desk Stretches
export const QUICK_STRETCHES = [
  {
    name: "Cat-Cow Chair Stretch 🐱",
    duration: "30s",
    desc: "Inhale, arch your back gently and look up. Exhale, round your spine forward like a cozy sleeping cat!"
  },
  {
    name: "Shoulder Roll Release 💆",
    duration: "30s",
    desc: "Roll shoulders up to your ears, then slowly back and down in 5 big circles. Release computer hunching!"
  },
  {
    name: "Wrist & Paw Shakeout 🐾",
    duration: "20s",
    desc: "Interlace your fingers, roll wrists in fluid figures of 8, then gently shake out tired paws!"
  },
  {
    name: "Gentle Neck Tilt 🌸",
    duration: "30s",
    desc: "Lower right ear to right shoulder, breathe deeply for 3 counts. Switch sides softly."
  }
];

// Response Generator Logic
export function generateLunaResponse(userInput, context = {}) {
  const input = (userInput || '').toLowerCase().trim();
  const {
    userName = 'friend',
    waterGlasses = 0,
    waterGoal = 8,
    streak = 1,
    habitsCompleted = 0,
    totalHabits = 5,
    currentMood = 'happy',
    dietPreference = 'Balanced'
  } = context;

  // Medical Check
  const medicalKeywords = ['sick', 'doctor', 'pain', 'fever', 'diagnos', 'prescrib', 'disease', 'chest hurt', 'injury', 'medicine', 'pill', 'blood pressure'];
  if (medicalKeywords.some(kw => input.includes(kw))) {
    return {
      text: `${MEDICAL_DISCLAIMER}\n\n*Luna gently nuzzles your hand with a warm purr.* 🐾 Are you drinking enough water or resting comfortably today? 💧`,
      isMedicalWarning: true,
      action: 'show_comfort'
    };
  }

  // Water / Hydration queries
  if (input.includes('water') || input.includes('hydrat') || input.includes('drink')) {
    const remaining = Math.max(0, waterGoal - waterGlasses);
    if (remaining === 0) {
      return {
        text: `*Purrrrs excitedly!* 🎉 Wow ${userName}, you've already crushed your daily goal with ${waterGlasses}/${waterGoal} glasses! Your skin and energy are glowing! Keep hydrated with a soothing herbal tea if you like! 💧✨ Ready for a stretch?`,
        action: 'confetti'
      };
    }
    return {
      text: `*Bops water bottle with paw* 🐾 You've had ${waterGlasses} out of ${waterGoal} glasses today! Just ${remaining} more to go to keep your body energized and your mind sharp! Go grab a fresh glass now—I'll wait right here! 💧😸`,
      action: 'water_prompt'
    };
  }

  // Food / Meal recommendations
  if (input.includes('eat') || input.includes('food') || input.includes('meal') || input.includes('lunch') || input.includes('dinner') || input.includes('snack') || input.includes('breakfast') || input.includes('recipe')) {
    const meal = HEALTHY_MEALS[Math.floor(Math.random() * HEALTHY_MEALS.length)];
    return {
      text: `*Licks whiskers playfully!* 🥗 For a yummy and balanced meal, how about **${meal.name}**?\n\n✨ **Why it's great**: ${meal.benefits}\n\nWant me to show you the full ingredients list or recommend a healthy snack instead? 🥑🐾`,
      action: 'suggest_food',
      suggestedMeal: meal
    };
  }

  // Music suggestions
  if (input.includes('music') || input.includes('song') || input.includes('playlist') || input.includes('listen') || input.includes('tunes')) {
    const moodKey = input.includes('stress') || input.includes('relax') ? 'stressed' : input.includes('focus') || input.includes('study') ? 'focus' : input.includes('tired') ? 'tired' : 'happy';
    const musicInfo = MOOD_MUSIC[moodKey];
    const trackList = musicInfo.tracks.slice(0, 3).map(t => `🎵 **${t.title}** - ${t.artist} *(${t.vibe})*`).join('\n');
    return {
      text: `*Ears perk up to the rhythm!* 🎶 Here's a curated vibe for you:\n\n${trackList}\n\nShall I turn on our cozy ambient purr and lo-fi mixer right now? 🎧✨`,
      action: 'suggest_music',
      musicInfo
    };
  }

  // Meditation & Breathing
  if (input.includes('meditat') || input.includes('breath') || input.includes('calm') || input.includes('relax') || input.includes('mindful') || input.includes('anxi')) {
    return {
      text: `*Curls tail around your wrist* 🧘 Let's do a quick **4-7-8 breathing reset** together!\n\n1. Inhale deeply through your nose for **4 counts** 🌸\n2. Hold gently for **7 counts** 🌿\n3. Exhale with a soft whoosh for **8 counts** 💨\n\nHow does your chest feel now? Want to try our 2-minute cloud visualization? ✨`,
      action: 'open_breathing'
    };
  }

  // Stretches
  if (input.includes('stretch') || input.includes('sitting') || input.includes('back') || input.includes('neck') || input.includes('desk') || input.includes('tired')) {
    const stretch = QUICK_STRETCHES[Math.floor(Math.random() * QUICK_STRETCHES.length)];
    return {
      text: `*Does a big arching cat stretch!* 🐾 Time for a pawsome quick break:\n\n**${stretch.name}** (${stretch.duration}):\n${stretch.desc}\n\n*Ahhh, feels good!* Don't forget to roll your shoulders! How are your muscles feeling? 🐱✨`,
      action: 'suggest_stretch'
    };
  }

  // Habits & Progress
  if (input.includes('habit') || input.includes('progress') || input.includes('streak') || input.includes('xp') || input.includes('coin') || input.includes('quest')) {
    return {
      text: `*Meow of joy!* 🎉 You're on a **${streak}-day streak** with **${habitsCompleted}/${totalHabits}** habits checked today! Every completed habit earns you XP and sparkly Coins to dress me up in cute hats! 🎩✨ Which habit are we conquering next?`,
      action: 'show_habits'
    };
  }

  // Daily Schedule / Planner
  if (input.includes('schedule') || input.includes('plan') || input.includes('routine') || input.includes('timeline') || input.includes('day')) {
    return {
      text: `Here is a balanced, high-energy daily wellness blueprint tailored for you! 📅✨\n\n• 🌅 **07:30 AM**: Gentle wake-up, glass of warm lemon water 💧 & Cat-Cow stretch\n• 🥣 **08:30 AM**: Nutritious breakfast & quick habit check\n• 🎯 **09:30 AM - 12:30 PM**: Deep focus sprint (with 5-min eye rest)\n• 🥗 **01:00 PM**: Nourishing wholesome lunch & fresh walk\n• 🧘 **03:30 PM**: 4-7-8 breathing break & hydration refill\n• 🏃 **06:00 PM**: Active workout or playful movement\n• 🌙 **09:30 PM**: Screen-free wind-down & cozy chamomile tea\n\nShall we lock this into your daily timeline? 🐾`,
      action: 'open_planner'
    };
  }

  // Sad / Stressed / Venting
  if (input.includes('sad') || input.includes('cry') || input.includes('upset') || input.includes('depressed') || input.includes('lonely') || input.includes('overwhelm') || input.includes('exhausted')) {
    return {
      text: `*Gently climbs onto your lap, resting a soft chin on your hand while purring steadily.* 🐾💖\n\nI hear you, and I'm right here with you. It's completely okay to feel this way. You don't have to carry everything all at once.\n\nTake one slow breath with me. Would you like a quiet soothing song, a gentle guided cloud visualization, or just some peaceful company? 🤗✨`,
      action: 'comfort_mode'
    };
  }

  // Cat Joke / Playful
  if (input.includes('joke') || input.includes('funny') || input.includes('laugh') || input.includes('play') || input.includes('purr')) {
    const jokes = [
      "Why was the cat sitting on the computer? Because it wanted to keep an eye on the mouse! 🐭💻",
      "What is a cat's favorite color? Purrr-ple! 💜🐱",
      "What do you call a cat that likes to meditate? An en-light-ened yogi! 🧘🐾",
      "How do cats stay so healthy? With plenty of cat-naps and good hydra-paw-tion! 💧😸"
    ];
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    return {
      text: `*Giggles and twitches whiskers!* 😹 Here's one for you:\n\n"${joke}"\n\nDid that bring a smile to your face? Ready to earn some wellness coins today? 🪙✨`,
      action: 'pet_happy'
    };
  }

  // Default Warm Conversational Response
  const defaultGreetings = [
    `*Prances up and rubs gently against your screen!* 🐾 Hey ${userName}! I'm feeling extra playful today! Have you had a sip of water yet, or should we tackle a quick healthy habit together? 💧✨`,
    `*Meow!* 🐱 Luna is on duty to keep your spirits high and your body happy! How is your energy level right now—ready to crush your goals or need a relaxing stretch? 🌿💖`,
    `*Purrrrrs softly.* ✨ I'm all ears! Tell me how your day is going, ask for a tasty meal idea, or let's start a 2-minute breathing session! What's on your mind? 🧘🥗`
  ];
  const response = defaultGreetings[Math.floor(Math.random() * defaultGreetings.length)];
  return {
    text: response,
    action: 'idle_chat'
  };
}

// Voice Emotion Proxy Analyzer
export function analyzeVoiceEmotion(textDescription, toneTag) {
  const input = (textDescription + " " + (toneTag || '')).toLowerCase();
  
  let emotion = "Calm & Centered 😌";
  let suggestedActivity = "A 2-minute mindfulness breathing pause to sustain your flow.";
  let lunaAdvice = "You sound balanced and grounded! Let's keep this peaceful momentum rolling! 🌿✨";

  if (input.includes('yell') || input.includes('angry') || input.includes('frustrat') || input.includes('shout') || input.includes('mad') || toneTag === 'fired_up') {
    emotion = "Fired Up / Intense Frustration 🔥";
    suggestedActivity = "High-energy movement: 15 jumping jacks or a brisk power walk to channel adrenaline.";
    lunaAdvice = "You sound fired up! Let's channel that strong energy into a quick workout or brisk movement to release tension! 🐾⚡";
  } else if (input.includes('whisper') || input.includes('anxious') || input.includes('nervous') || input.includes('scared') || input.includes('fast') || toneTag === 'anxious') {
    emotion = "Anxious / Rapid Pulse 💓";
    suggestedActivity = "Grounding 4-7-8 breathing exercise with tactile sensation (petting Luna or holding warm tea).";
    lunaAdvice = "I sense some fluttery anxiety in your tone. Let's slow our breath down together and ground our paws on the floor. You are safe! 🌸🤗";
  } else if (input.includes('tired') || input.includes('sigh') || input.includes('monotone') || input.includes('drained') || toneTag === 'exhausted') {
    emotion = "Exhausted / Low Energy 😴";
    suggestedActivity = "Restorative hydration (cold lemon water) followed by a 5-minute screen-free eye rest.";
    lunaAdvice = "Your voice feels weary, friend. Please don't push too hard right now. Sip some water and let's do a gentle neck roll. 💧🛌";
  } else if (input.includes('laugh') || input.includes('excited') || input.includes('high pitch') || input.includes('happy') || toneTag === 'joyful') {
    emotion = "Joyful & Enthusiastic 🎉";
    suggestedActivity = "Celebrate with a habit streak check-in or treat Luna to a playful toy in the boutique!";
    lunaAdvice = "Your voice is sparkling with joy! That positive energy is infectious! Let's turn that happiness into streak milestones! 🌟😸";
  }

  return {
    detectedEmotion: emotion,
    suggestedActivity,
    lunaAdvice,
    disclaimer: VOICE_DISCLAIMER
  };
}
