import { NextRequest, NextResponse } from 'next/server';
import { TodoService } from '@/services/todo';

export async function GET() {
    try {
        const allTasks = await TodoService.getAllRecords();
        return NextResponse.json(allTasks);
    } catch (err) {
        console.log('err >>', err);
        NextResponse.json({ status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const req = await request.json();
        const { taskname, isdone = false } = req;
        if (!taskname)
            return NextResponse.json(
                JSON.stringify({
                    message: 'Invalid Request! Please enter valid taskname',
                }),
                { status: 201 },
            );
        const insertedUser = await TodoService.postRecord(taskname, isdone);
        return new NextResponse(
            JSON.stringify({
                message: 'Data Added',
                insertedUser,
            }),
            { status: 201 },
        );
    } catch (err) {
        console.log('err >>', err);
        return NextResponse.json({ status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const req = await request.json();
        const { id, isdone = false } = req;
        if (id) {
            const updateResult = TodoService.modifyTodo(id, isdone);
            return NextResponse.json(
                JSON.stringify({
                    message: 'Data Added',
                    updateResult,
                }),
                { status: 201 },
            );
        }
    } catch (err) {
        console.log('err >>', err);
        return NextResponse.json({ status: 500 });
    }
}

