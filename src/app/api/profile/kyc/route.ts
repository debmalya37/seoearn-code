// src/app/api/profile/kyc/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@src/lib/dbConnect'
import UserModel from '@src/models/userModel'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@src/app/api/auth/[...nextauth]/options'
import formidable from 'formidable'
import { uploadToCloudinary } from '@src/lib/cloudinary'

export const config = {
  api: { bodyParser: false }
}

export async function POST(req: NextRequest) {
  // Next.js 14: use getServerSession
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  // parse multipart/form-data
  const form = new formidable.IncomingForm()
  const { files } = await new Promise<any>((resolve, reject) => {
    form.parse(req as any, (err: any, fields: any, files: any) =>
      err ? reject(err) : resolve({ fields, files })
    )
  })

  const { idFront, idBack, selfie } = files as any
  if (!idFront || !selfie) {
    return NextResponse.json(
      { success: false, message: 'ID front and selfie are required' },
      { status: 400 }
    )
  }

  await dbConnect()
  const user = await UserModel.findOne({ email: session.user.email })
  if (!user) {
    return NextResponse.json({ success: false }, { status: 404 })
  }

  // Upload to Cloudinary
  const baseFolder = `kyc/${user._id}`
  const idFrontUrl = await uploadToCloudinary(idFront.filepath, `${baseFolder}/front`)
  const idBackUrl  = idBack
    ? await uploadToCloudinary(idBack.filepath, `${baseFolder}/back`)
    : undefined
  const selfieUrl  = await uploadToCloudinary(selfie.filepath, `${baseFolder}/selfie`)

  // Update user record
  user.kycDocuments = { idFrontUrl, idBackUrl, selfieUrl }
  user.kycStatus    = 'pending'
  user.kycSubmittedAt = new Date()
  await user.save()

  return NextResponse.json({ success: true })
}
