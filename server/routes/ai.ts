import type { Express } from "express";
import { z } from "zod";
import { storage } from "../storage";

const feedbackRequestSchema = z.object({
  age: z.string(),
  goal: z.enum(['energy', 'focus', 'strength']),
  mealLog: z.any(),
  activityLog: z.any().optional(),
  logId: z.string().optional(),
});

// Check if AI feedback is enabled
const AI_FEEDBACK_ENABLED = process.env.AI_FEEDBACK_ENABLED !== 'false';

// Canned responses for when AI is disabled
const CANNED_RESPONSES = {
  energy: [
    "Great choice! These foods will help keep your energy up throughout the day.",
    "Awesome! Eating well is like putting the best fuel in your body's engine.",
    "Nice work! Your body loves these nutritious foods that give you lasting energy."
  ],
  focus: [
    "Excellent pick! These foods help your brain stay sharp and focused.",
    "Smart choice! Good nutrition helps you think clearly and concentrate better.",
    "Well done! Brain-boosting foods like these help you learn and remember more."
  ],
  strength: [
    "Perfect! These foods help build strong muscles and bones.",
    "Great job! Your body uses these nutrients to grow stronger every day.",
    "Awesome choice! Eating well helps your body repair and build muscle."
  ]
};

async function generateAIFeedback(age: string, goal: string, mealLog: any): Promise<string> {
  if (!AI_FEEDBACK_ENABLED || !process.env.OPENAI_API_KEY) {
    // Return canned response
    const responses = CANNED_RESPONSES[goal as keyof typeof CANNED_RESPONSES] || CANNED_RESPONSES.energy;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  try {
    // Prepare meal description for AI
    let mealDescription = '';
    if (mealLog.emojis) {
      mealDescription = `Food emojis: ${mealLog.emojis.join(' ')}`;
    } else if (mealLog.description) {
      mealDescription = `Food description: ${mealLog.description}`;
    } else if (mealLog.photoCaption) {
      mealDescription = 'User provided a photo of their meal';
    }

    const systemPrompt = `You are BiteBurst, a kid-friendly nutrition coach. Keep outputs 1–2 sentences, positive, age-appropriate (6–14), never judgmental. Focus on encouragement and simple health benefits.`;
    
    const userPrompt = `A child aged ${age} with the goal of improving their ${goal} just logged: ${mealDescription}. Give them encouraging feedback about their food choice.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 120,
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText);
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || CANNED_RESPONSES[goal as keyof typeof CANNED_RESPONSES][0];

  } catch (error) {
    console.error('AI feedback generation error:', error);
    // Fallback to canned response
    const responses = CANNED_RESPONSES[goal as keyof typeof CANNED_RESPONSES] || CANNED_RESPONSES.energy;
    return responses[Math.floor(Math.random() * responses.length)];
  }
}

export function registerAIRoutes(app: Express, requireAuth: any) {
  // Generate AI feedback for meal/activity
  app.post('/api/ai/feedback', requireAuth, async (req: any, res: any) => {
    try {
      const validatedData = feedbackRequestSchema.parse(req.body);
      
      console.log('AI feedback request:', {
        enabled: AI_FEEDBACK_ENABLED,
        hasApiKey: !!process.env.OPENAI_API_KEY,
        age: validatedData.age,
        goal: validatedData.goal
      });

      // Generate feedback
      const feedback = await generateAIFeedback(
        validatedData.age,
        validatedData.goal,
        validatedData.mealLog
      );

      // Note: For MVP, we don't store feedback in logs table
      // Could be implemented later if needed

      res.json({ feedback });

    } catch (error) {
      console.error('AI feedback error:', error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Invalid request data', details: error.errors });
      } else {
        res.status(500).json({ 
          error: 'Failed to generate feedback',
          feedback: 'Great job logging your meal! Keep up the healthy eating habits.'
        });
      }
    }
  });

  // Health check for AI service
  app.get('/api/ai/status', (req: any, res: any) => {
    res.json({
      enabled: AI_FEEDBACK_ENABLED,
      hasApiKey: !!process.env.OPENAI_API_KEY,
      model: 'gpt-4o-mini'
    });
  });
}