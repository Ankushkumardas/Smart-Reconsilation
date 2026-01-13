import { useState } from 'react'
import './App.css'
import FileUpload from './components/FileUpload'
import ReconciliationTable from './components/ReconciliationTable'
import History from './components/History'
import { reconcileFiles, type ComparisonResult } from './utils/matcher'
import type { Invoice } from './utils/parser'
import { saveHistory } from './utils/storage'

function App() {
  const [results, setResults] = useState<ComparisonResult | null>(null);

  const handleProcess = (fileA: Invoice[], fileB: Invoice[]) => {
    const comparison = reconcileFiles(fileA, fileB);
    setResults(comparison);

    saveHistory(comparison);
  };

  const handleLoadHistory = (savedResult: ComparisonResult) => {
    setResults(savedResult);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Smart Reconciliation Visualizer</h1>
      </header>

      <main className="main-content">
        <FileUpload onProcess={handleProcess} />

        {results && (
          <ReconciliationTable results={results} />
        )}

        <History onLoadHistory={handleLoadHistory} />
      </main>
    </div>
  )
}

export default App
