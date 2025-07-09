// src/app/api/profile/kyc/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@src/lib/dbConnect'
import UserModel from '@src/models/userModel'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@src/app/api/auth/[...nextauth]/options'
import { v2 as cloudinary } from 'cloudinary'
import streamifier from 'streamifier'

// Configure Cloudinary
cloudinary.config({
  cloud_name:    process.env.CLOUDINARY_CLOUD_NAME,
  api_key:       process.env.CLOUDINARY_API_KEY,
  api_secret:    process.env.CLOUDINARY_API_SECRET,
})

// helper to upload a Buffer
async function uploadBuffer(buffer: Buffer, folder: string) {
  return new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error)
        resolve(result?.secure_url || '')
      }
    )
    streamifier.createReadStream(buffer).pipe(uploadStream)
  })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  // parse the multipart form
  const formData = await req.formData()
  const idFrontFile = formData.get('idFront') as File | null
  const idBackFile  = formData.get('idBack')  as File | null
  const selfieFile  = formData.get('selfie')  as File | null

  if (!idFrontFile || !selfieFile) {
    return NextResponse.json({
      success: false,
      message: 'ID front and selfie are required'
    }, { status: 400 })
  }

  // read buffers
  const [ frontBuf, backBuf, selfieBuf ] = await Promise.all([
    idFrontFile.arrayBuffer().then(buf => Buffer.from(buf)),
    idBackFile  ? idBackFile.arrayBuffer().then(buf => Buffer.from(buf)) : Promise.resolve<Buffer|undefined>(undefined),
    selfieFile.arrayBuffer().then(buf => Buffer.from(buf)),
  ])

  // connect & lookup user
  await dbConnect()
  const user = await UserModel.findOne({ email: session.user.email })
  if (!user) {
    return NextResponse.json({ success: false }, { status: 404 })
  }

  // upload to Cloudinary under a per‑user folder
  const baseFolder = `kyc/${user._id}`
  const idFrontUrl = await uploadBuffer(frontBuf, `${baseFolder}/front`)
  const idBackUrl  = backBuf ? await uploadBuffer(backBuf, `${baseFolder}/back`) : undefined
  const selfieUrl  = await uploadBuffer(selfieBuf, `${baseFolder}/selfie`)

  // persist to user document
  user.kycDocuments    = { idFrontUrl, idBackUrl, selfieUrl }
  user.kycStatus       = 'pending'
  user.kycSubmittedAt  = new Date()
  await user.save()

  return NextResponse.json({ success: true })
}
