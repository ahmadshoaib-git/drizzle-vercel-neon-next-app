import { drizzle } from 'drizzle-orm/node-postgres';
import { integer, pgTable, serial, text, timestamp, varchar, boolean } from 'drizzle-orm/pg-core';
import { InferModel, eq, sql } from 'drizzle-orm';
import { Pool } from 'pg';
import { NextRequest, NextResponse } from 'next/server';

const pool = new Pool({
    connectionString: process.env.NEXT_PUBLIC_DB_CONNECTION_STRING,
});

const tasks = pgTable('todo', {
    id: serial('id').primaryKey(),
    taskName: text('full_name').notNull(),
    isDone: boolean('false').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

type Task = InferModel<typeof tasks>;
type NewTask = InferModel<typeof tasks, 'insert'>;

const db = drizzle(pool);

export async function GET() {
    try {
        console.log('DB > ', db);
        const allTasks = await db.select().from(tasks);
        return NextResponse.json(allTasks);
    } catch (err) {
        console.log('err >>', err);
        NextResponse.json({ status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const req = await request.json();
        const { taskName, isDone } = req;
        const newTask: NewTask = {
            taskName: taskName,
            isDone: isDone,
        };
        console.log('DB > ', db);
        const insertedUser = await db.insert(tasks).values(newTask).returning();
        console.log(insertedUser);
        NextResponse.json(insertedUser);
    } catch (err) {
        NextResponse.json({ status: 500 });
    }
}

