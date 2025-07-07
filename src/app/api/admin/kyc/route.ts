// src/app/api/admin/kyc/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@src/lib/dbConnect'
import UserModel from '@src/models/userModel'

export async function GET() {
  await dbConnect()
  const users = await UserModel.find({ kycStatus: 'pending' }).lean()
  const list = users.map(u => ({
    userId: String(u._id).toString(),
    email:  u.email,
    name:   u.name,
    docs:   u.kycDocuments,
    submittedAt: u.kycSubmittedAt
  }))
  return NextResponse.json({ success: true, list })
}
