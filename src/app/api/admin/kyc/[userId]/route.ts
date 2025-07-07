// src/app/api/admin/kyc/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@src/lib/dbConnect'
import UserModel from '@src/models/userModel'
import { Types } from 'mongoose'

export async function PATCH(req: NextRequest, { params }: { params: { userId: string } }) {
  const { decision, notes } = await req.json()   // { decision: 'approve'|'reject', notes?:string }
  if (!Types.ObjectId.isValid(params.userId) || !['approve','reject'].includes(decision)) {
    return NextResponse.json({ success: false, message: 'Invalid' }, { status: 400 })
  }
  await dbConnect()
  const user = await UserModel.findById(params.userId)
  if (!user) return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 })

  user.kycStatus     = decision === 'approve' ? 'verified' : 'rejected'
  user.kycReviewedAt = new Date()
  user.kycReviewNotes= notes || ''
  await user.save()

  return NextResponse.json({ success: true })
}
