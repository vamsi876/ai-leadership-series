import { relations } from 'drizzle-orm';
import { 
  pgTable, 
  text, 
  timestamp, 
  boolean, 
  integer,
  primaryKey 
} from 'drizzle-orm/pg-core';

// User table (if not already exists)
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Course progress table
export const courseProgress = pgTable('course_progress', {
  userId: text('user_id').references(() => users.id).notNull(),
  courseId: text('course_id').notNull(),
  lessonId: text('lesson_id').notNull(),
  completed: boolean('completed').default(false),
  completedAt: timestamp('completed_at'),
  lastViewedAt: timestamp('last_viewed_at').defaultNow(),
  timeSpent: integer('time_spent').default(0), // in seconds
}, (table) => ({
  pk: primaryKey({ columns: [table.userId, table.courseId, table.lessonId] }),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  progress: many(courseProgress),
}));

export const courseProgressRelations = relations(courseProgress, ({ one }) => ({
  user: one(users, {
    fields: [courseProgress.userId],
    references: [users.id],
  }),
})); 