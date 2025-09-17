import type { Express } from "express";
import { storage } from "../storage";
import { z } from "zod";

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
          totalSteps: 4,
          steps: [
            {
              id: 'step-1',
              stepNumber: 1,
              questionType: 'multiple-choice' as const,
              question: "What's the best breakfast before football training?",
              content: {
                options: [
                  { id: 'porridge', text: 'Porridge with fruit', emoji: '🥣', correct: true },
                  { id: 'croissant', text: 'Croissant with jam', emoji: '🥐', correct: false },
                  { id: 'fizzy', text: 'Fizzy drink', emoji: '🥤', correct: false }
                ],
                feedback: "Yes! Oats give long energy and fruit adds vitamins. That's why players eat porridge before training — it keeps them running all game!"
              },
              xpReward: 10,
              mascotAction: 'holding_football'
            },
            {
              id: 'step-2',
              stepNumber: 2,
              questionType: 'true-false' as const,
              question: "Water helps footballers stay strong for the whole game.",
              content: {
                correctAnswer: true,
                feedback: "Correct! Even Messi drinks water at half-time. It cools your body and keeps you fast."
              },
              xpReward: 10,
              mascotAction: 'sipping_water'
            },
            {
              id: 'step-3',
              stepNumber: 3,
              questionType: 'matching' as const,
              question: "Match the food to its benefit.",
              content: {
                matchingPairs: [
                  { left: '🥦 Broccoli', right: 'Vitamins for stamina' },
                  { left: '🥣 Yogurt with berries', right: 'Recovery fuel for muscles' },
                  { left: '🥚 Boiled egg', right: 'Protein for strength' }
                ],
                feedback: "Perfect matches! Broccoli keeps your body strong, yogurt helps muscles recover, and eggs build strength for harder kicks."
              },
              xpReward: 15,
              mascotAction: 'juggling_football'
            },
            {
              id: 'step-4',
              stepNumber: 4,
              questionType: 'multiple-choice' as const,
              question: "What's the best half-time snack to keep your energy up?",
              content: {
                options: [
                  { id: 'chocolate', text: 'Chocolate bar', emoji: '🍫', correct: false },
                  { id: 'banana', text: 'Banana', emoji: '🍌', correct: true },
                  { id: 'crisps', text: 'Crisps', emoji: '🍟', correct: false }
                ],
                feedback: "Perfect! Bananas give quick energy to refuel your legs so you can sprint again in the second half — just like Mbappé."
              },
              xpReward: 10,
              mascotAction: 'high_five'
            }
          ]
        };
        
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

      // For now, hardcode the correct answers
      // In the future, this would check against the database
      const correctAnswers: Record<string, string | boolean> = {
        'step-1': 'porridge',
        'step-2': true,
        'step-3': 'matching', // Simplified for now
        'step-4': 'banana'
      };

      const expectedAnswer = correctAnswers[validatedData.stepId];
      let isCorrect = false;

      if (typeof expectedAnswer === 'boolean') {
        isCorrect = validatedData.answer === String(expectedAnswer);
      } else {
        isCorrect = validatedData.answer === expectedAnswer;
      }

      // Award XP based on step
      const xpRewards: Record<string, number> = {
        'step-1': 10,
        'step-2': 10,
        'step-3': 15,
        'step-4': 10
      };

      const xpAwarded = isCorrect ? xpRewards[validatedData.stepId] || 10 : 0;

      // If correct, award XP to user
      if (isCorrect && xpAwarded > 0) {
        try {
          const user = await storage.getUser(validatedData.userId);
          if (user) {
            await storage.updateUser(validatedData.userId, {
              totalXp: user.totalXp + xpAwarded,
              level: Math.floor((user.totalXp + xpAwarded) / 100) + 1
            });
            
            // Log XP event
            await storage.createXpEvent({
              userId: validatedData.userId,
              amount: xpAwarded,
              reason: `lesson_${validatedData.lessonId}_${validatedData.stepId}`
            });
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
}