"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import Link from "next/link"

type District = { id: number; name: string }
type Sector = { id: number; name: string }

export default function UbwitabirePage() {
  const [districts, setDistricts] = useState<District[]>([])
  const [sectors, setSectors] = useState<Sector[]>([])
  const [form, setForm] = useState<any>({})

  useEffect(() => {
    supabase.from("districts").select("*").then(r => {
      if (r.data) setDistricts(r.data)
    })
  }, [])

  function loadSectors(districtId: number) {
    supabase.from("sectors").select("*").eq("district_id", districtId)
      .then(r => r.data && setSectors(r.data))
  }

  function handleChange(e: any) {
    const { name, value } = e.target
    const f = { ...form, [name]: value }

    f.abiyandikishije_bose =
      Number(f.abiyandikishije_gore || 0) +
      Number(f.abiyandikishije_gabo || 0)

    f.abitabiriye_bose =
      Number(f.abitabiriye_gore || 0) +
      Number(f.abitabiriye_gabo || 0)

    setForm(f)
  }

  function submit(e: any) {
    e.preventDefault()
    supabase.from("ubwitabire").insert([form]).then(() => {
      alert("Ubwitabire saved successfully")
      setForm({})
    })
  }

  const box = {
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: 20,
    marginBottom: 40,
    backgroundColor: "#f9f9f9",
    maxWidth: 700,
    margin: "20px auto"
  }

  const input = {
    width: "100%",
    padding: 8,
    marginBottom: 12,
    borderRadius: 4,
    border: "1px solid #ccc"
  }

  const label = { fontWeight: 600, marginBottom: 4, display: "block" }
  const button = {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    marginTop: 10
  }

  return (
    <div>
      <Link href="/">
        <button style={{ ...button, backgroundColor: "#2196F3" }}>Back to Home</button>
      </Link>

      <form onSubmit={submit} style={box}>
        <h2>Ubwitabire Form</h2>

        <label style={label}>District</label>
        <select
          name="district_id"
          value={form.district_id || ""}
          onChange={e => {
            handleChange(e)
            loadSectors(Number(e.target.value))
          }}
          style={input}
        >
          <option value="">Select District</option>
          {districts.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>

        <label style={label}>Sector</label>
        <select
          name="sector_id"
          value={form.sector_id || ""}
          onChange={handleChange}
          style={input}
        >
          <option value="">Select Sector</option>
          {sectors.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <input name="abiyandikishije_gore" type="number" placeholder="Abiyandikishije Gore" onChange={handleChange} style={input} />
        <input name="abiyandikishije_gabo" type="number" placeholder="Abiyandikishije Gabo" onChange={handleChange} style={input} />
        <input readOnly value={form.abiyandikishije_bose || 0} style={input} />

        <input name="abitabiriye_gore" type="number" placeholder="Abitabiriye Gore" onChange={handleChange} style={input} />
        <input name="abitabiriye_gabo" type="number" placeholder="Abitabiriye Gabo" onChange={handleChange} style={input} />
        <input readOnly value={form.abitabiriye_bose || 0} style={input} />

        <button type="submit" style={button}>Save Ubwitabire</button>
      </form>
    </div>
  )
}