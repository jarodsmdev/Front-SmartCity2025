
import React, { useEffect, useRef, useState } from 'react'
import { KPI } from '../types'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

declare global {
  interface Window {
    webkitSpeechRecognition?: any
    SpeechRecognition?: any
  }
}

export default function AgentQuery({ kpi, monthly, onSubmit }: {
  kpi: KPI, monthly: { month: string, value: number }[], onSubmit: (q: string)=>void
}) {
  const [q, setQ] = useState('Quiero saber el riesgo de accidentes en Alameda el 23/09/2025')
  const [listening, setListening] = useState(false)
  const recRef = useRef<any>(null)

  useEffect(() => {
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition
    if (Rec) {
      const rec = new Rec()
      rec.lang = 'es-CL'
      rec.interimResults = false
      rec.maxAlternatives = 1
      rec.onresult = (e: any) => {
        const txt = e.results[0][0].transcript
        setQ(prev => (prev ? prev + ' ' : '') + txt)
      }
      rec.onend = () => setListening(false)
      recRef.current = rec
    }
  }, [])

  const startStop = () => {
    if (!recRef.current) return alert('Este navegador no soporta reconocimiento de voz. Usa Chrome/Edge en escritorio.')
    if (listening) { recRef.current.stop(); setListening(false) }
    else { setListening(true); recRef.current.start() }
  }

  const speak = (text: string) => {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'es-CL'
    window.speechSynthesis.speak(u)
  }

  const barFill = getComputedStyle(document.documentElement).getPropertyValue('--chart-bar').trim() || '#7aa2ff'

  return (
    <div className="card query-box">
      <h3>Consulta al Agente</h3>
      <textarea value={q} onChange={e=>setQ(e.target.value)} aria-label="Escribe tu consulta"/>
      <div className="row" style={{marginTop:8}}>
        <button onClick={()=>onSubmit(q)}>Preguntar</button>
        <button className="secondary" onClick={startStop}>{listening ? 'Detener voz' : 'Dictar por voz'}</button>
        <button className="secondary" onClick={()=>speak('Ingresa tu consulta en el cuadro de texto. Puedes dictar usando el botón de voz. Para oír resultados, activa el lector en tu navegador.')}>Leer instrucciones</button>
      </div>
      <p style={{color:'#a9b3d8', fontSize:12, marginTop:8}}>Template: la pregunta será enviada al RAG/Agente cuando el backend esté disponible.</p>

      <div className="kpi" style={{marginTop:12}}>
        <div className="kpi-item red"><div>Accidentes (6 meses)</div><strong>{kpi.accidents.value}</strong><span className="delta">+{kpi.accidents.deltaPct}%</span></div>
        <div className="kpi-item blue"><div>Víctimas fatales/graves</div><strong>{kpi.victims.value}</strong><span className="delta">{kpi.victims.deltaPct}%</span></div>
        <div className="kpi-item green"><div>Mejoras aplicadas</div><strong>{kpi.improvements.value}</strong><span className="delta">+{kpi.improvements.deltaPct}%</span></div>
      </div>

      <div style={{height:220, marginTop:12}}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill={barFill} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
