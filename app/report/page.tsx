"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import * as XLSX from "xlsx"

export default function ReportPage() {
  const [districts, setDistricts] = useState<any[]>([])
  const [selectedDistrict, setSelectedDistrict] = useState<number | "all">("all")
  const [fromDate, setFromDate] = useState<string>("")
  const [toDate, setToDate] = useState<string>("")
  const [ubwitabire, setUbwitabire] = useState<any[]>([])
  const [ibikorwa, setIbikorwa] = useState<any[]>([])

  const rowsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    supabase.from("districts").select("*").then(res => {
      if (res.data) setDistricts(res.data)
    })
    fetchData("all", "", "")
  }, [])

  async function fetchData(districtId: number | "all", fromDateVal?: string, toDateVal?: string) {
    let u = supabase.from("ubwitabire").select(`
      abiyandikishije_gore,
      abiyandikishije_gabo,
      abiyandikishije_bose,
      abitabiriye_gore,
      abitabiriye_gabo,
      abitabiriye_bose,
      district:district_id ( name ),
      sector:sector_id ( name ),
      created_at
    `)

    let i = supabase.from("ibikorwa").select(`
      igikorwa,
      igikorwa_agaciro,
      site,
      agaciro,
      district:district_id ( name ),
      sector:sector_id ( name ),
      created_at
    `)

    if (districtId !== "all") {
      u = u.eq("district_id", districtId)
      i = i.eq("district_id", districtId)
    }

    if (fromDateVal) {
      const fromISO = new Date(fromDateVal).toISOString()
      u = u.gte("created_at", fromISO)
      i = i.gte("created_at", fromISO)
    }

    if (toDateVal) {
      const toISO = new Date(new Date(toDateVal).setHours(23, 59, 59, 999)).toISOString()
      u = u.lte("created_at", toISO)
      i = i.lte("created_at", toISO)
    }

    const [resU, resI] = await Promise.all([u, i])
    if (resU.data) setUbwitabire(resU.data)
    if (resI.data) setIbikorwa(resI.data)
    setCurrentPage(1)
  }

  function handleDistrictChange(e: any) {
    const value = e.target.value === "all" ? "all" : Number(e.target.value)
    setSelectedDistrict(value)
    fetchData(value, fromDate, toDate)
  }

  function handleDateChange() {
    fetchData(selectedDistrict, fromDate, toDate)
  }

  function findUbwitabire(d: string, s: string) {
    return ubwitabire.find(u => u.district?.name === d && u.sector?.name === s)
  }

  const mergedRows = ibikorwa.map(row => {
    const u = findUbwitabire(row.district?.name, row.sector?.name)
    return {
      District: row.district?.name,
      Sector: row.sector?.name,
      Abiyandikishije_Gore: u?.abiyandikishije_gore ?? "",
      Abiyandikishije_Gabo: u?.abiyandikishije_gabo ?? "",
      Abiyandikishije_Bose: u?.abiyandikishije_bose ?? "",
      Abitabiriye_Gore: u?.abitabiriye_gore ?? "",
      Abitabiriye_Gabo: u?.abitabiriye_gabo ?? "",
      Abitabiriye_Bose: u?.abitabiriye_bose ?? "",
      Igikorwa: row.igikorwa,
      Value_Description: row.igikorwa_agaciro,
      Site: row.site,
      Agaciro: row.agaciro
    }
  })

  const totalPages = Math.ceil(mergedRows.length / rowsPerPage)
  const start = (currentPage - 1) * rowsPerPage
  const paginatedRows = mergedRows.slice(start, start + rowsPerPage)

  function exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(mergedRows)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report")
    XLSX.writeFile(workbook, "Report.xlsx")
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  const tableStyle = { borderCollapse: "collapse", width: "100%" }
  const thStyle = { border: "1px solid #ccc", padding: 8, backgroundColor: "#f0f0f0" }
  const tdStyle = { border: "1px solid #ccc", padding: 6 }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Unified Report</h2>
        <button onClick={handleLogout} style={{ padding: "6px 12px" }}>Logout</button>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>District: </label>
        <select value={selectedDistrict} onChange={handleDistrictChange}>
          <option value="all">All Districts</option>
          {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>

        <label style={{ marginLeft: 20 }}>From: </label>
        <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} />
        <label style={{ marginLeft: 10 }}>To: </label>
        <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} />
        <button onClick={handleDateChange} style={{ marginLeft: 10, padding: "6px 12px" }}>Filter</button>

        <button onClick={exportToExcel} style={{ marginLeft: 20, padding: "6px 12px" }}>Export to Excel</button>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>District</th>
            <th style={thStyle}>Sector</th>
            <th style={thStyle}>Abiyandikishije Gore</th>
            <th style={thStyle}>Abiyandikishije Gabo</th>
            <th style={thStyle}>Abiyandikishije Bose</th>
            <th style={thStyle}>Abitabiriye Gore</th>
            <th style={thStyle}>Abitabiriye Gabo</th>
            <th style={thStyle}>Abitabiriye Bose</th>
            <th style={thStyle}>Igikorwa</th>
            <th style={thStyle}>Value / Description</th>
            <th style={thStyle}>Site</th>
            <th style={thStyle}>Agaciro</th>
          </tr>
        </thead>
        <tbody>
          {paginatedRows.map((r, i) => (
            <tr key={i}>
              <td style={tdStyle}>{r.District}</td>
              <td style={tdStyle}>{r.Sector}</td>
              <td style={tdStyle}>{r.Abiyandikishije_Gore}</td>
              <td style={tdStyle}>{r.Abiyandikishije_Gabo}</td>
              <td style={tdStyle}>{r.Abiyandikishije_Bose}</td>
              <td style={tdStyle}>{r.Abitabiriye_Gore}</td>
              <td style={tdStyle}>{r.Abitabiriye_Gabo}</td>
              <td style={tdStyle}>{r.Abitabiriye_Bose}</td>
              <td style={tdStyle}>{r.Igikorwa}</td>
              <td style={tdStyle}>{r.Value_Description}</td>
              <td style={tdStyle}>{r.Site}</td>
              <td style={tdStyle}>{r.Agaciro}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{ marginTop: 15 }}>
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</button>
        <span style={{ margin: "0 10px" }}>Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
      </div>
    </div>
  )
}