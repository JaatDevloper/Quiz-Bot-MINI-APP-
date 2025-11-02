import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuizSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to validate Telegram user
  const validateTelegramUser = (req: any, res: any, next: any) => {
    const telegramUserId = req.headers['x-telegram-user-id'];
    if (!telegramUserId) {
      return res.status(401).json({ error: 'Unauthorized: No Telegram user ID' });
    }
    req.telegramUserId = telegramUserId;
    next();
  };

  // Get quiz statistics for a user
  app.get('/api/stats/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const stats = await storage.getQuizStats(userId);
      
      if (!stats) {
        return res.json({
          totalQuizzes: 0,
          freeQuizzes: 0,
          paidQuizzes: 0,
          engagement: 0,
        });
      }
      
      res.json(stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Failed to fetch statistics' });
    }
  });

  // Get all quizzes for a user
  app.get('/api/quizzes/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const quizzes = await storage.getQuizzesByUserId(userId);
      res.json(quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      res.status(500).json({ error: 'Failed to fetch quizzes' });
    }
  });

  // Get a single quiz
  app.get('/api/quiz/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const quiz = await storage.getQuiz(id);
      
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }
      
      res.json(quiz);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      res.status(500).json({ error: 'Failed to fetch quiz' });
    }
  });

  // Create a new quiz
  app.post('/api/quiz', async (req, res) => {
    try {
      const validatedData = insertQuizSchema.parse(req.body);
      const quiz = await storage.createQuiz(validatedData);
      res.status(201).json(quiz);
    } catch (error: any) {
      console.error('Error creating quiz:', error);
      if (error.name === 'ZodError') {
        return res.status(400).json({ error: 'Invalid quiz data', details: error.errors });
      }
      res.status(500).json({ error: 'Failed to create quiz' });
    }
  });

  // Update a quiz
  app.patch('/api/quiz/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const quiz = await storage.updateQuiz(id, req.body);
      
      if (!quiz) {
        return res.status(404).json({ error: 'Quiz not found' });
      }
      
      res.json(quiz);
    } catch (error) {
      console.error('Error updating quiz:', error);
      res.status(500).json({ error: 'Failed to update quiz' });
    }
  });

  // Delete a quiz
  app.delete('/api/quiz/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteQuiz(id);
      
      if (!deleted) {
        return res.status(404).json({ error: 'Quiz not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting quiz:', error);
      res.status(500).json({ error: 'Failed to delete quiz' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
