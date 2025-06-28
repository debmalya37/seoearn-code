// src/app/wallet/failure/page.tsx
'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function FailurePage() {
  const router = useRouter()

  useEffect(() => {
    console.warn('❌ Payeer payment failed or was cancelled')
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
        <p className="mt-4">Oops! Your payment could not be processed.</p>
        <button
          className="mt-6 bg-red-600 text-white px-4 py-2 rounded"
          onClick={() => router.push('/wallet')}
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
