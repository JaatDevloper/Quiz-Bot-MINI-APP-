import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const quizzes = pgTable("quizzes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  isPaid: boolean("is_paid").notNull().default(false),
  questions: jsonb("questions").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  published: boolean("published").notNull().default(false),
});

export const quizStats = pgTable("quiz_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  totalQuizzes: integer("total_quizzes").notNull().default(0),
  freeQuizzes: integer("free_quizzes").notNull().default(0),
  paidQuizzes: integer("paid_quizzes").notNull().default(0),
  engagement: integer("engagement").notNull().default(0),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
});

export const insertQuizStatsSchema = createInsertSchema(quizStats).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuizStats = z.infer<typeof insertQuizStatsSchema>;
export type QuizStats = typeof quizStats.$inferSelect;

export interface Question {
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}
