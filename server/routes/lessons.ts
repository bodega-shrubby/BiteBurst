import type { Express } from "express";
import { storage } from "../storage";
import { z } from "zod";
import { insertLessonAttemptSchema } from "../../shared/schema";

const answerSubmissionSchema = z.object({
  userId: z.string(),
  lessonId: z.string(),
  stepId: z.string(),
  answer: z.string(),
});

const setLessonCacheHeaders = (res: any) => {
  const lastModified = new Date();
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    Pragma: 'no-cache',
    Expires: '0',
    'Last-Modified': lastModified.toUTCString(),
    ETag: `W/"${lastModified.getTime()}"`
  });
};

export function registerLessonRoutes(app: Express, requireAuth: any) {
  // Get lessons by year group
  app.get('/api/lessons/year-group/:yearGroup', requireAuth, async (req: any, res: any) => {
    try {
      const { yearGroup } = req.params;
      const userId = req.userId;
      
      const allLessons = await storage.getLessonsByYearGroup(yearGroup);
      
      const completedLessons = await storage.getCompletedLessonIds(userId);
      const completedLessonIds = new Set(completedLessons);
      
      let foundCurrent = false;
      const lessonsWithState = allLessons.map((lesson) => {
        const isCompleted = completedLessonIds.has(lesson.id);
        let state: 'current' | 'unlocked' | 'locked' | 'completed' = 'locked';
        
        if (isCompleted) {
          state = 'completed';
        } else if (!foundCurrent) {
          state = 'current';
          foundCurrent = true;
        }
        
        return {
          id: lesson.id,
          title: lesson.title,
          icon: lesson.iconEmoji || '📚',
          topicId: lesson.topicId,
          description: lesson.description,
          state
        };
      });
      
      res.json(lessonsWithState);
    } catch (error) {
      console.error('Failed to get lessons by year group:', error);
      res.status(500).json({ error: 'Failed to load lessons' });
    }
  });

  // Get all lessons for a curriculum (combines topics + lessons)
  app.get('/api/curriculum/:curriculumId/lessons', requireAuth, async (req: any, res: any) => {
    try {
      let { curriculumId } = req.params;
      const userId = req.userId;
      
      // Get topics for this curriculum
      let curriculumTopics = await storage.getTopicsByCurriculum(curriculumId);
      
      // If no topics found, fall back to uk-ks1 which has sample lessons
      if (curriculumTopics.length === 0 && curriculumId !== 'uk-ks1') {
        console.log(`No topics found for curriculum ${curriculumId}, falling back to uk-ks1`);
        curriculumId = 'uk-ks1';
        curriculumTopics = await storage.getTopicsByCurriculum('uk-ks1');
      }
      
      // Get lessons for each topic
      const allLessons: any[] = [];
      for (const topic of curriculumTopics) {
        const topicLessons = await storage.getLessonsByTopic(topic.id);
        for (const lesson of topicLessons) {
          allLessons.push({
            id: lesson.id,
            title: lesson.title,
            icon: lesson.iconEmoji || '📚',
            topicId: topic.id,
            topicTitle: topic.title,
            sortOrder: lesson.orderInUnit ?? 0,
            description: lesson.description
          });
        }
      }
      
      // Sort by unit order then lesson order
      allLessons.sort((a, b) => a.sortOrder - b.sortOrder);
      
      // Get user's completed lessons from lesson_attempts
      const completedLessons = await storage.getCompletedLessonIds(userId);
      const completedLessonIds = new Set(completedLessons);
      
      // Assign states: first incomplete is 'current', completed ones are 'completed', rest locked
      let foundCurrent = false;
      const lessonsWithState = allLessons.map((lesson, index) => {
        const isCompleted = completedLessonIds.has(lesson.id);
        let state: 'current' | 'unlocked' | 'locked' | 'completed' = 'locked';
        
        if (isCompleted) {
          state = 'completed';
        } else if (!foundCurrent) {
          state = 'current';
          foundCurrent = true;
        } else if (index > 0 && completedLessonIds.has(allLessons[index - 1]?.id)) {
          state = 'unlocked';
        }
        
        return {
          ...lesson,
          state
        };
      });
      
      // If no lessons found from DB, return empty array
      setLessonCacheHeaders(res);
      res.json(lessonsWithState);
    } catch (error) {
      console.error('Failed to get curriculum lessons:', error);
      res.status(500).json({ error: 'Failed to load lessons' });
    }
  });

  // Get topics for a curriculum
  app.get('/api/curriculum/:curriculumId/topics', requireAuth, async (req: any, res: any) => {
    try {
      const { curriculumId } = req.params;
      const curriculumTopics = await storage.getTopicsByCurriculum(curriculumId);
      res.json(curriculumTopics);
    } catch (error) {
      console.error('Failed to get curriculum topics:', error);
      res.status(500).json({ error: 'Failed to load topics' });
    }
  });

  // Get lesson by ID
  app.get('/api/lessons/:lessonId', requireAuth, async (req: any, res: any) => {
    try {
      const { lessonId } = req.params;

      const lessonFromDb = await storage.getLessonWithSteps(lessonId);

      if (lessonFromDb) {
        // DEBUG: Log what we received from storage
        console.log('DEBUG ROUTE - lessonFromDb.steps[0] retryConfig:', lessonFromDb.steps[0]?.retryConfig);
        
        const lessonData = {
          id: lessonFromDb.id,
          title: lessonFromDb.title,
          description: lessonFromDb.description ?? '',
          totalSteps: lessonFromDb.totalSteps ?? lessonFromDb.steps.length,
          steps: lessonFromDb.steps.map((step) => ({
            id: step.id,
            stepNumber: step.stepNumber,
            questionType: step.questionType,
            question: step.question,
            content: step.content,
            xpReward: step.xpReward,
            mascotAction: step.mascotAction ?? undefined,
            retryConfig: step.retryConfig ?? undefined,
          })),
        };

        // DEBUG: Log final API response
        console.log('DEBUG ROUTE - Final response steps[0].retryConfig:', lessonData.steps[0]?.retryConfig);
        
        setLessonCacheHeaders(res);
        console.log(`📤 LESSON CACHE: Sending ${lessonId} from database with cache headers`);
        return res.json(lessonData);
      }

      // For now, return hardcoded "Fuel for Football" lesson data
      // In the future, this would come from the database
      if (lessonId === 'fuel-for-football') {
        const lessonData = {
          id: 'fuel-for-football',
          title: 'Fuel for Football',
          description: 'Learn the best foods to eat before and during football training!',
          totalSteps: 6,
          steps: [
            {
              id: 'step-1',
              stepNumber: 1,
              questionType: 'multiple-choice' as const,
              question: "Before a football match, which food gives you the best long-lasting energy?",
              content: {
                options: [
                  { id: 'sweets', text: 'Sweets', emoji: '🍬', correct: false },
                  { id: 'white-bread', text: 'White bread', emoji: '🍞', correct: false },
                  { id: 'oats', text: 'Oats', emoji: '🥣', correct: true }
                ],
                feedback: "Correct! Oats give slow-release energy so you don't run out of steam — just like Lionel Messi keeps moving all game."
              },
              xpReward: 10,
              mascotAction: 'holding_football',
              retryConfig: {
                maxAttempts: 3,
                xp: { firstTry: 10, secondTry: 5, learnCard: 0 },
                messages: {
                  tryAgain1: "Not quite — think steady energy for the whole game.",
                  tryAgain2: "Almost! Which breakfast keeps you running past half-time?",
                  learnCard: "Oats give steady energy. That's why top players eat porridge before matches."
                }
              }
            },
            {
              id: 'step-2',
              stepNumber: 2,
              questionType: 'true-false' as const,
              question: "Drinking water helps footballers play their best.",
              content: {
                correctAnswer: true,
                feedback: "Yes! Even Cristiano Ronaldo is known for choosing water over fizzy drinks — it keeps muscles working and the brain sharp."
              },
              xpReward: 10,
              mascotAction: 'sipping_water',
              retryConfig: {
                maxAttempts: 3,
                xp: { firstTry: 10, secondTry: 5, learnCard: 0 },
                messages: {
                  tryAgain1: "Try again — players drink water so they don't slow down.",
                  tryAgain2: "Hint: the best choice keeps you cool and thinking clearly.",
                  learnCard: "Without water, players slow down. Staying hydrated helps you play like the pros."
                }
              }
            },
            {
              id: 'step-3',
              stepNumber: 3,
              questionType: 'matching' as const,
              question: "Match the food to what it does for your body when playing football.",
              content: {
                matchingPairs: [
                  { left: '🥣 Oats', right: 'Long-lasting energy for running' },
                  { left: '🥛 Yogurt', right: 'Repairs muscles and strengthens bones' },
                  { left: '🍟 Crisps', right: 'Extra fat, not much help on the pitch' }
                ],
                feedback: "Oats = steady energy, like Erling Haaland powering through defenders.\nYogurt = repairs muscles, like Alexia Putellas staying strong in midfield.\nCrisps = tasty, but won't fuel you like Sam Kerr sprinting for a goal."
              },
              xpReward: 15,
              mascotAction: 'juggling_football',
              retryConfig: {
                maxAttempts: 3,
                xp: { firstTry: 15, secondTry: 8, learnCard: 0 },
                messages: {
                  tryAgain1: "Some matches aren't right — think energy, repair, and 'not much help'.",
                  tryAgain2: "Check again: oats = energy. Which one repairs muscles and bones?",
                  learnCard: "Correct matches: Oats → energy, Yogurt → muscles & bones, Crisps → not much help."
                }
              }
            },
            {
              id: 'step-4',
              stepNumber: 4,
              questionType: 'multiple-choice' as const,
              question: "Which of these is the best half-time snack to keep your energy up?",
              content: {
                options: [
                  { id: 'banana', text: 'Banana', emoji: '🍌', correct: true },
                  { id: 'chocolate-bar', text: 'Chocolate bar', emoji: '🍫', correct: false },
                  { id: 'fizzy-drink', text: 'Fizzy drink', emoji: '🥤', correct: false }
                ],
                feedback: "Spot on! Bananas give quick, clean energy. That's why Kylian Mbappé often eats fruit to stay sharp in matches."
              },
              xpReward: 10,
              mascotAction: 'high_five',
              retryConfig: {
                maxAttempts: 3,
                xp: { firstTry: 10, secondTry: 5, learnCard: 0 },
                messages: {
                  tryAgain1: "That's a quick burst… it fades fast. Pick one for the second half.",
                  tryAgain2: "Hint: choose the snack with clean energy for sprinting.",
                  learnCard: "Bananas = quick, clean energy. They keep you running in the second half like the pros."
                }
              }
            },
            {
              id: 'step-5',
              stepNumber: 5,
              questionType: 'ordering' as const,
              question: "Put these foods in order to make a balanced footballer's plate.",
              content: {
                orderingItems: [
                  { id: 'pasta', text: 'Pasta', correctOrder: 1 },
                  { id: 'yogurt', text: 'Yogurt', correctOrder: 2 },
                  { id: 'broccoli', text: 'Broccoli', correctOrder: 3 }
                ],
                feedback: "Nice! Pasta = energy, Yogurt = muscle repair, Broccoli = vitamins. That's how players like Lucy Bronze and Neymar fuel before big games."
              },
              xpReward: 10,
              mascotAction: 'plate_builder',
              retryConfig: {
                maxAttempts: 3,
                xp: { firstTry: 10, secondTry: 5, learnCard: 0 },
                messages: {
                  tryAgain1: "Nearly — start with energy, then repair, then vitamins.",
                  tryAgain2: "Think: carbs → protein/dairy → fruit/veg.",
                  learnCard: "Balanced plate: Pasta (energy), Yogurt (repair), Broccoli (health)."
                }
              }
            },
            {
              id: 'step-6',
              stepNumber: 6,
              questionType: 'multiple-choice' as const,
              question: "After a football match, eating protein helps your ______ recover.",
              content: {
                options: [
                  { id: 'brain', text: 'Brain', emoji: '🧠', correct: false },
                  { id: 'muscles', text: 'Muscles', emoji: '💪', correct: true },
                  { id: 'hair', text: 'Hair', emoji: '💇', correct: false }
                ],
                feedback: "Exactly! Protein repairs muscles so you're ready to train again — just like Sam Kerr or Harry Kane preparing for the next match."
              },
              xpReward: 10,
              mascotAction: 'flexing',
              retryConfig: {
                maxAttempts: 3,
                xp: { firstTry: 10, secondTry: 5, learnCard: 0 },
                messages: {
                  tryAgain1: "Think about what works hardest in football.",
                  tryAgain2: "Hint: protein helps the part that kicks, runs, and jumps.",
                  learnCard: "Protein = muscle repair. That's why players eat yogurt, eggs, or beans after matches."
                }
              }
            }
          ]
        };

        // Force disable ETags and prevent all caching
        setLessonCacheHeaders(res);
        console.log('📤 LESSON CACHE: Sending fuel-for-football with cache headers');
        return res.json(lessonData);
      }

      if (lessonId === 'brainfuel-for-school') {
        const lessonData = {
          id: 'brainfuel-for-school',
          title: 'BrainFuel for School',
          description: 'Learn the best foods to fuel your brain for exams and studying!',
          totalSteps: 6,
          steps: [
            {
              id: 'step-1',
              stepNumber: 1,
              questionType: 'multiple-choice' as const,
              question: "Which food gives the most steady energy for study or revision?",
              content: {
                options: [
                  { id: 'sweets', text: 'Sweets', emoji: '🍬', correct: false },
                  { id: 'white-bread', text: 'White bread', emoji: '🍞', correct: false },
                  { id: 'brown-rice', text: 'Brown rice', emoji: '🍚', correct: true },
                  { id: 'fizzy-drink', text: 'Fizzy drink', emoji: '🥤', correct: false }
                ],
                feedback: "Correct. Wholegrain carbs (like brown rice, oats, wholemeal pasta) release glucose slowly, keeping focus steady across a lesson."
              },
              xpReward: 10,
              mascotAction: 'graduation_cap',
              retryConfig: {
                maxAttempts: 3,
                xp: { firstTry: 10, secondTry: 5, learnCard: 0 },
                messages: {
                  tryAgain1: "Think slow & steady fuel, not a quick burst.",
                  tryAgain2: "Which option keeps blood sugar stable through the lesson?",
                  learnCard: "The brain uses glucose. Wholegrains release it gradually → fewer dips in focus."
                }
              }
            },
            {
              id: 'step-2',
              stepNumber: 2,
              questionType: 'true-false' as const,
              question: "Proteins are only for muscles, not the brain. True or false?",
              content: {
                correctAnswer: false,
                feedback: "Right. Protein helps build/repair tissues and make brain messengers; healthy fats (e.g., omega-3) support cell membranes and memory."
              },
              xpReward: 10,
              mascotAction: 'brain_glow',
              retryConfig: {
                maxAttempts: 3,
                xp: { firstTry: 10, secondTry: 5, learnCard: 0 },
                messages: {
                  tryAgain1: "Your brain also needs building blocks.",
                  tryAgain2: "Which choice recognises protein's role beyond muscles?",
                  learnCard: "KS3 nutrition: protein = growth & repair; fats = energy/structures; both matter for brain function."
                }
              }
            },
            {
              id: 'step-3',
              stepNumber: 3,
              questionType: 'matching' as const,
              question: "Match the nutrient to how it helps you think and learn.",
              content: {
                matchingPairs: [
                  { left: '🧠 Omega-3 fats', right: 'Supports memory & learning (cell membranes)' },
                  { left: '⚡ B vitamins', right: 'Helps release energy from food for focus' },
                  { left: '🩸 Iron', right: 'Carries oxygen to the brain (clear thinking)' },
                  { left: '🛡️ Vitamin C', right: 'Helps protect cells (antioxidant)' }
                ],
                feedback: "Omega-3: healthy brain cell membranes → memory.\nB vitamins: energy release → concentration.\nIron: oxygen supply → less tiredness.\nVitamin C: protection → healthy function."
              },
              xpReward: 15,
              mascotAction: 'clipboard_tick',
              retryConfig: {
                maxAttempts: 3,
                xp: { firstTry: 15, secondTry: 8, learnCard: 0 },
                messages: {
                  tryAgain1: "Think energy, oxygen, memory, protection.",
                  tryAgain2: "Which one links to oxygen in blood?",
                  learnCard: "Omega-3→memory; B vits→energy release; Iron→oxygen; Vit C→protection."
                }
              }
            },
            {
              id: 'step-4',
              stepNumber: 4,
              questionType: 'multiple-choice' as const,
              question: "Exam in 1 hour. Best snack for sharp focus?",
              content: {
                options: [
                  { id: 'chocolate-bar', text: 'Chocolate bar', emoji: '🍫', correct: false },
                  { id: 'banana-nuts', text: 'Banana + nuts', emoji: '🍌', correct: true },
                  { id: 'fizzy-drink', text: 'Fizzy drink', emoji: '🥤', correct: false },
                  { id: 'crisps', text: 'Crisps', emoji: '🍟', correct: false }
                ],
                feedback: "Yes. Fruit + nuts give glucose + protein + minerals → steady energy through the exam."
              },
              xpReward: 10,
              mascotAction: 'ready_sign',
              retryConfig: {
                maxAttempts: 3,
                xp: { firstTry: 10, secondTry: 5, learnCard: 0 },
                messages: {
                  tryAgain1: "Some choices spike then crash. Which lasts longer?",
                  tryAgain2: "Pick the one that combines energy and nutrients.",
                  learnCard: "Smart snacks blend carb + protein + vitamins (e.g., fruit+nuts, yogurt+berries)."
                }
              }
            },
            {
              id: 'step-5',
              stepNumber: 5,
              questionType: 'ordering' as const,
              question: "Put the steps in order to show how nutrients reach your brain.",
              content: {
                orderingItems: [
                  { id: 'chew-mouth', text: 'Chew food in the mouth', correctOrder: 1 },
                  { id: 'stomach-breakdown', text: 'Food broken down more in the stomach', correctOrder: 2 },
                  { id: 'small-intestine', text: 'Small intestine absorbs nutrients into blood', correctOrder: 3 },
                  { id: 'blood-transport', text: 'Nutrients travel in blood to brain & muscles', correctOrder: 4 }
                ],
                feedback: "Exactly. Most absorption happens in the small intestine; blood then delivers nutrients to the brain."
              },
              xpReward: 15,
              mascotAction: 'snack_pot',
              retryConfig: {
                maxAttempts: 3,
                xp: { firstTry: 15, secondTry: 8, learnCard: 0 },
                messages: {
                  tryAgain1: "Chew → digest → absorb → transport.",
                  tryAgain2: "Which organ does the absorbing step?",
                  learnCard: "Small intestine = main site of nutrient absorption into the bloodstream."
                }
              }
            },
            {
              id: 'step-6',
              stepNumber: 6,
              questionType: 'multiple-choice' as const,
              question: "If you often skip breakfast, what's most likely?",
              content: {
                options: [
                  { id: 'tiredness-focus', text: 'Tiredness & poor focus', emoji: '💤', correct: true },
                  { id: 'faster-running', text: 'Faster running speed', emoji: '🏃', correct: false },
                  { id: 'better-memory', text: 'Better memory', emoji: '🎧', correct: false },
                  { id: 'stronger-muscles', text: 'Stronger muscles', emoji: '💪', correct: false }
                ],
                feedback: "Correct. Low morning glucose → less concentration and slower thinking in lessons."
              },
              xpReward: 10,
              mascotAction: 'thumbs_up',
              retryConfig: {
                maxAttempts: 3,
                xp: { firstTry: 10, secondTry: 5, learnCard: 0 },
                messages: {
                  tryAgain1: "Skipping meals rarely improves performance.",
                  tryAgain2: "What happens when the brain's fuel runs low?",
                  learnCard: "Breakfast = steady morning energy → better attention and memory in class."
                }
              }
            }
          ]
        };

        // Force disable ETags and prevent all caching
        setLessonCacheHeaders(res);
        console.log('📤 LESSON CACHE: Sending brainfuel-for-school with cache headers');
        return res.json(lessonData);
      }
      
      return res.status(404).json({ error: 'Lesson not found' });
    } catch (error) {
      console.error('Get lesson error:', error);
      res.status(500).json({ error: 'Failed to load lesson' });
    }
  });

  // Submit lesson answer
  app.post('/api/lessons/answer', requireAuth, async (req: any, res: any) => {
    try {
      const validatedData = answerSubmissionSchema.parse(req.body);
      
      // Verify parent owns the child profile
      // req.userId is the Supabase parent auth ID
      // validatedData.userId is the child profile ID
      const childProfile = await storage.getUser(validatedData.userId);
      if (!childProfile) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Allow if parentAuthId matches OR direct ID match (legacy users)
      const isParentOwned = childProfile.parentAuthId === req.userId;
      const isDirectMatch = validatedData.userId === req.userId;
      
      if (!isParentOwned && !isDirectMatch) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // For now, hardcode the correct answers by lesson
      // In the future, this would check against the database
      const fuelForFootballAnswers: Record<string, string | boolean> = {
        'step-1': 'oats',
        'step-2': true,
        // step-3 (matching) and step-5 (ordering) handled by special logic below
        'step-4': 'banana',
        'step-6': 'muscles'
      };
      
      const brainFuelAnswers: Record<string, string | boolean> = {
        'step-1-brain': 'brown-rice',
        'step-2-brain': false,
        // step-3 (matching) and step-5 (ordering) handled by special logic below
        'step-4-brain': 'banana-nuts', 
        'step-6-brain': 'tiredness-focus'
      };
      
      console.log('DEBUG - Answer submission:', {
        lessonId: validatedData.lessonId,
        stepId: validatedData.stepId,
        submittedAnswer: validatedData.answer
      });

      // Define legacy hardcoded lesson IDs
      const LEGACY_LESSON_IDS = ['fuel-for-football', 'brainfuel-for-school'];
      const isLegacyLesson = LEGACY_LESSON_IDS.includes(validatedData.lessonId);

      let expectedAnswer;
      if (validatedData.lessonId === 'fuel-for-football') {
        expectedAnswer = fuelForFootballAnswers[validatedData.stepId];
      } else if (validatedData.lessonId === 'brainfuel-for-school') {
        expectedAnswer = brainFuelAnswers[validatedData.stepId];
      }
      let isCorrect = false;

      // Special handling for matching questions (step-3)
      if (validatedData.stepId.includes('step-3') && 
          (validatedData.lessonId === 'brainfuel-for-school' || validatedData.lessonId === 'fuel-for-football')) {
        try {
          const submittedMatches = JSON.parse(validatedData.answer);
          
          // Define correct matching pairs
          let correctMatches: Record<string, string> = {};
          
          if (validatedData.lessonId === 'brainfuel-for-school') {
            // BrainFuel step-3 matching pairs (updated to match specification)
            correctMatches = {
              '🧠 Omega-3 fats': 'Supports memory & learning (cell membranes)',
              '⚡ B vitamins': 'Helps release energy from food for focus',
              '🩸 Iron': 'Carries oxygen to the brain (clear thinking)',
              '🛡️ Vitamin C': 'Helps protect cells (antioxidant)'
            };
          } else if (validatedData.lessonId === 'fuel-for-football') {
            // Fuel for Football step-3 matching pairs (updated to match specification)
            correctMatches = {
              '🥣 Oats': 'Long-lasting energy for running',
              '🥛 Yogurt': 'Repairs muscles and strengthens bones',
              '🍟 Crisps': 'Extra fat, not much help on the pitch'
            };
          }
          
          // Check if all pairs match correctly
          isCorrect = Object.keys(correctMatches).every(left => 
            submittedMatches[left] === correctMatches[left]
          ) && Object.keys(submittedMatches).length === Object.keys(correctMatches).length;
          
        } catch (e) {
          console.error('Failed to parse matching answer:', e);
          isCorrect = false;
        }
      }
      // Special handling for ordering questions (step-5)
      else if ((validatedData.stepId.includes('step-5') || validatedData.stepId.includes('step-5-brain')) && 
          (validatedData.lessonId === 'brainfuel-for-school' || validatedData.lessonId === 'fuel-for-football')) {
        try {
          const submittedOrder = JSON.parse(validatedData.answer);
          
          // Get lesson data to find correct order
          let correctOrderIds: string[] = [];
          
          if (validatedData.lessonId === 'brainfuel-for-school') {
            // BrainFuel step-5 ordering
            correctOrderIds = ['chew-mouth', 'stomach-breakdown', 'small-intestine', 'blood-transport'];
          } else if (validatedData.lessonId === 'fuel-for-football') {
            // Fuel for Football step-5 ordering  
            correctOrderIds = ['pasta', 'yogurt', 'broccoli'];
          }
          
          isCorrect = JSON.stringify(submittedOrder) === JSON.stringify(correctOrderIds);
        } catch (e) {
          console.error('Failed to parse ordering answer:', e);
          isCorrect = false;
        }
      } 
      // For DB-based lessons (non-legacy), validate using database
      else if (!isLegacyLesson) {
        try {
          // Try to get lesson from DB to validate any question type
          const lessonData = await storage.getLessonWithSteps(validatedData.lessonId);
          if (lessonData) {
            const step = lessonData.steps.find(s => s.id === validatedData.stepId);
            if (step) {
              console.log('DEBUG - DB lesson step validation:', {
                questionType: step.questionType,
                hasCorrectPair: !!step.content?.correctPair,
                hasCorrectAnswer: !!step.content?.correctAnswer,
                hasOptions: !!step.content?.options
              });
              
              switch (step.questionType) {
                case 'tap-pair':
                  // Validate tap-pair: answer is JSON array of 2 IDs
                  if (step.content?.correctPair) {
                    try {
                      const selectedIds = JSON.parse(validatedData.answer) as string[];
                      const correctPair = step.content.correctPair as string[];
                      // Check if both selected IDs are in correctPair (order doesn't matter)
                      isCorrect = Array.isArray(selectedIds) && 
                        selectedIds.length === 2 && 
                        correctPair.includes(selectedIds[0]) && 
                        correctPair.includes(selectedIds[1]);
                    } catch (e) {
                      console.error('Failed to parse tap-pair answer:', e);
                      isCorrect = false;
                    }
                  }
                  break;
                  
                case 'fill-blank':
                  // Validate fill-blank: answer matches correctAnswer
                  if (step.content?.correctAnswer) {
                    isCorrect = validatedData.answer === step.content.correctAnswer;
                  }
                  break;
                  
                case 'multiple-choice':
                  // Validate multiple-choice: answer matches correct option ID
                  if (step.content?.options) {
                    const correctOption = step.content.options.find((o: any) => o.correct === true);
                    isCorrect = correctOption && validatedData.answer === correctOption.id;
                  }
                  break;
                  
                case 'true-false':
                  // Validate true-false: answer matches correctAnswer as string
                  if (step.content?.correctAnswer !== undefined) {
                    isCorrect = validatedData.answer === String(step.content.correctAnswer);
                  }
                  break;
                  
                case 'matching':
                  // Validate matching: answer is JSON object of left->right pairs
                  if (step.content?.matchingPairs) {
                    try {
                      const submittedMatches = JSON.parse(validatedData.answer);
                      const pairs = step.content.matchingPairs as Array<{left: string; right: string}>;
                      const correctMatches: Record<string, string> = {};
                      pairs.forEach(p => { correctMatches[p.left] = p.right; });
                      isCorrect = Object.keys(correctMatches).every(left => 
                        submittedMatches[left] === correctMatches[left]
                      ) && Object.keys(submittedMatches).length === Object.keys(correctMatches).length;
                    } catch (e) {
                      console.error('Failed to parse matching answer:', e);
                      isCorrect = false;
                    }
                  }
                  break;
                  
                case 'ordering':
                  // Validate ordering: answer is JSON array in correct order
                  if (step.content?.orderingItems) {
                    try {
                      const submittedOrder = JSON.parse(validatedData.answer);
                      const items = step.content.orderingItems as Array<{id: string; correctOrder: number}>;
                      const correctOrderIds = items
                        .sort((a, b) => a.correctOrder - b.correctOrder)
                        .map(item => item.id);
                      isCorrect = JSON.stringify(submittedOrder) === JSON.stringify(correctOrderIds);
                    } catch (e) {
                      console.error('Failed to parse ordering answer:', e);
                      isCorrect = false;
                    }
                  }
                  break;
                  
                default:
                  console.warn('Unknown question type:', step.questionType);
                  isCorrect = false;
              }
            } else {
              console.error('Step not found in lesson:', validatedData.stepId);
            }
          } else {
            console.error('Lesson not found in DB:', validatedData.lessonId);
          }
        } catch (e) {
          console.error('Failed to validate DB lesson answer:', e);
          isCorrect = false;
        }
      }
      // Handle hardcoded lesson question types
      else if (typeof expectedAnswer === 'boolean') {
        isCorrect = validatedData.answer === String(expectedAnswer);
      } else {
        isCorrect = validatedData.answer === expectedAnswer;
      }

      // Award XP based on lesson and step
      let xpReward = 10; // default
      
      // Try to get XP from DB first
      try {
        const lessonData = await storage.getLessonWithSteps(validatedData.lessonId);
        if (lessonData) {
          const step = lessonData.steps.find(s => s.id === validatedData.stepId);
          if (step && step.xpReward) {
            xpReward = step.xpReward;
          }
        }
      } catch (e) {
        console.log('Using default XP, DB lookup failed:', e);
      }
      
      // Fallback to hardcoded for legacy lessons
      if (validatedData.lessonId === 'fuel-for-football') {
        const fuelXpRewards: Record<string, number> = {
          'step-1': 10,
          'step-2': 10,
          'step-3': 15,
          'step-4': 10,
          'step-5': 10,
          'step-6': 10
        };
        xpReward = fuelXpRewards[validatedData.stepId] || xpReward;
      } else if (validatedData.lessonId === 'brainfuel-for-school') {
        const brainXpRewards: Record<string, number> = {
          'step-1': 10,
          'step-2': 10,
          'step-3': 15,
          'step-4': 10,
          'step-5': 15,
          'step-6': 10
        };
        xpReward = brainXpRewards[validatedData.stepId] || xpReward;
      }

      const xpAwarded = isCorrect ? xpReward : 0;

      // If correct, award XP to user
      if (isCorrect && xpAwarded > 0) {
        try {
          const user = await storage.getUser(validatedData.userId);
          if (user) {
            await storage.updateUser(validatedData.userId, {
              totalXp: user.totalXp + xpAwarded,
              level: Math.floor((user.totalXp + xpAwarded) / 100) + 1
            });
            
            // Log XP event (simplified for now)
            console.log(`XP awarded: ${xpAwarded} for user ${validatedData.userId}`);
          }
        } catch (xpError) {
          console.error('Error awarding XP:', xpError);
          // Continue even if XP award fails
        }
      }

      res.json({
        correct: isCorrect,
        xpAwarded: xpAwarded,
        stepId: validatedData.stepId
      });
    } catch (error) {
      console.error('Submit answer error:', error);
      res.status(500).json({ error: 'Failed to submit answer' });
    }
  });

  // Log lesson attempt analytics
  app.post('/api/lessons/log-attempt', requireAuth, async (req: any, res: any) => {
    try {
      const validatedData = insertLessonAttemptSchema.parse(req.body);
      
      // Verify user matches authenticated user
      if (validatedData.userId !== req.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // Store the analytics data
      await storage.logLessonAttempt(validatedData);

      res.json({ success: true });
    } catch (error) {
      console.error('Log attempt error:', error);
      res.status(500).json({ error: 'Failed to log attempt' });
    }
  });
}