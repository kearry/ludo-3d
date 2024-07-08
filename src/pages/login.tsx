import { signIn, useSession } from "next-auth/react"
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import React from "react"

export default function Login() {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session) {
      router.push('/game')
    }
  }, [session, router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Sign In</h1>
      <div className="space-y-4">
        <Button onClick={() => signIn("google")}>Sign in with Google</Button>
        <Button onClick={() => signIn("github")}>Sign in with GitHub</Button>
        <Button onClick={() => signIn("credentials", { callbackUrl: '/game' })}>Sign in with Credentials</Button>
      </div>
    </div>
  )
}