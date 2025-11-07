
import React from 'react'

export default function TemporalAnalysis({ data }: { data: {
  criticalHours: string[],
  zoneSeverity: { zone: string, score: number }[],
  causes: { label: string, pct: number }[]
} }) {
  return (
    <div className="card">
      <h3>Horarios y criticidad</h3>
      <div className="card-grid">
        <div className="card">
          <h3>Horarios críticos</h3>
          <div className="row" style={{flexWrap:'wrap', gap:8}}>
            {data.criticalHours.map(h => <span key={h} className="tag">{h} hrs</span>)}
          </div>
        </div>
        <div className="card">
          <h3>Criticidad por zona</h3>
          <table className="table">
            <thead><tr><th>Zona</th><th style={{textAlign:'right'}}>Score</th></tr></thead>
            <tbody>
              {data.zoneSeverity.map(z=>(
                <tr key={z.zone}><td>{z.zone}</td><td style={{textAlign:'right'}}>{z.score}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <h3>Causas principales</h3>
          <table className="table">
            <thead><tr><th>Causa</th><th style={{textAlign:'right'}}>%</th></tr></thead>
            <tbody>
              {data.causes.map(c=>(
                <tr key={c.label}><td>{c.label}</td><td style={{textAlign:'right'}}>{c.pct}%</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p style={{color:'#a9b3d8', fontSize:12}}>Sección en espera de API. Valores de ejemplo.</p>
    </div>
  )
}
