
ALTER TABLE "lesson_steps" ADD COLUMN IF NOT EXISTS "retry_config" jsonb;

-- Fuel for Football lesson retry configuration
UPDATE "lesson_steps"
SET "retry_config" = jsonb_build_object(
  'maxAttempts', 3,
  'xp', jsonb_build_object(
    'firstTry', 10,
    'secondTry', 5,
    'learnCard', 0
  ),
  'messages', jsonb_build_object(
    'tryAgain1', 'Not quite — think steady energy for the whole game.',
    'tryAgain2', 'Almost! Which breakfast keeps you running past half-time?',
    'learnCard', 'Oats give steady energy. That''s why top players eat porridge before matches.'
  )
)
WHERE "lesson_id" = 'fuel-for-football' AND "step_number" = 1;

UPDATE "lesson_steps"
SET "retry_config" = jsonb_build_object(
  'maxAttempts', 3,
  'xp', jsonb_build_object(
    'firstTry', 10,
    'secondTry', 5,
    'learnCard', 0
  ),
  'messages', jsonb_build_object(
    'tryAgain1', 'Try again — players drink water so they don''t slow down.',
    'tryAgain2', 'Hint: the best choice keeps you cool and thinking clearly.',
    'learnCard', 'Without water, players slow down. Staying hydrated helps you play like the pros.'
  )
)
WHERE "lesson_id" = 'fuel-for-football' AND "step_number" = 2;

UPDATE "lesson_steps"
SET "retry_config" = jsonb_build_object(
  'maxAttempts', 3,
  'xp', jsonb_build_object(
    'firstTry', 15,
    'secondTry', 8,
    'learnCard', 0
  ),
  'messages', jsonb_build_object(
    'tryAgain1', 'Some matches aren''t right — think energy, repair, and ''not much help''.',
    'tryAgain2', 'Check again: oats = energy. Which one repairs muscles and bones?',
    'learnCard', 'Correct matches: Oats → energy, Yogurt → muscles & bones, Crisps → not much help.'
  )
)
WHERE "lesson_id" = 'fuel-for-football' AND "step_number" = 3;

UPDATE "lesson_steps"
SET "retry_config" = jsonb_build_object(
  'maxAttempts', 3,
  'xp', jsonb_build_object(
    'firstTry', 10,
    'secondTry', 5,
    'learnCard', 0
  ),
  'messages', jsonb_build_object(
    'tryAgain1', 'That''s a quick burst… it fades fast. Pick one for the second half.',
    'tryAgain2', 'Hint: choose the snack with clean energy for sprinting.',
    'learnCard', 'Bananas = quick, clean energy. They keep you running in the second half like the pros.'
  )
)
WHERE "lesson_id" = 'fuel-for-football' AND "step_number" = 4;

UPDATE "lesson_steps"
SET "retry_config" = jsonb_build_object(
  'maxAttempts', 3,
  'xp', jsonb_build_object(
    'firstTry', 10,
    'secondTry', 5,
    'learnCard', 0
  ),
  'messages', jsonb_build_object(
    'tryAgain1', 'Nearly — start with energy, then repair, then vitamins.',
    'tryAgain2', 'Think: carbs → protein/dairy → fruit/veg.',
    'learnCard', 'Balanced plate: Pasta (energy), Yogurt (repair), Broccoli (health).'
  )
)
WHERE "lesson_id" = 'fuel-for-football' AND "step_number" = 5;

UPDATE "lesson_steps"
SET "retry_config" = jsonb_build_object(
  'maxAttempts', 3,
  'xp', jsonb_build_object(
    'firstTry', 10,
    'secondTry', 5,
    'learnCard', 0
  ),
  'messages', jsonb_build_object(
    'tryAgain1', 'Think about what works hardest in football.',
    'tryAgain2', 'Hint: protein helps the part that kicks, runs, and jumps.',
    'learnCard', 'Protein = muscle repair. That''s why players eat yogurt, eggs, or beans after matches.'
  )
)
WHERE "lesson_id" = 'fuel-for-football' AND "step_number" = 6;

-- BrainFuel for School lesson retry configuration
UPDATE "lesson_steps"
SET "retry_config" = jsonb_build_object(
  'maxAttempts', 3,
  'xp', jsonb_build_object(
    'firstTry', 10,
    'secondTry', 5,
    'learnCard', 0
  ),
  'messages', jsonb_build_object(
    'tryAgain1', 'Think slow & steady fuel, not a quick burst.',
    'tryAgain2', 'Which option keeps blood sugar stable through the lesson?',
    'learnCard', 'The brain uses glucose. Wholegrains release it gradually → fewer dips in focus.'
  )
)
WHERE "lesson_id" = 'brainfuel-for-school' AND "step_number" = 1;

UPDATE "lesson_steps"
SET "retry_config" = jsonb_build_object(
  'maxAttempts', 3,
  'xp', jsonb_build_object(
    'firstTry', 10,
    'secondTry', 5,
    'learnCard', 0
  ),
  'messages', jsonb_build_object(
    'tryAgain1', 'Your brain also needs building blocks.',
    'tryAgain2', 'Which choice recognises protein''s role beyond muscles?',
    'learnCard', 'KS3 nutrition: protein = growth & repair; fats = energy/structures; both matter for brain function.'
  )
)
WHERE "lesson_id" = 'brainfuel-for-school' AND "step_number" = 2;

UPDATE "lesson_steps"
SET "retry_config" = jsonb_build_object(
  'maxAttempts', 3,
  'xp', jsonb_build_object(
    'firstTry', 15,
    'secondTry', 8,
    'learnCard', 0
  ),
  'messages', jsonb_build_object(
    'tryAgain1', 'Think energy, oxygen, memory, protection.',
    'tryAgain2', 'Which one links to oxygen in blood?',
    'learnCard', 'Omega-3→memory; B vits→energy release; Iron→oxygen; Vit C→protection.'
  )
)
WHERE "lesson_id" = 'brainfuel-for-school' AND "step_number" = 3;

UPDATE "lesson_steps"
SET "retry_config" = jsonb_build_object(
  'maxAttempts', 3,
  'xp', jsonb_build_object(
    'firstTry', 10,
    'secondTry', 5,
    'learnCard', 0
  ),
  'messages', jsonb_build_object(
    'tryAgain1', 'Some choices spike then crash. Which lasts longer?',
    'tryAgain2', 'Pick the one that combines energy and nutrients.',
    'learnCard', 'Smart snacks blend carb + protein + vitamins (e.g., fruit+nuts, yogurt+berries).'
  )
)
WHERE "lesson_id" = 'brainfuel-for-school' AND "step_number" = 4;

UPDATE "lesson_steps"
SET "retry_config" = jsonb_build_object(
  'maxAttempts', 3,
  'xp', jsonb_build_object(
    'firstTry', 15,
    'secondTry', 8,
    'learnCard', 0
  ),
  'messages', jsonb_build_object(
    'tryAgain1', 'Chew → digest → absorb → transport.',
    'tryAgain2', 'Which organ does the absorbing step?',
    'learnCard', 'Small intestine = main site of nutrient absorption into the bloodstream.'
  )
)
WHERE "lesson_id" = 'brainfuel-for-school' AND "step_number" = 5;

UPDATE "lesson_steps"
SET "retry_config" = jsonb_build_object(
  'maxAttempts', 3,
  'xp', jsonb_build_object(
    'firstTry', 10,
    'secondTry', 5,
    'learnCard', 0
  ),
  'messages', jsonb_build_object(
    'tryAgain1', 'Skipping meals rarely improves performance.',
    'tryAgain2', 'What happens when the brain''s fuel runs low?',
    'learnCard', 'Breakfast = steady morning energy → better attention and memory in class.'
  )
)
WHERE "lesson_id" = 'brainfuel-for-school' AND "step_number" = 6;
