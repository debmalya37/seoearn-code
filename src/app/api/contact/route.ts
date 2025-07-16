import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 })
  }

  // create reusable transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST,
    port:   Number(process.env.SMTP_PORT),
    secure: true, // use TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  try {
    await transporter.sendMail({
      from:    `"Contact Form" <${process.env.SMTP_USER}>`,
      to:      process.env.CONTACT_TO,
      subject: 'New contact form submission',
      replyTo: email,
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `.trim(),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Mail error:', err)
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 })
  }
}
