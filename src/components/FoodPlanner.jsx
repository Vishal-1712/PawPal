import React, { useState } from 'react';
import { 
  Utensils, 
  Sparkles, 
  Clock, 
  Flame, 
  Check, 
  Heart, 
  Info, 
  RefreshCw,
  Plus
} from 'lucide-react';
import { HEALTHY_MEALS } from '../utils/lunaAI';
import { soundEngine } from '../utils/audio';

export default function FoodPlanner() {
  const [selectedDiet, setSelectedDiet] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [plannedMeals, setPlannedMeals] = useState(() => {
    try {
      const saved = localStorage.getItem('pawpal_planned_meals');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  const [recipes, setRecipes] = useState(HEALTHY_MEALS);

  const diets = ['All', 'Vegetarian', 'Vegan', 'Gluten-Free', 'High-Protein'];
  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Wind-down'];

  const togglePlanMeal = (id) => {
    soundEngine.playCoinCollect();
    setPlannedMeals(prev => {
      const next = prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id];
      try { localStorage.setItem('pawpal_planned_meals', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const filteredMeals = recipes.filter((meal) => {
    const matchesDiet = selectedDiet === 'All' || meal.tags.includes(selectedDiet);
    const matchesCategory = selectedCategory === 'All' || meal.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesDiet && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Personalized Food & Nutrition 🥗</h2>
              <span className="badge badge-emerald">Balanced Fuel</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Nourishing, dietitian-approved meals tailored to your tastebuds. Every recipe includes Luna's nutrition breakdown!
            </p>
          </div>

          <div className="glass-pill" style={{ color: '#166534', fontWeight: '700' }}>
            <Sparkles size={16} color="#16a34a" />
            <span>Luna Approved Recipes 🌿</span>
          </div>
        </div>

        {/* Filters: Dietary & Meal Types */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          
          {/* Dietary Prefs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: '600' }}>Diet:</span>
            {diets.map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDiet(d)}
                className="glass-pill"
                style={{
                  cursor: 'pointer',
                  background: selectedDiet === d ? 'rgba(16, 185, 129, 0.25)' : 'var(--surface-card)',
                  borderColor: selectedDiet === d ? 'var(--accent-emerald-light)' : 'var(--border-glass)',
                  color: selectedDiet === d ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: '600' }}>Meal:</span>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className="glass-pill"
                style={{
                  cursor: 'pointer',
                  background: selectedCategory === c ? 'rgba(139, 92, 246, 0.25)' : 'var(--surface-card)',
                  borderColor: selectedCategory === c ? 'var(--primary-light)' : 'var(--border-glass)',
                  color: selectedCategory === c ? '#ffffff' : 'var(--text-muted)'
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.2rem' }}>
        {filteredMeals.map((meal) => {
          const isPlanned = plannedMeals.includes(meal.id);
          return (
            <div 
              key={meal.id} 
              className="glass-panel" 
              style={{ 
                padding: '1.5rem', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                borderColor: isPlanned ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-glass)',
                background: isPlanned ? 'rgba(16, 185, 129, 0.04)' : 'var(--surface-card)'
              }}
            >
              <div>
                {/* Category & Stats */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                  <span className="badge badge-purple">{meal.category}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Clock size={13} /> {meal.prepTime}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#fb923c' }}>
                      <Flame size={13} /> {meal.calories} kcal
                    </span>
                  </div>
                </div>

                {/* Recipe Title */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.6rem' }}>
                  {meal.name}
                </h3>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.9rem' }}>
                  {meal.tags.map((t, idx) => (
                    <span key={idx} className="glass-pill" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>
                      {t}
                    </span>
                  ))}
                </div>

                {/* Luna's Nutrition Explanation Badge */}
                <div style={{ 
                  padding: '0.8rem', 
                  borderRadius: 'var(--radius-md)', 
                  background: 'rgba(16, 185, 129, 0.08)', 
                  border: '1px dashed rgba(16, 185, 129, 0.3)',
                  marginBottom: '1rem',
                  fontSize: '0.82rem',
                  color: '#6ee7b7'
                }}>
                  <div style={{ fontWeight: '700', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <span>🐱</span> Why Luna Loves This:
                  </div>
                  {meal.benefits}
                </div>

                {/* Ingredients snippet */}
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  <strong style={{ color: 'var(--text-main)' }}>Key Ingredients:</strong> {meal.ingredients.join(', ')}
                </div>
              </div>

              {/* Action: Add to Plan */}
              <button 
                onClick={() => togglePlanMeal(meal.id)}
                className={`btn ${isPlanned ? 'btn-emerald' : 'btn-outline'}`}
                style={{ width: '100%', fontSize: '0.85rem' }}
              >
                {isPlanned ? (
                  <>
                    <Check size={16} />
                    <span>Added to Today's Plan</span>
                  </>
                ) : (
                  <>
                    <Plus size={16} />
                    <span>Add to Meal Planner</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
