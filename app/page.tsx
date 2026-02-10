"use client"

import Link from "next/link"

export default function Home() {
  return (
    <div style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: 30
    }}>
      {/* Logo */}
      <img src="/logo.png" alt="Logo" width={120} />

      {/* Title */}
      <h1>Urugerero Reporting System</h1>

      {/* Navigation */}
      <div style={{ display: "flex", gap: 20 }}>
        <Link href="/ubwitabire">
          <button style={btn}>Ubwitabire</button>
        </Link>

        <Link href="/ibikorwa">
          <button style={btn}>Ibikorwa</button>
        </Link>
		
        <Link href="/login">
		  <button style={btn}>Report (Login Required)</button>
		</Link>

      </div>
    </div>
  )
}

const btn = {
  padding: "14px 30px",
  fontSize: 16,
  borderRadius: 8,
  border: "none",
  backgroundColor: "#4CAF50",
  color: "#fff",
  cursor: "pointer"
}