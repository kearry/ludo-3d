import { signIn } from "next-auth/react"
import React from "react"

export default function Login() {
  return (
    <div>
      <h1>Login</h1>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
      <button onClick={() => signIn("github")}>Sign in with GitHub</button>
      <form onSubmit={(e) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const username = (form.elements.namedItem('username') as HTMLInputElement).value
        const password = (form.elements.namedItem('password') as HTMLInputElement).value
        signIn("credentials", { username, password })
      }}>
        <input name="username" type="text" placeholder="Username" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">Sign in with Credentials</button>
      </form>
    </div>
  )
}