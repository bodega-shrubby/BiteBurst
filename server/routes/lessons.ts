import type { Express } from "express";
import { storage } from "../storage";
import { z } from "zod";
import { insertLessonAttemptSchema } from "../../shared/schema";

const answerSubmissionSchema = z.object({
  userId: z.string(),
  childId: z.string().optional(), // For additional children from children table
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

function getLocalizedContent(step: any, locale: string) {
  const variants = step.contentVariants as Record<string, any> | null;
  if (variants && variants[locale]) {
    return { ...step.content, ...variants[locale] };
  }
  return step.content;
}

interface AuthResolution {
  valid: boolean;
  error?: string;
  isChildSelf: boolean;
  parentId?: string;
  childFromChildrenTable?: any;
  userFromUsersTable?: any;
  age?: number;
  locale?: string;
}

async function resolveUserAuth(userId: string, authId: string): Promise<AuthResolution> {
  // First check users table
  const userFromUsersTable = await storage.getUser(userId);
  
  if (userFromUsersTable) {
    // Found in users table
    const isParentOwned = userFromUsersTable.parentAuthId === authId;
    const isDirectMatch = userId === authId;
    
    if (isParentOwned || isDirectMatch) {
      return {
        valid: true,
        isChildSelf: false,
        parentId: userId,
        userFromUsersTable,
        age: undefined, // Parent doesn't have age, child records do
        locale: userFromUsersTable.locale || 'en-GB'
      };
    }
    return { valid: false, error: 'Unauthorized', isChildSelf: false };
  }
  
  // Not in users table - check children table
  const childFromChildrenTable = await storage.getChild(userId);
  
  if (!childFromChildrenTable) {
    return { valid: false, error: 'User not found', isChildSelf: false };
  }
  
  // Child exists - check if child is accessing their own data
  if (childFromChildrenTable.id === authId) {
    return {
      valid: true,
      isChildSelf: true,
      parentId: childFromChildrenTable.parentId,
      childFromChildrenTable,
      age: childFromChildrenTable.age,
      locale: childFromChildrenTable.locale || 'en-GB'
    };
  }
  
  // Check if parent is authorized
  const parent = await storage.getUser(childFromChildrenTable.parentId);
  if (parent && parent.parentAuthId === authId) {
    return {
      valid: true,
      isChildSelf: false,
      parentId: childFromChildrenTable.parentId,
      childFromChildrenTable,
      age: childFromChildrenTable.age,
      locale: childFromChildrenTable.locale || 'en-GB'
    };
  }
  
  return { valid: false, error: 'Unauthorized', isChildSelf: false };
}

async function validateChildOwnership(
  childId: string | undefined, 
  parentUserId: string, 
  isChildSelf: boolean
): Promise<{ valid: boolean; error?: string }> {
  if (!childId || isChildSelf) {
    return { valid: true };
  }
  
  const child = await storage.getChild(childId);
  if (!child) {
    return { valid: false, error: 'Child not found' };
  }
  
  if (child.parentId !== parentUserId) {
    return { valid: false, error: 'Unauthorized child access' };
  }
  
  return { valid: true };
}

export function registerLessonRoutes(app: Express, requireAuth: any) {
  // Get current lesson for a user (for dashboard hero)
  app.get('/api/user/:userId/current-lesson', requireAuth, async (req: any, res: any) => {
    try {
      const { userId } = req.params;
      
      const auth = await resolveUserAuth(userId, req.userId);
      if (!auth.valid) {
        const statusCode = auth.error === 'User not found' ? 404 : 403;
        return res.status(statusCode).json({ error: auth.error });
      }
      
      // Get child's age for filtering lessons
      const childAge = auth.age;
      
      if (!childAge) {
        // Return default lesson if no age set
        return res.json({
          id: 'default',
          title: 'Welcome to BiteBurst',
          emoji: '🌟',
          current_slide: 1,
          total_slides: 5,
          progress_percent: 0,
        });
      }
      
      // Get all lessons for the child's age
      const allLessons = await storage.getLessonsByAge(childAge);
      
      if (!allLessons || allLessons.length === 0) {
        return res.json({
          id: 'getting-started',
          title: 'Getting Started',
          emoji: '🚀',
          current_slide: 1,
          total_slides: 3,
          progress_percent: 0,
        });
      }
      
      // Get completed lessons for this user
      const completedLessons = await storage.getCompletedLessonIds(userId, undefined);
      const completedLessonIds = new Set(completedLessons);
      
      // Find the first incomplete lesson (current lesson)
      let currentLesson = allLessons.find((lesson: any) => !completedLessonIds.has(lesson.id));
      
      // If all lessons completed, return the last one
      if (!currentLesson) {
        currentLesson = allLessons[allLessons.length - 1];
      }
      
      // Get the lesson's steps count
      const lessonWithSteps = await storage.getLessonWithSteps(currentLesson.id);
      const totalSlides = lessonWithSteps?.steps?.length || 5;
      
      // Get user's progress from lesson_attempts table
      const currentSlide = 1; // Default to first step
      const progressPercent = completedLessonIds.has(currentLesson.id) ? 100 : 0;
      
      res.json({
        id: currentLesson.id,
        title: currentLesson.title,
        emoji: currentLesson.iconEmoji || '📚',
        current_slide: currentSlide,
        total_slides: totalSlides,
        progress_percent: completedLessonIds.has(currentLesson.id) ? 100 : progressPercent,
      });
    } catch (error) {
      console.error('Failed to get current lesson:', error);
      res.status(500).json({ error: 'Failed to load current lesson' });
    }
  });

  // Get lessons by age
  app.get('/api/lessons/age/:age', requireAuth, async (req: any, res: any) => {
    try {
      const age = parseInt(req.params.age, 10);
      const childUserId = req.query.userId as string;
      const childId = req.query.childId as string;
      
      if (isNaN(age) || age < 6 || age > 14) {
        return res.status(400).json({ error: 'Invalid age. Must be between 6 and 14.' });
      }
      
      if (!childUserId) {
        return res.status(400).json({ error: 'userId query parameter is required' });
      }
      
      const auth = await resolveUserAuth(childUserId, req.userId);
      if (!auth.valid) {
        const statusCode = auth.error === 'User not found' ? 404 : 403;
        return res.status(statusCode).json({ error: auth.error });
      }
      
      const childValidation = await validateChildOwnership(childId, auth.parentId!, auth.isChildSelf);
      if (!childValidation.valid) {
        return res.status(403).json({ error: childValidation.error });
      }
      
      const allLessons = await storage.getLessonsByAge(age);
      
      // Get completed lessons for either the additional child (childId) or primary child (userId)
      const completedLessons = await storage.getCompletedLessonIds(childUserId, childId || undefined);
      const completedLessonIds = new Set(completedLessons);
      
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
          // Unlock next lesson if previous is completed
          state = 'unlocked';
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
      console.error('Failed to get lessons by age:', error);
      res.status(500).json({ error: 'Failed to load lessons' });
    }
  });

  // Get all lessons for a child by age (combines topics + lessons)
  app.get('/api/age/:age/lessons', requireAuth, async (req: any, res: any) => {
    try {
      const age = parseInt(req.params.age, 10);
      const childUserId = req.query.userId as string;
      const childId = req.query.childId as string;
      
      if (isNaN(age) || age < 6 || age > 14) {
        return res.status(400).json({ error: 'Invalid age. Must be between 6 and 14.' });
      }
      
      if (!childUserId) {
        return res.status(400).json({ error: 'userId query parameter is required' });
      }
      
      const auth = await resolveUserAuth(childUserId, req.userId);
      if (!auth.valid) {
        const statusCode = auth.error === 'User not found' ? 404 : 403;
        return res.status(statusCode).json({ error: auth.error });
      }
      
      const childValidation = await validateChildOwnership(childId, auth.parentId!, auth.isChildSelf);
      if (!childValidation.valid) {
        return res.status(403).json({ error: childValidation.error });
      }
      
      // Get topics for this age
      let ageTopics = await storage.getTopicsByAge(age);
      
      // If no topics found for this age, fall back to age 6 which should have sample lessons
      if (ageTopics.length === 0 && age !== 6) {
        console.log(`No topics found for age ${age}, falling back to age 6`);
        ageTopics = await storage.getTopicsByAge(6);
      }
      
      // Get lessons for each topic
      const allLessons: any[] = [];
      for (const topic of ageTopics) {
        const topicLessons = await storage.getLessonsByTopic(topic.id);
        for (const lesson of topicLessons) {
          allLessons.push({
            id: lesson.id,
            title: lesson.title,
            icon: lesson.iconEmoji || '📚',
            topicId: topic.id,
            topicTitle: topic.title,
            topicOrder: topic.orderPosition ?? 0,
            sortOrder: lesson.orderInUnit ?? 0,
            description: lesson.description,
            difficultyLevel: lesson.difficultyLevel ?? 1
          });
        }
      }
      
      // Sort by topic order first, then lesson order, then difficulty level
      allLessons.sort((a, b) => {
        if (a.topicOrder !== b.topicOrder) {
          return a.topicOrder - b.topicOrder;
        }
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }
        return a.difficultyLevel - b.difficultyLevel;
      });
      
      // Get completed lessons for either the additional child (childId) or primary child (userId)
      const completedLessons = await storage.getCompletedLessonIds(childUserId, childId || undefined);
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
      console.error('Failed to get age-based lessons:', error);
      res.status(500).json({ error: 'Failed to load lessons' });
    }
  });

  // Get topics for an age
  app.get('/api/age/:age/topics', requireAuth, async (req: any, res: any) => {
    try {
      const age = parseInt(req.params.age, 10);
      if (isNaN(age) || age < 6 || age > 14) {
        return res.status(400).json({ error: 'Invalid age. Must be between 6 and 14.' });
      }
      const ageTopics = await storage.getTopicsByAge(age);
      res.json(ageTopics);
    } catch (error) {
      console.error('Failed to get topics by age:', error);
      res.status(500).json({ error: 'Failed to load topics' });
    }
  });

  // Get lesson by ID
  app.get('/api/lessons/:lessonId', requireAuth, async (req: any, res: any) => {
    try {
      const { lessonId } = req.params;
      const childLocale = req.query.locale as string || 'en-GB';

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
            content: getLocalizedContent(step, childLocale),
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
      
      const auth = await resolveUserAuth(validatedData.userId, req.userId);
      if (!auth.valid) {
        const statusCode = auth.error === 'User not found' ? 404 : 403;
        return res.status(statusCode).json({ error: auth.error });
      }
      
      const childValidation = await validateChildOwnership(validatedData.childId, auth.parentId!, auth.isChildSelf);
      if (!childValidation.valid) {
        return res.status(403).json({ error: childValidation.error });
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
                case 'lesson-content':
                  // No validation needed - this is a learning step, not a quiz
                  // Always return correct with 0 XP
                  isCorrect = true;
                  break;
                  
                case 'tap-pair':
                  if (step.content?.pairs && Array.isArray(step.content.pairs)) {
                    try {
                      const userMatches = JSON.parse(validatedData.answer) as Record<string, string>;
                      const correctPairs = step.content.pairs as Array<{left: string; right: string}>;
                      isCorrect = correctPairs.every(pair => userMatches[pair.left] === pair.right);
                    } catch (e) {
                      console.error('Failed to parse tap-pair answer:', e);
                      isCorrect = false;
                    }
                  } else if (step.content?.correctPair) {
                    try {
                      const selectedIds = JSON.parse(validatedData.answer) as string[];
                      const correctPair = step.content.correctPair as string[];
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
                  if (step.content?.correctAnswer) {
                    isCorrect = validatedData.answer.toLowerCase().trim() === String(step.content.correctAnswer).toLowerCase().trim();
                  } else if (step.content?.blanks && Array.isArray(step.content.blanks)) {
                    const blanks = step.content.blanks as Array<{id: string; correctAnswer: string; acceptableAnswers?: string[]}>;
                    if (blanks.length > 0) {
                      const userAnswer = validatedData.answer.toLowerCase().trim();
                      const acceptable = blanks[0].acceptableAnswers || [blanks[0].correctAnswer];
                      isCorrect = acceptable.some(a => a.toLowerCase().trim() === userAnswer);
                    }
                  }
                  break;
                  
                case 'multiple-choice':
                  // Validate multiple-choice: answer matches correct option ID or correctAnswer field
                  if (step.content?.correctAnswer) {
                    // Direct correctAnswer field (preferred)
                    isCorrect = validatedData.answer === step.content.correctAnswer;
                  } else if (step.content?.options) {
                    // Fallback to finding correct option (check both 'correct' and 'isCorrect' fields)
                    const correctOption = step.content.options.find((o: any) => o.correct === true || o.isCorrect === true);
                    isCorrect = correctOption && validatedData.answer === correctOption.id;
                  }
                  break;
                  
                case 'true-false':
                  // Validate true-false: answer matches correctAnswer or correct option ID
                  if (step.content?.correctAnswer !== undefined) {
                    isCorrect = validatedData.answer === String(step.content.correctAnswer);
                  } else if (step.content?.options && Array.isArray(step.content.options)) {
                    // Options array - check both 'correct' and 'isCorrect' fields
                    const correctOption = step.content.options.find((o: any) => o.correct === true || o.isCorrect === true);
                    isCorrect = correctOption && validatedData.answer === correctOption.id;
                  }
                  break;
                  
                case 'matching':
                  // Validate matching: answer is JSON object of left->right pairs
                  // Support both matchingPairs (legacy) and pairs (new format)
                  const matchingPairs = step.content?.matchingPairs || step.content?.pairs;
                  if (matchingPairs && Array.isArray(matchingPairs)) {
                    try {
                      const submittedMatches = JSON.parse(validatedData.answer);
                      const pairs = matchingPairs as Array<{left: string; right: string}>;
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
                  // Support both orderingItems (legacy) and items with category (new format)
                  // Generate IDs for items that don't have them (matching frontend logic)
                  if (step.content?.orderingItems) {
                    try {
                      const submittedOrder = JSON.parse(validatedData.answer);
                      const items = (step.content.orderingItems as Array<{id?: string; correctOrder: number; text: string}>)
                        .map((item, index) => ({
                          ...item,
                          id: item.id || `order-item-${index}`
                        }));
                      const correctOrderIds = items
                        .sort((a, b) => a.correctOrder - b.correctOrder)
                        .map(item => item.id);
                      isCorrect = JSON.stringify(submittedOrder) === JSON.stringify(correctOrderIds);
                    } catch (e) {
                      console.error('Failed to parse ordering answer:', e);
                      isCorrect = false;
                    }
                  } else if (step.content?.items && Array.isArray(step.content.items)) {
                    // New format: items array with id, text, category or correctOrder
                    try {
                      const submittedOrder = JSON.parse(validatedData.answer);
                      const items = (step.content.items as Array<{id?: string; text: string; correctOrder?: number; category?: string}>)
                        .map((item, index) => ({
                          ...item,
                          id: item.id || `order-item-${index}`,
                          correctOrder: item.correctOrder ?? index + 1
                        }));
                      // Sort by correctOrder and get IDs
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
            const currentXp = user.totalXp ?? 0;
            await storage.updateUser(validatedData.userId, {
              totalXp: currentXp + xpAwarded,
              level: Math.floor((currentXp + xpAwarded) / 100) + 1
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
      
      const auth = await resolveUserAuth(validatedData.userId, req.userId);
      if (!auth.valid) {
        const statusCode = auth.error === 'User not found' ? 404 : 403;
        return res.status(statusCode).json({ error: auth.error });
      }
      
      const childValidation = await validateChildOwnership(validatedData.childId ?? undefined, auth.parentId!, auth.isChildSelf);
      if (!childValidation.valid) {
        return res.status(403).json({ error: childValidation.error });
      }

      // Store the analytics data
      const result = await storage.logLessonAttempt(validatedData);

      res.json({ success: true });
    } catch (error) {
      console.error('Log attempt error:', error);
      res.status(500).json({ error: 'Failed to log attempt' });
    }
  });

  // Mark a lesson as complete
  app.post('/api/lessons/:lessonId/complete', requireAuth, async (req: any, res: any) => {
    try {
      const { lessonId } = req.params;
      const { xpEarned, userId, childId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }
      
      const auth = await resolveUserAuth(userId, req.userId);
      if (!auth.valid) {
        const statusCode = auth.error === 'User not found' ? 404 : 403;
        return res.status(statusCode).json({ error: auth.error });
      }
      
      const childValidation = await validateChildOwnership(childId, auth.parentId!, auth.isChildSelf);
      if (!childValidation.valid) {
        return res.status(403).json({ error: childValidation.error });
      }
      
      await storage.markLessonComplete(userId, lessonId, xpEarned || 0, childId);
      
      res.json({ success: true });
    } catch (error) {
      console.error('Mark lesson complete error:', error);
      res.status(500).json({ error: 'Failed to mark lesson complete' });
    }
  });

  // Get claimed treasure chests for a user
  app.get('/api/treasures', requireAuth, async (req: any, res: any) => {
    try {
      const userId = req.query.userId as string;
      const childId = req.query.childId as string | undefined;
      
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }
      
      const auth = await resolveUserAuth(userId, req.userId);
      if (!auth.valid) {
        return res.status(403).json({ error: auth.error });
      }
      
      const treasures = await storage.getTreasureChests(userId, childId);
      res.json(treasures);
    } catch (error) {
      console.error('Get treasures error:', error);
      res.status(500).json({ error: 'Failed to get treasures' });
    }
  });

  // Claim a treasure chest
  app.post('/api/treasures/:lessonBaseId/claim', requireAuth, async (req: any, res: any) => {
    try {
      const { lessonBaseId } = req.params;
      const { userId, childId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }
      
      const auth = await resolveUserAuth(userId, req.userId);
      if (!auth.valid) {
        return res.status(403).json({ error: auth.error });
      }
      
      const childValidation = await validateChildOwnership(childId, auth.parentId!, auth.isChildSelf);
      if (!childValidation.valid) {
        return res.status(403).json({ error: childValidation.error });
      }
      
      // Claim the treasure and award XP
      const treasure = await storage.claimTreasureChest(userId, lessonBaseId, childId);
      
      // Award XP to user - get current user and update their XP
      const user = await storage.getUser(userId);
      if (user) {
        const newXp = (user.totalXp || 0) + treasure.xpReward;
        await storage.updateUser(userId, { totalXp: newXp });
      }
      
      res.json({
        success: true,
        xpEarned: treasure.xpReward,
        message: `🎉 Treasure claimed! You earned ${treasure.xpReward} XP!`
      });
    } catch (error) {
      console.error('Claim treasure error:', error);
      res.status(500).json({ error: 'Failed to claim treasure' });
    }
  });
}