// src/app/wallet/success/page.tsx
'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    console.log('✅ Payeer payment was successful')
    // Optional: Show a loader for a few seconds then redirect
    // setTimeout(() => router.push('/wallet'), 3000)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-green-600">Payment Successful</h1>
        <p className="mt-4">Thank you! Your deposit has been received.</p>
        <button
          className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
          onClick={() => router.push('/wallet')}
        >
          Go to Wallet
        </button>
      </div>
    </div>
  )
}
