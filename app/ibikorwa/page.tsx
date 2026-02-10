"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import Link from "next/link"

type District = { id: number; name: string }
type Sector = { id: number; name: string }

export default function IbikorwaPage() {
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
    setForm({ ...form, [name]: value })
  }

  async function submit(e: any) {
    e.preventDefault()

    if (!form.district_id || !form.sector_id || !form.igikorwa) {
      alert("Please fill in District, Sector, and Igikorwa")
      return
    }

    // If "Ibindi" is selected, use the text input as igikorwa
    const igikorwaValue = form.igikorwa === "Ibindi" ? form.ibindi_text : form.igikorwa

    const payload = {
      district_id: form.district_id,
      sector_id: form.sector_id,
      igikorwa: igikorwaValue,
      igikorwa_agaciro: form.igikorwa !== "Ibindi" ? form.igikorwa_agaciro : null,
      site: form.site || null,
      agaciro: form.agaciro || null
    }

    const { error } = await supabase.from("ibikorwa").insert([payload])

    if (error) {
      alert("Error saving Ibikorwa: " + error.message)
      console.error(error)
    } else {
      alert("Ibikorwa saved successfully")
      setForm({})
    }
  }

  const box = {
    border: "1px solid #ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 40,
    backgroundColor: "#f9f9f9",
    maxWidth: 400,
    margin: "10px auto"
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
        <h2>Ibikorwa Form</h2>

        <label style={label}>District</label>
        <select
          name="district_id"
          value={form.district_id || ""}
          onChange={e => { handleChange(e); loadSectors(Number(e.target.value)) }}
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

        <label style={label}>Hitamo Igikorwa</label>
        <select
          name="igikorwa"
          value={form.igikorwa || ""}
          onChange={handleChange}
          style={input}
        >
          <option value="">Hitamo Igikorwa</option>
          <option value="Umubare_w_amazu_yubatswe">Umubare w’amazu yubatswe</option>
          <option value="Umubare_w_amazu_yasankwe">Umubare w’amazu yasankwe</option>
          <option value="ECDs_zubatswe">ECDs zubatswe</option>
          <option value="Ibiro_byubatswe_cg_byasankwe">Ibiro byubatswe cg byasankwe</option>
          <option value="Amasoko_yubatswe">Amasoko yubatswe</option>
          <option value="Ibikoni_byubatswe">Ibikoni byubatswe</option>
          <option value="Ibikoni_byasankwe">Ibikoni byasankwe</option>
          <option value="Ubwiherero_bwubatswe">Ubwiherero bwubatswe</option>
          <option value="Ubwiherero_bwasankwe">Ubwiherero bwasankwe</option>
          <option value="Imirima_yigikoni">Imirima y’igikoni</option>
          <option value="Ibiti_byatewe">Ibiti byatewe</option>
          <option value="Imihanda_yakozwe">Imihanda yakozwe</option>
          <option value="Amateme_yakozwe">Amateme yakozwe</option>
          <option value="Ubukangurambaga">Ubukangurambaga</option>
          <option value="Ibindi">Ibindi</option>
        </select>

        {/* Conditional input */}
        {form.igikorwa && form.igikorwa !== "Ibindi" && (
          <>
            <label style={label}>Umubare</label>
            <input
              name="igikorwa_agaciro"
              type="number"
              placeholder="Umubare"
              value={form.igikorwa_agaciro || ""}
              onChange={handleChange}
              style={input}
            />
          </>
        )}

        {form.igikorwa === "Ibindi" && (
          <>
            <label style={label}>Sobanura Ibindi</label>
            <input
              name="ibindi_text"
              type="text"
              placeholder="Sobanura igikorwa"
              value={form.ibindi_text || ""}
              onChange={handleChange}
              style={input}
            />
          </>
        )}

        <label style={label}>Site</label>
        <input
          name="site"
          type="text"
          placeholder="Site"
          value={form.site || ""}
          onChange={handleChange}
          style={input}
        />

        <label style={label}>Agaciro</label>
        <input
          name="agaciro"
          type="number"
          placeholder="Agaciro"
          value={form.agaciro || ""}
          onChange={handleChange}
          style={input}
        />

        <button type="submit" style={button}>Save Ibikorwa</button>
      </form>
    </div>
  )
}