import React, { useState } from 'react'

export default function Analyzer(){
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const run = async () => {
    setError(null)
    setLoading(true)
    setResult(null)
    try{
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      if(!res.ok) throw new Error('Analyse failed')
      const data = await res.json()
      setResult(data)
    }catch(e){
      setError(e.message || 'Erreur')
    }finally{ setLoading(false) }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Analyseur de contenu</h2>
      <div className="bg-white p-4 rounded shadow">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} className="w-full p-2 border rounded" placeholder="Collez un article ou un extrait..." />
        <div className="mt-2 flex gap-2">
          <button onClick={run} className="px-3 py-2 bg-blue-600 text-white rounded">Analyser</button>
        </div>

        {loading && <div className="mt-3 text-sm text-gray-600">Analyse en cours…</div>}
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        {result && (
          <div className="mt-4">
            <h3 className="font-semibold">Classification: <span className="text-blue-700">{result.label}</span></h3>
            <p className="text-sm text-gray-600">Confiance: {Math.round(result.confidence * 100)}%</p>
            <div className="mt-2 p-3 bg-gray-50 rounded">
              <h4 className="font-medium">Raisons:</h4>
              <ul className="list-disc list-inside text-sm">
                {result.reasons.map((r,i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
            <div className="mt-2 p-3 bg-gray-50 rounded">
              <h4 className="font-medium">Suggestions:</h4>
              <ul className="list-disc list-inside text-sm">
                {result.suggestions.map((s,i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
