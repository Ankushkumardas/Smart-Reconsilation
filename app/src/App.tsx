import { useState } from 'react'
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
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden w-full">
      <header className="bg-slate-900 text-white px-8 py-4 flex items-center justify-between shadow-sm shrink-0">
        <h1 className="text-xl font-semibold tracking-wide">Smart Reconciliation Visualizer</h1>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row p-6 overflow-hidden gap-6 w-full">
        {/* Left Sidebar (Controls & History) - 1/4 width on huge screens, fixed width on normal desktops */}
        <aside className="w-full lg:w-1/4 lg:min-w-[320px] flex flex-col gap-6 overflow-y-auto lg:overflow-visible shrink-0">
          <FileUpload onProcess={handleProcess} />
          <History onLoadHistory={handleLoadHistory} />
        </aside>

        {/* Main Content (Results) - Takes remaining space */}
        <section className="flex-1 flex flex-col h-full min-h-0 overflow-hidden">
          {results ? (
            <ReconciliationTable results={results} />
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-12 shadow-sm flex flex-col items-center justify-center h-full text-center text-slate-400">
              <svg className="w-16 h-16 mb-4 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
              </svg>
              <p className="text-lg font-medium text-slate-500">No results to display</p>
              <p className="text-sm">Upload files in the sidebar to start reconciliation.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
