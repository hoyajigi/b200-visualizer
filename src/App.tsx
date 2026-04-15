import { useState } from 'react'
import type { GpuModel } from './data/specs'
import { GPU_SPECS } from './data/specs'
import { GpuVisualizer } from './components/gpu/GpuVisualizer'
import { DgxVisualizer } from './components/dgx/DgxVisualizer'

type ViewMode = 'gpu' | 'dgx'

function App() {
  const [gpuModel, setGpuModel] = useState<GpuModel>('B200')
  const [viewMode, setViewMode] = useState<ViewMode>('gpu')

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <header className="border-b border-border-subtle bg-bg-primary/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1100px] mx-auto px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-semibold text-text-primary tracking-tight">
              Blackwell Visualizer
            </h1>
            <div className="h-4 w-px bg-border" />
            <span className="text-xs text-text-muted">
              {GPU_SPECS[gpuModel].architecture}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-bg-secondary rounded-lg p-[3px] border border-border-subtle">
              {(['B200', 'B300'] as const).map((model) => (
                <button
                  key={model}
                  onClick={() => setGpuModel(model)}
                  className={`
                    px-3.5 py-1 text-xs rounded-md transition-all duration-150 font-medium
                    ${gpuModel === model
                      ? 'bg-accent-green text-bg-primary shadow-sm'
                      : 'text-text-muted hover:text-text-secondary'}
                  `}
                >
                  {model}
                </button>
              ))}
            </div>

            <div className="flex bg-bg-secondary rounded-lg p-[3px] border border-border-subtle">
              {([
                { id: 'gpu' as const, label: 'GPU Die' },
                { id: 'dgx' as const, label: 'DGX Node' },
              ]).map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setViewMode(id)}
                  className={`
                    px-3.5 py-1 text-xs rounded-md transition-all duration-150
                    ${viewMode === id
                      ? 'bg-bg-hover text-text-primary'
                      : 'text-text-muted hover:text-text-secondary'}
                  `}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-8 py-6">
        {viewMode === 'gpu' && <GpuVisualizer key={gpuModel} spec={GPU_SPECS[gpuModel]} />}
        {viewMode === 'dgx' && <DgxVisualizer key={gpuModel} gpuModel={gpuModel} />}
      </main>

      <footer className="border-t border-border-subtle">
        <div className="max-w-[1100px] mx-auto px-8 py-4 text-center text-[11px] text-text-muted">
          Data sourced from NVIDIA Blackwell Architecture documentation
        </div>
      </footer>
    </div>
  )
}

export default App
