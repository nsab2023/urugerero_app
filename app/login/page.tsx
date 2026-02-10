"use client"
import { useState } from "react"
import { supabase } from "../../lib/supabase"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()

  async function handleLogin(e: any) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      alert(error.message)
    } else {
      router.push("/report")
    }
  }

  return (
    <form onSubmit={handleLogin} style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: "100%", marginBottom: 10, padding: 8 }} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: "100%", marginBottom: 10, padding: 8 }} />
      <button type="submit" style={{ padding: 10, width: "100%", backgroundColor: "green", color: "white" }}>Login</button>
    </form>
  )
}