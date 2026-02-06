import type { Express } from "express";
import { storage } from "../storage";

export function registerTopicRoutes(app: Express, requireAuth: any) {
  app.get('/api/topics/:topicId', requireAuth, async (req: any, res: any) => {
    try {
      const { topicId } = req.params;

      const topic = await storage.getTopicById(topicId);
      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' });
      }

      let mascot = null;
      if (topic.defaultMascotId) {
        mascot = await storage.getMascotById(topic.defaultMascotId);
      }

      const lessons = await storage.getLessonsByTopic(topicId);

      res.json({
        id: topic.id,
        title: topic.title,
        description: topic.description,
        iconEmoji: topic.iconEmoji,
        defaultMascotId: topic.defaultMascotId,
        age: topic.age,
        mascot: mascot ? {
          id: mascot.id,
          name: mascot.name,
          emoji: mascot.emoji,
          imagePath: mascot.imagePath,
        } : null,
        lessonCount: lessons.length,
      });
    } catch (error) {
      console.error('Error fetching topic:', error);
      res.status(500).json({ error: 'Failed to fetch topic' });
    }
  });

  app.get('/api/topics/:topicId/lessons', requireAuth, async (req: any, res: any) => {
    try {
      const { topicId } = req.params;
      const { userId, childId } = req.query;

      const topic = await storage.getTopicById(topicId);
      if (!topic) {
        return res.status(404).json({ error: 'Topic not found' });
      }

      const allLessons = await storage.getLessonsByTopic(topicId);

      let completedLessonIds: Set<string> = new Set();
      if (userId) {
        const completedLessons = await storage.getCompletedLessonIds(userId as string, childId as string | undefined);
        completedLessonIds = new Set(completedLessons);
      }

      let foundCurrent = false;
      const lessonsWithState = await Promise.all(allLessons.map(async (lesson, index) => {
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

        let mascotDetails = null;
        if (lesson.mascotId) {
          mascotDetails = await storage.getMascotById(lesson.mascotId);
        }

        return {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          topicId: lesson.topicId,
          difficultyLevel: lesson.difficultyLevel,
          learningTakeaway: lesson.learningTakeaway,
          mascotIntro: lesson.mascotIntro,
          mascotId: lesson.mascotId,
          mascot: mascotDetails ? {
            id: mascotDetails.id,
            name: mascotDetails.name,
            emoji: mascotDetails.emoji,
            imagePath: mascotDetails.imagePath,
          } : null,
          orderInUnit: lesson.orderInUnit,
          totalSteps: lesson.totalSteps,
          iconEmoji: lesson.iconEmoji,
          estimatedMinutes: lesson.estimatedMinutes,
          state,
        };
      }));

      res.json(lessonsWithState);
    } catch (error) {
      console.error('Error fetching lessons for topic:', error);
      res.status(500).json({ error: 'Failed to fetch lessons' });
    }
  });

  // Get topics by age
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
}
