import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import React from 'react'

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to Ludo 3D</h1>
      {session ? (
        <Link href="/game">
          <Button>Start New Game</Button>
        </Link>
      ) : (
        <Link href="/login">
          <Button>Sign In to Play</Button>
        </Link>
      )}
    </div>
  )
}