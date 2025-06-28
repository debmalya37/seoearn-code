// src/app/api/tasks/[id]/requests/[requestId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import Task from '@src/models/taskModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '@src/app/api/auth/[...nextauth]/options';
import { Types } from 'mongoose';

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string; requestId: string } }
  ) {
    await dbConnect();
  
    // 1. Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
  
    const { id, requestId } = params;
    // 2. Validate IDs
    if (!Types.ObjectId.isValid(id) || !Types.ObjectId.isValid(requestId)) {
      return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
    }
  
    const { action } = await req.json();
    if (!['Approved','Rejected'].includes(action)) {
      return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }
  
    // 3. Find & update the single subdoc status by its _id
    const task = await Task.findOneAndUpdate(
      { _id: id, 'requests._id': requestId },
      { $set: { 'requests.$.status': action } },
      { new: true }
    )
      .populate('requests.userId', 'username email')
      .exec();
  
    if (!task) {
      return NextResponse.json({ success: false, message: 'Request not found' }, { status: 404 });
    }
  
    // 4. If approved, push the user into taskDoneBy
    if (action === 'Approved') {
      const sub = task.requests.find(r => r._id.toString() === requestId);
      if (sub) {
        task.taskDoneBy = task.taskDoneBy || [];
        if (!task.taskDoneBy.some(uid => uid.equals(sub.userId))) {
          task.taskDoneBy.push(sub.userId);
          await task.save();
        }
      }
    }
  
    // 5. Normalize each subdoc's `_id` → `id` so front‑end can use `req.id`
    const requests = (task.requests || []).map(r => ({
      id: r._id.toString(),
      userId: {
        username: (r.userId as any).username,
        email: (r.userId as any).email,
      },
      message: r.message,
      fileUrl: r.fileUrl,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    }));
  
    return NextResponse.json({ success: true, requests }, { status: 200 });
  }
