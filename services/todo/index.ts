import { eq, InferModel } from 'drizzle-orm';
import { boolean, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';
import { db } from '../config';

const tasks = pgTable('tasks', {
    id: serial('id').primaryKey(),
    taskname: varchar('taskname', { length: 255 }).notNull(),
    isdone: boolean('isdone').notNull(),
    createdat: timestamp('createdat').defaultNow().notNull(),
});

type Task = InferModel<typeof tasks>;
type NewTask = InferModel<typeof tasks, 'insert'>;

export class TodoService {
    static async getAllRecords() {
        try {
            const allTasks = await db.select().from(tasks);
            return allTasks;
        } catch (error) {
            console.error('Error executing SQL query:', error);
            throw error;
        }
    }
    static async postRecord(taskName: string, isDone: boolean) {
        try {
            const newTask: NewTask = {
                taskname: taskName,
                isdone: isDone,
                createdat: new Date(),
            };
            const insertedUser = await db.insert(tasks).values(newTask).returning();
            return insertedUser;
        } catch (error) {
            console.error('Error executing SQL query:', error);
            throw error;
        }
    }
    static async modifyTodo(id: any, isDone: boolean) {
        try {
            const updateResult = await db
                .update(tasks)
                .set({ isdone: isDone })
                .where(eq(tasks.id, id))
                .returning({ taskname: tasks.taskname, isdone: tasks.isdone });
            return updateResult;
        } catch (error) {
            console.error('Error executing SQL query:', error);
            throw error;
        }
    }
}

