// src/app/api/profile/kyc/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@src/lib/dbConnect'
import UserModel from '@src/models/userModel'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@src/app/api/auth/[...nextauth]/options'
import formidable from 'formidable'
import { uploadToCloudinary } from '@src/lib/cloudinary'
import fs from 'fs'



export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  // parse via Web API
  const data = await req.formData()
  const idFront = data.get('idFront') as File | null
  const idBack  = data.get('idBack')  as File | null
  const selfie  = data.get('selfie')  as File | null

  if (!idFront || !selfie) {
    return NextResponse.json(
      { success: false, message: 'ID front and selfie are required' },
      { status: 400 }
    )
  }

  // convert each File into a Buffer or stream for Cloudinary
  const readBuffer = (f: File) =>
    f.stream().getReader().read().then(({ value }) => Buffer.from(value ?? new Uint8Array()))

  const [frontBuf, backBuf, selfieBuf] = await Promise.all([
    readBuffer(idFront),
    idBack  ? readBuffer(idBack)   : Promise.resolve(undefined),
    readBuffer(selfie),
  ])

  await dbConnect()
  const user = await UserModel.findOne({ email: session.user.email })
  if (!user) return NextResponse.json({ success: false }, { status: 404 })

  // Cloudinary helper should accept a Buffer or base64
  const baseFolder = `kyc/${user._id}`
  const writeTempFile = async (buffer: Buffer, fileName: string): Promise<string> => {
    const tempPath = `/tmp/${fileName}`
    await fs.promises.writeFile(tempPath, new Uint8Array(buffer))
    return tempPath
  }

  const idFrontPath = await writeTempFile(frontBuf, 'idFront.jpg')
  const idFrontUrl = await uploadToCloudinary(idFrontPath, `${baseFolder}/front`)

  const idBackUrl = backBuf
    ? await uploadToCloudinary(await writeTempFile(backBuf, 'idBack.jpg'), `${baseFolder}/back`)
    : undefined

  const selfiePath = await writeTempFile(selfieBuf, 'selfie.jpg')
  const selfieUrl = await uploadToCloudinary(selfiePath, `${baseFolder}/selfie`)

  user.kycDocuments = { idFrontUrl, idBackUrl, selfieUrl }
  user.kycStatus    = 'pending'
  user.kycSubmittedAt = new Date()
  await user.save()

  return NextResponse.json({ success: true })
}

