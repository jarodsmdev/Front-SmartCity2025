
import React, { useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import AgentQuery from './components/AgentQuery'
import MapView from './components/MapView'
import CriticalRoutesTable from './components/CriticalRoutesTable'
import TemporalAnalysis from './components/TemporalAnalysis'
import AgentProposals from './components/AgentProposals'
import pointsData from './mock/criticalPoints.json'
import routesData from './mock/routes.json'
import indicators from './mock/indicators.json'
import monthly from './mock/accidentsByMonth.json'
import temporal from './mock/temporal.json'
import proposals from './mock/proposals.json'
import { CriticalPoint, CriticalRoute, KPI } from './types'

export default function App() {
  const [query, setQuery] = useState('')
  const routes: CriticalRoute[] = routesData as any
  const kpi: KPI = indicators as any
  const points: CriticalPoint[] = pointsData as any

  const filteredPoints = useMemo(()=>{
    const q = query.toLowerCase()
    let risk: string | null = null
    if (q.includes('alto')) risk = 'Alto'
    else if (q.includes('medio')) risk = 'Medio'
    else if (q.includes('bajo')) risk = 'Bajo'
    return points.filter(p => !risk || p.risk===risk)
  }, [query, points])

  const [selected, setSelected] = useState<CriticalPoint | null>(null)

  const onAsk = (q: string) => {
    setQuery(q)
    // TODO: enviar a backend /agente
  }

  return (
    <div className="container">
      <Navbar />
      <div className="content">
        <AgentQuery kpi={kpi} monthly={monthly as any} onSubmit={onAsk} />
        <div className="grid-main">
          <MapView points={filteredPoints} onSelect={setSelected} />
          {selected && (
            <div className="card">
              <h3>Detalle del punto seleccionado</h3>
              <p><strong>{selected.name}</strong></p>
              <ul>
                <li>Riesgo: {selected.risk}</li>
                <li>Probabilidad: {(selected.probability*100).toFixed(0)}%</li>
                <li>Tipo de vía: {selected.roadType}</li>
                <li>Región/Ciudad: {selected.region} / {selected.city}</li>
                <li>Horario crítico: {selected.timeband ?? 's/d'}</li>
              </ul>
            </div>
          )}
          <CriticalRoutesTable routes={routes} />
          <TemporalAnalysis data={temporal as any} />
          <AgentProposals proposals={proposals as any} />
        </div>
      </div>
    </div>
  )
}
