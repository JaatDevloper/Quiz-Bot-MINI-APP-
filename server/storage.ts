import { type User, type InsertUser, type Quiz, type InsertQuiz, type QuizStats, type InsertQuizStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Quiz methods
  getQuiz(id: string): Promise<Quiz | undefined>;
  getQuizzesByUserId(userId: string): Promise<Quiz[]>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  updateQuiz(id: string, quiz: Partial<InsertQuiz>): Promise<Quiz | undefined>;
  deleteQuiz(id: string): Promise<boolean>;

  // Quiz stats methods
  getQuizStats(userId: string): Promise<QuizStats | undefined>;
  updateQuizStats(userId: string, stats: Partial<InsertQuizStats>): Promise<QuizStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private quizzes: Map<string, Quiz>;
  private quizStats: Map<string, QuizStats>;

  constructor() {
    this.users = new Map();
    this.quizzes = new Map();
    this.quizStats = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    
    // Initialize stats for new user
    await this.updateQuizStats(id, {
      userId: id,
      totalQuizzes: 0,
      freeQuizzes: 0,
      paidQuizzes: 0,
      engagement: 0,
    });
    
    return user;
  }

  async getQuiz(id: string): Promise<Quiz | undefined> {
    return this.quizzes.get(id);
  }

  async getQuizzesByUserId(userId: string): Promise<Quiz[]> {
    return Array.from(this.quizzes.values())
      .filter((quiz) => quiz.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createQuiz(insertQuiz: InsertQuiz): Promise<Quiz> {
    const id = randomUUID();
    const quiz: Quiz = {
      id,
      userId: insertQuiz.userId,
      title: insertQuiz.title,
      description: insertQuiz.description ?? null,
      category: insertQuiz.category,
      isPaid: insertQuiz.isPaid ?? false,
      questions: insertQuiz.questions,
      published: insertQuiz.published ?? false,
      createdAt: new Date(),
    };
    this.quizzes.set(id, quiz);

    // Update stats
    const stats = await this.getQuizStats(insertQuiz.userId);
    if (stats) {
      await this.updateQuizStats(insertQuiz.userId, {
        totalQuizzes: stats.totalQuizzes + 1,
        freeQuizzes: insertQuiz.isPaid ? stats.freeQuizzes : stats.freeQuizzes + 1,
        paidQuizzes: insertQuiz.isPaid ? stats.paidQuizzes + 1 : stats.paidQuizzes,
      });
    }

    return quiz;
  }

  async updateQuiz(id: string, updates: Partial<InsertQuiz>): Promise<Quiz | undefined> {
    const quiz = this.quizzes.get(id);
    if (!quiz) return undefined;

    const updatedQuiz: Quiz = { ...quiz, ...updates };
    this.quizzes.set(id, updatedQuiz);
    return updatedQuiz;
  }

  async deleteQuiz(id: string): Promise<boolean> {
    const quiz = this.quizzes.get(id);
    if (!quiz) return false;

    this.quizzes.delete(id);

    // Update stats
    const stats = await this.getQuizStats(quiz.userId);
    if (stats) {
      await this.updateQuizStats(quiz.userId, {
        totalQuizzes: Math.max(0, stats.totalQuizzes - 1),
        freeQuizzes: quiz.isPaid ? stats.freeQuizzes : Math.max(0, stats.freeQuizzes - 1),
        paidQuizzes: quiz.isPaid ? Math.max(0, stats.paidQuizzes - 1) : stats.paidQuizzes,
      });
    }

    return true;
  }

  async getQuizStats(userId: string): Promise<QuizStats | undefined> {
    return this.quizStats.get(userId);
  }

  async updateQuizStats(userId: string, updates: Partial<InsertQuizStats>): Promise<QuizStats> {
    const existing = this.quizStats.get(userId);
    const stats: QuizStats = existing
      ? { ...existing, ...updates }
      : {
          id: randomUUID(),
          userId,
          totalQuizzes: 0,
          freeQuizzes: 0,
          paidQuizzes: 0,
          engagement: 0,
          ...updates,
        };
    this.quizStats.set(userId, stats);
    return stats;
  }
}

export const storage = new MemStorage();
