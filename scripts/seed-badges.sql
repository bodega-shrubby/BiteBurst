-- Seed Badge Catalog with the 10 badges specified in the prompt
INSERT INTO badge_catalog (code, name, description, category, tier, threshold, icon, rarity, active) VALUES
('FIRST_FOOD', 'First Food Log', 'Your first healthy step! 🍎', 'food', 1, 1, 'badge_first_food', 'common', true),
('FIRST_ACTIVITY', 'First Activity Log', 'Way to move your body! ⚽', 'activity', 1, 1, 'badge_first_activity', 'common', true),
('STREAK_3', '3-Day Streak', 'Three days in a row! 🔥', 'streak', 1, 3, 'badge_streak_3', 'common', true),
('STREAK_7', 'One-Week Streak', 'One whole week! 🌟', 'streak', 2, 7, 'badge_streak_7', 'uncommon', true),
('STREAK_14', 'Two-Week Streak', 'Two weeks strong! 💪', 'streak', 2, 14, 'badge_streak_14', 'uncommon', true),
('STREAK_30', '30-Day Streak', 'Legend status! 🏆', 'streak', 3, 30, 'badge_streak_30', 'rare', true),
('FOOD_VARIETY_5', 'Fruit Fighter', 'Logged 5 different fruits! 🍓', 'food', 2, 5, 'badge_fruit_variety', 'uncommon', true),
('ACTIVITY_10', 'Move Maker', '10 activities logged! 🏃', 'activity', 2, 10, 'badge_activity_10', 'uncommon', true),
('COMBO_DAY', 'Fuel + Move', 'Logged food and activity today! ⚡', 'combo', 1, 1, 'badge_combo_day', 'common', true),
('WATER_7', 'Water Warrior', 'Drank water 7 days! 💧', 'lifetime', 1, 7, 'badge_water_7', 'common', true)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  tier = EXCLUDED.tier,
  threshold = EXCLUDED.threshold,
  icon = EXCLUDED.icon,
  rarity = EXCLUDED.rarity,
  active = EXCLUDED.active;