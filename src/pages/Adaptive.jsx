import React from 'react'
import modules from '../content/modules.json'

export default function Adaptive(){
  // Read last quiz result from localStorage to tailor recommendations
  let last = null
  try{ last = JSON.parse(localStorage.getItem('aleloianatra_last_result')) }catch(e){ last = null }

  const scoreRatio = last ? (last.score / Math.max(1, last.total)) : null
  const audience = last?.audience || 'all'

  // Recommendation logic: prefer modules matching audience and level needed
  let recs = []
  const preferAudience = (m) => !m.audiences || m.audiences.includes(audience) || audience === 'all'

  if(scoreRatio === null){
    recs = modules.filter(m => preferAudience(m) && (m.level === 'Débutant' || m.level === 'Pratique')).slice(0,3)
  } else if(scoreRatio < 0.5){
    recs = modules.filter(m => preferAudience(m) && (m.level === 'Débutant' || m.level === 'Intermédiaire')).slice(0,4)
  } else if(scoreRatio < 0.8){
    recs = modules.filter(m => preferAudience(m) && m.level !== 'Débutant').slice(0,4)
  } else {
    recs = modules.filter(m => preferAudience(m) && (m.level === 'Avancé' || m.id === 'm6'))
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Parcours adaptif</h2>
      {last && (
        <div className="mb-3 text-sm text-gray-600">Dernier score: {last.score} / {last.total} (module: {last.moduleId})</div>
      )}
      <div className="grid gap-3">
        {recs.length === 0 ? (
          <div className="p-4 bg-white rounded shadow">Aucune recommandation disponible.</div>
        ) : recs.map((r,i) => (
          <div key={r.id || i} className="p-4 bg-white rounded shadow">
            <h3 className="font-medium">{r.title}</h3>
            <p className="text-sm text-gray-600">{r.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
