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

export function registerLessonRoutes(app: Express, requireAuth: any) {
  // Get lesson by ID
  app.get('/api/lessons/:lessonId', requireAuth, async (req: any, res: any) => {
    try {
      const { lessonId } = req.params;
      
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
        res.set({
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
          'Last-Modified': new Date().toUTCString(),
          ETag: 'W/"' + Date.now() + '"'
        });
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
              question: "Which breakfast gives your brain the best fuel for a 2-hour exam?",
              content: {
                options: [
                  { id: 'porridge-berries', text: 'Porridge with blueberries + milk', emoji: '🥣', correct: true },
                  { id: 'chocolate-cereal', text: 'Chocolate cereal + fizzy drink', emoji: '🥛', correct: false },
                  { id: 'white-toast', text: 'White toast with jam', emoji: '🍞', correct: false }
                ],
                feedback: "Great choice! Porridge gives slow, steady energy. Blueberries help with memory, and milk's protein keeps your brain working smoothly through the exam."
              },
              xpReward: 10,
              mascotAction: 'graduation_cap',
              retryConfig: {
                maxAttempts: 3,
                xp: { firstTry: 10, secondTry: 5, learnCard: 0 },
                messages: {
                  tryAgain1: "Think steady energy that lasts through your exam, not a sugar rush.",
                  tryAgain2: "Which breakfast keeps your brain working smoothly for 2 hours?",
                  learnCard: "Porridge gives slow, steady energy. Blueberries help with memory, and milk's protein keeps your brain working smoothly through the exam."
                }
              }
            },
            {
              id: 'step-2',
              stepNumber: 2,
              questionType: 'true-false' as const,
              question: "Your brain is mostly water. Even small dehydration can make it harder to concentrate.",
              content: {
                correctAnswer: true,
                feedback: "Right! Even losing a bit of water makes you think slower and feel tired. Drinking water keeps you sharp in lessons and exams."
              },
              xpReward: 10,
              mascotAction: 'brain_glow',
              retryConfig: {
                maxAttempts: 3,
                xp: { firstTry: 10, secondTry: 5, learnCard: 0 },
                messages: {
                  tryAgain1: "Think about what your brain is mostly made of - it needs this to work well.",
                  tryAgain2: "What happens when you don't drink enough during the day?",
                  learnCard: "Your brain is about 80% water! Even losing a bit makes you think slower and feel tired. Drinking water keeps you sharp in lessons and exams."
                }
              }
            },
            {
              id: 'step-3',
              stepNumber: 3,
              questionType: 'matching' as const,
              question: "Match the food to what it gives your brain for school.",
              content: {
                matchingPairs: [
                  { left: '🐟 Salmon', right: 'Stronger memory for tests' },
                  { left: '🥚 Eggs', right: 'Energy to focus in lessons' },
                  { left: '🥦 Broccoli', right: 'Vitamins to stay healthy' },
                  { left: '🫘 Beans', right: 'Oxygen for clear thinking' }
                ],
                feedback: "Perfect matches! Each food helps your brain work better in different ways."
              },
              xpReward: 15,
              mascotAction: 'clipboard_tick',
              retryConfig: {
                maxAttempts: 3,
                xp: { firstTry: 15, secondTry: 7, learnCard: 0 },
                messages: {
                  tryAgain1: "Think about what each food gives your brain - they all help in different ways.",
                  tryAgain2: "Match what makes your memory stronger, what gives energy, what keeps you healthy.",
                  learnCard: "Each food helps your brain differently: Salmon strengthens memory, eggs give focus energy, broccoli provides vitamins, and beans deliver oxygen for clear thinking."
                }
              }
            },
            {
              id: 'step-4',
              stepNumber: 4,
              questionType: 'multiple-choice' as const,
              question: "It's 30 minutes before your science quiz. What's the best quick snack?",
              content: {
                options: [
                  { id: 'banana-water', text: 'Banana + water', emoji: '🍌', correct: true },
                  { id: 'chocolate-juice', text: 'Chocolate bar + juice', emoji: '🍫', correct: false },
                  { id: 'large-sandwich', text: 'Large sandwich', emoji: '🥪', correct: false }
                ],
                feedback: "A banana gives quick energy and water keeps your brain working fast. Heavy food or lots of sugar can make you slow down during the quiz."
              },
              xpReward: 10,
              mascotAction: 'ready_sign',
              retryConfig: {
                maxAttempts: 3,
                xp: { firstTry: 10, secondTry: 5, learnCard: 0 },
                messages: {
                  tryAgain1: "Think quick energy + brain hydration, but not too heavy before a quiz.",
                  tryAgain2: "What gives fast energy without making you sleepy during the test?",
                  learnCard: "A banana gives quick energy and water keeps your brain working fast. Heavy food or lots of sugar can make you slow down during the quiz."
                }
              }
            },
            {
              id: 'step-5',
              stepNumber: 5,
              questionType: 'label-reading' as const,
              question: "Which revision snack is better for longer focus?",
              content: {
                labelOptions: [
                  { id: 'snack-a', name: 'Snack A', sugar: '15g', fiber: '1g', protein: '0g', correct: false },
                  { id: 'snack-b', name: 'Snack B', sugar: '9g', fiber: '4g', protein: '7g', correct: true }
                ],
                feedback: "Snack B! The fibre and protein slow down the energy release, so your brain gets steady fuel while you revise."
              },
              xpReward: 10,
              mascotAction: 'snack_pot',
              retryConfig: {
                maxAttempts: 3,
                xp: { firstTry: 10, secondTry: 5, learnCard: 0 },
                messages: {
                  tryAgain1: "Look at the fiber and protein - which one gives steady energy instead of a sugar crash?",
                  tryAgain2: "Higher fiber and protein means slower energy release for longer focus.",
                  learnCard: "Snack B! The fiber and protein slow down the energy release, so your brain gets steady fuel while you revise."
                }
              }
            },
            {
              id: 'step-6',
              stepNumber: 6,
              questionType: 'ordering' as const,
              question: "Put these in the best order before a test.",
              content: {
                orderingItems: [
                  { id: 'drink-water', text: 'Drink water', correctOrder: 1 },
                  { id: 'light-snack', text: 'Eat a light snack', correctOrder: 2 },
                  { id: 'deep-breaths', text: '3 deep breaths + check your things', correctOrder: 3 }
                ],
                feedback: "Hydration first, then steady fuel, then calming your nerves. That way you're ready to focus."
              },
              xpReward: 15,
              mascotAction: 'thumbs_up',
              retryConfig: {
                maxAttempts: 3,
                xp: { firstTry: 15, secondTry: 7, learnCard: 0 },
                messages: {
                  tryAgain1: "Think about preparing your body first, then your mind for the test.",
                  tryAgain2: "What order helps you feel calm and ready - hydration, fuel, then relaxation?",
                  learnCard: "Hydration first, then steady fuel, then calming your nerves. That way you're ready to focus and do your best on the test."
                }
              }
            }
          ]
        };
        
        // Force disable ETags and prevent all caching
        res.set({
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
          Pragma: 'no-cache',
          Expires: '0',
          'Last-Modified': new Date().toUTCString(),
          ETag: 'W/"' + Date.now() + '"'
        });
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
      
      // Verify user matches authenticated user
      if (validatedData.userId !== req.user.userId) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      // For now, hardcode the correct answers by lesson
      // In the future, this would check against the database
      const fuelForFootballAnswers: Record<string, string | boolean> = {
        'step-1': 'oats',
        'step-2': true,
        'step-3': 'matching-complete',
        'step-4': 'banana',
        'step-5': 'ordering-complete',
        'step-6': 'muscles'
      };
      
      const brainFuelAnswers: Record<string, string | boolean> = {
        'step-1': 'porridge-berries',
        'step-2': true,
        'step-3': 'matching-complete',
        'step-4': 'banana-water',
        'step-5': 'snack-b',
        'step-6': 'ordering-complete'
      };

      let expectedAnswer;
      if (validatedData.lessonId === 'fuel-for-football') {
        expectedAnswer = fuelForFootballAnswers[validatedData.stepId];
      } else if (validatedData.lessonId === 'brainfuel-for-school') {
        expectedAnswer = brainFuelAnswers[validatedData.stepId];
      }
      let isCorrect = false;

      if (typeof expectedAnswer === 'boolean') {
        isCorrect = validatedData.answer === String(expectedAnswer);
      } else {
        isCorrect = validatedData.answer === expectedAnswer;
      }

      // Award XP based on lesson and step
      let xpReward = 10; // default
      if (validatedData.lessonId === 'fuel-for-football') {
        const fuelXpRewards: Record<string, number> = {
          'step-1': 10,
          'step-2': 10,
          'step-3': 15,
          'step-4': 10,
          'step-5': 10,
          'step-6': 10
        };
        xpReward = fuelXpRewards[validatedData.stepId] || 10;
      } else if (validatedData.lessonId === 'brainfuel-for-school') {
        const brainXpRewards: Record<string, number> = {
          'step-1': 10,
          'step-2': 10,
          'step-3': 15,
          'step-4': 10,
          'step-5': 10,
          'step-6': 15
        };
        xpReward = brainXpRewards[validatedData.stepId] || 10;
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
      if (validatedData.userId !== req.user.userId) {
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